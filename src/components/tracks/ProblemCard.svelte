<script>
	import { enhance } from '$app/forms';
	import { ExternalLink, CheckCircle, Circle } from 'lucide-svelte';
	import DifficultyBadge from './DifficultyBadge.svelte';

	export let problem;
	export let submitting = false;
</script>

<div class="card hover:shadow-lg transition-shadow">
	<div class="flex items-start gap-4">
		<!-- Checkbox -->
		<form
			method="POST"
			action="?/toggleProblem"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<input type="hidden" name="problemId" value={problem.id} />
			<input type="hidden" name="completed" value={!problem.completed} />
			<input type="hidden" name="points" value={problem.points} />
			<button
				type="submit"
				disabled={submitting}
				class="mt-1 disabled:opacity-50"
				aria-label={problem.completed ? 'Mark as incomplete' : 'Mark as complete'}
			>
				{#if problem.completed}
					<CheckCircle class="h-6 w-6 text-green-600" />
				{:else}
					<Circle class="h-6 w-6 text-gray-400 hover:text-primary-600 transition-colors" />
				{/if}
			</button>
		</form>

		<!-- Problem Info -->
		<div class="flex-1 min-w-0">
			<div class="flex items-start justify-between gap-4 mb-2">
				<h3
					class="text-lg font-semibold text-gray-900 {problem.completed
						? 'line-through text-gray-500'
						: ''}"
				>
					{problem.title}
				</h3>
				<DifficultyBadge difficulty={problem.difficulty} />
			</div>

			<div class="flex items-center gap-4 text-sm text-gray-600">
				<span>Points: {problem.points}</span>
				{#if problem.completed_at}
					<span class="text-green-600">
						Completed on {new Date(problem.completed_at).toLocaleDateString()}
					</span>
				{/if}
			</div>
		</div>

		<!-- External Link -->
		<a
			href={problem.external_link}
			target="_blank"
			rel="noopener noreferrer"
			class="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors whitespace-nowrap"
		>
			<span class="hidden sm:inline">Solve</span>
			<ExternalLink class="h-5 w-5" />
		</a>
	</div>
</div>
