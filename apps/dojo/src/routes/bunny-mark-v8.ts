
import { Assets, Container, EventSystem, Rectangle, TextureStyle, autoDetectRenderer } from 'pixi.js';
import { BunnyV8 } from './Bunny-v8';

TextureStyle.defaultOptions.scaleMode = 'nearest'
EventSystem.defaultEventFeatures.move = false;
EventSystem.defaultEventFeatures.globalMove = false;

const bunnyPool: BunnyV8[] = [];

export async function bunnyMarkV8({ totalBunnies, preference }: { totalBunnies: number, preference: 'webgl' | 'webgpu' }) {

    const renderer = await autoDetectRenderer({
        preference,
        clearBeforeRender: true,
        backgroundAlpha: 1,
        backgroundColor: 0xFFFFFF,
        width: 800,
        height: 600,
        resolution: 1,
        antialias: false,
        hello: true,
    })



    const pageContent = document.querySelector('#page-content');
    pageContent?.appendChild(renderer.view.canvas as HTMLCanvasElement)

    const stage = new Container();

    const textures = Object.values(await Assets.load([
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_d_1.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_d_1.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_d_2.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_l_1.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_l_2.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_r_1.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_r_2.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_u_1.png',
        '/assets/oryx_wee_dungeon/wee_sliced/monsters/wee_mons_druid_atk_u_2.png'
    ]));

    const bounds = new Rectangle(0, 0, 800, 600);

    const bunnies: BunnyV8[] = []

    function addBunny() {

        const bunny = bunnyPool.pop() || new BunnyV8(textures[bunnies.length % textures.length], bounds)

        bunny.reset();

        stage.addChild(bunny.view);
        bunnies.push(bunny);
    }

    for (let i = 0; i < totalBunnies; i++) {
        addBunny();
    }

    let pause = false;

    renderer.view.canvas.addEventListener('mousedown', () => {
        pause = !pause
    })


    function renderUpdate() {

        if (!pause) {
            for (let i = 0; i < bunnies.length; i++) {
                bunnies[i].update();
            }
        }

        // bunnies[0].view.visible = !bunnies[0].view.visible;

        renderer.render(stage);
        requestAnimationFrame(renderUpdate)
    }

    renderUpdate();


}