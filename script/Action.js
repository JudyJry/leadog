import * as PIXI from 'pixi.js';
import { sound } from '@pixi/sound';
import { PageObject, GameObject } from "./GameObject";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ColorSlip } from './ColorSlip';
import { TextStyle } from './TextStyle';
import { addPointerEvent, createSprite, createText } from "./GameFunction.js";
import { brightnessOverEvent } from './UI';

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
        this.w = 1920;
        this.h = 1080;
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.action.addChild(this.container);
    }
    resize() {
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
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
        this.draw = function (x = 0, y = 0) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite = createSprite("image/logo.png");
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
        this.isPlayGame = false;
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
                this.drawBg("white");
                this.bg.alpha = 1;
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
        this.isPlayGame = true;
        this.drawBg();
        gsap.to(this.bg, { duration: 1, alpha: 0.5 });
    }
    onClearGame() {
        this.isPlayGame = false;
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
        this.sound.volume = volume;
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
    }
}
export class ActionLine extends ActionObject {
    constructor(manager, action, linePoint) {
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
        this.linePoint = linePoint;
        this.container.zIndex = 10;
        this.container.alpha = 1;
        this.draw = function () {
            this.drawLine();
            this.drawHint();
            this.container.addChild(this.sprite);
            this.container.position.set(-this.w / 2, -this.h / 2);
            this.action.container.sortChildren();
        }
    }
    drawLine(p = this.linePoint) {
        this.sprite.moveTo(p[0], p[1]).bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
    }
    drawHint() {
        this.hint = createSprite(
            this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures["cursorHint.png"]
            , 0.5, 0.3);
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
        this.offset = 0.075;
        this.container.zIndex = 100;
        this.isFrist = true;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.draw = function () {
            this.drawRope();
        }
    }
    setup() {
        this.draw();
        this.container.name = this.name;
        this.container.scale.set(this.manager.canvasScale);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
        this.container.scale.set(this.manager.canvasScale);
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
        this.mask = new PIXI.Graphics();
        this.mask.beginFill(0xFF0000);
        this.mask.drawRect(0, 0, 1920, 1080);
        this.mask.endFill();
        this.mask.pivot.set(960, 540);
        this.action.addChild(this.mask);
        this.rope.mask = this.mask;
        this.container.addChild(this.rope);
        this.container.position.set(-this.w / 2, -this.h / 2);
    }
    onPlay() {
        if (this.manager.mouse.isPressed) {
            if (this.isFrist) {
                this.isFrist = false;
            }
            this.history.unshift({ x: this.manager.mouse.x, y: this.manager.mouse.y });
            console.log(`lineTo:${this.history[0].x},${this.history[0].y}`);
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
        let vv = c.line.getPoints().slice();
        let v = [vv.at(-1), vv[0]];
        let h = [this.history[0], this.history.at(-1)];
        let s = this.mask.getBounds();
        //console.log(`x:${s.x},y:${s.y},w:${s.width},h:${s.height}`);
        let isPass = v.map((_, i, v) => {
            let vx = Math.round((v[i].x / 1920) * 1000) / 1000;
            let vy = Math.round((v[i].y / 1080) * 1000) / 1000;
            //console.log(`---\novx:${v[i].x},ovy:${v[i].y},\nnvx:${vx},nvy:${vy}`);
            return h.map((_, j, h) => {
                let hx = Math.round(((h[j].x - s.x) / s.width) * 1000) / 1000;
                let hy = Math.round(((h[j].y - s.y) / s.height) * 1000) / 1000;
                //console.log(`ohx:${h[j].x},ohy:${h[j].y},\nnhx:${hx},nhy:${hy}`);
                return Math.abs(hx - vx) < this.offset && Math.abs(hy - vy) < this.offset;
            }).some(e => e);
        }).some(e => e);
        console.log(`RopeComplete:${isPass}`);
        if (isPass) {
            this.action.isPlayGame = false;
            this.onClearGame();
            c.video.onClearGame();
            c.ui.onClearGame();
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
        e.overEvent = brightnessOverEvent;
        addPointerEvent(e);
    }
    clickEvent(_) { alert("click " + this.name); }
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
        const textures = this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures;
        this.textureList = [
            textures["count5.png"],
            textures["count4.png"],
            textures["count3.png"],
            textures["count2.png"],
            textures["count1.png"],
        ]
        this.draw = function () {
            let _x = (0.5 * this.w) - 100;
            let _y = (-0.5 * this.h) + 100;
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
        this.draw = function () {
            let _x = (-0.5 * this.w) + 300;
            let _y = (0.5 * this.h) - 150;
            this.sprite = createSprite(
                this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures["Goodjob.png"],
                0.5, this.scale);
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
    constructor(manager, action, text, uiUrl = "image/video/actionUI_sprites.json") {
        super(manager, action);
        this.name = "ActionStart";
        this.isNotStart = true;
        this.uiUrl = uiUrl;
        this.draw = function () {
            this.sprite = createSprite(
                this.manager.resources["image/video/actionUI_sprites.json"].spritesheet.textures["know.png"]
                , 0.5, this.scale);
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
                    this.action.removeChild(this.action.children.video.bg);
                    this.action.children.video.drawBg();
                    this.action.obj.playButton.texture =
                        this.manager.resources[this.uiUrl].spritesheet.textures["pause.png"];
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

            const videoData = this.action.videoData.name.split("_");
            this.manager.userData[videoData[0]].video[videoData[1]] = true;;
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
        if (this.action.obj.random === this.action.obj.videoList.length - 1) { this.action.obj.random = 0 }
        else { this.action.obj.random += 1 }
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
export class ActionLinsStage extends ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.linePoint = undefined;
        this.titleUrl = undefined;
        this.hintUrl = undefined;
        this.hintPos = [0.284, 0.397];
        this.draw = function () {
            this.drawline();
            this.drawStage();
            this.drawRope();
        }
    }
    drawRope() {
        this.action.children.rope = new ActionRope(this.manager, this.action);
        this.action.children.rope.setup();
    }
    drawline() {
        this.action.children.line = new ActionLine(this.manager, this.action, this.linePoint);
        this.action.children.line.setup();
    }
    drawStage() {
        this.countdown = new ActionCountDown(this.manager, this.action, this);
        this.countdown.setup();
        let title = createSprite(this.titleUrl, [1, 0.5], this.scale);
        let hint = createSprite(this.hintUrl, 0.5, this.scale);
        title.position.set((0.5 * this.w) - 150, (-0.5 * this.h) + 95);
        this.setPosition(hint, this.hintPos[0], this.hintPos[1]);

        this.container.addChild(title, hint);
        this.container.alpha = 0;
        gsap.to(this.container, { duration: 1, alpha: 1 });
    }
    onClearGame() {
        let gj = new ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                this.action.removeChild(this.action.children.line.container);
                this.action.removeChild(this.action.children.rope.container);
                this.action.children.line.hintGsap.kill();
                delete this.action.children.rope;
                delete this.action.children.line;
                delete this.action.children.ui;
            }.bind(this)
        });
    }
    update() {
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}
export class ActionButtonStage extends ActionUI {
    constructor(manager, action) {
        super(manager, action);
        this.scale = 1;
        this.titleUrl = "image/video/youth/bus/stage_1_title.png";
        this.hintUrl = "image/video/youth/bus/stage_1_hint.png";
        this.hintPos = [0.284, 0.397];
        this.draw = function () {
            this.drawStage();
        }
    }
    drawStage() {
        this.countdown = new ActionCountDown(this.manager, this.action, this);
        this.countdown.setup();
        let title = createSprite(this.titleUrl, [1, 0.5], this.scale);
        let hint = createSprite(this.hintUrl, 0.5, this.scale);
        title.position.set((0.5 * this.w) - 150, (-0.5 * this.h) + 95);
        this.setPosition(hint, this.hintPos[0], this.hintPos[1]);

        this.container.addChild(title, hint);
        this.container.alpha = 0;
        gsap.to(this.container, { duration: 1, alpha: 1 });
    }

    onClearGame() {
        let gj = new ActionGoodjob(this.manager, this.action);
        gj.setup();
        gsap.to(this.container, {
            duration: 1, alpha: 0,
            onComplete: function () {
                this.action.removeChild(this.container);
                delete this.action.children.ui;

            }.bind(this)
        });
    }
    update() {
        this.button.update();
        try {
            if (Math.floor(this.countdown.times) > 5) {
                this.action.removeChild(this.countdown.container);
                this.countdown.sprite.destroy();
                this.countdown.container.destroy();
                this.countdown = undefined;
            }
            else {
                this.countdown.update();
            }
        }
        catch {
            this.countdown = new ActionCountDown(this.manager, this.action, this);
            this.countdown.setup();
        }
    }
}