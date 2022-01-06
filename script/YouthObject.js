import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';
import YouthAction_Bus from './YouthAction_bus.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class YouthObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "YouthObject";
        this.children = {
            "background": new Background(manager, "image/building/youth/youth_bg.png"),
            "graduate": new Graduate(manager),
            "info": new Info(manager),
            "bus": new Bus(manager),
            "instruction": new Instruction(manager),
            "traffic": new Traffic(manager),
        };
    }
}

class Graduate extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "畢業生照片";
        this.x = -0.145;
        this.y = -0.303;
        this.url = "image/building/youth/graduate.png";
    }
    //todo() { }
}
class Info extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "法律知識";
        this.x = 0.169;
        this.y = -0.316;
        this.url = "image/building/youth/info.png";
    }
    //todo() { }
}
class Bus extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "公車訓練";
        this.x = -0.065;
        this.y = -0.043;
        this.url = "image/building/youth/bus.png";
        this.surl = "image/building/youth/bus_shadow.png";
    }
    todo() { this.manager.loadAction(new YouthAction_Bus(this.manager)); }
}
class Instruction extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "指令訓練";
        this.x = 0.117;
        this.y = -0.027;
        this.url = "image/building/youth/instruction.png";
        this.surl = "image/building/youth/instruction_shadow.png";
    }
    //todo() { this.manager.loadAction(new ChildhoodAction(this.manager)); }
}
class Traffic extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "馬路訓練";
        this.x = -0.442;
        this.y = 0.212;
        this.url = "image/building/youth/traffic.png";
        this.surl = "image/building/youth/traffic_shadow.png";
    }
    //todo() { this.manager.loadAction(new ChildhoodAction(this.manager)); }
}

