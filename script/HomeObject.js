import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Background, GameObject, PageObject } from './GameObject.js';
import * as gf from "./GameFunction.js";
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';
import { homePageData, objType } from './Data.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class HomeObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "HomeObject";
        this.children = {
            "background": new Background(manager, "image/homepage/map.png"),
            "building": new Building(manager, this)
        };
    }
}
class Building extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.name = "Building"
        this.page = page;
        this.filter = FilterSet.link;
        this.container.zIndex = 20;
        this.scale = 1;
        this.spriteHeight = 100;
        this.space = 10;
        this.zoomIn = 3;
        this.w = 1920;
        this.ts = TextStyle.link;
        this.draw = function () {
            homePageData.forEach(function (data, i) {
                switch (data.type) {
                    case objType.building:
                        this.drawBuilding(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.character:
                        this.drawCharacter(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.animation:
                        this.drawAnimation(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.other:
                        this.drawOther(i, data.name, data.url, data.x, data.y);
                        break;
                }
            }.bind(this));
        }
    }
    drawBuilding(i, n, url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = PIXI.Sprite.from(url);
        c.name = n;
        c.dataIndex = i;
        c.isEntering = false;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.filters = [this.filter];
        c.clickEvent = this.buildingClickEvent.bind(this);
        gf.addPointerEvent(c);

        c.text = new PIXI.Text(c.name, this.ts);
        c.text.zIndex = 100;
        c.text.anchor.set(0.5);
        c.text.originHeight = (this.spriteHeight * -1) + _y;
        c.text.position.set(_x, c.text.originHeight);
        c.text.alpha = 0;

        c.position.set(_x, _y);
        this.container.addChild(c);
        this.manager.addChild(c.text);
    }
    drawCharacter(i, n, url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = PIXI.Sprite.from(url);
        c.name = n;
        c.dataIndex = i;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.position.set(_x, _y);
        this.container.addChild(c);
    }
    drawAnimation(i, n, url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = PIXI.Sprite.from(url);
        c.name = n;
        c.dataIndex = i;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.position.set(_x, _y);
        this.container.addChild(c);
    }
    drawOther(i, n, url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let c = PIXI.Sprite.from(url);
        c.name = n;
        c.dataIndex = i;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.position.set(_x, _y);
        this.container.addChild(c);
    }
    buildingClickEvent(e) {
        if (!e.isEntering) {
            e.isEntering = true;
            let _x = (homePageData[e.dataIndex].x * this.w);
            let _y = (homePageData[e.dataIndex].y * this.h);
            let tl = gsap.timeline();
            tl.to(this.page.container, {
                duration: 0.5, x: -_x * this.zoomIn, y: -_y * this.zoomIn,
            });
            tl.to(this.page.container.scale, {
                duration: 0.5, x: this.zoomIn, y: this.zoomIn,
                onComplete: function () {
                    this.page.container.scale.set(1);
                    this.manager.toOtherPage(e);
                }.bind(this)
            }, 0);
        }
    }
    update() {
        this.container.children.forEach((e) => {
            if (e.isPointerOver) {
                e.filters = [this.filter];
                gsap.to(e.text, { duration: 1, y: e.text.originHeight - this.space, alpha: 1 });
                gsap.to(e.scale, { duration: 1, x: this.scale + 0.01, y: this.scale + 0.01 });
            }
            else {
                e.filters = [];
                gsap.to(e.text, { duration: 0.5, y: e.text.originHeight, alpha: 0 });
                gsap.to(e.scale, { duration: 1, x: this.scale, y: this.scale });
            }
        });
    }
}

class TestGif {
    constructor(manager, src) {
        this.manager = manager;
        this.anim = undefined;
        try { this.manager.app.loader.add(src); }
        catch { }
        this.manager.app.loader.load((_) => {
            this.playAnimation(src);
            console.log(this.anim);
        });
        this.x = this.manager.w * 0.4;
        this.y = this.manager.h * 0.4;
        this.speed = 5;
        this.scale = -0.5;
    }
    playAnimation(src) {
        this.clearAnimation();
        this.anim = this.manager.app.loader.resources[src].animation;
        this.manager.app.stage.addChild(this.anim);
        this.anim.scale.set(this.scale, 0.5);
        this.anim.anchor.set(0.5);
        this.anim.position.set(this.x, this.y);
        this.anim.onLoop = () => console.log('Looped!');
        this.anim.onComplete = () => console.log('Completed!');
        this.anim.play();
    }
    clearAnimation() {
        if (this.anim) {
            this.anim.stop();
            this.anim.currentFrame = 0;
            this.manager.app.stage.removeChild(this.anim);
            this.anim = null;
        }
    }
    move(x, y) {
        this.x += x;
        this.y += y;
        this.anim.position.set(this.x, this.y);
    }
}