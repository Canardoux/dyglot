#!/bin/bash
npm run build
if [ $# -eq 0 ]; then
    	echo "No arguments supplied"
	exit 1
fi
git add .
git commit -m "$1"
git push


