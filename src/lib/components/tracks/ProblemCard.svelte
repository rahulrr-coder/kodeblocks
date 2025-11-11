<script>
import { fade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import { createEventDispatcher } from 'svelte';
import DifficultyBadge from '$lib/components/common/DifficultyBadge.svelte';

export let problem;
export let index;
export let isSubmitting = false;

const dispatch = createEventDispatcher();

function handleMarkComplete() {
	if (isSubmitting) return;
	dispatch('complete', problem.id);
}

function formatTimestamp(timestamp) {
if (!timestamp) return '';
const date = new Date(timestamp);
const now = new Date();
const diffMs = now - date;
const diffMins = Math.floor(diffMs / 60000);
const diffHours = Math.floor(diffMins / 60);
const diffDays = Math.floor(diffHours / 24);

if (diffMins < 60) return `${diffMins}m ago`;
if (diffHours < 24) return `${diffHours}h ago`;
if (diffDays < 7) return `${diffDays}d ago`;
return date.toLocaleDateString();
}

function getPlatformDisplay(platform) {
const map = {
leetcode: 'LeetCode',
codeforces: 'Codeforces',
hackerrank: 'HackerRank',
gfg: 'GeeksforGeeks',
other: 'External'
};
return map[platform] || platform;
}
</script>

<div 
	class="problem-card" 
	class:completed={problem.isCompleted}
	in:fade={{ duration: 300, delay: Math.min(index * 15, 400), easing: cubicOut }}
>
<div class="problem-main">
<div class="problem-header">
<span class="problem-number">#{index + 1}</span>
<h4 class="problem-title">{problem.title}</h4>
{#if problem.isCompleted}
<span class="completed-badge">
<svg class="checkmark" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
</svg>
Completed
</span>
{/if}
</div>

<div class="problem-meta">
<DifficultyBadge difficulty={problem.difficulty} />
<span class="meta-separator">•</span>
<span class="bloks-badge">
<span class="bloks-icon">🧱</span>
<strong>{problem.bloks}</strong> Bloks
</span>
<span class="meta-separator">•</span>
<span class="platform-badge">{getPlatformDisplay(problem.external_platform)}</span>
{#if problem.is_must_do}
<span class="must-do-tag">MUST DO</span>
{/if}
{#if problem.is_featured}
<span class="featured-tag">⭐ FEATURED</span>
{/if}
</div>

{#if problem.description}
<p class="problem-description">{problem.description}</p>
{/if}

{#if problem.section_tags && problem.section_tags.length > 0}
<div class="tags-container">
{#each problem.section_tags.slice(0, 3) as tag}
<span class="section-tag">{tag}</span>
{/each}
</div>
{/if}
</div>

<div class="problem-actions">
{#if problem.isCompleted}
<div class="completion-info">
<span class="completed-time">✓ Completed {formatTimestamp(problem.completedAt)}</span>
<span class="bloks-earned">+{problem.bloksEarnedFromThis} Bloks</span>
</div>
{:else}
<div class="action-buttons">
<a href={problem.external_url} target="_blank" rel="noopener noreferrer" class="btn btn-solve">
Solve
<svg class="external-icon" viewBox="0 0 20 20" fill="currentColor">
<path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
</svg>
</a>
<button 
	class="btn btn-complete" 
	class:loading={isSubmitting}
	disabled={isSubmitting} 
	on:click={handleMarkComplete}
	title="Mark as complete"
>
{#if isSubmitting}
	<span class="spinner"></span>
	Submitting...
{:else}
	Mark Complete
{/if}
</button>
</div>
{/if}
</div>
</div>

<style>
.problem-card {
background: white;
border: 2px solid #e5e7eb;
border-radius: 1rem;
padding: 1.5rem;
transition: all 0.2s;
display: flex;
justify-content: space-between;
gap: 1.5rem;
}
.problem-card:hover {
border-color: #d97706;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.problem-card.completed {
background: #f0fdf4;
border-color: #86efac;
}
.problem-main {
flex: 1;
}
.problem-header {
display: flex;
align-items: center;
gap: 0.75rem;
margin-bottom: 0.75rem;
flex-wrap: wrap;
}
.problem-number {
font-size: 0.875rem;
font-weight: 600;
color: #9ca3af;
}
.problem-title {
font-size: 1.125rem;
font-weight: 700;
color: #111827;
margin: 0;
flex: 1;
}
.completed-badge {
display: inline-flex;
align-items: center;
gap: 0.375rem;
padding: 0.25rem 0.75rem;
background: #22c55e;
color: white;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 600;
}
.checkmark {
width: 1rem;
height: 1rem;
}
.problem-meta {
display: flex;
align-items: center;
gap: 0.75rem;
flex-wrap: wrap;
margin-bottom: 0.75rem;
}
.meta-separator {
color: #d1d5db;
}
.bloks-badge {
display: inline-flex;
align-items: center;
gap: 0.375rem;
font-size: 0.875rem;
color: #6b7280;
}
.bloks-badge strong {
color: #d97706;
font-weight: 700;
}
.platform-badge {
font-size: 0.875rem;
color: #6b7280;
}
.must-do-tag {
padding: 0.25rem 0.625rem;
background: #fee2e2;
color: #991b1b;
font-size: 0.75rem;
font-weight: 700;
border-radius: 0.375rem;
}
.featured-tag {
padding: 0.25rem 0.625rem;
background: #dbeafe;
color: #1e40af;
font-size: 0.75rem;
font-weight: 700;
border-radius: 0.375rem;
}
.problem-description {
font-size: 0.875rem;
color: #6b7280;
line-height: 1.5;
margin: 0.75rem 0;
}
.tags-container {
display: flex;
gap: 0.5rem;
flex-wrap: wrap;
}
.section-tag {
padding: 0.25rem 0.625rem;
background: #f3f4f6;
color: #4b5563;
font-size: 0.75rem;
border-radius: 0.375rem;
}
.problem-actions {
display: flex;
flex-direction: column;
justify-content: center;
gap: 0.75rem;
}
.action-buttons {
display: flex;
flex-direction: column;
gap: 0.625rem;
}
.btn {
display: inline-flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
padding: 0.625rem 1.25rem;
border-radius: 0.5rem;
font-size: 0.875rem;
font-weight: 600;
text-decoration: none;
border: none;
cursor: pointer;
transition: all 0.2s;
white-space: nowrap;
}
.btn-solve {
background: #d97706;
color: white;
}
.btn-solve:hover {
background: #b45309;
transform: translateY(-1px);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.btn-complete {
background: #14b8a6;
color: white;
position: relative;
}
.btn-complete:hover:not(:disabled) {
background: #0d9488;
transform: translateY(-1px);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.btn-complete:disabled {
background: #d1d5db;
color: #9ca3af;
cursor: not-allowed;
}
.btn-complete.loading {
background: #0d9488;
cursor: wait;
}
.spinner {
display: inline-block;
width: 1rem;
height: 1rem;
border: 2px solid rgba(255, 255, 255, 0.3);
border-top-color: white;
border-radius: 50%;
animation: spin 0.6s linear infinite;
margin-right: 0.5rem;
}
@keyframes spin {
to {
	transform: rotate(360deg);
}
}
.external-icon {
width: 1rem;
height: 1rem;
}
.completion-info {
display: flex;
flex-direction: column;
align-items: flex-end;
gap: 0.375rem;
}
.completed-time {
font-size: 0.875rem;
color: #059669;
font-weight: 500;
}
.bloks-earned {
font-size: 0.875rem;
color: #d97706;
font-weight: 700;
}
@media (max-width: 768px) {
.problem-card {
flex-direction: column;
}
.problem-actions {
width: 100%;
}
.action-buttons {
flex-direction: row;
}
.btn {
flex: 1;
}
}
</style>
