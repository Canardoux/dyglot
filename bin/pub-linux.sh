rm -rf build .svelte-kit dist-electron
BUILD_TARGET=desktop VITE_BUILD_TARGET=desktop npm run build:desktop
# vérifiez que le log dit bien: "Using @sveltejs/adapter-static" + "Wrote site to "build""
CSC_IDENTITY_AUTO_DISCOVERY=false npx electron-builder --mac --dir
npx electron-builder --linux AppImage deb --x64


