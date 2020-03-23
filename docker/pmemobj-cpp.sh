#!/bin/bash -ex

git clone https://github.com/pmem/libpmemobj-cpp
cd libpmemobj-cpp
mkdir build
cd build
cmake .. -DCMAKE_INSTALL_PREFIX=/usr
make
make install
cd ../..
rm -r libpmemobj-cpp
