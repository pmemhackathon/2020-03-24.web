#!/bin/bash -ex

git clone https://github.com/pmem/pmemkv-jni.git
cd pmemkv-jni
make
make install prefix=/usr
cd ..
rm -r pmemkv-jni
