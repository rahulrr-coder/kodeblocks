<script>
	import { ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>KodeBlocks - Master DSA</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
		<h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
			🧩 KodeBlocks
		</h1>
		<p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
			Master Data Structures & Algorithms through structured learning paths and consistent practice.
		</p>
		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<a 
				href="/login" 
				class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors"
			>
				Get Started
				<ArrowRight class="ml-2 h-5 w-5" />
			</a>
			<a 
				href="https://github.com/rahulrr-coder/kodeblocks" 
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
			>
				View on GitHub
			</a>
		</div>
	</div>
</div>
