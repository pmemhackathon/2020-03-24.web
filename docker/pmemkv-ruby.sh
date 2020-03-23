#!/bin/bash -ex

# all of the dependencies (gems) needed to run pmemkv-ruby will be saved in
# /opt/bindings/ruby directory
mkdir -p /opt/bindings/ruby/
sudo gem install bundler -v '< 2.0'
git clone https://github.com/pmem/pmemkv-ruby.git
cd pmemkv-ruby
# bundle package command copies all of the .gem files needed to run the application
# into the vendor/cache directory
sudo bundle package
mv -v vendor/cache/* /opt/bindings/ruby/
cd ..
rm -rf pmemkv-ruby
