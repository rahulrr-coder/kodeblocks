<script>
	export let difficulty;
	
	const classes = {
		Easy: 'badge-easy',
		Medium: 'badge-medium',
		Hard: 'badge-hard'
	};
	
	$: badgeClass = classes[difficulty] || 'badge-easy';
</script>

<span class={badgeClass}>
	{difficulty}
</span>
