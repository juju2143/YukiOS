#include "stdlib.h"

int main(int argc, char** argv) {
    puts("$ ");
    int ex = 1;
    char chr;
    char* cmd;
    while(ex)
    {
        chr = getchar();
        if(chr!=0)
        {
            if(chr==13)
            {
                puts("\r\n");
                int pid = exec("bin/hello.wasm", 0, 0);
                int ret = wait(pid);
                puts("$ ");
            }
            else
            {
                putchar(chr);
            }
        }
    }
    return 0;
}