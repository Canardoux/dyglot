#!/bin/bash
if [ $# -eq 0 ]; then
    	echo "No arguments supplied"
	exit 1
fi
rm -rf dist build dist-electron 2>/dev/null
mkdir dist
npm run build:web
if [ $? -ne 0 ]; then
	echo "Error during `npm run build`" >&2
	exit 1
fi
mv build dist/web
git add .
git commit -m "$1"
git pull
git push

bin/build-desktop.sh mac
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh`" >&2
        exit 1
fi
mv dist-electron dist/mac
#npm run desktop:dist:mac
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:mac`" >&2
#        exit 1
#fi

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

exit 0
#rm -rf build .svelte-kit dist-electron
#BUILD_TARGET=desktop VITE_BUILD_TARGET=desktop npm run build:desktop
## vérifiez que le log dit bien: "Using @sveltejs/adapter-static" + "Wrote site to "build""
#CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --dir
#npx electron-builder --linux AppImage deb --x64

#bin/pub-linux.sh

scp bin/build-desktop.sh larpoux@danku:~/bin/
ssh larpoux@danku 'bash -lc ~/bin/build-desktop.sh linux'
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on danku`" >&2
        exit 1
fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi

scp bin/build-desktop.sh larpoux@jupiter:~/bin/
ssh larpoux@jupiter 'bash -lc ~/bin/build-desktop.sh linux'
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on jupiter`" >&2
        exit 1
fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi


scp bin/build-desktop.sh larpoux@zeus:~/bin/
ssh larpoux@zeus 'bash -lc ~/bin/build-desktop.sh linux'
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on zeus`" >&2
        exit 1
fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi

scp bin/build-desktop.sh larpoux@bigmac:~/bin/
ssh larpoux@bigmac 'bash -lc ~/bin/build-desktop.sh win' 
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on bigmac`" >&2
        exit 1
fi
#npm run desktop:dist:win
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:win`" >&2
#        exit 1
#fi


echo "*** E.O.J. ***"
exit 0

