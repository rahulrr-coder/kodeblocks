<script>
	import { ArrowRight, Code2, Flame, CheckCircle2 } from 'lucide-svelte';

	const features = [
		{
			icon: '🎯',
			title: 'Curated Tracks',
			description: 'Structured learning paths from foundations to advanced problem-solving'
		},
		{
			icon: '🔥',
			title: 'Daily Streaks',
			description: 'Build consistency with streak tracking and daily coding challenges'
		},
		{
			icon: '📊',
			title: 'Track Progress',
			description: 'Visual dashboards showing your growth across all problem categories'
		}
	];
</script>

<svelte:head>
	<title>KodeBlocks - Master DSA One Block at a Time</title>
	<meta name="description" content="Structured learning tracks, daily coding challenges, and progress tracking to master Data Structures & Algorithms." />
</svelte:head>

<!-- Public Navigation -->
<nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
	<div class="max-w-6xl mx-auto px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<a href="/" class="flex items-center gap-2">
				<div class="w-8 h-8 bg-linear-to-br from-amber-500 to-teal-600 rounded-lg flex items-center justify-center">
					<span class="text-white font-bold text-sm">KB</span>
				</div>
				<span class="text-xl font-bold text-neutral-900">KodeBlocks</span>
			</a>
			
			<div class="flex items-center gap-4">
				<a href="/login" class="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
					Sign In
				</a>
				<a href="/login" class="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors">
					Get Started
				</a>
			</div>
		</div>
	</div>
</nav>

<div class="min-h-screen bg-neutral-50">
	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-linear-to-br from-neutral-50 via-amber-50 to-neutral-50">
		<!-- Subtle background decoration -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
			<div class="absolute top-20 -right-20 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
			<div class="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-teal-100 rounded-full blur-3xl"></div>
		</div>

		<div class="relative max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-24">
			<div class="max-w-4xl">
				<!-- Minimal badge -->
				<div class="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-200 rounded-full mb-8 animate-slide-up">
					<Flame class="w-4 h-4 text-amber-600" />
					<span class="text-sm font-medium text-amber-800">Track. Practice. Master.</span>
				</div>

				<!-- Hero headline -->
				<h1 class="text-6xl lg:text-7xl font-bold text-neutral-900 mb-6 tracking-tight animate-slide-up" style="animation-delay: 0.1s;">
					Master DSA,<br />
					<span class="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-500 to-teal-600">One Block at a Time</span>
				</h1>

				<!-- Hero description -->
				<p class="text-xl text-neutral-600 mb-10 max-w-2xl leading-relaxed animate-slide-up" style="animation-delay: 0.2s;">
					Structured learning tracks, consistent practice, and real progress tracking. Your path from beginner to expert starts here.
				</p>

				<!-- CTA -->
				<div class="flex flex-wrap gap-4 animate-slide-up" style="animation-delay: 0.3s;">
					<a 
						href="/login" 
						class="group inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
					>
						Start Learning Free
						<ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</a>
					<a 
						href="https://github.com/rahulrr-coder/kodeblocks" 
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 px-8 py-4 bg-white text-neutral-700 font-semibold rounded-lg border border-neutral-300 hover:border-neutral-400 transition-all duration-200 hover:scale-105"
					>
						<Code2 class="w-5 h-5" />
						View Source
					</a>
				</div>

				<!-- Social proof -->
				<div class="flex items-center gap-6 mt-12 pt-8 border-t border-neutral-200 animate-slide-up" style="animation-delay: 0.4s;">
					<div class="flex items-center gap-3">
						<div class="flex -space-x-3">
							<div class="w-10 h-10 rounded-full bg-linear-to-br from-amber-200 to-amber-300 border-2 border-white"></div>
							<div class="w-10 h-10 rounded-full bg-linear-to-br from-teal-200 to-teal-300 border-2 border-white"></div>
							<div class="w-10 h-10 rounded-full bg-linear-to-br from-amber-300 to-teal-200 border-2 border-white"></div>
						</div>
						<div class="text-sm text-neutral-600">
							<span class="font-semibold text-neutral-900">1,000+</span> active learners
						</div>
					</div>
					<div class="h-8 w-px bg-neutral-300"></div>
					<div class="flex items-center gap-2">
						<CheckCircle2 class="w-5 h-5 text-teal-600" />
						<span class="text-sm text-neutral-600">
							<span class="font-semibold text-neutral-900">500+</span> problems solved daily
						</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-24 bg-white">
		<div class="max-w-6xl mx-auto px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-neutral-900 mb-4">
					Everything you need to excel
				</h2>
				<p class="text-lg text-neutral-600">
					Simple, focused, effective
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				{#each features as feature}
					<div class="group p-8 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
						<div class="text-5xl mb-4">{feature.icon}</div>
						<h3 class="text-xl font-semibold text-neutral-900 mb-3">
							{feature.title}
						</h3>
						<p class="text-neutral-600 leading-relaxed">
							{feature.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="py-24 bg-linear-to-br from-amber-500 to-amber-600">
		<div class="max-w-6xl mx-auto px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-white mb-4">
					Join a thriving community
				</h2>
			</div>

			<div class="grid md:grid-cols-4 gap-8">
				<div class="text-center">
					<div class="text-5xl font-bold text-white mb-2">500+</div>
					<div class="text-amber-100">Practice Problems</div>
				</div>
				<div class="text-center">
					<div class="text-5xl font-bold text-white mb-2">15+</div>
					<div class="text-amber-100">Learning Tracks</div>
				</div>
				<div class="text-center">
					<div class="text-5xl font-bold text-white mb-2">1000+</div>
					<div class="text-amber-100">Active Learners</div>
				</div>
				<div class="text-center">
					<div class="text-5xl font-bold text-white mb-2">95%</div>
					<div class="text-amber-100">Success Rate</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works -->
	<section class="py-24 bg-white">
		<div class="max-w-6xl mx-auto px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-neutral-900 mb-4">
					How it works
				</h2>
				<p class="text-lg text-neutral-600">
					Three simple steps to success
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-12">
				<div class="relative">
					<div class="flex items-center justify-center w-14 h-14 bg-amber-500 text-white text-2xl font-bold rounded-lg mb-6">
						1
					</div>
					<h3 class="text-xl font-semibold text-neutral-900 mb-3">
						Choose Your Track
					</h3>
					<p class="text-neutral-600 leading-relaxed">
						Select from curated learning paths designed for your level and goals
					</p>
				</div>

				<div class="relative">
					<div class="flex items-center justify-center w-14 h-14 bg-teal-500 text-white text-2xl font-bold rounded-lg mb-6">
						2
					</div>
					<h3 class="text-xl font-semibold text-neutral-900 mb-3">
						Practice Consistently
					</h3>
					<p class="text-neutral-600 leading-relaxed">
						Solve problems daily, build streaks, and develop your coding intuition
					</p>
				</div>

				<div class="relative">
					<div class="flex items-center justify-center w-14 h-14 bg-amber-600 text-white text-2xl font-bold rounded-lg mb-6">
						3
					</div>
					<h3 class="text-xl font-semibold text-neutral-900 mb-3">
						Track Your Growth
					</h3>
					<p class="text-neutral-600 leading-relaxed">
						Monitor progress, earn achievements, and see your skills improve
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Final CTA -->
	<section class="py-24 bg-linear-to-br from-amber-50 to-orange-50">
		<div class="max-w-4xl mx-auto px-6 lg:px-8 text-center">
			<h2 class="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
				Ready to start your journey?
			</h2>
			<p class="text-xl text-neutral-600 mb-10">
				Join thousands of developers mastering DSA and landing their dream roles
			</p>
			<a 
				href="/login" 
				class="inline-flex items-center gap-2 px-10 py-5 bg-amber-600 text-white text-lg font-semibold rounded-lg hover:bg-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
			>
				Get Started Free
				<ArrowRight class="w-5 h-5" />
			</a>
		</div>
	</section>
	
	<!-- Footer -->
	<footer class="bg-neutral-900 text-neutral-300 py-12">
		<div class="max-w-6xl mx-auto px-6 lg:px-8">
			<div class="grid md:grid-cols-4 gap-8 mb-8">
				<div>
					<div class="flex items-center gap-2 mb-4">
						<div class="w-8 h-8 bg-linear-to-br from-amber-500 to-teal-600 rounded-lg flex items-center justify-center">
							<span class="text-white font-bold text-sm">KB</span>
						</div>
						<span class="text-lg font-bold text-white">KodeBlocks</span>
					</div>
					<p class="text-sm text-neutral-400">
						Master DSA through structured learning and consistent practice.
					</p>
				</div>
				
				<div>
					<h3 class="font-semibold text-white mb-3">Learn</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="/tracks" class="hover:text-white transition-colors">Tracks</a></li>
						<li><a href="/dashboard" class="hover:text-white transition-colors">Dashboard</a></li>
						<li><a href="/leaderboard" class="hover:text-white transition-colors">Leaderboard</a></li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-semibold text-white mb-3">Resources</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="https://github.com/rahulrr-coder/kodeblocks" target="_blank" rel="noopener" class="hover:text-white transition-colors">About</a></li>
						<li><a href="https://github.com/rahulrr-coder/kodeblocks" target="_blank" rel="noopener" class="hover:text-white transition-colors">Blog</a></li>
						<li><a href="https://github.com/rahulrr-coder/kodeblocks" target="_blank" rel="noopener" class="hover:text-white transition-colors">FAQs</a></li>
					</ul>
				</div>
				
				<div>
					<h3 class="font-semibold text-white mb-3">Connect</h3>
					<ul class="space-y-2 text-sm">
						<li><a href="https://github.com/rahulrr-coder/kodeblocks" target="_blank" rel="noopener" class="hover:text-white transition-colors">GitHub</a></li>
						<li><a href="https://twitter.com" target="_blank" rel="noopener" class="hover:text-white transition-colors">Twitter</a></li>
						<li><a href="mailto:demo@kodeblocks.com" class="hover:text-white transition-colors">Email</a></li>
					</ul>
				</div>
			</div>
			
			<div class="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-400">
				<p>© 2025 KodeBlocks. Built with ❤️ by <a href="https://github.com/rahulrr-coder" target="_blank" rel="noopener" class="text-amber-500 hover:text-amber-400">@RS</a> Rahul RR.</p>
			</div>
		</div>
	</footer>
</div>
