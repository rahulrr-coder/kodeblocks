<script>
	export let data;
	
	// Use data to prevent warning
	$: profile = data?.profile;
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<h1 class="text-4xl font-bold text-neutral-900 mb-4">Leaderboard</h1>
	<p class="text-lg text-neutral-600 mb-8">See who's leading this week! 🏆</p>
	
	<div class="bg-white rounded-2xl shadow-md p-6 border border-neutral-200">
		<h2 class="text-2xl font-bold mb-4">Weekly Rankings</h2>
		<p class="text-neutral-600">Leaderboard coming soon!</p>
	</div>
</div>
