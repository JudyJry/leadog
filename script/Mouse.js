import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class Mouse {
    constructor(manager) {
        this.manager = manager;
        this.position = {
            x: 0,
            y: 0
        };
        this.x = this.position.x;
        this.y = this.position.y;
        this.isPressed = false;
        this.pressed = () => { };
        this.getMousePos = function () {
            this.position = this.manager.app.renderer.plugins.interaction.mouse.global;
            this.x = this.position.x;
            this.y = this.position.y;
            return { x: this.x, y: this.y };
        };
        onpointerdown = onpointerup = (e) => {
            this.isPressed = e.type == 'pointerdown';
            if (this.isPressed) {
                gsap.killTweensOf(this.sprite.scale);
                gsap.to(this.sprite.scale, { duration: 0.2, x: this.scale - 0.05, y: this.scale - 0.05 });
            }
            else {
                gsap.killTweensOf(this.sprite.scale);
                gsap.to(this.sprite.scale, { duration: 0.5, x: this.scale, y: this.scale });
            }
            this.pressed(this.isPressed);
        }
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.scale = 0.3;
    }
    setup() {
        this.manager.app.renderer.plugins.interaction.cursorStyles.pointer = "none";
        this.cursor = new PIXI.Container();
        this.cursor.zIndex = 200;
        this.sprite = PIXI.Sprite.from("image/video/cursor.png");
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.cursor.addChild(this.sprite);
        this.cursor.position.set(-this.w / 2, -this.h / 2);
        this.manager.app.stage.addChild(this.cursor);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.cursor.position.set(-this.w / 2, -this.h / 2);
    }
    update() {
        this.getMousePos();
        this.sprite.position.set(this.x, this.y);
    }
}