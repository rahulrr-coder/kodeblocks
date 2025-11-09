<script>
	export let value = 0;
	export let max = 100;
	export let color = 'primary';
	export let label = '';
	
	$: percentage = max > 0 ? (value / max) * 100 : 0;
	
	const colorClasses = {
		primary: 'bg-primary-600',
		blue: 'bg-blue-600',
		green: 'bg-green-600',
		yellow: 'bg-yellow-600',
		purple: 'bg-purple-600',
		red: 'bg-red-600'
	};
	
	$: barColor = colorClasses[color] || colorClasses.primary;
</script>

<div class="w-full">
	{#if label}
		<div class="flex items-center justify-between mb-2">
			<span class="text-sm text-gray-600">{label}</span>
			<span class="text-sm text-gray-600">{value} / {max}</span>
		</div>
	{/if}
	<div class="w-full bg-gray-200 rounded-full h-3">
		<div
			class="{barColor} h-3 rounded-full transition-all duration-300"
			style="width: {Math.min(percentage, 100)}%"
		></div>
	</div>
</div>
