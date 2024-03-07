#!/bin/bash
set -e

cd /

git clone https://github.com/McMastercce/bvd-103-mcmasterful-books

sudo chown -R node:node /bvd-103-mcmasterful-books/

cd /bvd-103-mcmasterful-books

npm install

echo "MCMASTERFUL_ASSIGNMENT=\"$assignment\"" >> /etc/environment

npm install -g ./bvd-103-mcmasterful-books