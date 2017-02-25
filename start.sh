#!/bin/bash
echo "Get latest source"
git pull origin develop && node index.js
echo "Starting server..."
