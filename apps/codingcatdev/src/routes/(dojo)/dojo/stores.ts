import { writable, type Writable } from 'svelte/store';

export const tile = {
	size: 16, // px
	zoom: 2, // matches overworld setting in Tiled export
	// Calculates a single tile unit
	unit: (v: number) => {
		return tile.size * tile.zoom * v;
	}
};

// Writables
export const cameraStore: Writable<typeof tile | undefined> = writable(undefined);
