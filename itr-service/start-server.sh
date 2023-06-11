#!/bin/bash
mkdir -p ./logs
#${DB_URL}
#mongodb://localhost:27017/itr-portal
node app.js --dbUrl=${DB_URL}