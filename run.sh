#!/bin/bash

echo "" > running.log

npm start >> running.log 2>&1

cat running.log
echo "--------"
tail -f running.log
