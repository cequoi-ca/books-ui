#!/bin/bash
set -e

cd /

git clone https://github.com/McMastercce/bvd-103-mcmasterful-books

echo "MCMASTERFUL_ASSIGNMENT=\"$assignment\"" >> /etc/environment

npm install -g ./bvd-103-mcmasterful-books