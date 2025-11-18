/**
 * @fileoverview Sound effects utility using Web Audio API
 * Programmatically generates sound effects without requiring audio files
 */

// Sound enabled state (can be toggled by user)
let soundsEnabled = true;

/**
 * Get audio context (lazy initialization)
 */
function getAudioContext() {
	if (typeof window === 'undefined') return null;
	return new (window.AudioContext || window.webkitAudioContext)();
}

/**
 * Toggle sound effects on/off
 * @param {boolean} enabled - Whether sounds should be enabled
 */
export function setSoundsEnabled(enabled) {
	soundsEnabled = enabled;
	if (typeof window !== 'undefined') {
		localStorage.setItem('soundsEnabled', JSON.stringify(enabled));
	}
}

/**
 * Get current sound enabled state
 * @returns {boolean} Whether sounds are enabled
 */
export function areSoundsEnabled() {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('soundsEnabled');
		if (stored !== null) {
			soundsEnabled = JSON.parse(stored);
		}
	}
	return soundsEnabled;
}

/**
 * Play a coin/blok earning sound
 */
export function playCoinSound() {
	if (!areSoundsEnabled()) return;

	const audioContext = getAudioContext();
	if (!audioContext) return;

	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	// Bright, pleasant coin sound
	oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
	oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

	gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + 0.2);
}

/**
 * Play a success/completion sound
 */
export function playSuccessSound() {
	if (!areSoundsEnabled()) return;

	const audioContext = getAudioContext();
	if (!audioContext) return;

	// Play ascending notes (C - E - G)
	const frequencies = [523.25, 659.25, 783.99];
	const startTime = audioContext.currentTime;

	frequencies.forEach((freq, index) => {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.frequency.value = freq;
		gainNode.gain.setValueAtTime(0.2, startTime + index * 0.1);
		gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.1 + 0.15);

		oscillator.start(startTime + index * 0.1);
		oscillator.stop(startTime + index * 0.1 + 0.15);
	});
}

/**
 * Play an achievement unlock fanfare
 */
export function playAchievementSound() {
	if (!areSoundsEnabled()) return;

	const audioContext = getAudioContext();
	if (!audioContext) return;

	// Triumphant fanfare (G - B - D - G)
	const frequencies = [392, 493.88, 587.33, 783.99];
	const startTime = audioContext.currentTime;

	frequencies.forEach((freq, index) => {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.type = 'triangle';
		oscillator.frequency.value = freq;

		gainNode.gain.setValueAtTime(0.25, startTime + index * 0.12);
		gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.12 + 0.3);

		oscillator.start(startTime + index * 0.12);
		oscillator.stop(startTime + index * 0.12 + 0.3);
	});

	// Add a final sustained note
	const finalOsc = audioContext.createOscillator();
	const finalGain = audioContext.createGain();

	finalOsc.connect(finalGain);
	finalGain.connect(audioContext.destination);

	finalOsc.type = 'triangle';
	finalOsc.frequency.value = 783.99;

	finalGain.gain.setValueAtTime(0.3, startTime + 0.5);
	finalGain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.0);

	finalOsc.start(startTime + 0.5);
	finalOsc.stop(startTime + 1.0);
}

/**
 * Play a streak milestone sound
 */
export function playStreakSound() {
	if (!areSoundsEnabled()) return;

	const audioContext = getAudioContext();
	if (!audioContext) return;

	// Rising whoosh sound
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.type = 'sawtooth';
	oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
	oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);

	gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

	oscillator.start(audioContext.currentTime);
	oscillator.stop(audioContext.currentTime + 0.3);
}

/**
 * Play a level up sound
 */
export function playLevelUpSound() {
	if (!areSoundsEnabled()) return;

	const audioContext = getAudioContext();
	if (!audioContext) return;

	// Ascending arpeggio
	const frequencies = [261.63, 329.63, 392, 523.25, 659.25];
	const startTime = audioContext.currentTime;

	frequencies.forEach((freq, index) => {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.type = 'square';
		oscillator.frequency.value = freq;

		gainNode.gain.setValueAtTime(0.15, startTime + index * 0.08);
		gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + index * 0.08 + 0.1);

		oscillator.start(startTime + index * 0.08);
		oscillator.stop(startTime + index * 0.08 + 0.1);
	});
}
