/**
 * @fileoverview Confetti utility for celebration effects
 */

import confetti from 'canvas-confetti';

/**
 * Trigger confetti explosion effect
 * @param {Object} options - Confetti options
 */
export function celebrationConfetti(options = {}) {
	const defaults = {
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 }
	};

	confetti({
		...defaults,
		...options
	});
}

/**
 * Trigger multiple confetti bursts
 */
export function multipleConfettiBursts(count = 3) {
	let burstCount = 0;

	const burst = () => {
		confetti({
			particleCount: 50,
			angle: 60,
			spread: 55,
			origin: { x: 0 }
		});

		confetti({
			particleCount: 50,
			angle: 120,
			spread: 55,
			origin: { x: 1 }
		});

		burstCount++;
		if (burstCount < count) {
			setTimeout(burst, 150);
		}
	};

	burst();
}

/**
 * Trigger confetti fireworks effect
 */
export function confettiFireworks() {
	const duration = 2000;
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(function() {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);

		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
		});
		confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
		});
	}, 250);
}

/**
 * Trigger realistic confetti cannon effect
 */
export function confettiCannon() {
	const count = 200;
	const defaults = {
		origin: { y: 0.7 }
	};

	function fire(particleRatio, opts) {
		confetti({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio)
		});
	}

	fire(0.25, {
		spread: 26,
		startVelocity: 55
	});

	fire(0.2, {
		spread: 60
	});

	fire(0.35, {
		spread: 100,
		decay: 0.91,
		scalar: 0.8
	});

	fire(0.1, {
		spread: 120,
		startVelocity: 25,
		decay: 0.92,
		scalar: 1.2
	});

	fire(0.1, {
		spread: 120,
		startVelocity: 45
	});
}

/**
 * Trigger custom colored confetti
 * @param {Array<string>} colors - Array of hex color codes
 */
export function coloredConfetti(colors = ['#f59e0b', '#d97706', '#14b8a6']) {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		colors: colors
	});
}

/**
 * Trigger badge unlock confetti with gold colors
 */
export function badgeUnlockConfetti() {
	const colors = ['#FFD700', '#FFA500', '#FF8C00', '#FFE55C'];

	confetti({
		particleCount: 150,
		spread: 100,
		origin: { y: 0.5 },
		colors: colors,
		shapes: ['circle', 'square'],
		scalar: 1.2
	});
}

/**
 * Trigger streak celebration confetti with fire colors
 */
export function streakConfetti() {
	const colors = ['#FF4500', '#FF6347', '#FFA500', '#FFD700'];

	confetti({
		particleCount: 100,
		spread: 80,
		origin: { y: 0.6 },
		colors: colors,
		startVelocity: 45
	});
}
