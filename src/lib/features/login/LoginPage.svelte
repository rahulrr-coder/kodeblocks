<script>
	import { createSupabaseLoadClient } from '$lib/supabase.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import GoogleLoginButton from '$components/login/GoogleLoginButton.svelte';
	import EmailLoginForm from '$components/login/EmailLoginForm.svelte';

	let supabase;
	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	onMount(() => {
		supabase = createSupabaseLoadClient(fetch);
		
		// Check if there's an error from the callback
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('error') === 'auth_failed') {
			error = 'Authentication failed. Please try again.';
		}
		
		// Check if user is already logged in
		checkSession();
	});

	async function checkSession() {
		const { data: { session } } = await supabase.auth.getSession();
		if (session) {
			goto('/dashboard');
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';
		
		try {
			const { data, error: authError } = await supabase.auth.signInWithOAuth({
				provider: 'google',
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
					queryParams: {
						access_type: 'offline',
						prompt: 'consent',
					}
				}
			});

			if (authError) {
				error = authError.message;
				loading = false;
			}
			// User will be redirected to Google, so no need to set loading = false
		} catch (e) {
			error = 'Failed to initiate Google login. Please try again.';
			loading = false;
		}
	}

	async function handleEmailLogin(e) {
		e.preventDefault();
		
		loading = true;
		error = '';
		
		try {
			const { data, error: authError } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (authError) {
				error = authError.message;
				loading = false;
			} else {
				goto('/dashboard');
			}
		} catch (e) {
			error = 'Failed to sign in. Please try again.';
			loading = false;
		}
	}

	async function handleSignUp(e) {
		e.preventDefault();
		
		loading = true;
		error = '';
		
		try {
			const { data, error: authError } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (authError) {
				error = authError.message;
				loading = false;
			} else {
				error = 'Check your email for the confirmation link!';
				loading = false;
			}
		} catch (e) {
			error = 'Failed to sign up. Please try again.';
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-50 via-amber-50 to-neutral-50 px-4 py-12">
	<div class="max-w-md w-full">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-neutral-900 mb-2">Welcome to KodeBlocks</h1>
			<p class="text-lg text-neutral-600">Start your DSA learning journey</p>
		</div>

		<!-- Card -->
		<div class="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
			{#if error}
				<div class="mb-6 p-4 bg-error-light/20 border border-error rounded-lg">
					<p class="text-sm text-error-dark">{error}</p>
				</div>
			{/if}

			<GoogleLoginButton {loading} onClick={handleGoogleLogin} />

			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-neutral-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-white text-neutral-500">Or continue with email</span>
				</div>
			</div>

			<EmailLoginForm 
				bind:email 
				bind:password 
				{loading} 
				onLogin={handleEmailLogin}
				onSignUp={handleSignUp}
			/>

			<p class="mt-6 text-center text-xs text-neutral-500">
				By continuing, you agree to our <a href="/terms" class="text-amber-600 hover:text-amber-700">Terms</a> and <a href="/privacy" class="text-amber-600 hover:text-amber-700">Privacy Policy</a>
			</p>
		</div>

		<!-- Back to home -->
		<div class="mt-6 text-center">
			<a href="/" class="text-sm text-neutral-600 hover:text-amber-600 transition-colors">
				← Back to home
			</a>
		</div>
	</div>
</div>
