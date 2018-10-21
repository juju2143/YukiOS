var containers = document.getElementById('terminal');
var term = new Terminal({});
stream = term.open(containers);

window.addEventListener('error', function(event) {
    term.write("kernel panic - bad browser, get a newer one\r\n");
});

var getcbuf = [];
var processes = {};
var pid = 0;
var lastret = 0;
var pidsab = new SharedArrayBuffer(131072);
var pidbuf = new Uint32Array(pidsab);
var getcsab = new SharedArrayBuffer(131072);
var getcbuf = new Uint32Array(getcsab);

term._core.register(term.addDisposableListener('key', (key, ev) => {
    //getcbuf.push(ev.keyCode);
    /*event = {};
    for(var i in ev) {
        //console.log(typeof ev[i]);
        if(typeof ev[i]!=="function" && typeof ev[i]!=="object")
            event[i] = ev[i];
    }
    for(var i in processes) {
        processes[i].postMessage(["key", key]);
    }*/
    getcbuf.copyWithin(1,0);
    getcbuf[0] = ev.keyCode;
}));

var handlers = {
    exec: function(path, argc, argv, ppid, newpid){
        var curpid = newpid;
        processes[curpid] = new Worker("process.js", {name: path});
        processes[curpid].onmessage = (e) => {
            var data = e.data;
            var name = data.shift();
            handlers[name](...data);
        }
        processes[curpid].postMessage(["start", path, argc, argv, { pid: curpid, ppid: ppid, processes: pidsab, getcsab: getcsab }]);
    },
    kill: function(pid, ret){
        processes[pid].terminate();
        delete processes[pid];
        pidbuf[pid] = ret;
    },
    write: function(str){
        term.write(str);
        if(str.codePointAt(0)==127) term.write("\b");
    }
}

async function run(){
    pidbuf[0] = 1;
    pidbuf[1] = 2**32-1;
    handlers.exec("bin/init.wasm",0,0,0,1);
    //term.write("\r\nkernel panic: init died")
}

run();