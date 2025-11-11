<script>
	export let title;
	export let value;
	export let icon = null;
	export let iconColor = 'blue';
	export let subtitle = '';
</script>

<div class="card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
	<div class="flex items-center justify-between">
		<div>
			<p class="text-sm text-gray-600 mb-1">{title}</p>
			<p class="text-3xl font-bold text-gray-900">{value}</p>
			{#if subtitle}
				<p class="text-xs text-gray-500 mt-1">{subtitle}</p>
			{/if}
		</div>
		{#if icon}
			<div class="p-3 bg-{iconColor}-100 rounded-full transition-transform duration-300 group-hover:scale-110">
				<svelte:component this={icon} class="h-8 w-8 text-{iconColor}-600" />
			</div>
		{/if}
	</div>
</div>
