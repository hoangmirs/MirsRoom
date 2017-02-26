#!/bin/bash
echo "Getting latest source"
git pull origin develop
git reset --hard origin/develop
echo "Done"
echo "Starting server..."
node app.js
