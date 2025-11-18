<script>
	/**
	 * @fileoverview Shared header component with KodeBloks branding
	 * Used across all authenticated pages for consistency
	 */
	import { page } from '$app/stores';
	
	export let user = null;

	// Get username from email
	$: username = user?.email ? user.email.split('@')[0] : 'User';
	
	// Check if current route is active
	function isActive(path) {
		return $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');
	}
	
	// Dropdown state
	let dropdownOpen = false;
	
	function toggleDropdown() {
		dropdownOpen = !dropdownOpen;
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (dropdownOpen && !event.target.closest('.user-menu')) {
			dropdownOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<header class="navbar">
	<div class="navbar-container">
		<!-- Logo Section -->
		<a href="/dashboard" class="logo">
			<div class="brick-icon">
				<div class="brick-row">
					<div class="brick"></div>
					<div class="brick"></div>
					<div class="brick"></div>
				</div>
				<div class="brick-row offset">
					<div class="brick"></div>
					<div class="brick"></div>
				</div>
				<div class="brick-row">
					<div class="brick"></div>
					<div class="brick"></div>
					<div class="brick"></div>
				</div>
			</div>
			<span class="logo-text">KodeBloks</span>
		</a>

		<!-- Navigation -->
		<nav class="nav-links">
			<a 
				href="/dashboard" 
				class="nav-link" 
				class:active={isActive('/dashboard')}
				data-sveltekit-preload-data="hover"
			>
				Dashboard
			</a>
			<a 
				href="/tracks" 
				class="nav-link" 
				class:active={isActive('/tracks')}
				data-sveltekit-preload-data="hover"
			>
				Tracks
			</a>
			<a 
				href="/leaderboard" 
				class="nav-link" 
				class:active={isActive('/leaderboard')}
				data-sveltekit-preload-data="hover"
			>
				Leaderboard
			</a>
		</nav>

		<!-- User Menu -->
		<div class="user-menu">
			<button class="user-button" on:click={toggleDropdown}>
				<span class="user-avatar">
					{username.charAt(0).toUpperCase()}
				</span>
				<span class="user-name">@{username}</span>
				<svg class="dropdown-arrow" class:rotate={dropdownOpen} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
					<path d="M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z"/>
				</svg>
			</button>
			
			{#if dropdownOpen}
				<div class="dropdown-menu">
					<a href="/profile" class="dropdown-item">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
						</svg>
						Profile
					</a>
					<form action="/auth/signout" method="POST" class="dropdown-form">
						<button type="submit" class="dropdown-item logout">
							<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
								<path fill-rule="evenodd" d="M10 12.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v2a.5.5 0 001 0v-2A1.5 1.5 0 009.5 2h-8A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h8a1.5 1.5 0 001.5-1.5v-2a.5.5 0 00-1 0v2z"/>
								<path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 000-.708l-3-3a.5.5 0 00-.708.708L14.293 7.5H5.5a.5.5 0 000 1h8.793l-2.147 2.146a.5.5 0 00.708.708l3-3z"/>
							</svg>
							Logout
						</button>
					</form>
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.navbar {
		background: #1e293b;
		border-bottom: 2px solid #334155;
		position: sticky;
		top: 0;
		z-index: 50;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.navbar-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	/* Logo Styles */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		transition: transform 0.2s;
	}

	.logo:hover {
		transform: scale(1.05);
	}

	.brick-icon {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.brick-row {
		display: flex;
		gap: 2px;
	}

	.brick-row.offset {
		margin-left: 12px;
	}

	.brick {
		width: 16px;
		height: 8px;
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		border-radius: 2px;
		box-shadow: 0 2px 4px rgba(217, 119, 6, 0.3);
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-family: 'Space Grotesk', sans-serif;
	}

	/* Navigation Styles */
	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
	}

	.nav-link {
		padding: 0.625rem 1.25rem;
		color: #cbd5e1;
		text-decoration: none;
		font-weight: 500;
		border-radius: 0.5rem;
		transition: all 0.2s;
		font-size: 0.95rem;
	}

	.nav-link:hover {
		background: #334155;
		color: #f59e0b;
	}

	.nav-link.active {
		background: #d97706;
		color: #0f172a;
		font-weight: 600;
	}

	/* User Menu Styles */
	.user-menu {
		display: flex;
		align-items: center;
		position: relative;
	}

	.user-button {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 1rem;
		background: #334155;
		border: 2px solid #475569;
		border-radius: 0.75rem;
		color: #f1f5f9;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 0.875rem;
	}

	.user-button:hover {
		background: #475569;
		border-color: #d97706;
		transform: translateY(-1px);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
	}
	
	.dropdown-arrow {
		transition: transform 0.2s;
	}
	
	.dropdown-arrow.rotate {
		transform: rotate(180deg);
	}

	.user-avatar {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		color: #0f172a;
		font-size: 0.875rem;
	}

	.user-name {
		font-family: 'JetBrains Mono', monospace;
	}
	
	/* Dropdown Menu */
	.dropdown-menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
		min-width: 12rem;
		overflow: hidden;
		z-index: 50;
	}
	
	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		color: #374151;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.15s;
		cursor: pointer;
		border: none;
		background: transparent;
		width: 100%;
		text-align: left;
	}
	
	.dropdown-item:hover {
		background: #f9fafb;
		color: #d97706;
	}
	
	.dropdown-item.logout {
		color: #dc2626;
		border-top: 1px solid #e5e7eb;
	}
	
	.dropdown-item.logout:hover {
		background: #fef2f2;
		color: #dc2626;
	}
	
	.dropdown-form {
		margin: 0;
		padding: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.navbar-container {
			padding: 0.75rem 1rem;
			gap: 1rem;
		}

		.logo-text {
			display: none;
		}

		.nav-links {
			gap: 0.25rem;
		}

		.nav-link {
			padding: 0.5rem 0.75rem;
			font-size: 0.875rem;
		}

		.user-name {
			display: none;
		}

		.user-button {
			padding: 0.5rem;
		}
	}
</style>
