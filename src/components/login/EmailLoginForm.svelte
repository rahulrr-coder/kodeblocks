<script>
	import { Mail, Lock } from 'lucide-svelte';

	export let email = '';
	export let password = '';
	export let loading = false;
	export let onLogin;
	export let onSignUp;
</script>

<form on:submit={onLogin} class="space-y-4">
	<div>
		<label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
		<div class="relative">
			<Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				placeholder="you@example.com"
			/>
		</div>
	</div>

	<div>
		<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
		<div class="relative">
			<Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
			<input
				id="password"
				type="password"
				bind:value={password}
				required
				class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
				placeholder="••••••••"
			/>
		</div>
	</div>

	<div class="flex gap-3">
		<button
			type="submit"
			disabled={loading}
			class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Sign In
		</button>
		<button
			type="button"
			on:click={onSignUp}
			disabled={loading}
			class="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
		>
			Sign Up
		</button>
	</div>
</form>
