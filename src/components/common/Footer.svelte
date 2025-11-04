<script>
	import { Github, Twitter, Mail } from 'lucide-svelte';
</script>

<footer class="bg-neutral-900 border-t border-neutral-800">
	<div class="max-w-6xl mx-auto px-6 lg:px-8 py-12">
		<div class="grid md:grid-cols-4 gap-8 mb-8">
			<!-- Brand -->
			<div class="md:col-span-1">
				<h3 class="text-xl font-bold text-white mb-3">KodeBlocks</h3>
				<p class="text-neutral-400 text-sm leading-relaxed">
					Master DSA one block at a time
				</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-sm font-semibold text-white mb-4">Learn</h4>
				<ul class="space-y-2">
					<li>
						<a href="/tracks" class="text-neutral-400 hover:text-amber-500 text-sm transition-colors">
							All Tracks
						</a>
					</li>
					<li>
						<a href="/dashboard" class="text-neutral-400 hover:text-amber-500 text-sm transition-colors">
							Dashboard
						</a>
					</li>
					<li>
						<a href="/leaderboard" class="text-neutral-400 hover:text-amber-500 text-sm transition-colors">
							Leaderboard
						</a>
					</li>
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h4 class="text-sm font-semibold text-white mb-4">Resources</h4>
				<ul class="space-y-2">
					<li>
						<a href="/profile" class="text-neutral-400 hover:text-amber-500 text-sm transition-colors">
							Profile
						</a>
					</li>
					<li>
						<a href="https://github.com/rahulrr-coder/kodeblocks" target="_blank" rel="noopener noreferrer" class="text-neutral-400 hover:text-amber-500 text-sm transition-colors">
							Documentation
						</a>
					</li>
				</ul>
			</div>

			<!-- Social -->
			<div>
				<h4 class="text-sm font-semibold text-white mb-4">Connect</h4>
				<div class="flex gap-4">
					<a 
						href="https://github.com/rahulrr-coder/kodeblocks" 
						target="_blank" 
						rel="noopener noreferrer"
						class="text-neutral-400 hover:text-teal-500 transition-colors"
						aria-label="GitHub"
					>
						<Github class="w-5 h-5" />
					</a>
					<a 
						href="https://twitter.com" 
						target="_blank" 
						rel="noopener noreferrer"
						class="text-neutral-400 hover:text-teal-500 transition-colors"
						aria-label="Twitter"
					>
						<Twitter class="w-5 h-5" />
					</a>
					<a 
						href="mailto:contact@kodeblocks.com" 
						class="text-neutral-400 hover:text-teal-500 transition-colors"
						aria-label="Email"
					>
						<Mail class="w-5 h-5" />
					</a>
				</div>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
			<p class="text-neutral-500 text-sm">
				&copy; {new Date().getFullYear()} KodeBlocks. Built with 
				<span class="text-amber-500">❤</span> for DSA excellence.
			</p>
			<div class="flex gap-6">
				<a href="/privacy" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
					Privacy
				</a>
				<a href="/terms" class="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
					Terms
				</a>
			</div>
		</div>
	</div>
</footer>
