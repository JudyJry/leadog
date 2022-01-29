import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';
import YouthAction_Bus from './YouthAction_bus.js';
import YouthAction_Instruction from './YouthAction_Instruction.js';
import YouthAction_Traffic from './YouthAction_Traffic.js';

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
    todo() {
        this.manager.loadAction(new YouthAction_Bus(this.manager), loadlist.bus);
    }
}
class Instruction extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "指令訓練";
        this.x = 0.117;
        this.y = -0.027;
        this.url = "image/building/youth/instruction.png";
        this.surl = "image/building/youth/instruction_shadow.png";
        this.random = Math.floor(Math.random() * 2);
    }
    todo() {
        if (this.random === 0) {
            this.manager.loadAction(new YouthAction_Instruction(this.manager), loadlist.instruction);
        }
        else {
            this.manager.loadAction(new YouthAction_Instruction(this.manager), loadlist.instruction);
        }
    }
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
    todo() { this.manager.loadAction(new YouthAction_Traffic(this.manager), loadlist.traffic); }
}

const loadlist = {
    bus: [
        "video/youth_bus.mp4",
        "sound/youth_bus.wav",
        "image/video/youth/bus/stage_1_title.png",
        "image/video/youth/bus/stage_1_hint.png"
    ],
    instruction: [
        "video/youth_instruction.mp4",
        "sound/youth_instruction.wav",
        "image/video/youth/instruction/stage_1_title.png",
        "image/video/youth/instruction/stage_1_hint.png",
        "image/video/youth/instruction/stage_2_title.png",
        "image/video/youth/instruction/stage_2_hint.png",
        "image/video/youth/instruction/stage_3_title.png",
        "image/video/youth/instruction/stage_3_hint.png",
        "image/video/youth/instruction/stage_4_title.png",
        "image/video/youth/instruction/stage_4_hint.png",
        "image/video/youth/instruction/stage_5_title.png",
        "image/video/youth/instruction/stage_5_hint.png",
    ],
    traffic: [
        "video/youth_traffic.mp4",
        "video/youth_traffic_1.mp4",
        "video/youth_traffic_2.mp4",
        "sound/youth_traffic.wav",
        "sound/youth_traffic_1.mp3",
        "sound/youth_traffic_2.mp3",
        "image/video/youth/traffic/stage_1_title.png",
        "image/video/youth/traffic/stage_1_hint.png",
        "image/video/youth/traffic/stage_1_choose_1.png",
        "image/video/youth/traffic/stage_1_choose_2.png",
        "image/video/youth/traffic/stage_1_button_1.png",
        "image/video/youth/traffic/stage_1_button_2.png"
    ]
}