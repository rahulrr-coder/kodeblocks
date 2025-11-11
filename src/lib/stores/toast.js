/**
 * @fileoverview Toast notification store
 * Manages toast notifications across the app
 */
import { writable } from 'svelte/store';

function createToastStore() {
	const { subscribe, update } = writable([]);

	return {
		subscribe,
		success: (message, duration = 4000) => {
			const id = Date.now();
			update(toasts => [...toasts, { id, type: 'success', message, duration }]);
			setTimeout(() => {
				update(toasts => toasts.filter(t => t.id !== id));
			}, duration);
		},
		error: (message, duration = 4000) => {
			const id = Date.now();
			update(toasts => [...toasts, { id, type: 'error', message, duration }]);
			setTimeout(() => {
				update(toasts => toasts.filter(t => t.id !== id));
			}, duration);
		},
		info: (message, duration = 4000) => {
			const id = Date.now();
			update(toasts => [...toasts, { id, type: 'info', message, duration }]);
			setTimeout(() => {
				update(toasts => toasts.filter(t => t.id !== id));
			}, duration);
		},
		dismiss: (id) => {
			update(toasts => toasts.filter(t => t.id !== id));
		}
	};
}

export const toast = createToastStore();
