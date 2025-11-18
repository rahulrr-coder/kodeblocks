<script>
	import { scale, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let badges = []; // Array of newly earned badges
	export let onClose = () => {};
	export let show = false;

	$: currentBadge = badges.length > 0 ? badges[0] : null;

	function handleClose() {
		if (badges.length > 1) {
			// Show next badge
			badges = badges.slice(1);
		} else {
			show = false;
			onClose();
		}
	}
</script>

{#if show && currentBadge}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
		on:click|stopPropagation
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		transition:fade={{ duration: 200 }}
		role="button"
		tabindex="0"
	>
		<!-- Modal -->
		<div
			class="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-amber-400"
			on:click|stopPropagation
			on:keydown|stopPropagation
			transition:scale={{ duration: 400, easing: cubicOut, start: 0.7 }}
			role="dialog"
			aria-modal="true"
		>
			<!-- Badge Unlock Header -->
			<div class="text-sm font-bold text-amber-700 uppercase tracking-wide mb-4 animate-pulse">
				🏆 Achievement Unlocked!
			</div>

			<!-- Badge Icon -->
			<div class="badge-icon-container mb-6">
				<div class="text-8xl animate-badge-unlock">
					{currentBadge.icon || '🎖️'}
				</div>
			</div>

			<!-- Badge Name -->
			<h2 class="text-3xl font-bold text-neutral-900 mb-3">
				{currentBadge.title || currentBadge.display_name}
			</h2>

			<!-- Badge Description -->
			<p class="text-neutral-600 text-lg mb-6">
				{currentBadge.description}
			</p>

			<!-- Badge Count (if multiple) -->
			{#if badges.length > 1}
				<p class="text-sm text-amber-600 font-medium mb-4">
					+{badges.length - 1} more achievement{badges.length > 2 ? 's' : ''} unlocked!
				</p>
			{/if}

			<!-- Continue Button -->
			<button
				on:click={handleClose}
				class="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all transform hover:scale-105 shadow-xl text-lg"
			>
				{badges.length > 1 ? 'Next →' : 'Awesome! 🎉'}
			</button>

			<!-- Close hint -->
			<p class="text-xs text-neutral-400 mt-4">
				Press ESC or click to continue
			</p>
		</div>
	</div>
{/if}

<style>
	@keyframes badge-unlock {
		0% {
			transform: scale(0) rotate(-180deg);
			opacity: 0;
		}
		50% {
			transform: scale(1.3) rotate(10deg);
		}
		70% {
			transform: scale(0.9) rotate(-5deg);
		}
		100% {
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.animate-badge-unlock {
		animation: badge-unlock 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		display: inline-block;
	}

	.badge-icon-container {
		position: relative;
	}

	.badge-icon-container::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 150px;
		height: 150px;
		background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
		border-radius: 50%;
		animation: glow-pulse 2s ease-in-out infinite;
	}

	@keyframes glow-pulse {
		0%, 100% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}
</style>
