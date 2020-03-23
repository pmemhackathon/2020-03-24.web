#!/bin/bash -ex

git clone https://github.com/pmem/valgrind.git
cd valgrind
# valgrind v3.14 with pmemcheck: fix memcheck failure on Ubuntu-19.04
#git checkout 0965e35d7fd5c7941dc3f2a0c981cb8386c479d3
./autogen.sh
./configure --prefix=/usr
make
sudo make install
cd ..
rm -r valgrind
