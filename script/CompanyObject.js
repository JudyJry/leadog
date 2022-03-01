import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background, Player, Door, Video } from './GameObject.js';
import { Page } from './Data.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class CompanyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "companyObject";
        this.children = {
            "background": new Background(this.manager, this, "image/building/company/bg.png"),
            "door": new Door(this.manager, this, -0.434, -0.052, "image/building/company/door.png"),
            "webside": new Webside(this.manager, this),
            "video": new CompanyVideo(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class Webside extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Webside";
        this.x = -0.02;
        this.y = -0.07;
        this.url = "image/building/company/webside.png";
        this.zoomIn = 1.5;
    }
}
class CompanyVideo extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.372;
        this.y = -0.07;
        this.url = "image/building/company/video.png";
        this.zoomIn = 1.6;
        this.videoList = [
            function () { return undefined }.bind(this),
        ];
    }
}


