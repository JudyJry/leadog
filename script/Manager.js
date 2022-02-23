import * as PIXI from 'pixi.js';
import { ColorSlip } from "./ColorSlip.js";
import ResourceLoader from "./ResourceLoader.js";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import UIsystem from './UI.js';
import HomeObject from "./HomeObject.js";
import BronObject from './BronObject.js';
import ChildhoodObject from './ChildhoodObject.js';
import YouthObject from './YouthObject.js';
import ElderlyObject from './ElderlyObject.js';
import CompanyObject from './CompanyObject.js';
import MarketObject from './MarketObject.js';
import KnowObject from './KnowObject.js';
import { Page } from './Data.js';

export default class Manager {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvasScale = 1;
        this.app = new PIXI.Application({
            width: this.w,
            height: this.h,
            backgroundColor: ColorSlip.lightBlue,
            antialias: true,
            view: document.getElementById("mainPIXI")
        });
        this.anchor = 0.5;
        this.app.stage.x = this.app.renderer.width * this.anchor;
        this.app.stage.y = this.app.renderer.height * this.anchor;
        this.loader = new ResourceLoader(this.app);
        this.loader.loadTexture(loadList.ui.concat(loadList.home));

        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this);
        this.uiSystem = new UIsystem(this);
        this.deltaTime = 0;
        this.activeObj = new HomeObject(this);

        this.isMute = false;
    }
    setup() {
        this.uiSystem.setup();
        this.activeObj.setup();
        this.mouse.setup();
        this.app.stage.sortChildren();
        this.app.ticker.add((delta) => {
            this.deltaTime = (1 / 60) * delta;
            this.update();
        })
    }
    update() {
        this.uiSystem.update();
        this.mouse.update();
        this.activeObj.update();
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app.renderer.resize(this.w, this.h);
        this.app.stage.x = this.app.renderer.width * this.anchor;
        this.app.stage.y = this.app.renderer.height * this.anchor;

        this.uiSystem.resize();
        this.activeObj.resize();
        this.mouse.resize();
        this.app.stage.sortChildren();
    }
    addChild(...e) {
        this.activeObj.container.addChild(...e);
        this.activeObj.container.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.activeObj.container.removeChildren(); }
        else { this.activeObj.container.removeChild(...e); }
    }
    loadPage(obj, list = undefined) {
        this.loader.loadAsset(function () {
            this.app.renderer.backgroundColor = ColorSlip.lightBlue;
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.activeObj = obj;
            this.activeObj.setup().then(function () {
                this.app.stage.addChild(this.uiSystem.container, this.mouse.cursor)
                this.app.stage.sortChildren();
            }.bind(this));
        }.bind(this), () => { }, list);
    }
    loadAction(act, list = undefined) {
        this.loader.loadAsset(function () {
            this.app.renderer.backgroundColor = ColorSlip.white;
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.removeChild();
            act.setup().then(function () {
                this.activeObj = act;
                this.keyboard.pressed = (k) => { }
                this.addChild(this.mouse.cursor);
            }.bind(this));
        }.bind(this), () => { }, list);
    }
    toOtherPage(e) {
        this.removeChild();
        this.app.stage.removeChildren();
        switch (e) {
            case Page.home:
                this.loadPage(new HomeObject(this), loadList.home);
                break;
            case Page.bron:
                this.loadPage(new BronObject(this), loadList.bron);
                break;
            case Page.childhood:
                this.loadPage(new ChildhoodObject(this), loadList.childhood);
                break;
            case Page.youth:
                this.loadPage(new YouthObject(this), loadList.youth);
                break;
            case Page.elderly:
                this.loadPage(new ElderlyObject(this), loadList.elderly);
                break;
            case Page.company:
                this.loadPage(new CompanyObject(this), loadList.company);
                break;
            case Page.market:
                this.loadPage(new MarketObject(this), loadList.market);
                break;
            case Page.know:
                this.loadPage(new KnowObject(this), loadList.know);
                break;
        }
    }
}

const loadList = {
    "ui": [
        //uiSystem-png
        "image/logo.svg",
        "image/book.svg",
        "image/index.svg",
        "image/menu.svg",
        "image/notify.svg",
        "image/user.svg",
        "image/bron.svg",
        "image/childhood.svg",
        "image/youth.svg",
        "image/elderly.svg",
        "image/company.svg",
        "image/buy.svg",
        "image/info.svg",
        "image/market.svg",
        "image/soundoff.svg",
        "image/soundon.svg",
        "image/know.svg",
        "image/question.svg",
        "image/ui_1.svg",
        "image/ui_2.svg",
        //page-ui
        "image/cancel.svg",
        "image/arrow_right.svg",
        "image/arrow_left.svg",
        //actionpage
        "image/TGDAlogo.png",
        "image/video/count5.png",
        "image/video/count4.png",
        "image/video/count3.png",
        "image/video/count2.png",
        "image/video/count1.png",
        "image/video/yes.png",
        "image/video/no.png",
        "image/video/know.png",
        "image/video/bar.png",
        "image/video/bar_full.png",
        "image/video/space.png",
        "image/video/wait.png",
        "image/video/ok.png",
        "image/video/cursor.png",
        "image/video/cursorHint.png",
        "image/video/Goodjob.png",
    ],
    "home": [
        "image/homepage/map.png",
        "image/homepage/island.png",
        "image/homepage/tree_front.png",
        "image/homepage/bron.png",
        "image/homepage/childhood.png",
        "image/homepage/youth.png",
        "image/homepage/elderly.png",
        "image/homepage/company.png",
        "image/homepage/know.png",
        "image/homepage/market.png",
    ],
    "bron": [
        //"image/building/bron/bg.png",
    ],
    "childhood": [
        "image/building/childhood/bg.png",
        "image/building/childhood/door.png",
        "image/building/childhood/book.png",
        "image/building/childhood/puzzle.png",
        "image/building/childhood/video.png",
    ],
    "youth": [
        //"image/building/youth/bg.png",
    ],
    "elderly": [
        //"image/building/elderly/bg.png",
    ],
    "know": [
        "image/building/know/bg.png",
        "image/building/know/billboard.png",
        "image/building/know/blackboard.png",
        "image/building/know/gashapon.png",
        "image/building/know/gashapon_alpha.png",
        "image/building/know/big_front.png",
        "image/building/know/big_back.png",
        "image/building/know/middle_front.png",
        "image/building/know/middle_back.png",
        "image/building/know/middle2_front.png",
        "image/building/know/middle2_back.png",
        "image/building/know/small_front.png",
        "image/building/know/small_back.png",
    ],
    "company": [
        //"image/building/company/bg.png",
    ],
    "market": [
        //"image/building/market/bg.png",
    ]
}