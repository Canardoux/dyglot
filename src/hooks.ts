import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute = (request) => deLocalizeUrl(request.url).pathname;

// Temporary shim for builds that expect `transport`.
// Remove once the feature is properly implemented or no longer required.
export const transport = undefined;