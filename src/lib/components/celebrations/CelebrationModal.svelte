<script>
	import { scale, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let bloks = 0;
	export let problemTitle = '';
	export let onClose = () => {};
	export let show = false;

	// Animated counter
	let displayedBloks = 0;
	let animationFrame = null;

	// Reactive statement - runs when show or bloks changes
	$: if (show && bloks > 0) {
		// Reset and start animation
		displayedBloks = 0;
		startAnimation();
	}

	function startAnimation() {
		const duration = 1000;
		const startTime = Date.now();
		const endValue = bloks;

		const animate = () => {
			const now = Date.now();
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Ease out cubic
			const easedProgress = 1 - Math.pow(1 - progress, 3);
			displayedBloks = Math.floor(endValue * easedProgress);

			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			} else {
				displayedBloks = endValue;
			}
		};

		// Cancel any existing animation
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}

		animate();
	}

	function handleClose() {
		// Cancel animation when closing
		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		show = false;
		displayedBloks = 0;
		onClose();
	}
</script>

{#if show}
	<!-- Glassmorphism Backdrop -->
	<div
		class="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4"
		on:click={handleClose}
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		transition:fade={{ duration: 300 }}
		role="button"
		tabindex="0"
	>
		<!-- Modal with glassmorphism -->
		<div
			class="glass-modal rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20"
			on:click|stopPropagation
			on:keydown|stopPropagation
			transition:scale={{ duration: 400, easing: cubicOut, start: 0.9 }}
			role="dialog"
			aria-modal="true"
		>
			<!-- Success Icon -->
			<div class="text-7xl mb-4 animate-bounce-in">
				🎉
			</div>

			<!-- Title -->
			<h2 class="text-3xl font-bold text-neutral-900 mb-2">
				Awesome!
			</h2>

			<!-- Problem Title -->
			{#if problemTitle}
				<p class="text-neutral-600 mb-6">
					You completed <span class="font-semibold">{problemTitle}</span>
				</p>
			{/if}

			<!-- Bloks Earned -->
			<div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-amber-200">
				<div class="text-sm text-amber-700 font-medium mb-2">Bloks Earned</div>
				<div class="text-6xl font-bold text-amber-600 animate-pulse-glow">
					+{displayedBloks}
				</div>
			</div>

			<!-- Continue Button -->
			<button
				on:click={handleClose}
				class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
			>
				Continue 🚀
			</button>
		</div>
	</div>
{/if}

<style>
	.glass-modal {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-bounce-in {
		animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.animate-pulse-glow {
		animation: pulse-glow 2s ease-in-out infinite;
	}

	@keyframes pulse-glow {
		0%, 100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.05);
		}
	}
</style>
