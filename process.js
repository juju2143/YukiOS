var memory = new WebAssembly.Memory({ initial: 10 });
var buffer = new Uint8Array(memory.buffer);
var pid = 0;
var ppid = 0;
var pidsab;
var pidbuf;

function getstr(ptr){
    if(typeof ptr !== 'number') return ptr;
    //if(ptr == 0) return '';
    len = 0;
    for(i=ptr; buffer[i] != 0; i++) len++;
    const decoder = new TextDecoder("utf-8");
    return decoder.decode(memory.buffer.slice(ptr, ptr+len));
}

var kernel = {
    retval: 0,
    memory: memory,
    __indirect_function_table: new WebAssembly.Table({ initial: 1, maximum: 1, element: 'anyfunc' }),
    exec: function(path, argc, argv){
        path = getstr(path);

        for(newpid = ++pidbuf[0];pidbuf[newpid]==2**32-1;(newpid=newpid==2**32-1?1:newpid+1));
        pidbuf[newpid] = 2**32-1;

        postMessage(["exec", path, argc, argv, pid, newpid]);

        return newpid;
    },
    getchar: function(){
        //if(getcbuf.length == 0) return 0;
        //return getcbuf.shift();
        return 0;
    },
    /*gets: function(ptr){
        if(getcbuf.length == 0) return 0;
        char = 0;
    },*/
    getpid: function(){
        return pid;
    },
    getppid: function(){
        return ppid;
    },
    kputs: function(ptr){
        var str = getstr(ptr);
        console.log(str);
    },
    putchar: function(char){
        postMessage(["write", String.fromCharCode(char)]);
    },
    puts: function(ptr){
        var str = getstr(ptr);
        postMessage(["write", str]);
    },
    wait: function(pid){
        while(pidbuf[pid] == 2**32-1);
        return pidbuf[pid];
    }
}


var handlers = {
    start: function(path, argc, argv, env){
        console.log("Starting process "+path+" (PID "+env.pid+") by PID "+env.ppid+"...")
        pid = env.pid;
        ppid = env.ppid;
        pidsab = env.processes;
        pidbuf = new Uint32Array(pidsab);
        fetch(path)
            .then(res => res.arrayBuffer())
            .then(buf => WebAssembly.compile(buf))
            .then(mod => WebAssembly.instantiate(mod, {env: kernel}))
            .then(obj => {
                var ret = obj.exports.main(argc, argv)
                pidbuf[pid] = ret;
                console.log("start: "+path+" ("+pid+") returned with code "+ret);
                postMessage(["kill", pid, ret]);
            })
            .catch(e => {
                pidbuf[pid] = 255;
                postMessage(["kill", pid, 255])
            });
    },
}

onmessage = function(e) {
    var data = e.data;
    var name = data.shift();
    handlers[name](...data);
}