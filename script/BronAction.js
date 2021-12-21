import * as PIXI from 'pixi.js';
import { Action, ActionObject } from "./Action";
export default class BronAction extends Action {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.offset = 50;
        this.children = {
            "video" : new Video(manager,this),
            "line": new Line(manager, this),
            "rope": new Rope(manager, this)
        }
    }
    onRopeComplete() {
        if (this.children.rope.isFrist) return;
        let v = this.children.line.getPoints().slice().reverse();
        //let h = [...new Set(this.children.rope.history.map(e => JSON.stringify(e)))].map(e => JSON.parse(e));
        let h = this.children.rope.history;
        let mul = Math.floor(h.length / v.length) === 0 ? 1 : Math.floor(h.length / v.length);
        let b = v.map((_, i, v) => {
            return h.map((_, j, h) => {
                if (j < (i + 1) * mul && j >= i * mul) { return Math.abs(h[j].x - v[i].x) < this.offset && Math.abs(h[j].y - v[i].y) < this.offset; }
            }).some(e => e);
        });
        let bool = b.reduce((sum, e) => { if (e === true) return sum + 1; else return sum }) >= 8 ? true : false;
        console.log(bool);
        if (bool) {
            this.children.video.videoCrol.pause();
        }
    }
}

class Rope extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Rope";
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
            .beginFill(0xffffff)
            .drawCircle(0, 0, 5)
            .endFill()
        this.line = new PIXI.SimpleRope(this.manager.app.renderer.generateTexture(this.texture), this.points);
        //this.line.blendmode = PIXI.BLEND_MODES.ADD;
        this.container.addChild(this.line);
    }
    update() {
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
            this.action.onRopeComplete();
            this.isFrist = true;
            this.history = [];
        }
    }
}

class Line extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Line";
        this.lineStyle = {
            width: 5,
            color: 0xfff,
            cap: PIXI.LINE_CAP.ROUND,
            join: PIXI.LINE_JOIN.ROUND
        };
        this.line = new PIXI.Graphics()
            .lineStyle(this.lineStyle).moveTo(50, 50)
            .bezierCurveTo(50, 50, 200, 100, 100, 100);
        this.draw = function () {
            this.container.addChild(this.line);
        }
    }
    drawLine(options) {
        let Options = {
            lineStyle: this.lineStyle,
            draw: (line)=>{
                line.moveTo(200,200);
                line.bezierCurveTo(200, 200, 300, 100, 100, 100);
            },
            ...options
        }
        this.line.clear();
        this.line.lineStyle(Options.lineStyle);
        Options.draw(this.line);
    }
    getPoints() {
        let points = this.line.geometry.graphicsData[0].shape.points;
        let values = [];
        for (let i = 0; i < points.length; i += 2) {
            values.push({ x: points[i], y: points[i + 1] });
        }
        return values;
    }
}

class Video extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Video";
        this.draw = function () {
            this.loadVideo();
        };
    }
    loadVideo(){
        this.sprite = new PIXI.Sprite.from("video/V_20211021_114529_D0.mp4");
        this.videoCrol = this.sprite.texture.baseTexture.resource.source;
        this.videoCrol.loop = true;
        this.videoCrol.muted = true;
        this.container.addChild(this.sprite);
        console.log(this.videoCrol);
    }
}