# YukiOS

YukiOS is an attempt at writing a complete multithreading operating system that runs in your browser. It consists of a JavaScript kernel loading and running WebAssembly binaries, a standard library that exposes kernel functions (imports) in C and a few interesting programs so it's usable.

## But why?

Why not? Gary Bernhardt [once said](https://www.destroyallsoftware.com/talks/the-birth-and-death-of-javascript) in 2014 it's the future, so yeah.

## What about the name?

It's snow in Japanese. I think it's cute.

## Is it supported on my browser?

Chrome should work starting from version 67. It uses a bunch of experimental features like `SharedArrayBuffer`, so here be dragons...

## How does it work?

Kernel initializes a terminal (mostly VT100-compatible, might later be a GUI) and a bunch of functions that interfaces with the GUI, DOM, filesystem and threads, then starts a new thread. Threads defines a bunch of functions programs can import and interfaces with said functions on the main thread. So it's pretty much:

Browser/DOM <=> Kernel <=> WebWorkers <=> WebAssembly program

where arrows are someinterface where they talk to each other.

## How are programs compiled?

You only need a working LLVM/clang compiler with WebAssembly enabled. It was experimental in v7 but it's moved to stable after release and should be there in version 8. Check the Makefile for examples.

It should be pretty lightweight, so no Emscripten or anything for now. Binaries should import functions it needs (in C, via a standard library) and export its main function.