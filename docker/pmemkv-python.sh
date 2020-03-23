#!/bin/bash -ex

git clone https://github.com/pmem/pmemkv-python.git
cd pmemkv-python
python3 setup.py install --user
cd ..
rm -r pmemkv-python
