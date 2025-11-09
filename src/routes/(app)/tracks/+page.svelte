<script>
	const tracks = [
		{ 
			slug: 'building-blocks',
			name: 'Building Blocks', 
			icon: '🧱', 
			color: '#d97706',
			description: 'Master DSA fundamentals',
			totalProblems: 100,
			solved: 0
		},
		{ 
			slug: 'deep-dive',
			name: 'Deep Dive', 
			icon: '🏊', 
			color: '#ea580c',
			description: 'Advanced algorithms',
			totalProblems: 100,
			solved: 0
		},
		{ 
			slug: 'interview-essentials',
			name: 'Interview Essentials', 
			icon: '💼', 
			color: '#0ea5e9',
			description: 'Ace your interviews',
			totalProblems: 50,
			solved: 0
		}
	];
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-12">
		<h1 class="text-5xl font-bold text-neutral-900 mb-4">Learning Tracks</h1>
		<p class="text-xl text-neutral-600">
			Choose your path and start solving curated DSA problems
		</p>
	</div>
	
	<!-- Tracks Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each tracks as track}
			<article class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-neutral-200 group hover:scale-105">
				<div class="p-8">
					<!-- Icon and Name -->
					<div class="flex items-center gap-4 mb-5">
						<span class="text-5xl transition-transform group-hover:scale-110 duration-300">{track.icon}</span>
						<h2 class="text-2xl font-bold text-neutral-900">{track.name}</h2>
					</div>
					
					<!-- Description -->
					<p class="text-neutral-600 mb-6 min-h-12">{track.description}</p>
					
					<!-- Stats -->
					<div class="mb-6 p-4 bg-neutral-50 rounded-lg">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm font-medium text-neutral-600">Problems</span>
							<span class="text-lg font-bold text-neutral-900">{track.totalProblems}</span>
						</div>
						<div class="flex justify-between items-center">
							<span class="text-sm font-medium text-neutral-600">Your Progress</span>
							<span class="text-sm font-bold" style="color: {track.color};">
								{track.solved}/{track.totalProblems}
							</span>
						</div>
					</div>
					
					<!-- Progress Bar -->
					<div class="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden mb-6">
						<div 
							class="h-full rounded-full transition-all duration-500"
							style="width: {(track.solved / track.totalProblems) * 100}%; background-color: {track.color};"
						></div>
					</div>
					
					<!-- CTA Button -->
					<a
						href="/tracks/{track.slug}"
						class="block w-full text-center py-3.5 px-6 rounded-xl text-white font-semibold transition-all duration-200 hover:opacity-90 hover:scale-105 shadow-md hover:shadow-lg"
						style="background-color: {track.color};"
					>
						Start Solving
					</a>
				</div>
			</article>
		{/each}
	</div>
</div>
