import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameObject, PageObject } from './GameObject.js';
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';
import { homePageData, objType } from './Data.js';
import { addPointerEvent, createSprite, createText } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class HomeObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "HomeObject";
        this.soundUrl = "sound/homepage.mp3";
        this.children = {
            "background": new Background(manager, "image/homepage/map.png"),
            "building": new Building(manager, this)
        };
    }
}
class Background extends GameObject {
    constructor(manager, url, height = window.innerHeight) {
        super(manager);
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.draw = function () {
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = 1;
            //this.container.addChild(this.sprite);
        }
    }
}
class Building extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.name = "Building"
        this.page = page;
        this.filter = FilterSet.blink();
        this.container.zIndex = 20;
        this.scale = 0.5;
        this.spriteHeight = 100;
        this.space = 10;
        this.zoomIn = 3;
        this.ts = TextStyle.link;
        this.texturesUrl = "image/homepage/sprites.json";
        this.building = [];
        this.animation = [];
        this.draw = function () {
            this.textures = this.manager.resources[this.texturesUrl].spritesheet.textures;
            homePageData.forEach(function (data, i) {
                switch (data.type) {
                    case objType.island:
                        this.drawIsland(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.wave:
                        this.drawWave(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.tree:
                        this.drawOther(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.light:
                        this.drawOther(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.building:
                        this.building.push(this.drawBuilding(i, data.name, data.url, data.x, data.y));
                        break;
                    case objType.animation:
                        this.animation.push(this.drawAnimation(i, data.name, data.url, data.x, data.y));
                        break;
                    case objType.dog:
                        this.drawOther(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.boat:
                        this.drawBoat(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.other:
                        this.drawOther(i, data.name, data.url, data.x, data.y);
                        break;
                }
            }.bind(this));
        }
    }
    drawIsland(i, n, url, x, y) {
        const textures = this.manager.resources["image/homepage/island/sprites.json"].spritesheet.textures;
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(textures[url], 0.5, this.scale);
        c.name = n;
        c.dataIndex = i;
        c.position.set(_x, _y);
        this.container.addChild(c);
        return c;
    }
    drawWave(i, n, url, x, y) {
        const t = 5;
        const s = 0.05;
        let _x = x * 2;
        let _y = y * 2;
        let e = new PIXI.Container();
        let c = createSprite("image/homepage/island/" + url, 0.5, this.scale - s);
        e.name = n;
        e.dataIndex = i;
        e.addChild(c);
        c.position.set(_x, _y);
        c.alpha = 0;
        gsap.timeline({ repeat: -1 })
            .to(c.scale, { duration: t, x: this.scale + s, y: this.scale + (s / 2), ease: "none" }, 0)
            .to(c, { duration: t / 2, alpha: 1, ease: "none" }, 0)
            .to(c, { duration: t / 2, alpha: 0 }, t / 2)

        let c2 = createSprite("image/homepage/island/" + url, 0.5, this.scale - s);
        c2.name = n;
        c2.dataIndex = i;
        c2.position.set(_x, _y);
        e.addChild(c2);
        c2.alpha = 0;
        gsap.timeline({ repeat: -1, delay: t / 2 })
            .to(c2.scale, { duration: t, x: this.scale + s, y: this.scale + (s / 2), ease: "none" }, 0)
            .to(c2, { duration: t / 2, alpha: 1, ease: "none" }, 0)
            .to(c2, { duration: t / 2, alpha: 0 }, t / 2)
        this.container.addChild(e);
        return e;
    }
    drawBoat(i, n, url, x, y) {
        const t = 5;
        const s = 5;
        let _x = x * 2;
        let _y = y * 2;
        let e = new PIXI.Container();
        let c = createSprite(this.textures[url], [0.5, 1], this.scale);
        let c2 = createSprite(this.textures[url], [0.5, 1], [this.scale, -this.scale]);
        c.rotation = -s * (Math.PI / 180);
        c2.rotation = s * (Math.PI / 180);
        c2.alpha = 0.25;
        e.addChild(c, c2);
        e.name = n;
        e.dataIndex = i;
        e.position.set(_x, _y);
        this.container.addChild(e);

        gsap.timeline({ repeat: -1 })
            .to(c, { duration: t / 2, rotation: s * (Math.PI / 180), ease: "none" }, 0)
            .to(c, { duration: t / 2, rotation: -s * (Math.PI / 180), ease: "none" }, t / 2)

            .to(c2, { duration: t / 2, rotation: -s * (Math.PI / 180), ease: "none" }, 0)
            .to(c2, { duration: t / 2, rotation: s * (Math.PI / 180), ease: "none" }, t / 2)

            .to(e, { duration: t / 2, x: "+=2", ease: "none" }, 0)
            .to(e, { duration: t / 2, x: "-=2", ease: "none" }, t / 2)

        return e;
    }
    drawBuilding(i, n, url, x, y) {
        const self = this;
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(this.textures[url], 0.5, this.scale);
        c.name = n;
        c.dataIndex = i;
        c.isEntering = false;
        c.blink = FilterSet.blink();
        c.filters = [c.blink.filter];
        c.clickEvent = buildingClickEvent;
        c.overEvent = buildingOverEvent;
        c.update = buildingUpdate;
        addPointerEvent(c);

        c.text = new PIXI.Text(c.name, this.ts);
        c.text.zIndex = 100;
        c.text.anchor.set(0.5);
        c.text.originHeight = (this.spriteHeight * -1) + _y;
        c.text.position.set(_x, c.text.originHeight);
        c.text.alpha = 0;

        c.position.set(_x, _y);
        this.container.addChild(c);
        this.manager.addChild(c.text);
        return c;

        function buildingUpdate() {
            if (c.isPointerOver) {
                c.blink.outerStrength = 5;
            }
            else if (c.isEntering) {
                c.blink.outerStrength = 0;
            }
            else {
                c.blink.effect();
            }
        }
        function buildingClickEvent(e) {
            if (!e.isEntering) {
                e.isEntering = true;
                let _x = homePageData[e.dataIndex].x * 2;
                let _y = homePageData[e.dataIndex].y * 2;
                gsap.timeline()
                    .to(self.page.container, { duration: 0.5, x: -_x * self.zoomIn, y: -_y * self.zoomIn })
                    .to(self.page.container.scale, { duration: 0.5, x: self.zoomIn, y: self.zoomIn }, 0)
                    .to(self.page.container, { duration: 0.5, onComplete: enter.bind(self) })
            }
            function enter() {
                self.page.container.scale.set(1);
                self.page.container.position.set(0);
                //self.manager.toOtherPage(e.name);
            };
        }
        function buildingOverEvent(e) {
            if (e.isPointerOver) {
                gsap.killTweensOf(e.text);
                gsap.killTweensOf(e.scale);
                gsap.to(e.text, { duration: 1, y: e.text.originHeight - self.space, alpha: 1 });
                gsap.to(e.scale, { duration: 1, x: self.scale + 0.01, y: self.scale + 0.01 });
            }
            else {
                gsap.killTweensOf(e.text);
                gsap.killTweensOf(e.scale);
                gsap.to(e.text, { duration: 0.5, y: e.text.originHeight, alpha: 0 });
                gsap.to(e.scale, { duration: 1, x: self.scale, y: self.scale });
            }
        }
    }
    drawAnimation(i, n, url, x, y) {
        const jsonUrl = "image/homepage/" + url + "/sprites.json";
        const texturesUrl = this.manager.resources[jsonUrl].spritesheet.textures;
        let textures = [];
        for (let i = 0; i < Object.keys(texturesUrl).length; i++) {
            textures.push(texturesUrl[i + ".png"]);
        }
        let _x = x * 2;
        let _y = y * 2;
        let c = new PIXI.AnimatedSprite(textures);
        c.name = n;
        c.dataIndex = i;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.position.set(_x, _y);
        this.container.addChild(c);
        switch (c.name) {
            case "ferrisWheel":
                c.animationSpeed = 0.75;
                break;
            case "trafficLight":
                c.animationSpeed = 0.75;
                c.scale.set(this.scale * 2);
                break;
            case "streetLight":
                c.animationSpeed = 0.5;
                break;
        }

        c.play();
        return c;
    }
    drawOther(i, n, url, x, y) {
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(this.textures[url], 0.5, this.scale);
        c.name = n;
        c.dataIndex = i;
        c.position.set(_x, _y);
        this.container.addChild(c);
    }
    update() {
        this.building.forEach(e => { e.update(); });
    }
}

class TestGif {
    constructor(manager, src, x, y) {
        this.manager = manager;
        this.anim = undefined;
        try { this.manager.app.loader.add(src); }
        catch { }
        this.manager.app.loader.load((_) => {
            this.playAnimation(src);
        });
        this.scale = 1;
        this.x = x;
        this.y = y;
    }
    playAnimation(src) {
        this.clearAnimation();
        this.anim = this.manager.resources[src].animation;
        this.anim.scale.set(this.scale);
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
            this.anim = null;
        }
    }
}