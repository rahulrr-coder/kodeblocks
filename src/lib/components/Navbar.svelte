<script>
	import { goto } from '$app/navigation';
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	
	export let currentPath = '';
	export let user = { username: 'User', avatar_id: '👤' };
	
	let showDropdown = false;
	let showMobileMenu = false;
	let supabase;
	
	// Safely extract username and avatar, with fallbacks
	// If avatar_id is a URL (from Google OAuth), replace with default emoji
	$: displayUsername = user?.username || 'User';
	$: displayAvatar = (user?.avatar_id && !user.avatar_id.includes('http') && !user.avatar_id.includes('://')) 
		? user.avatar_id 
		: '👤';
	
	$: if (typeof window !== 'undefined') {
		supabase = createSupabaseLoadClient(fetch);
	}
	
	const navLinks = [
		{ name: 'Dashboard', path: '/dashboard' },
		{ name: 'Tracks', path: '/tracks' },
		{ name: 'Leaderboard', path: '/leaderboard' }
	];
	
	function isActive(path) {
		// Exact match for the path or if it's a sub-route
		if (currentPath === path) return true;
		// For sub-routes like /tracks/foundations, match if starts with path + /
		if (path !== '/dashboard' && currentPath.startsWith(path + '/')) return true;
		// For dashboard, only match exact path to avoid false positives
		return false;
	}
	
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
	
	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}
	
	async function handleLogout() {
		if (supabase) {
			await supabase.auth.signOut();
			goto('/login');
		}
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.profile-dropdown')) {
			showDropdown = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<a href="/dashboard" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
				<span class="text-3xl">🧱</span>
				<span class="text-xl font-bold text-amber-600">KodeBloks</span>
			</a>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-2">
				{#each navLinks as link}
					<a
						href={link.path}
						class="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(link.path)
							? 'bg-amber-100 text-amber-700'
							: 'text-neutral-700 hover:bg-neutral-100'}"
					>
						{link.name}
					</a>
				{/each}
			</div>
			
			<!-- Desktop Profile Dropdown -->
			<div class="hidden md:block relative profile-dropdown">
				<button
					on:click={toggleDropdown}
					class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
				>
					<span class="text-2xl">{displayAvatar}</span>
					<span class="text-sm font-medium text-neutral-700">@{displayUsername}</span>
					<svg
						class="w-4 h-4 text-neutral-500 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				
				{#if showDropdown}
					<div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1">
						<a
							href="/profile"
							class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
						>
							My Profile
						</a>
						<div class="border-t border-neutral-200 my-1"></div>
						<button
							on:click={handleLogout}
							class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
						>
							Logout
						</button>
					</div>
				{/if}
			</div>
			
			<!-- Mobile Menu Button -->
			<button
				on:click={toggleMobileMenu}
				class="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if showMobileMenu}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
		
		<!-- Mobile Menu -->
		{#if showMobileMenu}
			<div class="md:hidden border-t border-neutral-200 py-4">
				<!-- Profile Section -->
				<div class="flex items-center gap-3 px-4 py-3 mb-2">
					<span class="text-3xl">{displayAvatar}</span>
					<div>
						<p class="text-sm font-medium text-neutral-900">@{displayUsername}</p>
						<p class="text-xs text-neutral-500">View Profile</p>
					</div>
				</div>
				
				<!-- Nav Links -->
				<div class="space-y-1 px-2 mb-4">
					{#each navLinks as link}
						<a
							href={link.path}
							class="block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {isActive(link.path)
								? 'bg-amber-100 text-amber-700'
								: 'text-neutral-700 hover:bg-neutral-100'}"
							on:click={() => showMobileMenu = false}
						>
							{link.name}
						</a>
					{/each}
				</div>
				
				<!-- Profile Links -->
				<div class="border-t border-neutral-200 pt-4 px-2 space-y-1">
					<a
						href="/profile"
						class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
					>
						My Profile
					</a>
					<a
						href="/settings"
						class="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
					>
						Settings
					</a>
					<button
						on:click={handleLogout}
						class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					>
						Logout
					</button>
				</div>
			</div>
		{/if}
	</div>
</nav>
