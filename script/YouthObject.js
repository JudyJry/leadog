import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player } from './GameObject.js';
import YouthAction_Bus from './YouthAction_bus.js';
import YouthAction_Instruction from './YouthAction_Instruction.js';
import YouthAction_Traffic from './YouthAction_Traffic.js';
import YouthAction_Instruction2 from './YouthAction_Instruction2.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class YouthObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "YouthObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/youth/bg.png"),
            "video": new Video(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Video extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.363;
        this.y = -0.037;
        this.url = "image/building/youth/video.png";
        this.zoomIn = 2;
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.random = Math.floor(Math.random() * 4);
    }
    clickEvent() {
        this.page.container.scale.set(1);
        this.page.container.position.set(0, 0);
        switch (this.random) {
            case 0:
                this.manager.loadAction(new YouthAction_Bus(this.manager), loadList.bus);
                break;
            case 1:
                this.manager.loadAction(new YouthAction_Traffic(this.manager), loadList.traffic);
                break;
            case 2:
                this.manager.loadAction(new YouthAction_Instruction(this.manager), loadList.instruction);
                break;
            case 3:
                this.manager.loadAction(new YouthAction_Instruction2(this.manager), loadList.instruction2);
                break;
        }

    }
}
const loadList = {
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
    instruction2: [
        "video/youth_instruction2.mp4",
        "sound/youth_instruction2.wav",
        "image/video/youth_instruction2/stage_1_title.png",
        "image/video/youth_instruction2/stage_1_hint.png",
        "image/video/youth_instruction2/stage_2_title.png",
        "image/video/youth_instruction2/stage_2_hint.png"
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