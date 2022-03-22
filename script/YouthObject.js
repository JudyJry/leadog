import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, OtherObject, Door } from './GameObject.js';
import YouthAction_Bus from './YouthAction_bus.js';
import YouthAction_Instruction from './YouthAction_Instruction.js';
import YouthAction_Traffic from './YouthAction_Traffic.js';
import YouthAction_Instruction2 from './YouthAction_Instruction2.js';
import { addPointerEvent, createSprite } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class YouthObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "YouthObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/youth/bg.png"),
            "door": new Door(this.manager, this, -0.064, 0.117, "image/building/youth/door.png"),
            "video": new YouthVideo(this.manager, this),
            "graduate": new Graduate(this.manager, this),
            "grass": new OtherObject(this.manager, "grass", 0.028, 0.054, "image/building/youth/grass.png"),
            "mirror": new Mirror(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class YouthVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.363;
        this.y = -0.037;
        this.url = "image/building/youth/video.png";
        this.zoomIn = 1.8;
        this.zoomInPos = [0, 25];
        this.uiOptions = {
            texturesUrl: "image/video/actionUI_sprites.json",
            frameUrl: "image/video/youth/video.png",
            frameScale: 0.25,
            uiHitArea: 65, uiScale: 0.2,
            standard: -300, height: 186, space: 35
        }
        this.videoList = [
            function () { return new YouthAction_Bus(this.manager, this) }.bind(this),
            function () { return new YouthAction_Traffic(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction2(this.manager, this) }.bind(this)
        ]
    }
    onClickResize() {
        if (!this.fullButton.turn) {
            this.page.container.scale.set(this.zoomIn);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * this.zoomIn, (-this._y + this.zoomInPos[1]) * this.zoomIn);
        }
        else if (this.fullButton.turn) {
            let fz = 2.85;
            this.page.container.scale.set(fz);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * fz, (-this._y + this.zoomInPos[1]) * fz);
        }
    }
    onClickUpdate() {
        this.video.update();
        if (this.fullButton.turn) {
            if (this.manager.mouse.x < 250) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: 0 });
            }
            else if (this.manager.mouse.x > 500) {
                gsap.to(this.manager.uiSystem.container, { duration: 1, x: -250 });
            }
            if (this.manager.mouse.y > this.h - 110) {
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 128) / 2.85) });
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
    clickEvent() {
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.video = this.videoList[this.random]();
        this.video.setup();
        this.drawUI();
        this.video.container.position.set(0, -24);
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
}
class Graduate extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Graduate";
        this.x = -0.294;
        this.y = -0.118;
        this.url = "image/building/youth/graduate.png";
        this.zoomIn = 1.3;
        this.zoomInPos = [35, -100];
    }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        this.zoom();
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
    }
}
class Mirror extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.x = 0.108;
        this.y = -0.026;
        this.url = "image/building/youth/mirror.png";
        this.zoomIn = 1.5;
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