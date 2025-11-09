<script>
	import { Trophy } from 'lucide-svelte';

	export let leaderboard = [];

	function getRankIcon(rank) {
		switch (rank) {
			case 1:
				return '🥇';
			case 2:
				return '🥈';
			case 3:
				return '🥉';
			default:
				return null;
		}
	}

	function getRankColor(rank) {
		switch (rank) {
			case 1:
				return 'bg-yellow-50 border-yellow-200';
			case 2:
				return 'bg-gray-50 border-gray-200';
			case 3:
				return 'bg-orange-50 border-orange-200';
			default:
				return 'bg-white border-gray-200';
		}
	}
</script>

<div class="card overflow-hidden">
	<div class="overflow-x-auto">
		<table class="w-full">
			<thead class="bg-gray-50 border-b border-gray-200">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Rank
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						User
					</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						Batch
					</th>
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Problems
					</th>
					<th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
						Points
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each leaderboard as user}
					<tr class="hover:bg-gray-50 transition-colors {getRankColor(user.rank)}">
						<!-- Rank -->
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center gap-2">
								{#if getRankIcon(user.rank)}
									<span class="text-2xl">{getRankIcon(user.rank)}</span>
								{:else}
									<span class="text-lg font-semibold text-gray-700">
										#{user.rank}
									</span>
								{/if}
							</div>
						</td>

						<!-- User -->
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center gap-3">
								{#if user.profile_picture}
									<img
										src={user.profile_picture}
										alt={user.display_name}
										class="h-10 w-10 rounded-full"
									/>
								{:else}
									<div
										class="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold"
									>
										{user.display_name?.[0]?.toUpperCase() || 'U'}
									</div>
								{/if}
								<div>
									<p class="font-semibold text-gray-900">{user.display_name}</p>
								</div>
							</div>
						</td>

						<!-- Batch -->
						<td class="px-6 py-4 whitespace-nowrap">
							<span class="text-sm text-gray-600">{user.batch || '-'}</span>
						</td>

						<!-- Problems Solved -->
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<span class="text-sm font-medium text-gray-900">
								{user.problemsSolved}
							</span>
						</td>

						<!-- Total Points -->
						<td class="px-6 py-4 whitespace-nowrap text-right">
							<div class="flex items-center justify-end gap-2">
								<Trophy class="h-4 w-4 text-yellow-500" />
								<span class="text-lg font-bold text-gray-900">
									{user.totalPoints}
								</span>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if leaderboard.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-600">No users on the leaderboard yet. Be the first!</p>
		</div>
	{/if}
</div>
