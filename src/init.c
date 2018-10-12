#include "stdlib.h"

int main(int argc, char** argv) {
  puts("YukiOS init 0.0.1 loading\r\n");
  int pid = exec("bin/sh.wasm", 0, 0);
  int ret = wait(pid);
  return ret;
}