<script>
	import { ArrowRight, Code2, Sparkles, Trophy, Zap, Target, Brain, Rocket } from 'lucide-svelte';
	import { onMount } from 'svelte';
	
	let mounted = false;
	
	onMount(() => {
		mounted = true;
	});

	const features = [
		{
			icon: Target,
			title: 'Structured Tracks',
			description: 'Follow curated learning paths designed to master DSA concepts progressively'
		},
		{
			icon: Brain,
			title: 'Smart Practice',
			description: 'Solve problems with intelligent difficulty progression and personalized recommendations'
		},
		{
			icon: Trophy,
			title: 'Compete & Grow',
			description: 'Join the leaderboard, track your progress, and compete with fellow coders'
		},
		{
			icon: Zap,
			title: 'Build Consistency',
			description: 'Develop a daily coding habit with streak tracking and achievement badges'
		}
	];

	const stats = [
		{ value: '500+', label: 'Practice Problems' },
		{ value: '15+', label: 'Learning Tracks' },
		{ value: '1000+', label: 'Active Learners' },
		{ value: '95%', label: 'Success Rate' }
	];
</script>

<svelte:head>
	<title>KodeBlocks - Master DSA Through Structured Practice</title>
	<meta name="description" content="Master Data Structures & Algorithms with structured learning paths, smart practice, and consistent daily coding challenges." />
</svelte:head>

<div class="min-h-screen bg-linear-to-br from-gray-50 via-primary-50/30 to-gray-50">
	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<!-- Animated background elements -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			<div class="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-pulse" style="animation-duration: 4s;"></div>
			<div class="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-pulse" style="animation-duration: 6s; animation-delay: 1s;"></div>
		</div>

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
			<!-- Main Hero Content -->
			<div class="text-center space-y-8">
				<!-- Badge -->
				<div class="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full shadow-sm 
					{mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}"
					style="animation-delay: 0.1s;">
					<Sparkles class="w-4 h-4 text-primary-600" />
					<span class="text-sm font-medium text-primary-700">Your Journey to Coding Mastery Starts Here</span>
				</div>

				<!-- Main Heading -->
				<h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 tracking-tight
					{mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}"
					style="animation-delay: 0.2s;">
					Master <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-800">DSA</span><br />
					One Block at a Time
				</h1>

				<!-- Subheading -->
				<p class="max-w-2xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed
					{mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}"
					style="animation-delay: 0.3s;">
					Transform from a coding beginner to a problem-solving expert with structured tracks, daily challenges, and a supportive community.
				</p>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4
					{mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}"
					style="animation-delay: 0.4s;">
					<a 
						href="/login" 
						class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
					>
						<span class="relative z-10 flex items-center gap-2">
							Start Learning Free
							<ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
						</span>
						<div class="absolute inset-0 bg-linear-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
					</a>
					<a 
						href="#features" 
						class="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
					>
						Explore Features
					</a>
				</div>

				<!-- Social Proof -->
				<div class="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4
					{mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}"
					style="animation-delay: 0.5s;">
					<div class="flex -space-x-2">
						<div class="w-8 h-8 rounded-full bg-primary-100 border-2 border-white"></div>
						<div class="w-8 h-8 rounded-full bg-primary-200 border-2 border-white"></div>
						<div class="w-8 h-8 rounded-full bg-primary-300 border-2 border-white"></div>
					</div>
					<span>Join <strong class="text-gray-900">1000+</strong> learners coding daily</span>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="relative py-12 {mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}" style="animation-delay: 0.6s;">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
				{#each stats as stat, i}
					<div class="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
						style="animation-delay: {0.7 + i * 0.1}s;">
						<div class="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
						<div class="text-sm md:text-base text-gray-600">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="py-20 {mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}" style="animation-delay: 0.8s;">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Section Header -->
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					Everything You Need to <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-800">Excel</span>
				</h2>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto">
					A comprehensive platform designed to transform your coding journey
				</p>
			</div>

			<!-- Features Grid -->
			<div class="grid md:grid-cols-2 gap-8">
				{#each features as feature, i}
					<div class="group relative p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-500"
						style="animation-delay: {0.9 + i * 0.1}s;">
						<!-- Icon -->
						<div class="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-primary-100 to-primary-200 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300">
							<svelte:component this={feature.icon} class="w-7 h-7 text-primary-600" />
						</div>
						
						<!-- Content -->
						<h3 class="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
						<p class="text-gray-600 leading-relaxed">{feature.description}</p>
						
						<!-- Hover gradient -->
						<div class="absolute inset-0 bg-linear-to-br from-primary-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="py-20 bg-linear-to-br from-primary-50/50 to-transparent {mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}" style="animation-delay: 1s;">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="text-center mb-16">
				<h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
					Your Path to Success
				</h2>
				<p class="text-xl text-gray-600">Simple steps to master coding</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<!-- Step 1 -->
				<div class="relative text-center">
					<div class="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary-500 to-primary-700 text-white rounded-2xl text-2xl font-bold mb-6 shadow-lg">
						1
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">Choose Your Track</h3>
					<p class="text-gray-600">Select from 15+ curated learning paths tailored to your level and goals</p>
				</div>

				<!-- Step 2 -->
				<div class="relative text-center">
					<div class="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary-500 to-primary-700 text-white rounded-2xl text-2xl font-bold mb-6 shadow-lg">
						2
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">Practice Daily</h3>
					<p class="text-gray-600">Solve problems consistently and build your coding muscle memory</p>
				</div>

				<!-- Step 3 -->
				<div class="relative text-center">
					<div class="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-primary-500 to-primary-700 text-white rounded-2xl text-2xl font-bold mb-6 shadow-lg">
						3
					</div>
					<h3 class="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
					<p class="text-gray-600">Monitor your growth, earn badges, and compete on the leaderboard</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20 {mounted ? 'animate-fadeIn opacity-100' : 'opacity-0'}" style="animation-delay: 1.2s;">
		<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="relative overflow-hidden bg-linear-to-r from-primary-600 to-primary-800 rounded-3xl shadow-2xl p-12 md:p-16 text-center">
				<!-- Background decoration -->
				<div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
				<div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
				
				<div class="relative z-10">
					<Rocket class="w-16 h-16 text-white mx-auto mb-6" />
					<h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
						Ready to Transform Your Coding Skills?
					</h2>
					<p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
						Join thousands of developers who are mastering DSA and landing their dream jobs
					</p>
					<a 
						href="/login" 
						class="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-primary-700 bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
					>
						Start Your Journey Now
						<ArrowRight class="ml-2 w-5 h-5" />
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer CTA -->
	<section class="py-12 text-center">
		<a 
			href="https://github.com/rahulrr-coder/kodeblocks" 
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
		>
			<Code2 class="w-5 h-5" />
			<span class="font-medium">View on GitHub</span>
		</a>
	</section>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fadeIn {
		animation: fadeIn 0.8s ease-out forwards;
	}
</style>
