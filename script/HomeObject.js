import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GlowFilter } from 'pixi-filters';
import { GameObject, PageObject } from './GameObject.js';
import * as gf from "./GameFunction.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class HomeObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "HomeObject";
        this.children = {
            "background": new Background(manager),
            "wave": new Wave(manager),
            "building": new Building(manager),
            "tree": new Tree(manager)
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

class Building extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "Building"
        this.filter = new GlowFilter({
            distance: 6,
            outerStrength: 6,
            innerStrength: 0,
            color: 0xedda6e,
            quality: 0.5
        });
        this.container.zIndex = 30;
        this.scale = 0.2;
        this.spriteHeight = 50;
        this.textHeight = this.spriteHeight + 10;
        this.w = 1920;
        this.draw = function () {
            this.drawBuilding("出生", 0.129, -0.228);
            this.drawBuilding("幼年", 0.195, -0.091);
            this.drawBuilding("壯年", 0.209, 0.111);
            this.drawBuilding("老年", 0.142, 0.205);
            this.drawBuilding("捐款", -0.008, -0.319);
            this.drawBuilding("配對", 0.028, -0.08);
            this.drawBuilding("活動", -0.14, 0.02);
            this.drawBuilding("外部連結", -0.004, 0.25);
        }
    }
    drawBuilding(n, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = new PIXI.Container();
        c.name = n;
        c.sprite = new PIXI.Sprite();
        c.text = new PIXI.Text(c.name, this.textStyle);
        c.isEntering = false;

        c.sprite.anchor.set(0.5);
        c.sprite.scale.set(this.scale);
        c.sprite.filters = [this.filter];
        c.sprite.texture = PIXI.Texture.from("image/location.svg");
        c.text.anchor.set(0.5);
        c.text.position.set(0, this.spriteHeight * -1);
        c.text.alpha = 0;

        c.position.set(_x, _y);
        c.addChild(c.sprite, c.text);
        this.container.addChild(c);
    }
    addEnterEvent() {
        if (this.manager.keyboard.key['Enter']) {
            this.container.children.forEach((e) => {
                if (this.manager.isArrive(e.name) && !e.isEntering) {
                    console.log(`You enter the ${e.name}!`);
                    e.isEntering = true;
                    this.manager.toOtherPage(e);
                }
            });
        }
    }
    update() {
        this.container.children.forEach((e) => {
            this.manager.arrived(e.name, gf.rectCollision(this.manager.player.container, e));
            if (this.manager.isArrive(e.name)) {
                e.sprite.filters = [this.filter];
                gsap.to(e.text, { duration: 1, y: this.textHeight * -1, alpha: 1 });
            }
            else {
                e.sprite.filters = [];
                gsap.to(e.text, { duration: 0.5, y: this.spriteHeight * -1, alpha: 0 });
            }
        });
    }
}

class Tree extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = 'Tree';
        this.container.zIndex = 20;
        this.filter = new GlowFilter({
            distance: 5,
            outerStrength: 5,
            innerStrength: 0,
            color: 0xedda6e,
            quality: 0.5
        });
        this.angle = 15 * (Math.PI / 180);
        this.draw = function () {
            this.drawTree(0.25, 0.1);
            this.drawTree(0.1, -0.1);
        }
    }
    drawTree(x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let tree = PIXI.Sprite.from("image/tree.png");
        tree.anchor.set(0.5, 1);
        tree.scale.set(0.25);
        tree.filters = [this.filter];
        tree.position.set(_x, _y);
        this.container.addChild(tree);
    }
    update() {
        for (let i = 0; i < this.container.children.length; i++) {
            let e = this.container.children[i];
            this.manager.arrived(this.name + i, gf.rectCollision(this.manager.player.container, e));
            if (this.manager.isArrive(this.name + i)) {
                let collision = gf.directionCollision(this.manager.player.container, e);
                if (collision == "left") {
                    gsap.to(e, {
                        duration: 1,
                        rotation: this.angle
                    });
                }
                else if (collision == "right") {
                    gsap.to(e, {
                        duration: 1,
                        rotation: this.angle * -1
                    });
                }
            }
            else {
                gsap.to(e, {
                    duration: 5,
                    rotation: 0
                });
            }
        }
    }
}

class Wave extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = 'Wave';
        this.container.zIndex = 0;
        this.time = 2;
        this.delay = 0.8;
        this.scale = 0.2;
        this.w = 1920;
        this.draw = function () {
            this.drawWave(-0.3, -0.4, this.delay * 0);
            this.drawWave(-0.5, -0.3, this.delay * 1);
            this.drawWave(0.3, 0.4, this.delay * 2);
            this.drawWave(-0.5, 0.3, this.delay * 3);
            this.drawWave(0.3, -0.4, this.delay * 4);
            this.container.position.set(0, 0);
        }
    }
    drawWave(x, y, d) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let s = PIXI.Sprite.from("image/wave.svg");
        s.scale.set(this.scale);
        s.alpha = 0;
        s.position.set(_x, _y);
        let tl = gsap.timeline({ repeat: -1, repeatDelay: 1, delay: d });
        tl.to(s, { duration: this.time, x: _x + 50, alpha: 1, ease: "none" });
        tl.to(s, { duration: this.time, x: _x + 100, alpha: 0, ease: "none" });
        this.container.addChild(s);
    }
}