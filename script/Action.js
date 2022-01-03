import * as PIXI from 'pixi.js';
import { PageObject, GameObject } from "./GameObject";
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { ColorSlip } from './ColorSlip';

gsap.registerPlugin(PixiPlugin);
gsap.registerPlugin(MotionPathPlugin);
PixiPlugin.registerPIXI(PIXI);

export class ActionPage extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ActionPage";
        this.isPlayGame = false;
    }
}
export class LogoVideo extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
        this.name = "LogoVideo";
        this.draw = function () {
            this.loadVideo();
        }
    }
    loadVideo(x = 0, y = 0) {
        let _x = (x * this.w);
        let _y = (y * this.h);

        this.sprite = new PIXI.Sprite.from("video/LOGO.mp4");
        this.sprite.anchor.set(0.5);
        this.videoTexture = this.sprite.texture.baseTexture;
        this.videoCrol = this.videoTexture.resource.source;
        this.videoCrol.muted = false;
        this.container.addChild(this.sprite);
        this.container.position.set(_x, _y);
    }
    update() {
        if (this.videoCrol.ended) {
            gsap.to(this.container, {
                duration: 1, alpha: 0, onComplete: function () {
                    this.onEnd();
                }.bind(this)
            });
        }
    }
    onEnd() { }
}
export class ActionVideo extends GameObject {
    constructor(manager, action, url) {
        super(manager);
        this.action = action;
        this.name = "Video";
        this.isStart = false;
        this.bg = new PIXI.Graphics();
        this.draw = function () {
            this.loadVideo(url, 0, 0);
            this.drawBg();
        }
    }
    loadVideo(url, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);

        this.sprite = new PIXI.Sprite.from(url);
        this.sprite.anchor.set(0.5);
        this.videoTexture = this.sprite.texture.baseTexture;
        this.videoCrol = this.videoTexture.resource.source;
        this.videoTexture.autoPlay = false;
        this.videoTexture.resource.autoPlay = false;
        this.videoCrol.muted = false;
        this.currentTime = this.videoCrol.currentTime;
        this.container.addChild(this.sprite);

        this.container.position.set(_x, _y);
        this.videoCrol.ontimeupdate = () => {
            this.currentTime = this.videoCrol.currentTime;
        };
    }
    drawBg(color = "black") {
        this.bg.clear();
        this.bg
            .beginFill(ColorSlip[color])
            .drawRect(-this.w / 2, -this.h / 2, this.w, this.h);
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
        if (this.manager.mouse.isPressed && this.isStart) {
            if (!this.videoCrol.paused) { this.pause(); }
            else { this.play(); }
        }
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        //if (this.videoCrol.ended) this.onEnd();
    }
    play() {
        this.videoCrol.play();
    }
    pause() {
        this.videoCrol.pause();
    }
    onEnd() { console.log("video end."); }
}
export class ActionLine extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
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
        this.hint = PIXI.Sprite.from("image/video/cursorHint.png");
        this.hint.anchor.set(0.5);
        this.hint.scale.set(0.3);
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
export class ActionRope extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
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
            //console.log(`lineTo:${this.manager.mouse.x},${this.manager.mouse.y}`);
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
export class ActionUI extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
        this.name = "ActionUI";
        this.UItextStyle = new PIXI.TextStyle({
            fontFamily: "GenSenRounded-B",
            fontSize: 54,
            fill: 0x666803,
            align: "center"
        });
        this.UItextStyleSmall = new PIXI.TextStyle({
            fontFamily: "GenSenRounded-B",
            fontSize: 36,
            fill: 0x666803,
            align: "center",
            lineHeight: 60
        })
        this.scale = 0.5;
    }
    setPosition(e, x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        e.position.set(_x, _y);
    }
    setInteract(e = this.sprite) {
        e.interactive = true;
        e.buttonMode = true;

        e.on("pointertap", onTap.bind(this));
        e.on("pointerover", onOver.bind(this));
        e.on("pointerout", onOut.bind(this));

        function onTap(event) { this.clickEvent(); }
        function onOver(event) { this.isPointerOver = true; }
        function onOut(event) { this.isPointerOver = false; }
    }
    clickEvent() { alert("click " + this.name); }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        if (this.isPointerOver) {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.sprite, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
export class ActionCountDown extends GameObject {
    constructor(manager, action, stage) {
        super(manager);
        this.action = action;
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
export class ActionGoodjob extends GameObject {
    constructor(manager, action) {
        super(manager);
        this.action = action;
        this.name = "ActionGoodjob";
        this.scale = 0.2;
        this.draw = function (x = -0.3, y = 0.35) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/video/Goodjob.png");
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.container.addChild(this.sprite);
            this.container.position.set(_x, _y);
        }
    }
    setup() {
        this.draw();
        this.manager.addChild(this.container);
        let tl = gsap.timeline({
            onComplete: function () {
                this.manager.removeChild(this.container);
                this.container.destroy({ children: true });
                delete this;
            }.bind(this)
        });
        tl.to(this.sprite.scale, { duration: 0.5, x: 0.6, y: 0.6, ease: "back.out(1.7)" });
        tl.to(this.sprite.scale, { duration: 0.5, x: 0, y: 0, ease: "back.in(1.7)" }, "+=1");
    }
} 