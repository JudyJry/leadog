import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GlowFilter } from 'pixi-filters';
import { GameObject, PageObject } from './GameObject.js';
import * as gf from "./GameFunction.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BronObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BronObject";
        this.children = {
            "background": new Background(manager)
        };
    }
}

class Background extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "Background"
        this.container.zIndex = 10;
        this.spriteHeight = this.sprite.texture.height;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/map.svg");
            this.spriteHeight = this.sprite.texture.height + 900;
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.h / this.spriteHeight;
            this.sprite.scale.set(this.manager.canvasScale);
            this.container.addChild(this.sprite);
        }
    }
}