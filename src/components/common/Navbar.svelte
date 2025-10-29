<script>
	import { page } from '$app/stores';
	import { session } from '$lib/stores.js';
	import { Menu, X, Home, Code2, User, Trophy, LogOut, ChevronDown } from 'lucide-svelte';

	export let user = null;
	export let onLogout = () => {};

	let showMobileMenu = false;
	let showTracksDropdown = false;

	const tracks = [
		{ name: 'Foundations', url: '/tracks/foundations' },
		{ name: 'Interview Prep', url: '/tracks/interview-prep' },
		{ name: 'Deep Dive', url: '/tracks/deep-dive' },
		{ name: 'Problem Solving', url: '/tracks/problem-solving' },
	];
</script>

<nav class="bg-white shadow-md sticky top-0 z-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<!-- Logo -->
			<div class="flex items-center">
				<a href={$session ? '/dashboard' : '/'} class="flex items-center space-x-2">
					<Code2 class="h-8 w-8 text-primary-600" />
					<span class="text-2xl font-bold text-gray-900">KodeBlocks</span>
				</a>
			</div>

			<!-- Desktop Navigation -->
			{#if $session}
				<div class="hidden md:flex items-center space-x-6">
					<a
						href="/dashboard"
						class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
					>
						<Home class="h-5 w-5" />
						<span>Dashboard</span>
					</a>

					<!-- Tracks Dropdown -->
					<div class="relative">
						<button
							on:click={() => (showTracksDropdown = !showTracksDropdown)}
							class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
						>
							<Code2 class="h-5 w-5" />
							<span>Tracks</span>
							<ChevronDown class="h-4 w-4" />
						</button>

						{#if showTracksDropdown}
							<div
								class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200"
							>
								{#each tracks as track}
									<a
										href={track.url}
										class="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
										on:click={() => (showTracksDropdown = false)}
									>
										{track.name}
									</a>
								{/each}
							</div>
						{/if}
					</div>

					<a
						href="/profile"
						class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
					>
						<User class="h-5 w-5" />
						<span>Profile</span>
					</a>

					<a
						href="/leaderboard"
						class="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
					>
						<Trophy class="h-5 w-5" />
						<span>Leaderboard</span>
					</a>

					<!-- User Avatar & Logout -->
					<div class="flex items-center space-x-3 pl-4 border-l border-gray-200">
						{#if user?.user_metadata?.avatar_url}
							<img
								src={user.user_metadata.avatar_url}
								alt="Profile"
								class="h-8 w-8 rounded-full"
							/>
						{:else}
							<div
								class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold"
							>
								{user?.email?.[0]?.toUpperCase() || 'U'}
							</div>
						{/if}
						<button
							on:click={onLogout}
							class="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
						>
							<LogOut class="h-5 w-5" />
							<span>Logout</span>
						</button>
					</div>
				</div>
			{:else}
				<div class="hidden md:flex items-center space-x-4">
					<a href="/login" class="btn-primary"> Get Started </a>
				</div>
			{/if}

			<!-- Mobile Menu Button -->
			<div class="md:hidden flex items-center">
				<button
					on:click={() => (showMobileMenu = !showMobileMenu)}
					class="text-gray-700 hover:text-primary-600"
				>
					{#if showMobileMenu}
						<X class="h-6 w-6" />
					{:else}
						<Menu class="h-6 w-6" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="md:hidden border-t border-gray-200">
			<div class="px-2 pt-2 pb-3 space-y-1">
				{#if $session}
					<a
						href="/dashboard"
						class="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
					>
						Dashboard
					</a>

					{#each tracks as track}
						<a
							href={track.url}
							class="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
						>
							{track.name}
						</a>
					{/each}

					<a
						href="/profile"
						class="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
					>
						Profile
					</a>

					<a
						href="/leaderboard"
						class="block px-3 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-md"
					>
						Leaderboard
					</a>

					<button
						on:click={onLogout}
						class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
					>
						Logout
					</button>
				{:else}
					<a
						href="/login"
						class="block px-3 py-2 text-center bg-primary-600 text-white rounded-md"
					>
						Get Started
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
