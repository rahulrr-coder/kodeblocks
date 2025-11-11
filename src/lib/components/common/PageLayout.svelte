<script>
	/**
	 * @fileoverview Shared page layout component
	 * Provides consistent spacing and container structure across pages
	 */
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	
	export let title = '';
	export let subtitle = '';
	export let maxWidth = '7xl'; // 'full', '7xl', '6xl', '5xl', '4xl'
	
	const maxWidthClasses = {
		'full': 'max-w-full',
		'7xl': 'max-w-7xl',
		'6xl': 'max-w-6xl',
		'5xl': 'max-w-5xl',
		'4xl': 'max-w-4xl'
	};
	
	$: containerClass = maxWidthClasses[maxWidth] || maxWidthClasses['7xl'];
</script>

<div class="{containerClass} mx-auto px-4 sm:px-6 lg:px-8 py-8">
	{#if title || subtitle}
		<div 
			class="mb-8"
			in:fly={{ y: 20, duration: 500, easing: cubicOut }}
		>
			{#if title}
				<h1 class="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
					{title}
				</h1>
			{/if}
			{#if subtitle}
				<p class="text-lg md:text-xl text-neutral-600">
					{subtitle}
				</p>
			{/if}
		</div>
	{/if}
	
	<slot />
</div>

<style>
	/* Additional styles can be added here if needed */
</style>
