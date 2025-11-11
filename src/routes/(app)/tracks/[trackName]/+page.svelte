<script>
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import ProgressOverview from '$lib/components/tracks/ProgressOverview.svelte';
	import FilterBar from '$lib/components/tracks/FilterBar.svelte';
	import SectionAccordion from '$lib/components/tracks/SectionAccordion.svelte';
	import CooldownTimer from '$lib/components/tracks/CooldownTimer.svelte';
	import { groupBySection, applyFiltersAndSort, getSectionOrder } from '$lib/utils/filterUtils.js';
	import { canComplete as checkCooldown, formatCooldownTime } from '$lib/utils/cooldownUtils.js';
	import { markProblemComplete, updateLastCompletedAt } from '$lib/api/submissions.js';
	import { createSupabaseLoadClient } from '$lib/supabase.js';

	export let data;

	let { track, problems, stats, totalBloksEarned, lastCompletedAt, user } = data;

	// Filter state
	let filters = {
		difficulty: 'all',
		status: 'all',
		mustDoOnly: false,
		sortBy: 'section'
	};

	// Cooldown state
	let canCompleteNow = true;
	let cooldownTimeString = '';
	let cooldownInterval;

	// Expanded sections state
	let expandedSections = new Set();

	// Reactive grouping and filtering
	$: filteredProblems = applyFiltersAndSort(problems, filters);
	$: groupedProblems = groupBySection(filteredProblems);
	$: sectionOrder = getSectionOrder();
	$: orderedSections = sectionOrder.filter((section) => groupedProblems[section]);

	// Expand first section by default
	onMount(() => {
		if (orderedSections.length > 0) {
			expandedSections.add(orderedSections[0]);
			expandedSections = expandedSections;
		}

		// Update cooldown status
		updateCooldownStatus();
		cooldownInterval = setInterval(updateCooldownStatus, 1000);

		return () => {
			if (cooldownInterval) clearInterval(cooldownInterval);
		};
	});

	function updateCooldownStatus() {
		canCompleteNow = checkCooldown(lastCompletedAt);
		cooldownTimeString = formatCooldownTime(lastCompletedAt);
	}

	function handleFilterChange(event) {
		filters = event.detail;
	}

	function toggleSection(section) {
		if (expandedSections.has(section)) {
			expandedSections.delete(section);
		} else {
			expandedSections.add(section);
		}
		expandedSections = expandedSections;
	}

	async function handleProblemComplete(event) {
		const problemId = event.detail;

		if (!canCompleteNow) {
			alert(`⏱️ Cooldown active. Please wait ${cooldownTimeString} before marking another problem complete.`);
			return;
		}

		const problem = problems.find((p) => p.id === problemId);
		if (!problem) return;

		try {
			const supabase = createSupabaseLoadClient(fetch);
			const { data: { user } } = await supabase.auth.getUser();

			if (!user) {
				alert('You must be logged in to mark problems complete');
				return;
			}

			// Mark problem complete
			await markProblemComplete(supabase, user.id, problemId, problem.bloks);

			// Update last completion timestamp
			await updateLastCompletedAt(supabase, user.id);

			// Update local state
			lastCompletedAt = new Date().toISOString();
			updateCooldownStatus();

			// Show success message
			showSuccessMessage(problem);

			// Refresh data from server
			await invalidateAll();

		} catch (error) {
			console.error('Error marking problem complete:', error);
			if (error.message?.includes('duplicate')) {
				alert('You have already completed this problem!');
			} else {
				alert('Failed to mark problem complete. Please try again.');
			}
		}
	}

	function showSuccessMessage(problem) {
		// Simple success alert (can be replaced with toast/notification later)
		const message = `🎉 Great job! You earned ${problem.bloks} Bloks!\n\n"${problem.title}" marked as complete.`;
		alert(message);
	}

	function handleCooldownExpire() {
		updateCooldownStatus();
	}

	// React to data changes
	$: {
		track = data.track;
		problems = data.problems;
		stats = data.stats;
		totalBloksEarned = data.totalBloksEarned;
		lastCompletedAt = data.lastCompletedAt;
		user = data.user;
		updateCooldownStatus();
	}
</script>

<svelte:head>
	<title>{track.name} - KodeBlocks</title>
</svelte:head>

<Header {user} currentRoute="/tracks" />

<div class="track-page">
	<!-- Back Button -->
	<div class="back-button-container">
		<a href="/dashboard" class="back-button">
			<svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				/>
			</svg>
			Back to Dashboard
		</a>
	</div>

	<!-- Progress Overview -->
	<ProgressOverview {track} {stats} {totalBloksEarned} />

	<!-- Cooldown Timer -->
	{#if !canCompleteNow}
		<CooldownTimer {lastCompletedAt} onExpire={handleCooldownExpire} />
	{/if}

	<!-- Filter Bar -->
	<FilterBar {filters} on:change={handleFilterChange} />

	<!-- Sections with Problems -->
	<div class="sections-container">
		{#if orderedSections.length === 0}
			<div class="empty-state">
				<div class="empty-icon">🔍</div>
				<h3 class="empty-title">No problems found</h3>
				<p class="empty-description">
					Try adjusting your filters to see more problems.
				</p>
			</div>
		{:else}
			{#each orderedSections as section}
				<SectionAccordion
					sectionName={section}
					problems={groupedProblems[section]}
					isExpanded={expandedSections.has(section)}
					canComplete={canCompleteNow}
					cooldownTime={cooldownTimeString}
					on:complete={handleProblemComplete}
				/>
			{/each}
		{/if}
	</div>
</div>

<style>
	.track-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.back-button-container {
		margin-bottom: 1.5rem;
	}

	.back-button {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #d97706;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}

	.back-button:hover {
		color: #b45309;
		transform: translateX(-4px);
	}

	.back-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.sections-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 1rem;
		border: 2px dashed #e5e7eb;
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: #111827;
		margin: 0 0 0.5rem 0;
	}

	.empty-description {
		font-size: 1rem;
		color: #6b7280;
		margin: 0;
	}

	@media (max-width: 768px) {
		.track-page {
			padding: 1rem;
		}
	}
</style>
