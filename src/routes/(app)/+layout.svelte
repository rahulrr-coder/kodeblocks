<script>
	import Header from '$lib/components/common/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Toast from '$lib/components/common/Toast.svelte';
	import { page } from '$app/stores';
	
	export let data;
	
	$: user = data.user;
	$: currentRoute = $page.url.pathname;
</script>

<div class="min-h-screen flex flex-col bg-neutral-50">
	<Header {user} {currentRoute} />
	
	<main class="flex-1">
		<slot />
	</main>
	
	<Footer />
	<Toast />
</div>
