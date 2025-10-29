<script>
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { user, session } from '$lib/stores.js';
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	import Navbar from '$components/common/Navbar.svelte';
	import Footer from '$components/common/Footer.svelte';
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

	async function handleLogout() {
		if (isMockMode) {
			window.location.href = '/';
			return;
		}
		
		if (supabase) {
			await supabase.auth.signOut();
			window.location.href = '/';
		}
	}
</script>

<svelte:head>
	<title>KodeBlocks - DSA Learning Platform</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Navbar user={data.user} onLogout={handleLogout} />

	<main class="flex-1">
		<slot />
	</main>

	<Footer />
</div>
