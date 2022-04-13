import * as PIXI from 'pixi.js';
import { ColorSlip } from "./ColorSlip.js";
import ResourceLoader from "./ResourceLoader.js";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import UIsystem from './UI.js';
import HomeObject from "./HomeObject.js";
import BornObject from './BornObject.js';
import ChildhoodObject from './ChildhoodObject.js';
import YouthObject from './YouthObject.js';
import ElderlyObject from './ElderlyObject.js';
import CompanyObject from './CompanyObject.js';
import MarketObject from './MarketObject.js';
import KnowObject from './KnowObject.js';
import { Page, userData } from './Data.js';
import { addPointerEvent } from './GameFunction.js';

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
        this.resources = this.app.loader.resources;

        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this);
        this.uiSystem = new UIsystem(this);
        this.deltaTime = 0;
        this.activeObj = new HomeObject(this);

        this.isMute = false;

        this.userData = userData;
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
    activeCancel(boolean, event = () => { }) {
        this.uiSystem.ui.cancel.icon.visible = boolean;
        this.uiSystem.ui.cancel.icon.clickEvent = event;
        addPointerEvent(this.uiSystem.cancel);
    }
    loadPage(obj, list = undefined) {
        this.loader.loadAsset(function () {
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
                this.app.renderer.backgroundColor = ColorSlip.lightBlue;
                this.loadPage(new HomeObject(this), loadList.home);
                break;
            case Page.born:
                this.app.renderer.backgroundColor = 0xF9EBCF;
                this.loadPage(new BornObject(this), loadList.born);
                break;
            case Page.childhood:
                this.app.renderer.backgroundColor = 0xFEF1E9;
                this.loadPage(new ChildhoodObject(this), loadList.childhood);
                break;
            case Page.youth:
                this.app.renderer.backgroundColor = ColorSlip.lightBlue;
                this.loadPage(new YouthObject(this), loadList.youth);
                break;
            case Page.elderly:
                this.app.renderer.backgroundColor = 0xFBF5EE;
                this.loadPage(new ElderlyObject(this), loadList.elderly);
                break;
            case Page.company:
                this.app.renderer.backgroundColor = 0xFBF5EE;
                this.loadPage(new CompanyObject(this), loadList.company);
                break;
            case Page.market:
                this.app.renderer.backgroundColor = ColorSlip.lightYellow;
                this.loadPage(new MarketObject(this), loadList.market);
                break;
            case Page.know:
                this.app.renderer.backgroundColor = 0xFFFCF4;
                this.loadPage(new KnowObject(this), loadList.know);
                break;
        }
    }
}

const loadList = {
    "ui": [
        //uiSystem-png
        "image/logo.png",
        "image/book.svg",
        "image/book/sprites.json",
        "image/index.svg",
        "image/menu.svg",
        "image/notify.svg",
        "image/user.svg",
        "image/born.svg",
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
        "image/cancel.png",
        "image/dialog.png",
        "image/dialog_button.png",
        "image/arrow_right.svg",
        "image/arrow_left.svg",
        //video-ui
        "image/video/video.png",
        "image/TGDAlogo.png",
        "image/video/actionUI_sprites.json"
    ],
    "home": [
        "image/homepage/map.png",
        "image/homepage/island.png",
        "image/homepage/tree_front.png",
        "image/homepage/born.png",
        "image/homepage/childhood.png",
        "image/homepage/youth.png",
        "image/homepage/elderly.png",
        "image/homepage/company.png",
        "image/homepage/know.png",
        "image/homepage/market.png",
    ],
    "born": [
        "image/building/born/bg.png",
        "image/building/born/door.png",
        "image/building/born/mirror.png",
        "image/building/born/map.png",
        "image/building/born/video.png",
        "image/building/born/sprites.json",
        "image/map/sprites.json",
    ],
    "childhood": [
        "image/building/childhood/bg.png",
        "image/building/childhood/door.png",
        "image/building/childhood/book.png",
        "image/building/childhood/puzzle.png",
        "image/building/childhood/puzzle_complete.png",
        "image/building/childhood/video.png",
        "image/building/childhood/sprites.json",
        "image/video/childhood/sprites.json",
    ],
    "youth": [
        "image/building/youth/bg.png",
        "image/building/youth/door.png",
        "image/building/youth/video.png",
        "image/building/youth/mirror.png",
        "image/building/youth/graduate.png",
        "image/video/youth/sprites.json",
        "image/building/youth/graduate/sprites.json",
        "image/building/youth/mirror/sprites.json",
        "video/youth_bus.mp4",
        "video/youth_instruction.mp4",
        "video/youth_instruction2.mp4",
        "video/youth_traffic.mp4",
        "video/youth_traffic.mp4",
        "video/youth_traffic_1.mp4",
        "video/youth_traffic_2.mp4"
    ],
    "elderly": [
        "image/building/elderly/bg.png",
        "image/building/elderly/door.png",
        "image/building/elderly/book.png",
        "image/building/elderly/map.png",
        "image/building/elderly/tv.png",
        "image/building/elderly/video.png",
        "image/video/elderly/elderly_video_sprites.json",
        "image/map/sprites.json",
    ],
    "know": [
        "image/building/know/bg.png",
        "image/building/know/billboard.png",
        "image/building/know/blackboard.png",
        "image/building/know/gashapon.png",
        "image/building/know/gashapon_alpha.png",
        "image/building/know/gashapon/sprites.json",
        "image/building/know/book/cover.png",
        "image/building/know/book/sprites.json",
    ],
    "company": [
        "image/building/company/bg.png",
        "image/building/company/webside/page_0_0.png",
        "image/building/company/webside/page_0_1.png",
        "image/building/company/webside/page_0_2.png",
        "image/building/company/webside/page_0_3.png",
        "image/building/company/webside/page_0_4.png",
        "image/building/company/webside/page_0_5.png",
        "image/building/company/webside/page_0_6.png",
        "image/building/company/webside/page_1.png",
        "image/building/company/webside/page_2.png",
        "image/building/company/webside/page_3.png",
        "image/building/company/webside/page_4.png",
        "image/building/company/webside/sprites.json"
    ],
    "market": [
        //"image/building/market/bg.png",
    ]
}