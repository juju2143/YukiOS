#include "stdlib.h"

int main(int argc, char** argv) {
  puts("$ ");
  int ex = 1;
  char str;
  //while(ex)
  {
      str = getchar();
      if(str!=0) putchar(str);
      if(str == 'q') ex=0;
      int pid = exec("bin/hello.wasm", 0, 0);
      int ret = wait(pid);
  }
  return 42;
}