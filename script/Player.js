import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Player {
    constructor(manager) {
        this.manager = manager;
        this.container = new PIXI.Container();
        this.container.zIndex = 90;
        this.scale = 0.21;
        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.speed = -5;
        this.vx = 0, this.vy = 0;
    }
    setPosition(x, y) {
        let _x = x / this.w;
        let _y = y / this.h;
        this.container.position.set(_x, _y);
    }
    draw() {
        this.sprite.texture = PIXI.Texture.from("image/player.svg");
        this.sprite.position.set(this.w / -2, this.h / -2);
        this.setPosition(this.manager.playerPos.x, this.manager.playerPos.y);
        this.container.addChild(this.sprite);
    }
    setup() {
        if (this.manager.isUsePlayer) {
            this.draw();
            this.manager.addChild(this.container);
        }
    }
    resize() {
        if (this.manager.isUsePlayer) {
            this.h = this.manager.h;
            this.container.removeChildren();
            this.draw();
        }
    }
    update() {
        if (this.manager.isUsePlayer) {
            gsap.to(this.container, { duration: 0.2, x: this.manager.playerPos.x, y: this.manager.playerPos.y });
        }
    }
}