<script>
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PageLayout from '$lib/components/common/PageLayout.svelte';
	import { getTrackInfo } from '$lib/config/tracks.js';
	import { trackDbToUrl } from '$lib/utils.js';
	
	export let data;
	
	const { tracks, user } = data;
</script>

<svelte:head>
	<title>Learning Tracks - KodeBloks</title>
</svelte:head>

<PageLayout 
	title="Learning Tracks"
	subtitle="Choose your path and start solving curated DSA problems"
>
	<!-- Tracks Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each tracks as track, i}
			{@const trackInfo = getTrackInfo(track.name)}
			{@const isComingSoon = track.is_coming_soon || track.totalProblems === 0}
			{@const progress = track.totalProblems > 0 ? (track.completedProblems / track.totalProblems) * 100 : 0}
			
			<article 
				class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-200 group hover:scale-105 hover:-translate-y-2 relative"
				in:scale={{ duration: 400, delay: 200 + i * 100, easing: cubicOut, start: 0.9 }}
			>
				{#if isComingSoon}
					<div class="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full z-10">
						🚧 Coming Soon
					</div>
				{/if}
				
				<div class="p-8">
					<!-- Icon and Name -->
					<div class="flex items-center gap-4 mb-5">
						<span class="text-5xl transition-transform group-hover:scale-110 duration-300">{trackInfo?.icon || '📚'}</span>
						<h2 class="text-2xl font-bold text-neutral-900">{track.name}</h2>
					</div>
					
					<!-- Description -->
					<p class="text-neutral-600 mb-6 min-h-12">{track.description || trackInfo?.description || 'Master key programming concepts'}</p>
					
					{#if !isComingSoon}
						<!-- Stats -->
						<div class="mb-6 p-4 bg-neutral-50 rounded-lg">
							<div class="flex justify-between items-center mb-2">
								<span class="text-sm font-medium text-neutral-600">Problems</span>
								<span class="text-lg font-bold text-neutral-900">{track.totalProblems}</span>
							</div>
							<div class="flex justify-between items-center">
								<span class="text-sm font-medium text-neutral-600">Your Progress</span>
								<span class="text-sm font-bold text-amber-600">
									{track.completedProblems}/{track.totalProblems}
								</span>
							</div>
						</div>
						
						<!-- Progress Bar -->
						<div class="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden mb-6">
							<div 
								class="h-full rounded-full transition-all duration-500 bg-amber-500"
								style="width: {progress}%;"
							></div>
						</div>
						
						<!-- CTA Button -->
						<a
							href="/tracks/{trackDbToUrl(track.name)}"
							class="block w-full text-center py-3.5 px-6 rounded-xl text-white font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-md hover:shadow-lg bg-amber-600 hover:bg-amber-700"
						>
							Start Solving
						</a>
					{:else}
						<!-- Coming Soon State -->
						<div class="mb-6 p-4 bg-neutral-50 rounded-lg">
							<p class="text-sm text-neutral-500 italic text-center">
								Track content is being prepared...
							</p>
						</div>
						
						<!-- Disabled Button -->
						<button
							disabled
							class="block w-full text-center py-3.5 px-6 rounded-xl text-white font-semibold bg-neutral-400 cursor-not-allowed opacity-60"
						>
							Coming Soon
						</button>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</PageLayout>
