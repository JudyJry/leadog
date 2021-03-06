import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameObject, PageObject } from './GameObject.js';
import { TextStyle } from './TextStyle.js';
import { FilterSet } from './FilterSet.js';
import { homePageData, objType } from './Data.js';
import { addDragEvent, addPointerEvent, createSprite, createText } from './GameFunction.js';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
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
    constructor(manager, url) {
        super(manager);
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.draw = function () {
            this.manager.canvasScale = window.innerWidth / 1920;
            console.log(window.innerWidth / 1920);
        }
    }
}
class Building extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.name = "Building";
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
                        this.drawTree(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.building:
                        this.building.push(this.drawBuilding(i, data.name, data.url, data.x, data.y));
                        break;
                    case objType.animation:
                        this.animation.push(this.drawAnimation(i, data.name, data.url, data.x, data.y));
                        break;
                    case objType.animationBuilding:
                        this.building.push(this.drawAnimationBuilding(i, data.name, data.url, data.x, data.y));
                        break;
                    case objType.boat:
                        this.drawBoat(i, data.name, data.url, data.x, data.y);
                        break;
                    case objType.dog:
                    case objType.light:
                    case objType.grass:
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
        c.zIndex = i;
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
        e.zIndex = i;
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
    drawBoat(i, n, url, x, y, scale = this.scale) {
        const self = this;
        let w = this.w;
        let h = this.h;
        const t = 5;
        const s = 5;
        let _x = x * 2;
        let _y = y * 2;
        let e = new PIXI.Container();
        let c = createSprite(this.textures[url], [0.5, 1], scale);
        let c2 = createSprite(this.textures[url], [0.5, 1], [scale, -scale]);
        c.rotation = -s * (Math.PI / 180);
        c2.rotation = s * (Math.PI / 180);
        c2.alpha = 0.25;
        e.addChild(c, c2);
        e.name = n;
        e.dataIndex = i;
        e.zIndex = i;
        e.position.set(_x, _y);
        this.container.addChild(e);

        let tl = gsap.timeline({ repeat: -1 })
            .to(c, { duration: t / 2, rotation: s * (Math.PI / 180), ease: "none" }, 0)
            .to(c, { duration: t / 2, rotation: -s * (Math.PI / 180), ease: "none" }, t / 2)

            .to(c2, { duration: t / 2, rotation: -s * (Math.PI / 180), ease: "none" }, 0)
            .to(c2, { duration: t / 2, rotation: s * (Math.PI / 180), ease: "none" }, t / 2)

        e.dragDownEvent = (e, event) => {
            setPos(e, event)
            gsap.timeline()
                .to(c, { duration: 0.5, y: 20 })
                .to(c, { duration: 0.5, y: -20 }, 0)
        }
        e.dragMoveEvent = (e, event) => {
            setPos(e, event)
        }
        e.dragUpEvent = (e, event) => {
            setPos(e, event)
            tl.play(true);
            gsap.timeline()
                .to(c, { duration: 0.5, y: 0 })
                .to(c, { duration: 0.5, y: 0 }, 0)
        }

        addDragEvent(e);
        return e;
        function setPos(e, event) {
            tl.pause()
            e.position.x = (self.manager.mouse.x - (w / 2)) / self.manager.canvasScale;
            e.position.y = (self.manager.mouse.y - (h / 2)) / self.manager.canvasScale;
        }
    }
    drawBuilding(i, n, url, x, y) {
        const self = this;
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(this.textures[url], 0.5, this.scale);
        c.name = n;
        c.dataIndex = i;
        c.zIndex = i;
        c.isEntering = false;
        c.blink = FilterSet.blink();
        c.filters = [c.blink.filter];
        c.clickEvent = buildingClickEvent;
        c.overEvent = buildingOverEvent;
        c.update = buildingUpdate;
        addPointerEvent(c);

        drawText();
        c.position.set(_x, _y);
        this.container.addChild(c);
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
                    .to(self.page.container, { duration: 0.5, x: -_x * self.zoomIn * self.manager.canvasScale, y: -_y * self.zoomIn * self.manager.canvasScale })
                    .to(self.page.container.scale, { duration: 0.5, x: self.zoomIn, y: self.zoomIn }, 0)
                    .to(self.page.container, { duration: 0.5, onComplete: enter.bind(self) })
            }
            function enter() {
                self.page.container.scale.set(1);
                self.page.container.position.set(0);
                self.manager.toOtherPage(e.name);
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
        function drawText() {
            c.text = new PIXI.Text(c.name, self.ts);
            c.text.zIndex = 100;
            c.text.anchor.set(0.5);
            c.text.originHeight = (self.spriteHeight * -1) + (_y * self.manager.canvasScale);
            c.text.position.set(_x * self.manager.canvasScale, c.text.originHeight);
            c.text.alpha = 0;
            self.manager.addChild(c.text);
        }
    }
    drawAnimationBuilding(i, n, url, x, y) {
        const self = this;
        const jsonUrl = "image/homepage/building/" + url + "/sprites.json";
        const texturesUrl = this.manager.resources[jsonUrl].spritesheet.textures;
        let textures = [];
        for (let i = 0; i < Object.keys(texturesUrl).length; i++) {
            textures.push(texturesUrl[i + ".png"]);
        }
        let _x = x * 2;
        let _y = y * 2;
        let e = new PIXI.Container();
        let c = new PIXI.AnimatedSprite(textures);
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.loop = false;
        e.name = n;
        e.dataIndex = i;
        e.zIndex = i;
        e.addChild(c);
        e.isEntering = false;
        e.blink = FilterSet.blink();
        e.filters = [e.blink.filter];
        e.position.set(_x, _y);
        e.overEvent = buildingOverEvent;
        e.clickEvent = buildingClickEvent;
        e.update = buildingUpdate;
        addPointerEvent(e);
        drawText();
        this.container.addChild(e);
        c.animationSpeed = 1.5;
        c.stop();
        return e;
        function buildingUpdate() {
            if (e.isPointerOver) {
                e.blink.outerStrength = 5;
            }
            else if (c.isEntering) {
                e.blink.outerStrength = 0;
            }
            else {
                e.blink.effect();
            }
        }
        function buildingClickEvent(e) {
            if (!e.isEntering) {
                e.isEntering = true;
                let _x = homePageData[e.dataIndex].x * 2;
                let _y = homePageData[e.dataIndex].y * 2;
                c.gotoAndPlay(0);
                gsap.timeline()
                    .to(self.page.container, { duration: 0.5, x: -_x * self.zoomIn * self.manager.canvasScale, y: -_y * self.zoomIn * self.manager.canvasScale })
                    .to(self.page.container.scale, { duration: 0.5, x: self.zoomIn, y: self.zoomIn }, 0)
                    .to(self.page.container, { duration: 0.5, onComplete: enter.bind(self) })
            }
            function enter() {
                self.page.container.scale.set(1);
                self.page.container.position.set(0);
                c.gotoAndStop(0);
                e.isEntering = false;
                self.manager.toOtherPage(e.name);
            };
        }
        function buildingOverEvent(e) {
            if (e.isPointerOver) {
                gsap.killTweensOf(e.text);
                gsap.killTweensOf(e.scale);
                gsap.to(e.text, { duration: 1, y: e.text.originHeight - self.space, alpha: 1 });
                gsap.to(e.scale, { duration: 1, x: 1.01, y: 1.01 });
            }
            else {
                gsap.killTweensOf(e.text);
                gsap.killTweensOf(e.scale);
                gsap.to(e.text, { duration: 0.5, y: e.text.originHeight, alpha: 0 });
                gsap.to(e.scale, { duration: 1, x: 1, y: 1 });
            }
        }
        function drawText() {
            e.text = new PIXI.Text(e.name, self.ts);
            e.text.zIndex = 100;
            e.text.anchor.set(0.5);
            e.text.originHeight = (self.spriteHeight * -1) + (_y * self.manager.canvasScale);
            e.text.position.set(_x * self.manager.canvasScale, e.text.originHeight);
            e.text.alpha = 0;
            self.manager.addChild(e.text);
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
        c.zIndex = i;
        c.anchor.set(0.5);
        c.scale.set(this.scale);
        c.position.set(_x, _y);
        this.container.addChild(c);
        switch (c.name) {
            case "ferrisWheel":
                let fs = 0;
                c.animationSpeed = 0.1;
                c.clickEvent = () => {
                    switch (fs) {
                        case 0:
                        case 2:
                        case 4:
                            c.animationSpeed = 0;
                            break;
                        case 1:
                        case 3:
                        case 5:
                            c.animationSpeed = 0.1;
                            break;
                        case 6:
                            c.animationSpeed = 0.75;
                            break;
                        case 7:
                            c.animationSpeed = 0.1;
                            fs = -1;
                            break;
                    }
                    fs++;
                }
                addPointerEvent(c);
                break;
            case "trafficLight":
                c.animationSpeed = 0.75;
                c.scale.set(this.scale * 2);
                break;
            case "streetLight":
                c.animationSpeed = 0.5;
                break;
            case "bus":
                c.scale.set(this.scale * 0.5);
                gsap.timeline({ repeat: -1 })
                    .to(c, { duration: 10, x: 82, y: -14 })
                    .to(c, { duration: 5, x: -64, y: 48, onComplete: () => { c.position.set(_x, _y); } })
                break;
            case "dog_born":
                c.animationSpeed = 0.5;
                let btl = gsap.timeline()
                    .to(c, { duration: 0.2, y: "-=10" })
                    .to(c, { duration: 0.2, y: "+=10" })
                    .to(c, { duration: 0.2, y: "-=5" })
                    .to(c, { duration: 0.2, y: "+=5" })
                btl.pause();
                c.clickEvent = () => {
                    btl.play(0.01);
                }
                addPointerEvent(c);
                break;
            case "dog_childhood":

                const fish = this.drawFish(0);
                const texturesUrl2 = this.manager.resources["image/homepage/dog/childhood/catch/sprites.json"].spritesheet.textures;
                let textures2 = [];
                for (let i = 0; i < Object.keys(texturesUrl2).length; i++) {
                    textures2.push(texturesUrl2[i + ".png"]);
                }
                let c2 = new PIXI.AnimatedSprite(textures2);
                c2.zIndex = i;
                c2.loop = false;
                c2.anchor.set(0.5);
                c2.scale.set(this.scale);
                c2.position.set(_x, _y);
                this.container.addChild(c2);
                c2.visible = false;
                c2.stop();
                c2.animationSpeed = 0.5;
                c.animationSpeed = 0.5;
                c.clickEvent = () => {
                    if (fish.isHooked) {
                        fish.isHooked = false;
                        fish.alpha = 0;
                        fish.anim.pause(0);
                        c.gotoAndStop(0);
                        c.visible = false;
                        c2.visible = true;
                        c2.gotoAndPlay(0);
                        setTimeout(() => {
                            gsap.to(fish, { duration: 2, alpha: 0.5, onComplete: () => { fish.anim.play(true); } })
                        }, 3000)
                    }
                }
                addPointerEvent(c);

                c2.onComplete = () => {
                    c2.gotoAndStop(0);
                    c2.visible = false;
                    c.visible = true;
                    c.gotoAndPlay(0);
                }
                break;
            case "dog_youth":
                c.animationSpeed = 1.2;
                const r = 60;
                gsap.timeline({ repeat: -1 })
                    .to(c, { duration: 2, x: "+=" + r, y: "+=" + r, ease: "none", onComplete: () => { c.scale.set(-this.scale, this.scale) } })
                    .to(c, { duration: 2, x: "-=" + r, y: "-=" + r, ease: "none", onComplete: () => { c.scale.set(this.scale, this.scale) } })
                break;
            case "dog_elderly":
                c.loop = false;
                c.animationSpeed = 0.5;
                let etl = gsap.timeline().to(c, { duration: 0.2, y: "-=5" }).to(c, { duration: 0.2, y: "+=5" });
                etl.pause();
                c.onComplete = () => { setTimeout(() => { c.gotoAndPlay(0); }, 5000) };
                c.clickEvent = () => { etl.play(0.01); }
                addPointerEvent(c);
                break;
        }
        c.play();
        return c;
    }
    drawFish(i) {
        const data = homePageData[i];
        let _x = data.x * 2;
        let _y = data.y * 2;
        let c = createSprite(this.textures[data.url], [1, 0], this.scale * 0.5);
        c.name = data.name;
        c.dataIndex = i;
        c.zIndex = i;
        c.isHooked = false;
        c.position.set(_x, _y);
        c.alpha = 0.5;
        this.container.addChild(c);
        c.anim = fishAnim();
        return c;
        function fishAnim() {
            return gsap.timeline({ repeat: -1 })
                .to(c, { duration: 3, rotation: "+=0.5", x: "+=5", y: "-=5", ease: "power1.inOut" })
                .to(c, { duration: 3, rotation: "-=0.5", x: "-=5", y: "+=5", ease: "power1.inOut" })
                .to(c, { duration: 3, rotation: "+=0.5", x: _x + 27, y: _y - 42, ease: "power1.inOut", onComplete: () => { c.isHooked = true; } })
                .to(c, { duration: 3, rotation: "-=0.5", ease: "power1.inOut", onComplete: () => { c.isHooked = false; } })
                .to(c, { duration: 3, rotation: 0, x: _x, y: _y, ease: "power1.inOut" })
        }
    }
    drawTree(i, n, url, x, y) {
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(this.textures[url], [0.5, 1], this.scale);
        c.name = n;
        c.dataIndex = i;
        c.zIndex = i;
        c.position.set(_x, _y + (c.height / 2));
        this.container.addChild(c);
        c.overEvent = treeOverEvent;
        c.clickEvent = () => { }
        addPointerEvent(c);
        function treeOverEvent(e) {
            const t = 0.2;
            const r = 1;
            gsap.timeline()
                .to(c, { duration: t, rotation: r * (Math.PI / 180) })
                .to(c, { duration: t, rotation: -r * (Math.PI / 180) })
                .to(c, { duration: t, rotation: 0 })
        }
    }
    drawOther(i, n, url, x, y) {
        let _x = x * 2;
        let _y = y * 2;
        let c = createSprite(this.textures[url], 0.5, this.scale);
        c.name = n;
        c.dataIndex = i;
        c.zIndex = i;
        c.position.set(_x, _y);
        this.container.addChild(c);
        switch (c.name) {
            case "light_4":
                let count = 0;
                c.clickEvent = () => {
                    count++;
                    if (count == 5) {
                        console.log("create boat")
                        count = 0;
                        let color = Math.floor(Math.random() * 2);
                        let scale = Math.random() * 0.25 + 0.25;
                        let rx = Math.floor(Math.random() * 10);
                        let ry = Math.floor(Math.random() * 10);
                        this.drawBoat(7, "boat_n", `sailboat_${color}.png`, x - rx, y - ry, scale);
                        this.container.sortChildren();
                    }
                }
                addPointerEvent(c);
                break;
        }
    }
    update() {
        this.building.forEach(e => { e.update(); });
    }
}
