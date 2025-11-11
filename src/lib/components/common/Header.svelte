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
</script>

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
			>
				Dashboard
			</a>
			<a 
				href="/leaderboard" 
				class="nav-link" 
				class:active={isActive('/leaderboard')}
			>
				Leaderboard
			</a>
			<a 
				href="/profile" 
				class="nav-link" 
				class:active={isActive('/profile')}
			>
				Profile
			</a>
		</nav>

		<!-- User Menu -->
		<div class="user-menu">
			<button class="user-button">
				<span class="user-avatar">
					{username.charAt(0).toUpperCase()}
				</span>
				<span class="user-name">@{username}</span>
			</button>
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
