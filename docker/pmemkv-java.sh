#!/bin/bash -ex

git clone https://github.com/pmem/pmemkv-java.git
cd pmemkv-java
export JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8
mvn install
cd ..
rm -r pmemkv-java
