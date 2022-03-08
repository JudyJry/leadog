import * as PIXI from 'pixi.js';
import { sound } from '@pixi/sound';
import { PageObject, GameObject } from "./GameObject";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ColorSlip } from './ColorSlip';
import { TextStyle } from './TextStyle';
import { addPointerEvent, createSprite, createText } from "./GameFunction.js";

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

export class ActionPage extends PageObject {
    constructor(manager, obj) {
        super(manager);
        this.obj = obj;
        this.name = "ActionPage";
        this.isPlayGame = false;
        this.videoScale = 0.44;
    }
    drawBg() {
        let bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        bg.anchor.set(0.5);
        bg.width = 1920;
        bg.height = 1080;
        return bg;
    }
    setup() {
        this.container.name = this.name;
        return new Promise(function (resolve, _) {
            this.container.addChild(this.drawBg());
            for (let [_, e] of Object.entries(this.children)) { e.setup(); }
            this.obj.container.addChildAt(this.container, 1);
            this.container.scale.set(this.videoScale);
            resolve();
        }.bind(this))
    }
    resize() { }
    update() {
        for (let [_, e] of Object.entries(this.children)) { e.update(); }
    }
    /**
     * @returns {PIXI.Sprite}
     */
    get videoSprite() { return this.children.video.sprite }
    /**
     * @returns {HTMLVideoElement}
     */
    get videoCrol() { return this.children.video.videoCrol }
    /**
     * @returns {ActionSound}
     */
    get sound() { return this.children.sound }
}
class ActionObject extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
        this.name = "ActionObject";
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.action.addChild(this.container);
    }
}
export class LogoVideo extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "LogoVideo";
        this.onEnd = function () {
            this.action.children.ui.start();
            this.action.children.sound.play();
            this.action.removeChild(this.container);
        }.bind(this);
        this.draw = function (x = 0, y = -0.1) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite = createSprite("image/logo@2x.png", 0.5, 2);
            this.container.addChild(this.sprite);
            this.container.position.set(_x, _y);
            let tl = gsap.timeline();
            tl.from(this.sprite, { duration: 2, alpha: 0 });
            tl.from(this.sprite, { duration: 2, alpha: 1, onComplete: this.onEnd });
        }
    }
    cancelEvent() {
        gsap.killTweensOf(this.sprite);
    }
}
export class ActionVideo extends ActionObject {
    constructor(manager, action, url) {
        super(manager, action);
        this.name = "Video";
        this.bg = new PIXI.Graphics();
        this.scale = 1;
        this.draw = function () {
            let promise = new Promise(function (resolve, _) {
                this.loadVideo(url);
                resolve();
            }.bind(this));
            promise.then(function () {
                this.videoCrol.pause();
                this.videoCrol.currentTime = 0;
                this.videoCrol.ontimeupdate = () => {
                    this.currentTime = this.videoCrol.currentTime;
                };
                this.drawBg();
                this.count = 0;
                this.isEnd = false;
                console.log("load " + this.name);
            }.bind(this)).catch(function () {
                console.error("fall load " + this.name);
            }.bind(this));
        }
    }
    loadVideo(url, x = 0, y = 0) {
        let _x = (x * this.w);
        let _y = (y * this.h);

        this.sprite = new PIXI.Sprite.from(url);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.videoTexture = this.sprite.texture.baseTexture;
        this.videoCrol = this.videoTexture.resource.source;
        this.videoTexture.autoPlay = false;
        this.videoTexture.resource.autoPlay = false;
        this.videoCrol.muted = this.manager.isMute;
        this.currentTime = this.videoCrol.currentTime;
        this.container.addChild(this.sprite);
        this.container.position.set(_x, _y);
        this.container.alpha = 0;
    }
    drawBg(color = "black") {
        let w = this.w >= 1920 ? this.w : 1920;
        let h = this.h >= 1080 ? this.h : 1080;
        this.bg.clear();
        this.bg
            .beginFill(ColorSlip[color])
            .drawRect(-w / 2, -h / 2, w, h);
        this.bg.alpha = 0;
        this.container.addChild(this.bg);
    }
    onPlayGame() {
        this.pause();
        gsap.to(this.bg, { duration: 1, alpha: 0.5 });
    }
    onClearGame() {
        gsap.to(this.bg, { duration: 1, alpha: 0, onComplete: function () { this.play(); }.bind(this) });
    }
    test() {
        if (this.manager.keyboard.key["Space"] && !this.videoCrol.paused) { this.pause(); }
        else if (this.manager.keyboard.key["Space"] && this.videoCrol.paused) { this.play(); }
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        this.videoCrol.muted = this.manager.isMute;
    }
    play() {
        this.videoCrol.play();
    }
    pause() {
        this.videoCrol.pause();
    }
    onEnd() {
        this.drawBg("white");
        gsap.to(this.bg, {
            duration: 3, alpha: 1, onComplete: function () {
                this.action.children.ui = this.action.end;
                this.action.children.ui.setup();
                this.action.children.ui.end();
                this.videoCrol.ontimeupdate = undefined;
                this.pause();
                this.videoCrol.currentTime = 0;
            }.bind(this)
        });
    }

}
export class ActionSound {
    constructor(manager, action, name, url, volume = 0.5) {
        this.manager = manager;
        this.action = action;
        this.name = name;
        this.sound = sound.add(name, url);
        this.sound.loop = true;
        this.sound.volume = this.manager.isMute ? 0 : volume;
        this.volume = volume;
        this.isEnd = false;
    }
    play() { this.sound.play(); console.log('%s:play', this.name); }
    pause() { this.sound.pause(); console.log('%s:pause', this.name); }
    onEnd() {
        if (this.sound.volume <= 0) {
            this.sound.pause();
        } else {
            this.sound.volume -= 0.2 * this.manager.deltaTime;
        }
    }
    setup() { }
    resize() { }
    update() {
        if (this.isEnd) { this.onEnd(); }
        else this.sound.volume = this.manager.isMute ? 0 : this.volume;
    }
}
export class ActionLine extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Line";
        this.isFrist = true;
        this.lineStyle = {
            width: 5,
            color: ColorSlip.white,
            cap: PIXI.LINE_CAP.ROUND,
            join: PIXI.LINE_JOIN.ROUND
        };
        this.sprite = new PIXI.Graphics().lineStyle(this.lineStyle);
        this.container.zIndex = 10;
        this.container.alpha = 1;
    }
    drawHint() {
        this.hint = createSprite("image/video/cursorHint.png", 0.5, 0.3);
        this.container.addChild(this.hint);
    }
    hintAnim() {
        if (this.hint)
            this.hintGsap = gsap.to(this.hint, {
                duration: 1, repeat: -1, motionPath: {
                    path: this.getPoints(),
                    fromCurrent: false,
                    offsetX: -50,
                    offsetY: 50
                }
            });
    }
    getPoints() {
        if (this.values) return this.values;
        let points = this.sprite.geometry.graphicsData[0].shape.points;
        let values = [];
        for (let i = 0; i < points.length; i += 2) {
            values.push({ x: points[i], y: points[i + 1] });
        }
        this.values = values;
        return this.values;
    }
    update() {
        if (this.action.isPlayGame && this.isFrist) {
            gsap.to(this.container, { duration: 0.5, alpha: 1 });
            this.hintAnim();
            this.isFrist = false;
        }
        else if (!this.action.isPlayGame) {
            this.container.alpha = 0;
        }
    }
}
export class ActionRope extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Rope";
        this.offset = 100;
        this.container.zIndex = 100;
        this.isFrist = true;
        this.draw = function () {
            this.drawRope();
        }
    }
    drawRope() {
        this.points = [];
        this.history = [];
        this.ropeSize = 100;
        for (let i = 0; i < this.ropeSize; i++) {
            this.points.push(new PIXI.Point(0, 0));
        }
        this.texture = new PIXI.Graphics()
            .beginFill(ColorSlip.lightOrange)
            .drawCircle(0, 0, 5)
            .endFill()
        this.rope = new PIXI.SimpleRope(this.manager.app.renderer.generateTexture(this.texture), this.points);
        //this.rope.blendmode = PIXI.BLEND_MODES.ADD;
        this.container.addChild(this.rope);
        this.container.position.set(-this.w / 2, -this.h / 2);
    }
    onPlay() {
        if (this.manager.mouse.isPressed) {
            if (this.isFrist) {
                this.isFrist = false;
            }
            console.log(`lineTo:${this.manager.mouse.x},${this.manager.mouse.y}`);
            this.history.unshift({ x: this.manager.mouse.x, y: this.manager.mouse.y });
            for (let i = 0; i < this.ropeSize; i++) {
                try {
                    this.points[i].x = this.history[i].x;
                    this.points[i].y = this.history[i].y;
                }
                catch {
                    this.points[i].x = undefined;
                    this.points[i].y = undefined;
                }
            }
        }
        else {
            if (this.isFrist == false) {
                this.onRopeComplete();
                this.isFrist = true;
            }
            this.history = [];
        }
    }
    onClearGame() {
        this.history = [];
        for (let i = 0; i < this.ropeSize; i++) {
            this.points[i].x = 0;
            this.points[i].y = 0;
        }
    }
    onRopeComplete(c = this.action.children) {
        if (!c) return;
        let v = c.line.getPoints().slice().reverse();
        //let h = [...new Set(c.rope.history.map(e => JSON.stringify(e)))].map(e => JSON.parse(e));
        let h = c.rope.history;
        let mul = Math.floor(h.length / v.length) === 0 ? 1 : Math.floor(h.length / v.length);
        let isPass = v.map((_, i, v) => {
            return h.map((_, j, h) => {
                if (j < (i + 1) * mul && j >= i * mul) { return Math.abs(h[j].x - v[i].x) < this.offset && Math.abs(h[j].y - v[i].y) < this.offset; }
            }).some(e => e);
        }).reduce((sum, e) => { if (e === true) return sum + 1; else return sum }) >= v.length / 2 ? true : false;
        console.log(`RopeComplete:${isPass}`);
        if (isPass) {
            this.action.isPlayGame = false;
            c.video.onClearGame();
            c.ui.onClearGame();
            this.onClearGame();
        }
    }
    update() {
        if (this.action.isPlayGame) this.onPlay();
    }
}
export class ActionUI extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "ActionUI";
        this.ts = TextStyle.Act;
        this.tsm = TextStyle.Act_small;
        this.scale = 0.5;
    }
    setPosition(e, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        e.position.set(_x, _y);
    }
    setInteract(e = this.sprite) {
        e.clickEvent = this.clickEvent.bind(this);
        e.overEvent = this.overEvent.bind(this);
        addPointerEvent(e);
    }
    clickEvent(_) { alert("click " + this.name); }
    overEvent(e) {
        if (e.isPointerOver) {
            gsap.killTweensOf(e);
            gsap.to(e, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.killTweensOf(e);
            gsap.to(e, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() { }
}
export class ActionCountDown extends ActionObject {
    constructor(manager, action, stage) {
        super(manager, action);
        this.stage = stage;
        this.name = "ActionCountDown";
        this.scale = 0.25;
        this.times = 0;
        this.textureList = [
            PIXI.Texture.from("image/video/count5.png"),
            PIXI.Texture.from("image/video/count4.png"),
            PIXI.Texture.from("image/video/count3.png"),
            PIXI.Texture.from("image/video/count2.png"),
            PIXI.Texture.from("image/video/count1.png"),
        ]
        this.draw = function (x = 0.45, y = -0.42) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = this.textureList[0];
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.sprite.position.set(_x, _y);
        }
    }
    setup() {
        this.draw();
        this.stage.container.addChild(this.sprite);
    }
    update() {
        this.times += this.manager.deltaTime;
        this.sprite.texture = this.textureList[Math.floor(this.times)];
    }
}
export class ActionGoodjob extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "ActionGoodjob";
        this.scale = 0.2;
        this.draw = function (x = -0.3, y = 0.35) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite = createSprite("image/video/Goodjob.png", 0.5, this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(_x, _y);
        }
    }
    setup() {
        this.draw();
        this.action.addChild(this.container);
        let tl = gsap.timeline({
            onComplete: function () {
                this.action.removeChild(this.container);
                this.container.destroy({ children: true });
                this.destroy();
            }.bind(this)
        });
        tl.to(this.sprite.scale, { duration: 0.5, x: 0.6, y: 0.6, ease: "back.out(1.7)" });
        tl.to(this.sprite.scale, { duration: 0.5, x: 0, y: 0, ease: "back.in(1.7)" }, "+=1");
    }
}

export class ActionStart extends ActionUI {
    constructor(manager, action, text) {
        super(manager, action);
        this.name = "ActionStart";
        this.isNotStart = true;
        this.draw = function () {
            this.sprite = createSprite("image/video/know.png", 0.5, this.scale);
            this.setPosition(this.sprite, 0, 0.3);
            this.sprite.alpha = 0;

            let textTitle = createText("任務目標", this.ts);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = createText(text, this.tsm);
            this.setPosition(textDescribe, 0, 0);
            this.container.addChild(textTitle, textDescribe, this.sprite);
            this.container.alpha = 0;
        }
    }
    start() {
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 }, 1);
        tl.to(this.sprite, {
            duration: 1, alpha: 1,
            onComplete: function () { this.setInteract(this.sprite); }.bind(this)
        }, "+=0.5");
    }
    clickEvent() {
        if (this.isNotStart) {
            this.isNotStart = false;
            gsap.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.action.removeChild(this.container);
                    this.action.children.video.isStart = true;
                    this.action.children.video.play();
                }.bind(this)
            });
        }
    }
}
export class ActionEnd extends ActionUI {
    constructor(manager, action, text) {
        super(manager, action);
        this.name = "ActionEnd";
        this.isNotStart = true;
        this.draw = function () {
            let textTitle = createText("任務完成", this.ts);
            this.setPosition(textTitle, 0, -0.3);
            let textDescribe = createText(text, this.tsm);
            this.setPosition(textDescribe, 0, 0);
            this.container.addChild(textTitle, textDescribe);
            this.container.alpha = 0;
        }
    }
    draw2() {
        this.sprite.texture = PIXI.Texture.from("image/TGDAlogo.png");
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(1.5);
        this.setPosition(this.sprite, -0.018, -0.012);

        this.container.removeChildren();
        let text1 = createText("感謝", this.tsm);
        this.setPosition(text1, -0.156, 0);
        let text2 = createText("協助拍攝", this.tsm);
        this.setPosition(text2, 0.146, 0);
        this.container.addChild(text1, text2, this.sprite);
        this.container.alpha = 0;
    }
    end() {
        this.action.children.sound.isEnd = true;
        let tl = gsap.timeline();
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.draw2();
            }.bind(this)
        }, "+=2");
        tl.to(this.container, { duration: 1, alpha: 1 });
        tl.to(this.container, {
            duration: 1, alpha: 0, onComplete: function () {
                this.action.removeChild(this.container);
                delete this.action.children.ui;
                this.action.obj.cancelEvent();
                this.manager.uiSystem.container.position.set(0);
            }.bind(this)
        }, "+=2");
    }
}