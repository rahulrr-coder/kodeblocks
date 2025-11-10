<script>
	/**
	 * @fileoverview Cooldown timer component
	 * Displays remaining cooldown time and updates every second
	 */
	import { onMount, onDestroy } from 'svelte';
	import { getCooldownRemaining, formatCooldownTime } from '$lib/utils/cooldownUtils.js';

	export let lastCompletedAt = null;
	export let onExpire = () => {};

	let remaining = null;
	let interval = null;

	function updateTimer() {
		remaining = getCooldownRemaining(lastCompletedAt);
		
		if (!remaining) {
			clearInterval(interval);
			onExpire();
		}
	}

	onMount(() => {
		updateTimer();
		interval = setInterval(updateTimer, 1000);
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
	});

	$: timeString = remaining ? `${remaining.minutes}m ${remaining.seconds}s` : '';
	$: showTimer = remaining && remaining.total > 0;
</script>

{#if showTimer}
	<div class="cooldown-banner">
		<div class="cooldown-content">
			<span class="cooldown-icon">⏱️</span>
			<div class="cooldown-text">
				<span class="cooldown-title">Taking a break!</span>
				<span class="cooldown-time">Next submission in <strong>{timeString}</strong></span>
			</div>
		</div>
	</div>
{/if}

<style>
	.cooldown-banner {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 2px solid #f59e0b;
		border-radius: 0.75rem;
		padding: 1rem 1.5rem;
		margin-bottom: 1.5rem;
		animation: slideDown 0.3s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.cooldown-content {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.cooldown-icon {
		font-size: 1.5rem;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	.cooldown-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.cooldown-title {
		font-weight: 600;
		color: #92400e;
		font-size: 0.95rem;
	}

	.cooldown-time {
		font-size: 0.875rem;
		color: #78350f;
	}

	.cooldown-time strong {
		font-weight: 700;
		color: #d97706;
	}
</style>
