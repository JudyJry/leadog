import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { ElderlyAction_Hair } from './ElderlyAction_Hair.js';
import { ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction_Story.js';
import { ColorSlip } from './ColorSlip.js';
import { addPointerEvent, createSprite } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ElderlyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ElderlyObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/elderly/bg.png"),
            "door": new Door(this.manager, this, -0.403, -0.067, "image/building/elderly/door.png"),
            "video": new ElderlyVideo(this.manager, this),
            "tv": new Tv(this.manager, this),
            "book": new Book(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class ElderlyVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.103;
        this.y = -0.077;
        this.url = "image/building/elderly/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new ElderlyAction_Story1(this.manager, this) }.bind(this),
            function () { return new ElderlyAction_Story2(this.manager, this) }.bind(this),
            function () { return new ElderlyAction_Story3(this.manager, this) }.bind(this)
        ];
    }
}
class Tv extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Tv";
        this.x = 0.275;
        this.y = -0.049;
        this.url = "image/building/elderly/tv.png";
        this.zoomIn = 2.6;
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.videoList = [function () { return new ElderlyAction_Hair(this.manager, this) }.bind(this)];
        this.uiScale = 0.25;
        this.uiHitArea = 79;
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.scale.set(this.manager.canvasScale);
        if (this.isClick && this.fullButton) {
            if (!this.fullButton.turn) {
                this.frame.alpha = 1;
                this.UItint("white");
                this.page.container.scale.set(this.zoomIn);
                this.page.container.position.set((-this._x + 83.5) * this.zoomIn, (-this._y - 73.5) * this.zoomIn);
            }
            else if (this.fullButton.turn) {
                let fz = 3.8;
                this.frame.alpha = 0;
                this.UItint("brown");
                this.page.container.scale.set(fz);
                this.page.container.position.set((-this._x + 83.5) * fz, (-this._y - 73.5) * fz);
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
                        gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 133) / 3.8) });
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
        tl.to(this.page.container, { duration: 0.5, x: (-this._x + 83.5) * this.zoomIn, y: (-this._y - 73.5) * this.zoomIn }, 0);
        this.page.children.player.move(this._x, this.sprite.width);

        this.video = this.videoList[this.random]();
        this.video.setup();
        this.video.container.position.set(-83, 72);
        this.drawUI();
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
    }
    drawUI() {
        this.ui = new PIXI.Container();
        const textures = this.manager.resources["image/video/elderly/elderly_video_sprites.json"].spritesheet.textures;
        this.frame = createSprite("image/video/tv.png", 0.5, 0.5);
        this.playButton = createSprite(textures["play.png"], 0.5, this.uiScale);
        this.volumeButton = createSprite(textures["volume.png"], 0.5, this.uiScale);
        this.nextButton = createSprite(textures["next.png"], 0.5, this.uiScale);
        this.fullButton = createSprite(textures["full.png"], 0.5, this.uiScale);

        let standard = -270;
        let h = 235;
        let space = 42;
        this.playButton.position.set(standard, h);
        this.nextButton.position.set(standard + space * 1, h);
        this.volumeButton.position.set(standard + space * 2, h);
        this.fullButton.position.set(-standard - 160, h);

        this.playButton.clickEvent = function () {
            if (this.video.children.video.isStart && !this.video.children.video.isPlayGame) {
                if (this.video.videoCrol.paused) { this.play(); } else { this.pause(); }
            }
        }.bind(this);

        this.nextButton.clickEvent = function () {
            this.random++;
            if (this.random >= this.videoList.length) { this.random = 0 }
            this.pause();
            this.container.removeChild(this.video.container);
            this.video = this.videoList[this.random]();
            this.video.setup();
            this.video.container.position.set(-83, 72);
            this.video.videoCrol.muted = this.volumeButton.turn;
        }.bind(this);

        this.volumeButton.clickEvent = function () {
            if (this.video.videoCrol.muted) {
                this.volumeButton.turn = false;
                this.video.videoCrol.muted = false;
                this.video.sound.volume = 0.5;
                this.volumeButton.texture = textures["volume.png"];
            }
            else {
                this.volumeButton.turn = true;
                this.video.videoCrol.muted = true;
                this.video.sound.volume = 0;
                this.volumeButton.texture = textures["volume_off.png"];
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
        this.playButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.volumeButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.nextButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        this.fullButton.hitArea = new PIXI.Rectangle(-this.uiHitArea, -this.uiHitArea, this.uiHitArea * 2, this.uiHitArea * 2);
        addPointerEvent(this.playButton);
        addPointerEvent(this.volumeButton);
        addPointerEvent(this.nextButton);
        addPointerEvent(this.fullButton);

        this.ui.addChild(this.playButton, this.volumeButton, this.nextButton, this.fullButton);
        this.container.addChild(this.frame, this.ui);
    }
    UItint(color = "brown") {
        this.playButton.tint = ColorSlip[color];
        this.volumeButton.tint = ColorSlip[color];
        this.nextButton.tint = ColorSlip[color];
        this.fullButton.tint = ColorSlip[color];
    }
    play() {
        this.video.videoCrol.play();
        this.video.sound.play();
        this.playButton.texture =
            this.manager.resources["image/video/elderly/elderly_video_sprites.json"]
                .spritesheet.textures["pause.png"];
    }
    pause() {
        this.video.videoCrol.pause();
        this.video.sound.pause();
        this.playButton.texture =
            this.manager.resources["image/video/elderly/elderly_video_sprites.json"]
                .spritesheet.textures["play.png"];
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.44;
        this.y = -0.081;
        this.url = "image/building/elderly/map.png";
        this.zoomIn = 1.5;
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = -0.294;
        this.y = -0.121;
        this.url = "image/building/elderly/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
    }
}
const loadList = {
    "story1": [
        "sound/elderly_story1.wav",
        "video/elderly_story1.mp4"
    ],
    "story2": [
        "sound/elderly_story2.mp3",
        "video/elderly_story2.mp4"
    ],
    "story3": [
        "sound/elderly_story3.wav",
        "video/elderly_story3.mp4"
    ],
    "hair": [
        "sound/elderly_hair.mp3",
        "video/elderly_hair.mp4",
        "image/video/elderly/hair/title_1.png",
        "image/video/elderly/hair/title_2.png",
        "image/video/elderly/hair/title_3.png",
        "image/video/elderly/hair/hint_1.png",
        "image/video/elderly/hair/hint_2.png",
        "image/video/elderly/hair/hint_3.png",
        "image/video/elderly/hair/button_1.png",
        "image/video/elderly/hair/button_2.png",
        "image/video/elderly/hair/button_3.png"
    ]
}