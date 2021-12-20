import * as PIXI from 'pixi.js';
import { Action, ActionObject } from "./Action";
import * as gf from './GameFunction';
export default class BronAction extends Action {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.deviation = 15;
        this.children = {
            "line": new Line(manager, this),
            "rope": new Rope(manager, this)
        }
    }
    onRopeComplete() { //debug: h[i].x can not read
        if (this.children.rope.isFrist) return;
        let v = this.children.line.values.slice().reverse();
        let h = [...new Set(this.children.rope.history.map(e => JSON.stringify(e)))].map(e => JSON.parse(e));
        let mul = Math.floor(h.length / v.length) === 0 ? 1 : Math.floor(h.length / v.length);
        let bool = new Array(v.length);
        let boolint = 0;
        for (let i = 0; i < v.length; i++) {
            bool[i] = Math.abs(h[i * mul].x - v[i].x) < 10 && Math.abs(h[i * mul].y - v[i].y) < 10;
            if (bool[i]) boolint++;
        }
        console.log(mul, boolint, bool);
        console.log(v);
        console.log(h);
    }
}

class Rope extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Rope";
        this.isFrist = true;
        this.draw = function () {
            this.drawLine();
        }
    }
    drawLine() {
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
        this.line.blendmode = PIXI.BLEND_MODES.ADD;
        this.container.addChild(this.line);
    }
    update() {
        if (this.manager.mouse.isPressed) {
            if (this.isFrist) {
                gf.debounce(drawRope, 50);
                this.isFrist = false;
            }
        }
        else {
            this.action.onRopeComplete();
            this.isFrist = true;
            this.history = [];
        }
        function drawRope() {
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
    }
}

class Line extends ActionObject {
    constructor(manager, action) {
        super(manager, action);
        this.name = "Line";
        this.isFrist = true;
        this.line = new PIXI.Graphics()
            .lineStyle({
                width: 5,
                color: 0xfff,
                cap: PIXI.LINE_CAP.ROUND,
                join: PIXI.LINE_JOIN.ROUND
            }).moveTo(50, 50)
            .bezierCurveTo(50, 50, 200, 100, 100, 100);
        this.draw = function () {
            this.container.addChild(this.line);
        }
    }
    update() {
        if (this.isFrist) {
            this.isFrist = false;
            setTimeout(function () {
                let points = this.line.geometry.graphicsData[0].shape.points;
                this.values = [];

                for (let i = 0; i < points.length; i += 2) {
                    this.values.push({ x: points[i], y: points[i + 1] });
                }
                //console.log(this.values);
            }.bind(this), 500);
        }
    }
}