<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { user, session } from '$lib/stores.js';
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	import '../app.css';

	export let data;

	// Default to mock mode when VITE_USE_MOCK_DATA is not set so the frontend
	// works out-of-the-box without a Supabase backend during local dev.
	const isMockMode = import.meta.env.VITE_USE_MOCK_DATA
		? import.meta.env.VITE_USE_MOCK_DATA === 'true'
		: true;
	let supabase;

	$: user.set(data.user);
	$: session.set(data.session);

	onMount(() => {
		if (isMockMode) {
			// In mock mode, skip auth state changes
			return;
		}

		supabase = createSupabaseLoadClient(fetch);

		// Guard in case the client library is not present or has different API (mock)
		if (supabase?.auth && typeof supabase.auth.onAuthStateChange === 'function') {
			const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((event, _session) => {
				// trigger a minimal invalidation when auth changes
				invalidate('supabase:auth');
			}) || {};

			return () => subscription?.unsubscribe?.();
		}
	});
</script>

<svelte:head>
	<title>KodeBloks - DSA Learning Platform</title>
</svelte:head>

<!-- Root layout: just global styles and slot, no navbar/footer -->
<slot />
