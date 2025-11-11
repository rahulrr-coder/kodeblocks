<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { user, session } from '$lib/stores.js';
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	import '../app.css';

	export let data;

	$: user.set(data.user);
	$: session.set(data.session);

	onMount(() => {
		let supabase;
		let subscription;

		try {
			supabase = createSupabaseLoadClient(fetch);
		} catch (error) {
			console.error('Failed to create Supabase client:', error);
			return;
		}

		if (supabase && supabase.auth && typeof supabase.auth.onAuthStateChange === 'function') {
			const result = supabase.auth.onAuthStateChange((event, _session) => {
				// trigger a minimal invalidation when auth changes
				invalidate('supabase:auth');
			});
			subscription = result?.data?.subscription;
		}

		return () => {
			if (subscription && typeof subscription.unsubscribe === 'function') {
				subscription.unsubscribe();
			}
		};
	});
</script>

<svelte:head>
	<title>KodeBloks - DSA Learning Platform</title>
</svelte:head>

<!-- Root layout: just global styles and slot, no navbar/footer -->
<slot />
