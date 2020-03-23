#!/bin/bash -ex

git clone https://github.com/pmem/pmemkv-nodejs.git
cd pmemkv-nodejs
npm install
cd ..
rm -r pmemkv-nodejs
