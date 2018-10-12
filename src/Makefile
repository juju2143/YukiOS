.PHONY: all

CFLAGS = --target=wasm32-unknown-unknown-wasm -O3 -nostartfiles -nostdlib -fvisibility=hidden -Iinclude
LDFLAGS = -Wl,--allow-undefined-file=include/stdlib.syms,--import-memory,--import-table,--demangle,--no-entry,--no-threads,--strip-all,--export=main
OUTDIR = ../bin

all: init.wasm sh.wasm hello.wasm

init.wasm:
	clang ${CFLAGS} ${LDFLAGS} -o ${OUTDIR}/init.wasm init.c

sh.wasm:
	clang ${CFLAGS} ${LDFLAGS} -o ${OUTDIR}/sh.wasm sh.c

hello.wasm:
	clang ${CFLAGS} ${LDFLAGS} -o ${OUTDIR}/hello.wasm hello.c