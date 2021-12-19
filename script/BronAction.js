import * as PIXI from 'pixi.js'
import { Action, ActionObject } from "./Action";
export default class BronAction extends Action {
    constructor(manager) {
        super(manager);
        this.name = "BronAction";
        this.children = {
            "rope": new Rope(manager),
            "line": new Line(manager)
        }
    }
}

class Rope extends ActionObject {
    constructor(manager) {
        super(manager);
        this.name = "Rope";
        this.isFrist = true;
        this.draw = function () {
            this.drawLine();
        }
    }
    drawLine() {
        this.points = [];
        this.historyX = [];
        this.historyY = [];
        this.historySize = 20;
        this.ropeSize = 100;
        for (let i = 0; i < this.ropeSize; i++) {
            this.points.push(new PIXI.Point(0, 0));
        }
        this.texture = new PIXI.Graphics()
            .beginFill(0x000000)
            .drawCircle(0, 0, 10)
            .endFill()
        this.line = new PIXI.SimpleRope(this.manager.app.renderer.generateTexture(this.texture), this.points);
        this.line.blendmode = PIXI.BLEND_MODES.ADD;
        this.container.addChild(this.line);
    }
    update() {
        if (this.manager.mouse.isPressed) {
            console.log(`lineTo:${this.manager.mouse.x},${this.manager.mouse.y}`);
            if (this.isFrist) {
                for (let i = 0; i < this.historySize; i++) {
                    this.historyX[i] = this.manager.mouse.x;
                    this.historyY[i] = this.manager.mouse.y;
                }
                this.points[0] = new PIXI.Point(this.historyX[0],this.historyY[0]);
                this.isFrist = false;
            }
            else {
                this.historyX.unshift(this.manager.mouse.x);
                this.historyY.unshift(this.manager.mouse.y);
            }
            // Update the points to correspond with history.
            for (let i = 0; i < this.ropeSize; i++) {
                const p = this.points[i];
                // Smooth the curve with cubic interpolation to prevent sharp edges.
                //const ix = cubicInterpolation(this.historyX, i / this.ropeSize * this.historySize);
                //const iy = cubicInterpolation(this.historyY, i / this.ropeSize * this.historySize);
                let ix = this.historyX[i];
                let iy = this.historyY[i];
                p.x = ix;
                p.y = iy;
            }
        }
        else {
            this.historyX = [];
            this.historyY = [];
            this.isFrist = true;
        }
        function clipInput(k, arr) {
            if (k < 0) k = 0;
            if (k > arr.length - 1) k = arr.length - 1;
            return arr[k];
        }
        function getTangent(k, factor, array) {
            return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
        }
        function cubicInterpolation(array, t, tangentFactor) {
            if (tangentFactor == null) tangentFactor = 1;

            const k = Math.floor(t);
            const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
            const p = [clipInput(k, array), clipInput(k + 1, array)];
            t -= k;
            const t2 = t * t;
            const t3 = t * t2;
            return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
        }
    }
}

class Line extends ActionObject {
    constructor(manager) {
        super(manager);
        this.name = "Line";
        this.draw = function () {
            this.drawLine();
        }
    }
    drawLine(){
        this.line = new PIXI.Graphics()
        .lineStyle({
            width:5,
            color:0xfff,
            cap:PIXI.LINE_CAP.ROUND,
            join:PIXI.LINE_JOIN.ROUND
        }).moveTo(50,50)
        .bezierCurveTo(50,50,200,100,100,100);
        this.container.addChild(this.line);
    }
}