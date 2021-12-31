import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GlowFilter } from 'pixi-filters';
import { GameObject, PageObject } from './GameObject.js';
import * as gf from "./GameFunction.js";
import BronAction from './BronAction.js';
import { ColorSlip } from './ColorSlip.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BronObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BronObject";
        this.children = {
            "background": new Background(manager),
            "distributionMap": new DistributionMap(manager),
            "birthCalendar": new BirthCalendar(manager),
            "actionTest": new ActionTest(manager),
        };
    }
}

class Background extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "Background";
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
class DistributionMap extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "DistributionMap";
        this.container.zIndex = 20;
        this.scale = 0.2;
        this.draw = function (x = 0.2, y = 0) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/location.svg");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.text = new PIXI.Text(this.name, this.textStyle);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);
            this.container.position.set(_x, _y);
            this.container.addChild(this.sprite, this.text);
        }
    }
}
class BirthCalendar extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "BirthCalendar";
        this.container.zIndex = 20;
        this.scale = 0.2;
        this.draw = function (x = -0.2, y = 0) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/location.svg");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.text = new PIXI.Text(this.name, this.textStyle);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);
            this.container.position.set(_x, _y);
            this.container.addChild(this.sprite, this.text);
        }
    }
}
class ActionTest extends GameObject {
    constructor(manager) {
        super(manager);
        this.name = "ActionTest";
        this.container.zIndex = 20;
        this.scale = 0.2;
        this.filter = new GlowFilter({
            distance: 6,
            outerStrength: 6,
            innerStrength: 0,
            color: ColorSlip.yellow,
            quality: 0.5
        });
        this.draw = function (x = 0, y = 0) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/location.svg");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.text = new PIXI.Text(this.name, this.textStyle);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50 * -1);
            this.container.position.set(_x, _y);
            this.container.addChild(this.sprite, this.text);
        }
    }
    addEnterEvent() {
        if (this.manager.keyboard.key['Enter']) {
            if (this.manager.isArrive(this.name) && !this.isEntering) {
                console.log(`You enter the ${this.name}!`);
                this.isEntering = true;
                this.manager.loadAction(new BronAction(this.manager));
            }
        }
    }
    update() {
        this.manager.arrived(this.name, gf.rectCollision(this.manager.player.container, this.container));
        if (this.manager.isArrive(this.name)) { this.sprite.filters = [this.filter]; }
        else { this.sprite.filters = []; }
    }
}