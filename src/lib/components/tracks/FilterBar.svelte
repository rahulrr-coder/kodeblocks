<script>
	/**
	 * @fileoverview Filter bar component for problem filtering and sorting
	 */
	import { createEventDispatcher } from 'svelte';

	export let filters = {
		difficulty: 'all',
		status: 'all',
		mustDoOnly: false,
		sortBy: 'section'
	};

	const dispatch = createEventDispatcher();

	function updateFilter(key, value) {
		filters = { ...filters, [key]: value };
		dispatch('change', filters);
	}
</script>

<div class="filter-bar">
	<div class="filter-section">
		<span class="filter-label">Difficulty</span>
		<div class="filter-buttons">
			<button
				class="filter-btn"
				class:active={filters.difficulty === 'all'}
				on:click={() => updateFilter('difficulty', 'all')}
			>
				All
			</button>
			<button
				class="filter-btn easy"
				class:active={filters.difficulty === 'easy'}
				on:click={() => updateFilter('difficulty', 'easy')}
			>
				Easy
			</button>
			<button
				class="filter-btn medium"
				class:active={filters.difficulty === 'medium'}
				on:click={() => updateFilter('difficulty', 'medium')}
			>
				Medium
			</button>
			<button
				class="filter-btn hard"
				class:active={filters.difficulty === 'hard'}
				on:click={() => updateFilter('difficulty', 'hard')}
			>
				Hard
			</button>
		</div>
	</div>

	<div class="filter-section">
		<span class="filter-label">Status</span>
		<div class="filter-buttons">
			<button
				class="filter-btn"
				class:active={filters.status === 'all'}
				on:click={() => updateFilter('status', 'all')}
			>
				All
			</button>
			<button
				class="filter-btn"
				class:active={filters.status === 'completed'}
				on:click={() => updateFilter('status', 'completed')}
			>
				✓ Completed
			</button>
			<button
				class="filter-btn"
				class:active={filters.status === 'incomplete'}
				on:click={() => updateFilter('status', 'incomplete')}
			>
				○ Incomplete
			</button>
		</div>
	</div>

	<div class="filter-section">
		<label class="filter-label" for="sort-select">Sort By</label>
		<select
			id="sort-select"
			class="sort-select"
			bind:value={filters.sortBy}
			on:change={() => dispatch('change', filters)}
		>
			<option value="section">Section Order</option>
			<option value="difficulty-asc">Difficulty (Easy → Hard)</option>
			<option value="difficulty-desc">Difficulty (Hard → Easy)</option>
			<option value="incomplete-first">Incomplete First</option>
			<option value="completed-first">Completed First</option>
			<option value="must-do-first">Must Do First</option>
		</select>
	</div>

	<div class="filter-section must-do-section">
		<label class="toggle-label">
			<input
				type="checkbox"
				class="toggle-checkbox"
				bind:checked={filters.mustDoOnly}
				on:change={() => dispatch('change', filters)}
			/>
			<span class="toggle-slider"></span>
			<span class="toggle-text">Must Do Only</span>
		</label>
	</div>
</div>

<style>
	.filter-bar {
		background: white;
		border-radius: 1rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 1rem;
		z-index: 10;
	}

	.filter-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.must-do-section {
		margin-left: auto;
		justify-content: center;
	}

	.filter-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	.filter-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.filter-btn {
		padding: 0.5rem 1rem;
		border: 2px solid #e5e7eb;
		background: white;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-btn:hover {
		border-color: #d97706;
		color: #d97706;
	}

	.filter-btn.active {
		background: #d97706;
		border-color: #d97706;
		color: white;
	}

	.filter-btn.easy.active {
		background: #22c55e;
		border-color: #22c55e;
	}

	.filter-btn.medium.active {
		background: #eab308;
		border-color: #eab308;
	}

	.filter-btn.hard.active {
		background: #ef4444;
		border-color: #ef4444;
	}

	.sort-select {
		padding: 0.5rem 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #374151;
		background: white;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.sort-select:hover,
	.sort-select:focus {
		border-color: #d97706;
		outline: none;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
	}

	.toggle-checkbox {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.toggle-slider {
		position: relative;
		width: 44px;
		height: 24px;
		background: #e5e7eb;
		border-radius: 12px;
		transition: background 0.3s;
	}

	.toggle-slider::before {
		content: '';
		position: absolute;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: white;
		top: 3px;
		left: 3px;
		transition: transform 0.3s;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.toggle-checkbox:checked + .toggle-slider {
		background: #d97706;
	}

	.toggle-checkbox:checked + .toggle-slider::before {
		transform: translateX(20px);
	}

	.toggle-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: #374151;
	}

	@media (max-width: 768px) {
		.filter-bar {
			flex-direction: column;
			gap: 1rem;
			position: relative;
			top: 0;
		}

		.must-do-section {
			margin-left: 0;
		}

		.filter-buttons {
			flex-wrap: wrap;
		}
	}
</style>
