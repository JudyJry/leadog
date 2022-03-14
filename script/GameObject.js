import * as PIXI from "pixi.js";
import gsap from "gsap";
import { TextStyle } from "./TextStyle.js";
import { FilterSet } from "./FilterSet.js";
import { addPointerEvent, createSprite, createText } from "./GameFunction.js";
import { math } from "./math.js";
import { Page } from "./Data.js";
import Manager from "./Manager.js";


export class PageObject {
    constructor(manager) {
        this.manager = manager;
        this.name = this.constructor.name;
        this.container = new PIXI.Container();
        this.children = {};
    }
    setup() {
        this.container.name = this.name;
        return new Promise(function (resolve, _) {
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.manager.app.stage.addChild(this.container);
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
        this.draw = function () {
            this.wall = {
                "right": (-this.w / 2) + ((this.space / 10) + this.speed),
                "left": (this.w / 2) - ((this.space / 10) + this.speed)
            }
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.manager.canvasScale = this.w / width <= this.h / height ? this.w / width : this.h / height;
            this.container.addChild(this.sprite);
            this.page.container.position.x = this.wall.left;
        }
    }
    update() {
        if (!this.page.isZoomIn) {
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
        this.fadeText = "點擊認識"
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
    update() {
        if (this.page.isZoomIn) {
            this.blink.outerStrength = 0;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
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
        this.container.scale.set(this.manager.canvasScale);
    }
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
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: -this._y * this.zoomIn }, 0);
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
    }
    /* drawCancel() {
        let ch = this.sprite.height / 2;
        let cw = this.sprite.width / 2;
        this.cancel = createSprite('image/cancel.svg', 0.5, this.scale);
        this.cancel.position.set(cw + 50, -ch + 60);
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.container.addChild(this.cancel);
        this.cancel.visible = false;
    } */
    drawCancel() {
        let _x = (this.w * 0.5) - 60;
        let _y = (this.h * -0.5) + 60;
        this.cancel = createSprite('image/cancel.svg', 0.5);
        this.cancel.position.set(_x, _y);
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
    constructor(manager, page) {
        super(manager);
        this.page = page;
        this.name = "Player";
        this.mouse = this.manager.mouse;
        this.container.zIndex = 90;
        this.scale = 0.5;
        this.x = -0.412;
        this.y = 0.119;
        this.speed = 25;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from("image/player.svg");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
    update() {
        if (!this.page.isZoomIn) { this.mouseMove(); }
    }
    mouseMove() {
        this.container.alpha = 1;
        let mx = math.Map(this.mouse.x, 0, this.w, -this.w / 2, this.w / 2) - this.page.container.position.x;
        if (mx > this.container.position.x + 50) {
            gsap.to(this.container, { duration: 0.5, x: "+=" + this.speed });
            this.sprite.scale.set(this.scale, this.scale);
        }
        else if (mx < this.container.position.x - 50) {
            gsap.to(this.container, { duration: 0.5, x: "-=" + this.speed });
            this.sprite.scale.set(-this.scale, this.scale);
        }
        else {
            gsap.to(this.container, { duration: 0.5, x: "+=0" });
        }
    }
    breath() {
        let tl = gsap.timeline({ repeat: -1 });
        tl.to(this.container.scale, { duration: 1.5, y: "-=0.05" });
        tl.to(this.container.scale, { duration: 1.5, y: "+=0.05" }, 2);
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
        this.fadeText = "離開房間";
    }
    clickEvent() {
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
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.videoList = [];
        this.uiScale = 0.25;
        this.uiHitArea = 85;
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
        if (this.isClick && this.fullButton) {
            if (!this.fullButton.turn) {
                this.page.container.scale.set(this.zoomIn);
                this.page.container.position.set(-this._x * this.zoomIn, -this._y * this.zoomIn);
            }
            else if (this.fullButton.turn) {
                let fz = 2.3;
                this.page.container.scale.set(fz);
                this.page.container.position.set(-this._x * fz, (-this._y * fz) + 7.5);
            }
        }
    }
    update() {
        if (this.page.isZoomIn) {
            this.blink.outerStrength = 0;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            if (this.isClick) {
                this.video.update();
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
        }
        else if (this.sprite.isPointerOver) {
            this.blink.outerStrength = 5;
        }
        else {
            this.blink.effect();
        }
    }
    clickEvent() {
        this.sprite.interactive = false;
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: -this._y * this.zoomIn }, 0);
        this.page.children.player.move(this._x, this.sprite.width);

        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(0, -7.4);
        this.drawUI();
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
    cancelEvent() {
        this.video.children.logo.cancelEvent();
        let tl = gsap.timeline({ onComplete: function () { this.sprite.interactive = true; }.bind(this) });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.scale, y: this.scale });
        tl.to(this.page.container, { duration: 0.5, x: -this._x / 2, y: 0 }, 0);
        this.pause();
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
        this.cancel = createSprite('image/cancel.svg', 0.5);
        this.cancel.position.set(_x, _y);
        this.cancel.clickEvent = this.cancelEvent.bind(this);
        addPointerEvent(this.cancel);
        this.manager.app.stage.addChildAt(this.cancel, 1);
        this.cancel.visible = false;
    }
    drawUI() {
        this.ui = new PIXI.Container();
        this.frame = createSprite("image/video/video.png", 0.5, this.uiScale);
        this.playButton = createSprite("image/video/play.png", 0.5, this.uiScale);
        this.volumeButton = createSprite("image/video/volume.png", 0.5, this.uiScale);
        this.nextButton = createSprite("image/video/next.png", 0.5, this.uiScale);
        this.fullButton = createSprite("image/video/full.png", 0.5, this.uiScale);

        let standard = -385;
        let h = 260;
        let space = 45;
        this.playButton.position.set(standard, h);
        this.nextButton.position.set(standard + space * 1, h);
        this.volumeButton.position.set(standard + space * 2, h);
        this.fullButton.position.set(-standard, h);

        this.playButton.clickEvent = function () {
            if (this.video.children.video.isStart && !this.video.children.video.isPlayGame) {
                if (this.video.videoCrol.paused) { this.play(); } else { this.pause(); }
            }
        }.bind(this);

        this.nextButton.clickEvent = function () {
            if (this.random === this.videoList.length - 1) { this.random = 0 }
            else { this.random += 1 }
            this.pause();
            this.container.removeChild(this.video.container);
            this.video = this.videoList[this.random]();
            this.video.setup();
            this.video.container.position.set(0, -7.4);
            this.video.videoCrol.muted = this.volumeButton.turn;
        }.bind(this);

        this.volumeButton.clickEvent = function () {
            if (this.video.videoCrol.muted) {
                this.volumeButton.turn = false;
                this.video.videoCrol.muted = false;
                this.video.sound.volume = 0.5;
                this.volumeButton.texture = PIXI.Texture.from("image/video/volume.png");
            }
            else {
                this.volumeButton.turn = true;
                this.video.videoCrol.muted = true;
                this.video.sound.volume = 0;
                this.volumeButton.texture = PIXI.Texture.from("image/video/volume_off.png");
            }
        }.bind(this);
        this.volumeButton.turn = false;

        this.fullButton.clickEvent = function () {
            if (this.fullButton.turn) {
                closeFullscreen();
                this.fullButton.turn = false;
            }
            else {
                openFullscreen(document.documentElement);
                this.fullButton.turn = true;
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
        }.bind(this);
        this.fullButton.turn = false;

        this.playButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.volumeButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.nextButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.fullButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        addPointerEvent(this.playButton);
        addPointerEvent(this.volumeButton);
        addPointerEvent(this.nextButton);
        addPointerEvent(this.fullButton);

        this.ui.addChild(this.frame, this.playButton, this.volumeButton, this.nextButton, this.fullButton);
        this.container.addChild(this.ui);
    }
    play() {
        this.video.videoCrol.play();
        this.video.sound.play();
        this.playButton.texture = PIXI.Texture.from("image/video/pause.png");
    }
    pause() {
        this.video.videoCrol.pause();
        this.video.sound.pause();
        this.playButton.texture = PIXI.Texture.from("image/video/play.png");
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