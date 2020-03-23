#!/bin/bash -ex

git clone https://github.com/memkind/memkind
cd memkind
git checkout v1.9.0
./build.sh --prefix=/usr
sudo make install
cd ..
rm -r memkind
