import { Sprite, Texture } from 'pixi.js';
import { tile } from './stores';

export class World {
	public texture: Texture;
	public sprite: Sprite;

	constructor(config: { texture: Texture }) {
		this.texture = config.texture;
		this.sprite = Sprite.from(this.texture);
		this.onInit();
	}

	onInit(): void {
		this.sprite.width = this.sprite.width * tile.zoom;
		this.sprite.height = this.sprite.height * tile.zoom;
	}
}
