#!/bin/bash
set -e

cd /

git clone https://github.com/McMastercce/bvd-103-mcmasterful-books

sudo chown -R node:node /bvd-103-mcmasterful-books/

cd /bvd-103-mcmasterful-books

npm install

npm install -g ./

sudo chown -R node:node /bvd-103-mcmasterful-books/