import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GlowFilter } from 'pixi-filters';
import { GameObject, PageObject, linkObject } from './GameObject.js';
import * as gf from "./GameFunction.js";
import ChildhoodAction from './ChildhoodAction.js';
import { ColorSlip } from './ColorSlip.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ChildhoodObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ChildhoodObject";
        this.children = {
            "background": new Background(manager),
            "toys": new Toys(manager),
        };
    }
}
class Background extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "Background";
        this.container.zIndex = 10;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/building/childhood/childhood.png");
            this.spriteWidth = this.sprite.texture.width;
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.w / this.spriteWidth;
            this.sprite.scale.set(this.manager.canvasScale);
            this.container.addChild(this.sprite);
        }
    }
    resize() {
        this.w = this.manager.w;
        this.container.removeChildren();
        this.draw();
    }
}

class Toys extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "玩具互動";
        this.x = 0.33;
        this.y = 0.143;
        this.url = "image/building/childhood/toys.png";
    }
    addKeyEvent() {
        if (this.manager.keyboard.key['Enter']) {
            if (this.manager.isArrive(this.name) && !this.isEntering) {
                //console.log(`You enter the ${this.name}!`);
                this.isEntering = true;
                this.manager.loadAction(new ChildhoodAction(this.manager));
            }
        }
    }
}