#!/bin/bash
if [ $# -eq 0 ]; then
    	echo "No arguments supplied"
	exit 1
fi
npm run build
if [ $? -ne 0 ]; then
	echo "Error during `npm run build`" >&2
	exit 1
fi
git add .
git commit -m "$1"
git push
source ~/bin/key.sh
# Ensure Xcode uses Apple's rsync
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
hash -r
which rsync
rsync --version
npm run ios:beta
if [ $? -ne 0 ]; then
        echo "Error during `npm run ios:beta`" >&2
        exit 1
fi

rm -rf build .svelte-kit dist-electron
BUILD_TARGET=desktop VITE_BUILD_TARGET=desktop npm run build:desktop
# vérifiez que le log dit bien: "Using @sveltejs/adapter-static" + "Wrote site to "build""
CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --dir
open -n dist-electron/mac-arm64/Dyglot.app

echo "*** E.O.J. ***"

