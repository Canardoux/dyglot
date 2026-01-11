#!/bin/bash
if [ $# -eq 0 ]; then
    	echo "No arguments supplied"
	exit 1
fi
rm -rf dist build dist-electron 2>/dev/null
git add .
git commit -m "Version $1"
git push
mkdir dist
echo "--------------------"
echo "     build:web      "
echo "--------------------"
npm run build:web
if [ $? -ne 0 ]; then
	echo "Error during `npm run build`" >&2
	exit 1
fi
mv build dist/web


echo "----------------------------"
echo "   build-desktop mac        "
echo "----------------------------"

npm ci
npm run "desktop:dist:mac"
if [ $? -ne 0 ]; then
        echo "Error during `desktop:dist:mac`" >&2
        exit 1
fi
mv dist-electron dist/mac-arm64
#npm run desktop:dist:mac
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:mac`" >&2
#        exit 1
#fi

echo "--------------------"
echo "     android:beta   "
echo "--------------------"

bin/android-bump-version.sh
source ~/.dyglot-secrets/android.env
npm run android:beta
if [ $? -ne 0 ]; then
        echo "Error during `npm run android:beta`" >&2
        exit 1
fi

cp -a android/app/build/outputs/bundle/release dist/android-release


echo "--------------------"
echo "     ios:beta       "
echo "--------------------"

source ~/.dyglot-secrets/asc.env
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

cp -a ios/App dist/ios

#rm -rf build .svelte-kit dist-electron
#BUILD_TARGET=desktop VITE_BUILD_TARGET=desktop npm run build:desktop
## vérifiez que le log dit bien: "Using @sveltejs/adapter-static" + "Wrote site to "build""
#CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --dir
#npx electron-builder --linux AppImage deb --x64

#bin/pub-linux.sh
echo "----- danku -----"
scp bin/build-desktop.sh larpoux@danku:~/bin/
ssh larpoux@danku 'bash -lc "~/bin/build-desktop.sh linux"'
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on danku`" >&2
        exit 1
fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi

echo "----- jupiter -----"
scp bin/build-desktop.sh larpoux@jupiter:~/bin/
ssh larpoux@jupiter 'bash -lc "~/bin/build-desktop.sh linux"'
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on jupiter`" >&2
        exit 1
fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi

#echo "----- zeus -----"
#scp bin/build-desktop.sh larpoux@zeus:~/bin/
#ssh larpoux@zeus 'bash -lc "~/bin/build-desktop.sh linux"'
#if [ $? -ne 0 ]; then
#        echo "Error during `bin/build-desktop.sh on zeus`" >&2
#        exit 1
#fi
#npm run desktop:dist:linux
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:linux`" >&2
#        exit 1
#fi

echo "----- bigmac -----"
scp bin/build-desktop.sh larpoux@bigmac:~/bin/
ssh larpoux@bigmac 'bash -lc "~/bin/build-desktop.sh win"' 
if [ $? -ne 0 ]; then
        echo "Error during `bin/build-desktop.sh on bigmac`" >&2
        exit 1
fi
#npm run desktop:dist:win
#if [ $? -ne 0 ]; then
#        echo "Error during `npm run desktop:dist:win`" >&2
#        exit 1
#fi
git add .
git commit -m "$1"
git pull
git push


echo "*** E.O.J. ***"
exit 0

