import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video, OtherObject } from './GameObject.js';
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
            "video": new YouthVideo(this.manager, this),
            "graduate": new Graduate(this.manager, this),
            "grass": new OtherObject(this.manager, "grass", 0.028, 0.054, "image/building/youth/grass.png"),
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
        this.uiScale = 0.24;
        this.videoList = [
            function () { return new YouthAction_Bus(this.manager, this) }.bind(this),
            function () { return new YouthAction_Traffic(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction(this.manager, this) }.bind(this),
            function () { return new YouthAction_Instruction2(this.manager, this) }.bind(this)
        ]
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.scale.set(this.manager.canvasScale);
        if (this.isClick && this.fullButton) {
            if (!this.fullButton.turn) {
                this.frame.alpha = 1;
                this.page.container.scale.set(this.zoomIn * this.manager.canvasScale);
                this.page.container.position.set((-this._x + 0) * this.zoomIn, (-this._y - 0) * this.zoomIn);
            }
            else if (this.fullButton.turn) {
                let fz = 3.8;
                this.frame.alpha = 0;
                this.page.container.scale.set(fz);
                this.page.container.position.set((-this._x + 0) * fz, (-this._y - 0) * fz);
            }
        }
    }
    update() {
        if (this.page.isZoomIn) {
            this.blink.outerStrength = 0;
            this.text.position.y = -this.spriteHeight;
            this.text.alpha = 0;
            if (this.isClick) {
                this.video.update();
                if (this.fullButton.turn) {
                    if (this.manager.mouse.x < 250) {
                        gsap.to(this.manager.uiSystem.container, { duration: 1, x: 0 });
                    }
                    else if (this.manager.mouse.x > 500) {
                        gsap.to(this.manager.uiSystem.container, { duration: 1, x: -250 });
                    }
                    if (this.manager.mouse.y > this.h - 110) {
                        gsap.to(this.ui, { duration: 1, y: -35 - (screen.height - this.h) });
                    }
                    else if (this.manager.mouse.y < this.h - 110) {
                        gsap.to(this.ui, { duration: 1, y: 20 });
                    }
                }
                else {
                    this.manager.uiSystem.container.position.x = 0;
                    this.ui.position.set(0);
                }
            }
        }
        else if (this.sprite.isPointerOver) {
            this.blink.outerStrength = 5;
        }
        else {
            this.blink.effect();
        }
    }
    clickEvent() {
        this.sprite.interactive = false;
        let tl = gsap.timeline();
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: (-this._x + 0) * this.zoomIn, y: (-this._y + 0) * this.zoomIn }, 0);
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
    drawUI() {
        this.ui = new PIXI.Container();
        this.frame = createSprite("image/video/youth/video.png", 0.5, 0.25);
        this.playButton = createSprite("image/video/play.png", 0.5, this.uiScale);
        this.volumeButton = createSprite("image/video/volume.png", 0.5, this.uiScale);
        this.nextButton = createSprite("image/video/next.png", 0.5, this.uiScale);
        this.fullButton = createSprite("image/video/full.png", 0.5, this.uiScale);

        let standard = -320;
        let h = 186;
        let space = 40;
        this.playButton.position.set(standard, h);
        this.nextButton.position.set(standard + space * 1, h);
        this.volumeButton.position.set(standard + space * 2, h);
        this.fullButton.position.set(-standard - 20, h);

        this.playButton.clickEvent = function () {
            if (this.video.videoCrol.paused) { this.play(); } else { this.pause(); }
        }.bind(this);

        this.nextButton.clickEvent = function () {
            if (this.random === this.videoList.length - 1) { this.random = 0 }
            else { this.random += 1 }
            this.pause();
            this.container.removeChild(this.video.container);
            this.video = this.videoList[this.random]();
            this.video.setup();
            this.video.container.position.set(0, -24);
            this.video.videoCrol.muted = this.volumeButton.turn;
        }.bind(this);

        this.volumeButton.clickEvent = function () {
            if (this.video.videoCrol.muted) {
                this.volumeButton.turn = false;
                this.video.videoCrol.muted = false;
                this.video.sound.volume = 0.5;
                this.volumeButton.texture = PIXI.Texture.from("image/video/volume.png");
            }
            else {
                this.volumeButton.turn = true;
                this.video.videoCrol.muted = true;
                this.video.sound.volume = 0;
                this.volumeButton.texture = PIXI.Texture.from("image/video/volume_off.png");
            }
        }.bind(this);
        this.volumeButton.turn = false;

        this.fullButton.clickEvent = function () {
            if (this.fullButton.turn) {
                closeFullscreen();
                this.fullButton.turn = false;
            }
            else {
                openFullscreen(document.documentElement);
                this.fullButton.turn = true;
            }
            function openFullscreen(elem) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) { /* Safari */
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) { /* IE11 */
                    elem.msRequestFullscreen();
                }
            }
            function closeFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }
        }.bind(this);
        this.fullButton.turn = false;

        addPointerEvent(this.playButton);
        addPointerEvent(this.volumeButton);
        addPointerEvent(this.nextButton);
        addPointerEvent(this.fullButton);
        addPointerEvent(this.video.videoSprite);

        this.ui.addChild(this.frame, this.playButton, this.volumeButton, this.nextButton, this.fullButton);
        this.container.addChild(this.ui);
    }
}
class Graduate extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Graduate";
        this.x = -0.241;
        this.y = -0.077;
        this.url = "image/building/youth/graduate.png";
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