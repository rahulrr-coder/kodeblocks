<script>
	/**
	 * @fileoverview Difficulty badge component
	 * PURE UI: No business logic, just styling based on difficulty level
	 */
	
	/** @type {'easy' | 'medium' | 'hard'} */
	export let difficulty;
</script>

<span 
	class="px-2 py-1 text-xs font-medium rounded-full
		{difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
		{difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
		{difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}"
>
	{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
</span>
