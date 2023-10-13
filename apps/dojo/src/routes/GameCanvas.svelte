<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	onMount(async () => {
		const { bunnyMarkV8 } = await import('./bunny-mark-v8');

		bunnyMarkV8({ totalBunnies: 10000, preference: 'webgpu' });
	});

	onDestroy(() => {});
</script>
