<script lang="ts" type="module">
	import { Application, Container, SCALE_MODES, settings, Assets, Sprite } from 'pixi.js';
	import { onDestroy, onMount } from 'svelte';

	// Game Classes
	import { World } from '../World';
	import { Camera } from '../Camera';

	// Stores
	let elemCanvas: HTMLCanvasElement;
	const loading: any = { amount: 0, complete: false };

	// Game Elements
	let app: Application;

	onMount(async () => {
		// Pixi.js Settings
		// settings.SCALE_MODE = SCALE_MODES.NEAREST;

		// Init Game App
		app = new Application({
			view: elemCanvas,
			resizeTo: document.body,
			backgroundColor: 0x999999
		});
		if (app === null) return;

		// Load Game Resources
		const overworldTexture = await Assets.load('/images/dojo/overworld.png');

		// Containers
		const containerLevel = new Container();

		// World
		const world = new World({ texture: overworldTexture });
		containerLevel.addChild(world.sprite);

		// Camera
		const camera = new Camera({ app: app, container: containerLevel });

		// Add to Stage
		app.stage.addChild(containerLevel);

		// Animation Loop
		let elapsed = 0.0;
		app.ticker.add((delta: any) => {
			elapsed += delta;

			// Move containerLevel based on camera position
			if (containerLevel.position.x !== camera.position.x) {
				containerLevel.position.x = camera.position.x;
			}
			if (containerLevel.position.y !== camera.position.y) {
				containerLevel.position.y = camera.position.y;
			}

			// Render Camera
			camera.render();
		});
	});

	onDestroy(() => {
		// Helps memory leak issues
		if (app !== undefined) app.stop();
	});
</script>

<!-- Game Canvas -->
<canvas id="app" bind:this={elemCanvas} />
