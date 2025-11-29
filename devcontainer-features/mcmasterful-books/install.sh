#!/bin/bash
set -e

npm install -g tsx
cd /
REPO=books-ui
git clone "https://github.com/cequoi-ca/$REPO"

sudo chown -R node:node "/$REPO/"
cd "/$REPO"
npm install
npm install -g ./
sudo chown -R node:node "/${REPO}/"
