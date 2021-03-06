import * as PIXI from "pixi.js";
import gsap from "gsap";
import { TextStyle } from "./TextStyle.js";
import { FilterSet } from "./FilterSet.js";
import { addPointerEvent, createSprite, createText } from "./GameFunction.js";
import { math } from "./math.js";
import { bookData, Page, videoData } from "./Data.js";
import Manager from "./Manager.js";
import { brightnessOverEvent } from "./UI.js";
import { sound } from '@pixi/sound';
import { ColorSlip } from "./ColorSlip.js";


export class PageObject {
    constructor(manager) {
        this.manager = manager;
        this.soundUrl = "";
        this.name = this.constructor.name;
        this.container = new PIXI.Container();
        this.children = {};
    }
    setup() {
        sound.removeAll();
        this.container.name = this.name;
        this.sound = sound.add(this.name, this.soundUrl);
        this.sound.loop = true;
        this.sound.muted = this.manager.isMute;
        this.sound.volume = 0.5;
        return new Promise(function (resolve, _) {
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.manager.app.stage.addChild(this.container);
            this.sound.play();
            resolve();
        }.bind(this))
    }
    resize() {
        for (let [_, e] of Object.entries(this.children)) { e.resize(); }
    }
    update() {
        for (let [_, e] of Object.entries(this.children)) { e.update(); }
    }
    addChild(...e) {
        this.container.addChild(...e);
        this.container.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.container.removeChildren(); }
        else { this.container.removeChild(...e); }
    }
    destroy() {
        if (this.children) {
            for (let [_, e] of Object.entries(this.children)) { e.destroy(); }
        }
        for (const prop of Object.getOwnPropertyNames(this)) delete this[prop];
    }
}
export class GameObject {
    constructor(manager) {
        this.manager = manager;
        this.name = this.constructor.name;
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.scale = 1;
        this.ts = TextStyle.link;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.draw = () => { };
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.manager.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
    }
    update() { }
    destroy() {
        for (const prop of Object.getOwnPropertyNames(this)) delete this[prop];
    }
}
export class Background extends GameObject {
    constructor(manager, page, url, width = window.innerWidth, height = window.innerHeight) {
        super(manager);
        this.page = page;
        this.url = url;
        this.name = "Background";
        this.container.zIndex = 10;
        this.space = 300;
        this.speed = 5;
        this.w = 1920;
        this.h = 1080;
        this.draw = function () {
            width = window.innerWidth;
            height = window.innerHeight;
            this.wall = {
                "right": (-width / 2) + ((this.space / 10) + this.speed),
                "left": (width / 2) - ((this.space / 10) + this.speed)
            }
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = width / 1920;
            this.container.addChild(this.sprite);
            this.page.container.position.x = this.wall.left;
            this.caution = createSprite("image/building/caution.png", 1, 0.75);
            this.caution.zIndex = 200;
            this.caution.position.set((width / 2) - 10, (height / 2) - 10);
            this.manager.app.stage.addChild(this.caution);
        }
    }
    resize() {
        this.manager.app.stage.removeChild(this.caution);
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
    }
    update() {
        if (!this.page.isZoomIn) {
            const frame = this.page.container;
            if (this.manager.mouse.x > window.innerWidth - this.space && frame.position.x > this.wall.right) {
                let distance = (this.space - (window.innerWidth - this.manager.mouse.x)) / 10;
                frame.position.x -= this.speed + distance;
            }
            if (this.manager.mouse.x < this.space && frame.position.x < this.wall.left) {
                let distance = (this.space - this.manager.mouse.x) / 10;
                frame.position.x += this.speed + distance;
            }
        }
    }
}
export class linkObject extends GameObject {
    constructor(manager, page) {
        super(manager);
        this.page = page;
        this.name = "linkObject";
        this.container.zIndex = 20;
        this.x = 0;
        this.y = 0;
        this.url = "image/building/know/billboard.png";
        this.spriteHeight = 250;
        this.zoomIn = 2;
        this.zoomInPos = [0, 0];
        this.fadeText = "????????????"
        this.isClick = false;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);

            this.blink = FilterSet.blink();
            this.sprite.filters = [this.blink.filter];

            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            this.container.addChild(this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            this.sprite.overEvent = this.overEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    zoom() {
        gsap.timeline()
            .to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn })
            .to(this.page.container, {
                duration: 0.5,
                x: (-this._x + this.zoomInPos[0]) * this.zoomIn,
                y: (-this._y + this.zoomInPos[1]) * this.zoomIn
            }, 0)
    }
    update() {
        if (this.page.isZoomIn) {
            this.blink.outerStrength = 0;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            if (this.isClick) { this.onClickUpdate(); }
        }
        else if (this.sprite.isPointerOver) {
            this.blink.outerStrength = 5;
        }
        else {
            this.blink.effect();
        }
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
        if (this.isClick) {
            this.sprite.interactive = false;
            this.zoom();
            if (this.cancel) {
                this.cancel.position.set((this.w * 0.5) - 60, (this.h * -0.5) + 60);
            }
            this.onClickResize();
        }
        this.container.scale.set(this.manager.canvasScale);
    }
    onClickResize() { }
    onClickUpdate() { }
    overEvent(e) {
        if (e.isPointerOver) {
            gsap.killTweensOf(this.text);
            gsap.to(this.text, { duration: 1, y: -this.textHeight, alpha: 1 });
        }
        else {
            gsap.killTweensOf(this.text);
            gsap.to(this.text, { duration: 0.5, y: -this.spriteHeight, alpha: 0 });
        }
    }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.png', 0.5);
        this.cancel.zIndex = 180;
        this.cancel.position.set(_x, _y);
        this.cancel.overEvent = brightnessOverEvent;
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 1);
        this.cancel.visible = false;
    }
    cancelEvent() {
        let tl = gsap.timeline({
            onComplete: function () {
                this.sprite.interactive = true;
            }.bind(this)
        });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.isClick = false;
        this.page.isZoomIn = false;
        this.cancel.visible = false;
        this.cancel = undefined;
    }
}
export class Player extends GameObject {
    constructor(manager, page, y = 0.2) {
        super(manager);
        this.page = page;
        this.name = "Player";
        this.mouse = this.manager.mouse;
        this.container.zIndex = 90;
        this.scale = 1;
        this.x = -0.412;
        this.y = y;
        this.speed = 75;
        this.textures = undefined;
        this.isLoaded = false;
        this.draw = function () {
            let pageName = this.page.name.replace("Object", "").toLowerCase();
            if (pageName != "born" &&
                pageName != "childhood" &&
                pageName != "youth" &&
                pageName != "elderly") { pageName = "childhood" }
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.texturesUrl = "image/walk/" + pageName + "/sprites.json";
            this.sprite.texture = PIXI.Texture.from("image/walk/" + pageName + "/player.png");
            this.sprite.anchor.set(0.5, 1);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(this._x, this._y);
            const self = this;
            onLoad();
            function onLoad() {
                console.log(self.texturesUrl);
                self.isLoaded = true;
                const texturesUrl = self.manager.resources[self.texturesUrl].spritesheet.textures;
                let textures = [];
                for (let i = 0; i < Object.keys(texturesUrl).length; i++) {
                    textures.push(texturesUrl[i + ".png"]);
                }
                self.anim = new PIXI.AnimatedSprite(textures);
                self.anim.anchor.set(0.5, 1);
                self.container.addChild(self.anim);
                self.anim.visible = false;
                self.breath = self.breathAnim();
            }
        }
    }
    resize() {
        gsap.killTweensOf(this.container.scale);
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
    }
    update() {
        if (!this.page.isZoomIn && this.isLoaded) { this.mouseMove(); }
    }
    mouseMove() {
        this.container.alpha = 1;
        let mx = math.Map(this.mouse.x, 0, this.w, -this.w / 2, this.w / 2) - this.page.container.position.x;
        if (mx > this.container.position.x + 50) {
            this.breath.pause();
            gsap.to(this.container, { duration: 0.5, x: "+=" + this.speed });
            this.sprite.visible = false;
            this.sprite.scale.set(this.scale, this.scale);
            this.anim.scale.set(this.scale, this.scale);
            this.anim.visible = true;
            this.anim.play();
        }
        else if (mx < this.container.position.x - 50) {
            this.breath.pause();
            gsap.to(this.container, { duration: 0.5, x: "-=" + this.speed });
            this.sprite.visible = false;
            this.sprite.scale.set(-this.scale, this.scale);
            this.anim.scale.set(-this.scale, this.scale);
            this.anim.visible = true;
            this.anim.play();
        }
        else {
            gsap.to(this.container, { duration: 0.5, x: "+=0" });
            this.sprite.visible = true;
            this.anim.visible = false;
            this.anim.stop();
            this.breath.play();
        }
    }
    breathAnim() {
        let tl = gsap.timeline({ repeat: -1 });
        tl.to(this.container.scale, { duration: 1.5, y: "-=0.02" });
        tl.to(this.container.scale, { duration: 1.5, y: "+=0.02" }, 1.75);
        return tl;
    }
    move(x, sw) {
        this.container.alpha = 0;
        /* let distance = this.container.position.x - x;
        let _x = x + ((sw / 2) * Math.sign(distance)) + (100 * Math.sign(distance));
        this.sprite.scale.set(this.scale * -Math.sign(distance), this.scale);
        gsap.to(this.container, { duration: (Math.abs(distance) / this.speed / 8), x: _x }); */
    }
}
export class Door extends linkObject {
    constructor(manager, page, x, y, url) {
        super(manager, page);
        this.name = "Door";
        this.x = x;
        this.y = y;
        this.url = url;
        this.zoomIn = 1;
        this.fadeText = "????????????";
    }
    clickEvent() {
        this.manager.app.stage.removeChild(this.page.children.background.caution);
        this.manager.toOtherPage(Page.home);
    }
}
export class Video extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0;
        this.y = 0;
        this.url = undefined;
        this.zoomIn = 1.6;
        this.fadeText = "??????????????????";
        this.spriteHeight = 10;
        this.videoList = [];
        this.uiOptions = {
            texturesUrl: "image/video/actionUI_sprites.json",
            frameUrl: "image/video/video.png",
            frameScale: 0.25,
            uiHitArea: 85, uiScale: 0.25,
            standard: -385, height: 260, space: 45,
            videoPos: [0, -7.4]
        }
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.random = Math.floor(Math.random() * this.videoList.length);
        this.container.scale.set(this.manager.canvasScale);
        this.manager.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.scale.set(this.manager.canvasScale);
        if (this.isClick && this.fullButton) { this.onClickResize(); }
        else { this.draw(); }
    }
    onClickResize() {
        if (this.cancel) {
            this.cancel.position.set((this.w * 0.5) - 60, (this.h * -0.5) + 60);
        }
        if (!this.fullButton.turn) {
            this.page.container.scale.set(this.zoomIn);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * this.zoomIn, (-this._y + this.zoomInPos[1]) * this.zoomIn);
        }
        else if (this.fullButton.turn) {
            let fz = 2.3;
            this.page.container.scale.set(fz);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * fz, ((-this._y + this.zoomInPos[1]) * fz) + 7.5);
        }
    }
    onClickUpdate() {
        if (this.video) this.video.update();
        if (this.fullButton.turn) {
            if (this.manager.mouse.x < 250) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: 0 });
            }
            else if (this.manager.mouse.x > 500) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: -250 });
            }
            if (this.manager.mouse.y > this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 126) / 2.3) });
            }
            else if (this.manager.mouse.y < this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: 0 });
            }
        }
        else {
            this.manager.uiSystem.container.position.x = 0;
            this.ui.position.set(0);
        }
    }
    clickEvent() {
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        sound.pause(this.page.name);
        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(this.uiOptions.videoPos[0], this.uiOptions.videoPos[1]);
        this.drawUI();
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
    cancelEvent() {
        this.pause();
        this.video.sound.remove();
        this.video.children.logo.cancelEvent();
        let tl = gsap.timeline({ onComplete: function () { this.sprite.interactive = true; }.bind(this) });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.video.container.removeChildren();
        this.container.removeChild(this.video.container, this.ui);

        this.page.isZoomIn = false;
        this.isClick = false;
        this.cancel.visible = false;
        this.video = undefined;
        this.cancel = undefined;
        if (this.fullButton.turn) {
            closeFullscreen();
            this.fullButton.turn = false;
        }
        gsap.killTweensOf(this.manager.uiSystem.container);
        this.manager.uiSystem.container.position.x = 0;
        sound.play(this.page.name);

        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.png', 0.5);
        this.cancel.zIndex = 150;
        this.cancel.position.set(_x, _y);
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 1);
        this.cancel.visible = false;
    }
    drawUI() {
        this.ui = new PIXI.Container();
        const self = this;
        const textures = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures;
        const uiScale = this.uiOptions.uiScale;
        const stan = this.uiOptions.standard;
        const h = this.uiOptions.height;
        const space = this.uiOptions.space;
        const videoPos = this.uiOptions.videoPos;
        this.frame = createSprite(this.uiOptions.frameUrl, 0.5, this.uiOptions.frameScale);
        this.ui.addChild(this.frame);
        this.playButton = drawPlayButton();
        this.volumeButton = drawVolumeButton();
        this.nextButton = drawNextButton();
        this.fullButton = drawFullButton();
        this.container.addChild(this.ui);
        function drawPlayButton() {
            let e = createSprite(textures["play.png"], 0.5, uiScale);
            e.position.set(stan, h);
            e.clickEvent = function () {
                if (self.video.children.video.isStart && !self.video.children.video.isPlayGame) {
                    if (self.video.videoCrol.paused) { self.play(); } else { self.pause(); }
                }
            }.bind(self);
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawVolumeButton() {
            let e = createSprite(textures["volume.png"], 0.5, uiScale);
            e.position.set(stan + space * 2, h);
            e.clickEvent = function () {
                if (self.video.videoCrol.muted) {
                    e.turn = false;
                    self.video.videoCrol.muted = false;
                    self.video.sound.muted = false;
                    e.texture = textures["volume.png"];
                }
                else {
                    e.turn = true;
                    self.video.videoCrol.muted = true;
                    self.video.sound.muted = true;
                    e.texture = textures["volume_off.png"];
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawNextButton() {
            let e = createSprite(textures["next.png"], 0.5, uiScale);
            e.position.set(stan + space * 1, h);
            e.clickEvent = function () {
                changeButtonInteractive(false);
                self.random++;
                if (self.random >= self.videoList.length) { self.random = 0 }
                deleteVideo();
                self.video = self.videoList[self.random]();
                self.video.setup();
                self.video.container.position.set(videoPos[0], videoPos[1]);
                self.video.videoCrol.muted = self.volumeButton.turn;
                changeButtonInteractive(true);
            }.bind(self);
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
            function deleteVideo() {
                self.video.children.logo.cancelEvent();
                self.video.children.ui.cancelEvent();
                self.pause();
                self.video.container.removeChildren();
                self.container.removeChild(self.video.container);
                self.video = undefined;
            }
            function changeButtonInteractive(bool) {
                self.playButton.interactive = bool;
                self.volumeButton.interactive = bool;
                self.nextButton.interactive = bool;
                self.fullButton.interactive = bool;
            }
        }
        function drawFullButton() {
            let e = createSprite(textures["full.png"], 0.5, uiScale);
            e.position.set(-stan, h);
            e.clickEvent = function () {
                if (e.turn) {
                    closeFullscreen();
                    e.turn = false;
                }
                else {
                    openFullscreen(document.documentElement);
                    e.turn = true;
                }
                function openFullscreen(elem) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                }
                function closeFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function addUIButtonEvent(e) {
            const uiHitArea = self.uiOptions.uiHitArea;
            e.hitArea = new PIXI.Rectangle(-uiHitArea, -uiHitArea, uiHitArea * 2, uiHitArea * 2);
            addPointerEvent(e);
        }
    }
    play() {
        this.video.videoCrol.play();
        this.video.sound.play();
        this.playButton.texture = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures["pause.png"];
    }
    pause() {
        this.video.videoCrol.pause();
        this.video.sound.pause();
        this.playButton.texture = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures["play.png"];
    }
    reload() {
        this.video.container.removeChildren();
        this.container.removeChild(this.video.container);

        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(0, -7.4);
        this.video.videoCrol.muted = this.volumeButton.turn;
    }
}
export class OtherObject extends GameObject {
    /**
     * @param {Manager} manager 
     * @param {string} name
     * @param {number} x 
     * @param {number} y 
     * @param {string} url 
     */
    constructor(manager, name, x, y, url) {
        super(manager);
        this.name = name;
        this.container.zIndex = 20;
        this.x = x;
        this.y = y;
        this.url = url;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
}

export class VideoPlayer extends Video {
    constructor(manager, page, videoFunc) {
        super(manager, page);
        this.x = 0;
        this.y = 0;
        this.videoFunc = videoFunc;
        this.videoScale = 0.6;
        this.zoomIn = 1;
        this.fullZoomIn = 1.67;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.bg = new PIXI.Graphics()
                .beginFill(ColorSlip.black, 0.2)
                .drawRect(0, 0, 1920, 1080)
                .endFill();
            this.bg.pivot.set(1920 / 2, 1080 / 2);
            this.bg.clickEvent = function () { this.cancelEvent(); }.bind(this);
            addPointerEvent(this.bg);
            gsap.from(this.bg, { duration: 1, alpha: 0 });
            this.container.zIndex = 110;
            this.container.addChild(this.bg);
            this.container.position.set(this._x, this._y);
        }
        this.uiOptions = {
            texturesUrl: "image/video/actionUI_sprites.json",
            frameUrl: "image/video/video.png",
            frameScale: 0.343,
            uiHitArea: 85, uiScale: 0.25,
            standard: -530, height: 360, space: 50
        }
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.manager.app.stage.addChildAt(this.container, 2);
        this.clickEvent();
    }
    update() {
        if (this.isClick) { this.onClickUpdate(); }
    }
    onClickUpdate() {
        this.video.update();
        if (this.fullButton.turn) {
            if (this.manager.mouse.x < 250) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: 0 });
            }
            else if (this.manager.mouse.x > 500) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: -250 });
            }
            if (this.manager.mouse.y > this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 150) / 2.3) });
            }
            else if (this.manager.mouse.y < this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: 0 });
            }
        }
        else {
            this.manager.uiSystem.container.position.x = 0;
            this.ui.position.set(0);
        }
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.scale.set(this.manager.canvasScale);
        if (this.cancel) {
            this.cancel.position.set((this.w * 0.5) - 60, (this.h * -0.5) + 60);
        }
        if (this.isClick && this.fullButton) { this.onClickResize(); }
    }
    onClickResize() {
        if (!this.fullButton.turn) {
            this.container.scale.set(this.zoomIn);
        }
        else if (this.fullButton.turn) {
            this.container.scale.set(this.fullZoomIn);
        }
    }
    clickEvent() {
        sound.pause(this.page.name);
        this.video = this.videoFunc(this.manager, this, this.videoScale);
        this.video.setup();
        this.drawUI();
        this.nextButton.interactive = false;
        this.nextButton.alpha = 0.5;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.isClick = true;
    }
    cancelEvent() {
        sound.pauseAll();
        sound.play(this.page.name);
        this.video.children.logo.cancelEvent();
        this.pause();
        this.video.container.removeChildren();
        this.container.removeChild(this.video.container, this.ui, this.bg);
        this.isClick = false;
        this.video = undefined;
        this.cancel.visible = false;
        this.manager.app.stage.removeChild(this.cancel);
        this.cancel = undefined;
        if (this.fullButton.turn) {
            closeFullscreen();
            this.fullButton.turn = false;
        }
        gsap.killTweensOf(this.manager.uiSystem.container);
        this.manager.uiSystem.container.position.x = 0;
        this.destroy();
        delete this;
        function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.png', 0.5);
        this.cancel.zIndex = 190;
        this.cancel.position.set(_x, _y);
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChild(this.cancel);
        this.manager.app.stage.sortChildren();
        this.cancel.visible = false;
    }
    drawUI() {
        this.ui = new PIXI.Container();
        const self = this;
        const textures = this.manager.resources[this.uiOptions.texturesUrl].spritesheet.textures;
        const uiScale = this.uiOptions.uiScale;
        const stan = this.uiOptions.standard;
        const h = this.uiOptions.height;
        const space = this.uiOptions.space;
        this.frame = createSprite(this.uiOptions.frameUrl, 0.5, this.uiOptions.frameScale);
        this.frame.position.set(0, 7.2);
        this.ui.addChild(this.frame);
        this.playButton = drawPlayButton();
        this.volumeButton = drawVolumeButton();
        this.nextButton = drawNextButton();
        this.fullButton = drawFullButton();
        this.container.addChild(this.ui);
        function drawPlayButton() {
            let e = createSprite(textures["play.png"], 0.5, uiScale);
            e.position.set(stan, h);
            e.clickEvent = function () {
                if (self.video.children.video.isStart && !self.video.children.video.isPlayGame) {
                    if (self.video.videoCrol.paused) { self.play(); } else { self.pause(); }
                }
            }.bind(self);
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawVolumeButton() {
            let e = createSprite(textures["volume.png"], 0.5, uiScale);
            e.position.set(stan + space * 2, h);
            e.clickEvent = function () {
                if (self.video.videoCrol.muted) {
                    e.turn = false;
                    self.video.videoCrol.muted = false;
                    self.video.sound.muted = false;
                    e.texture = textures["volume.png"];
                }
                else {
                    e.turn = true;
                    self.video.videoCrol.muted = true;
                    self.video.sound.muted = true;
                    e.texture = textures["volume_off.png"];
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawNextButton() {
            let e = createSprite(textures["next.png"], 0.5, uiScale);
            e.position.set(stan + space * 1, h);
            e.clickEvent = function () {
                self.random++;
                if (self.random >= self.videoList.length) { self.random = 0 }
                self.pause();
                self.container.removeChild(self.video.container);
                self.video = self.videoList[self.random]();
                self.video.setup();
                self.video.container.position.set(0, -7.4);
                self.video.videoCrol.muted = self.volumeButton.turn;
            }.bind(self);
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function drawFullButton() {
            let e = createSprite(textures["full.png"], 0.5, uiScale);
            e.position.set(-stan, h);
            e.clickEvent = function () {
                if (e.turn) {
                    closeFullscreen();
                    e.turn = false;
                }
                else {
                    openFullscreen(document.documentElement);
                    e.turn = true;
                }
                function openFullscreen(elem) {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen();
                    } else if (elem.webkitRequestFullscreen) { /* Safari */
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) { /* IE11 */
                        elem.msRequestFullscreen();
                    }
                }
                function closeFullscreen() {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) { /* Safari */
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { /* IE11 */
                        document.msExitFullscreen();
                    }
                }
            }.bind(self);
            e.turn = false;
            addUIButtonEvent(e);
            self.ui.addChild(e);
            return e;
        }
        function addUIButtonEvent(e) {
            const uiHitArea = self.uiOptions.uiHitArea;
            e.hitArea = new PIXI.Rectangle(-uiHitArea, -uiHitArea, uiHitArea * 2, uiHitArea * 2);
            addPointerEvent(e);
        }
    }
}