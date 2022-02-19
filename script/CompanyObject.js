import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { linkObject, PageObject, Background } from './GameObject.js';
import { Page } from './Data.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class CompanyObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "companyObject";
        this.children = {
            "background": new Background(manager, "image/building/company/company_bg.png"),
            "commodity": new Commodity(manager),
            "donate": new Donate(manager),
            "exit": new Exit(manager)
        };
    }
}

class Commodity extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "義賣商品";
        this.x = -0.055;
        this.y = -0.07;
        this.url = "image/building/company/commodity.png";
        this.surl = "image/building/company/commodity_shadow.png";
    }
    //clickEvent() { }
}
class Donate extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "捐款";
        this.x = -0.424;
        this.y = -0.004;
        this.url = "image/building/company/donate.png";
        this.surl = "image/building/company/donate_shadow.png";
    }
    //clickEvent() { }
}
class Exit extends linkObject {
    constructor(manager) {
        super(manager);
        this.name = "出口";
        this.x = -0.285;
        this.y = -0.186;
        this.url = "image/building/company/exit.png";
        this.surl = "image/building/company/exit_shadow.png";
    }
    clickEvent() { this.manager.toOtherPage(Page.home); }
}


