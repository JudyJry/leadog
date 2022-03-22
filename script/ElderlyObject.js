import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { ElderlyAction_Hair, ElderlyAction_Story1, ElderlyAction_Story2, ElderlyAction_Story3 } from './ElderlyAction.js';
import { ColorSlip } from './ColorSlip.js';

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
        this.zoomInPos = [83.4, -73.35]
        this.fadeText = "點擊播放影片";
        this.spriteHeight = 10;
        this.videoList = [function () { return new ElderlyAction_Hair(this.manager, this) }.bind(this)];
        this.uiOptions = {
            texturesUrl: "image/video/elderly/elderly_video_sprites.json",
            frameUrl: "image/video/tv.png",
            frameScale: 0.5,
            uiHitArea: 79, uiScale: 0.25,
            standard: -270, height: 235, space: 42
        }
    }
    onClickResize() {
        if (!this.fullButton.turn) {
            this.frame.alpha = 1;
            this.UItint("white");
            this.page.container.scale.set(this.zoomIn);
            this.page.container.position.set((-this._x + this.zoomInPos[0]) * this.zoomIn, (-this._y + this.zoomInPos[1]) * this.zoomIn);
        }
        else if (this.fullButton.turn) {
            let fz = 3.92;
            this.frame.alpha = 0;
            this.UItint("brown");
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
                gsap.to(this.ui, { duration: 1, y: -((screen.height - window.innerHeight + 160) / 3.92) });
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
        this.video.container.position.set(-83, 73);
        this.drawUI();
        this.fullButton.position.set(-this.uiOptions.standard - 160, this.uiOptions.height);
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;
        this.page.isZoomIn = true;
        this.isClick = true;
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
            this.manager.resources[this.uiOptions.texturesUrl]
                .spritesheet.textures["pause.png"];
    }
    pause() {
        this.video.videoCrol.pause();
        this.video.sound.pause();
        this.playButton.texture =
            this.manager.resources[this.uiOptions.texturesUrl]
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