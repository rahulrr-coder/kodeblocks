<script>
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { toast } from '$lib/stores/toast.js';
	
	$: toasts = $toast;
	
	function getIcon(type) {
		switch (type) {
			case 'success': return '🎉';
			case 'error': return '❌';
			case 'info': return 'ℹ️';
			default: return '💡';
		}
	}
	
	function getColorClasses(type) {
		switch (type) {
			case 'success': return 'bg-green-50 border-green-500 text-green-900';
			case 'error': return 'bg-red-50 border-red-500 text-red-900';
			case 'info': return 'bg-blue-50 border-blue-500 text-blue-900';
			default: return 'bg-neutral-50 border-neutral-500 text-neutral-900';
		}
	}
</script>

<div class="toast-container">
	{#each toasts as t (t.id)}
		<div
			class="toast {getColorClasses(t.type)}"
			in:fly={{ y: -20, duration: 300, easing: cubicOut }}
			out:fade={{ duration: 200 }}
		>
			<span class="toast-icon">{getIcon(t.type)}</span>
			<span class="toast-message">{t.message}</span>
			<button
				class="toast-close"
				on:click={() => toast.dismiss(t.id)}
				aria-label="Dismiss"
			>
				×
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		pointer-events: none;
	}
	
	.toast {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-left: 4px solid;
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		max-width: 400px;
		font-size: 0.9375rem;
		font-weight: 500;
		backdrop-filter: blur(8px);
	}
	
	.toast-icon {
		font-size: 1.25rem;
		flex-shrink: 0;
	}
	
	.toast-message {
		flex: 1;
		line-height: 1.5;
	}
	
	.toast-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		color: inherit;
		opacity: 0.6;
		transition: opacity 0.2s;
		padding: 0;
		width: 1.5rem;
		height: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.toast-close:hover {
		opacity: 1;
	}
	
	@media (max-width: 640px) {
		.toast-container {
			left: 1rem;
			right: 1rem;
		}
		
		.toast {
			max-width: 100%;
		}
	}
</style>
