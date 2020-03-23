#!/bin/bash -ex

#fc30 timedatectl bug workaround:
cd /etc
rm localtime
ln -s ../usr/share/zoneinfo/PST8PDT localtime
