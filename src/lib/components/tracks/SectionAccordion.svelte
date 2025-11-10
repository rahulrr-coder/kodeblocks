<script>
	/**
	 * @fileoverview Section accordion component
	 * Collapsible section with progress bar and problem list
	 */
	import { slide } from 'svelte/transition';
	import { calculateSectionStats } from '$lib/utils/filterUtils.js';
	import ProblemCard from './ProblemCard.svelte';

	export let sectionName;
	export let problems = [];
	export let isExpanded = false;
	export let canComplete = true;
	export let cooldownTime = '';
	export let onComplete = () => {};

	$: stats = calculateSectionStats(problems);

	function toggleSection() {
		isExpanded = !isExpanded;
	}
</script>

<div class="section-accordion">
	<button class="section-header" on:click={toggleSection} class:expanded={isExpanded}>
		<div class="section-header-main">
			<svg
				class="chevron"
				class:rotated={isExpanded}
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/>
			</svg>

			<h3 class="section-name">{sectionName}</h3>

			<span class="completion-badge">
				{stats.completed}/{stats.total}
			</span>
		</div>

		<div class="progress-container">
			<div class="progress-bar">
				<div
					class="progress-fill"
					style="width: {stats.percentage}%"
				></div>
			</div>
			<span class="progress-text">{stats.percentage}%</span>
		</div>
	</button>

	{#if isExpanded}
		<div class="section-content" transition:slide={{ duration: 300 }}>
			<div class="problems-list">
				{#each problems as problem, index}
					<ProblemCard
						{problem}
						{index}
						{canComplete}
						{cooldownTime}
						on:complete={onComplete}
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.section-accordion {
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 1rem;
		overflow: hidden;
		transition: border-color 0.2s;
	}

	.section-accordion:hover {
		border-color: #d97706;
	}

	.section-header {
		width: 100%;
		padding: 1.5rem;
		background: white;
		border: none;
		cursor: pointer;
		transition: background 0.2s;
		text-align: left;
	}

	.section-header:hover {
		background: #fef3c7;
	}

	.section-header.expanded {
		background: #fef3c7;
		border-bottom: 2px solid #f59e0b;
	}

	.section-header-main {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.chevron {
		width: 1.5rem;
		height: 1.5rem;
		color: #6b7280;
		transition: transform 0.3s;
		flex-shrink: 0;
	}

	.chevron.rotated {
		transform: rotate(90deg);
	}

	.section-name {
		font-size: 1.25rem;
		font-weight: 700;
		color: #111827;
		margin: 0;
		flex: 1;
	}

	.completion-badge {
		padding: 0.375rem 0.875rem;
		background: #d97706;
		color: white;
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
	}

	.progress-container {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.progress-bar {
		flex: 1;
		height: 0.75rem;
		background: #e5e7eb;
		border-radius: 9999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
		border-radius: 9999px;
		transition: width 0.5s ease-out;
	}

	.progress-text {
		font-size: 0.875rem;
		font-weight: 700;
		color: #6b7280;
		min-width: 3rem;
		text-align: right;
	}

	.section-content {
		padding: 1.5rem;
		background: #f9fafb;
	}

	.problems-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.section-header {
			padding: 1rem;
		}

		.section-header-main {
			flex-wrap: wrap;
		}

		.section-name {
			font-size: 1rem;
		}

		.section-content {
			padding: 1rem;
		}
	}
</style>
