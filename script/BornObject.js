import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Video } from './GameObject.js';
import { BornAction_Story1, BornAction_Story2 } from './BornAction_Story.js';
import { FilterSet } from './FilterSet.js';
import { addPointerEvent, createSprite } from './GameFunction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class BornObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "BornObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/born/bg.png"),
            "video": new BornVideo(this.manager, this),
            "clan": new Clan(this.manager, this),
            "map": new Map(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class BornVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = -0.291;
        this.y = -0.046;
        this.url = "image/building/born/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return new BornAction_Story1(this.manager, this) }.bind(this),
            function () { return new BornAction_Story2(this.manager, this) }.bind(this)
        ];
    }
}
class Clan extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Clan";
        this.x = 0.162;
        this.y = 0.205;
        this.url = "image/building/born/clan.png";
        this.turl = "image/building/born/clan_tree.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
        this.draw = function () {
            this._x = (this.x * this.w * 2);
            this._y = (this.y * this.h * 2);
            this.sprite.texture = PIXI.Texture.from(this.url);
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(this.scale);
            this.tree = PIXI.Sprite.from(this.turl);
            this.tree.anchor.set(0.5, 1);
            this.tree.scale.set(this.scale);
            this.tree.alpha = 0.5;
            this.tree.position.set(-10, -50);

            this.blink = FilterSet.blink();
            this.sprite.filters = [this.blink.filter];

            this.text = new PIXI.Text(this.fadeText, this.ts);
            this.text.anchor.set(0.5);
            this.textHeight = this.spriteHeight + 10;

            this.container.addChild(this.tree, this.sprite, this.text);

            this.sprite.clickEvent = this.clickEvent.bind(this);
            addPointerEvent(this.sprite);
            this.container.position.set(this._x, this._y);
        }
    }
}
class Map extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Map";
        this.x = 0.424;
        this.y = -0.082;
        this.url = "image/building/born/map.png";
        this.zoomIn = 1.5;
    }
}

const loadList = {
    story1: [
        "sound/born_story.mp3",
        "video/born_story1.mp4"
    ],
    story2: [
        "sound/born_story.mp3",
        "video/born_story2.mp4"
    ]
}
