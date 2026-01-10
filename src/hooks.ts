// src/hooks.ts
import type { Reroute } from '@sveltejs/kit';
import { deLocalizeUrl } from '$lib/paraglide/runtime';

export const reroute: Reroute = ({ url }) => deLocalizeUrl(url).pathname;

// Temporary shim for builds that expect `transport`.
export const transport = undefined;