import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameObject, PageObject } from './GameObject.js';
import * as gf from "./GameFunction.js";
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';

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
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from("image/homepage/island.png");
            this.spriteHeight = this.sprite.texture.height + 300;
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
        this.filter = FilterSet.link;
        this.container.zIndex = 20;
        this.scale = 0.7;
        this.spriteHeight = 100;
        this.textHeight = this.spriteHeight + 10;
        this.w = 1920;
        this.ts = TextStyle.link;
        this.draw = function () {
            this.drawBuilding("出生", "image/homepage/bron.png", 0.154, 0.141);
            this.drawBuilding("幼年", "image/homepage/childhood.png", 0.109, -0.042);
            this.drawBuilding("壯年", "image/homepage/youth.png", 0.029, 0.098);
            this.drawBuilding("老年", "image/homepage/elderly.png", -0.068, 0.098);
            this.drawBuilding("知識教育館", "image/homepage/education.png", 0.007, -0.165);
            this.drawBuilding("LEADOG公司", "image/homepage/company.png", -0.126, -0.183);
            this.drawBuilding("相關活動", "image/homepage/event.png", 0.137, -0.296);
        }
    }
    drawBuilding(n, url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = new PIXI.Container();
        c.name = n;
        c.sprite = PIXI.Sprite.from(url);
        c.text = new PIXI.Text(c.name, this.ts);
        c.isEntering = false;

        c.sprite.anchor.set(0.5);
        c.sprite.scale.set(this.scale);
        c.sprite.filters = [this.filter];
        c.text.anchor.set(0.5);
        c.text.position.set(0, this.spriteHeight * -1);
        c.text.alpha = 0;

        c.position.set(_x, _y);
        c.addChild(c.sprite, c.text);
        this.container.addChild(c);
    }
    addKeyEvent(k) {
        if (k['Enter'] && this.manager.isUsePlayer) {
            this.container.children.forEach((e) => {
                if (this.manager.isArrive(e.name) && !e.isEntering) {
                    //console.log(`You enter the ${e.name}!`);
                    e.isEntering = true;
                    this.manager.toOtherPage(e);
                }
            });
        }
    }
    addMouseEvent(m) {
        if (m && !this.manager.isUsePlayer) {
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
            if (this.manager.isUsePlayer) {
                this.manager.arrived(e.name, gf.rectCollision(this.manager.player.container, e));
            }
            else {
                this.manager.arrived(e.name, gf.pointCollision(this.manager.mouse.position, e));
            }
            
            if (this.manager.isArrive(e.name)) {
                e.sprite.filters = [this.filter];
                gsap.to(e.text, { duration: 1, y: this.textHeight * -1, alpha: 1 });
                gsap.to(e.sprite.scale, { duration: 1, x: this.scale + 0.01, y: this.scale + 0.01 });
            }
            else {
                e.sprite.filters = [];
                gsap.to(e.text, { duration: 0.5, y: this.spriteHeight * -1, alpha: 0 });
                gsap.to(e.sprite.scale, { duration: 1, x: this.scale, y: this.scale });
            }
        });
    }
}
class Tree extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = 'Tree';
        this.container.zIndex = 30;
        this.angle = 15 * (Math.PI / 180);
        this.scale = 0.8;
        this.draw = function () {
            this.drawTree("image/homepage/tree_front.png", 0.05, 0.121);
        }
    }
    drawTree(url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let tree = PIXI.Sprite.from(url);
        tree.anchor.set(0.5);
        tree.scale.set(this.scale);
        tree.position.set(_x, _y);
        this.container.addChild(tree);
    }
    /*
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
    */
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