<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	
	export let data;
	
	$: user = {
		username: data.profile?.username || 'User',
		avatar_id: data.profile?.avatar_id || '👤'
	};
	
	$: currentPath = $page.url.pathname;
</script>

<div class="min-h-screen flex flex-col bg-neutral-50">
	<Navbar {currentPath} {user} />
	
	<main class="flex-1">
		<slot />
	</main>
	
	<Footer />
</div>
