<script>
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GoogleLoginButton from '$components/login/GoogleLoginButton.svelte';
	import EmailLoginForm from '$components/login/EmailLoginForm.svelte';

	let supabase;
	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	onMount(() => {
		supabase = createSupabaseLoadClient(fetch);
	});

	async function handleGoogleLogin() {
		loading = true;
		error = '';
		
		await new Promise(resolve => setTimeout(resolve, 500));
		
		goto('/dashboard');
	}

	async function handleEmailLogin(e) {
		e.preventDefault();
		
		loading = true;
		error = '';
		
		await new Promise(resolve => setTimeout(resolve, 500));
		
		goto('/dashboard');
	}

	async function handleSignUp(e) {
		e.preventDefault();
		
		loading = true;
		error = '';
		
		await new Promise(resolve => setTimeout(resolve, 500));
		
		goto('/dashboard');
	}
</script>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-primary-50 to-white px-4">
	<div class="max-w-md w-full">
		<div class="card">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome to KodeBlocks</h1>
				<p class="text-gray-600">Start your DSA learning journey</p>
			</div>

			{#if error}
				<div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
					{error}
				</div>
			{/if}

			<GoogleLoginButton {loading} onClick={handleGoogleLogin} />

			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-2 bg-white text-gray-500">Or continue with email</span>
				</div>
			</div>

			<EmailLoginForm 
				bind:email 
				bind:password 
				{loading} 
				onLogin={handleEmailLogin}
				onSignUp={handleSignUp}
			/>

			<p class="mt-6 text-center text-sm text-gray-600">
				By continuing, you agree to our Terms of Service and Privacy Policy
			</p>
		</div>
	</div>
</div>
