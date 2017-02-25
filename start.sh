#!/bin/bash
echo "Getting latest source"
git pull origin develop
echo "Done"
echo "Starting server..."
node index.js
