export async function getPwaInfo() {
  const m = await import('virtual:pwa-info');
  return m.pwaInfo;
}

export async function registerPwa() {
  const { registerSW } = await import('virtual:pwa-register');
  return registerSW({
    immediate: true,
    onRegistered(r) {
      console.log('SW registered', r);
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    }
  });
}