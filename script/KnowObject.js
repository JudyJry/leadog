import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, GameObject } from './GameObject.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class KnowObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "KnowObject";
        this.container = new PIXI.Container();
        this.children = {
            "background": new bg(this.manager, this, "image/building/know/bg.png"),
            "billboard": new Billboard(this.manager, this)
        };
    }
}
class bg extends GameObject {
    constructor(manager, page, url, height = window.innerHeight) {
        super(manager);
        this.page = page;
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.space = 300;
        this.speed = 5;
        this.wall = {
            "right": (-this.w / 2) + ((this.space / 10) + this.speed),
            "left": (this.w / 2) - ((this.space / 10) + this.speed)
        }
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.h / height;
            this.container.addChild(this.sprite);
            this.page.container.position.x = this.wall.left;
        }
    }
    update() {
        const frame = this.page.container;
        if (this.manager.mouse.x > this.w - this.space && frame.position.x > this.wall.right) {
            let distance = (this.space - (this.w - this.manager.mouse.x)) / 10;
            frame.position.x -= this.speed + distance;
        }
        if (this.manager.mouse.x < this.space && frame.position.x < this.wall.left) {
            let distance = (this.space - this.manager.mouse.x) / 10;
            frame.position.x += this.speed + distance;
        }
    }
}
class Billboard extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.page = page;
        this.name = "寄養家庭條件";
        this.container.zIndex = 20;
        this.x = -0.189;
        this.y = 0.017;
        this.url = "image/building/know/billboard.png";
        this.blink = FilterSet.blink;
        this.draw = function () {
            let _x = (this.x * this.w);
            let _y = (this.y * this.h);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.sprite.filters = [this.blink.filter];
            this.text = new PIXI.Text(this.name, this.ts);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);

            this.container.addChild(this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(_x, _y);
        }
    }
    update() {
        if (this.sprite.isPointerOver) {
            this.blink.setOuter(5);
            gsap.to(this.text, { duration: 1, y: this.textHeight * -1, alpha: 1 });
            //gsap.to(this.sprite.scale, { duration: 1, x: this.scale + 0.01, y: this.scale + 0.01 });
        }
        else {
            this.blink.effect();
            gsap.to(this.text, { duration: 0.5, y: this.spriteHeight * -1, alpha: 0 });
            //gsap.to(this.sprite.scale, { duration: 1, x: this.scale, y: this.scale });
        }
    }
    clickEvent() {
        alert(`You Click the ${this.name}!`);
    }
}
