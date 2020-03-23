#!/bin/bash -ex

git clone https://github.com/pmem/pmdk
cd pmdk
make
make install prefix=/usr
cd ..
rm -r pmdk
