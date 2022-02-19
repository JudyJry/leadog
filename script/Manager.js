import * as PIXI from 'pixi.js';
import { ColorSlip } from "./ColorSlip.js";
import ResourceLoader from "./ResourceLoader.js";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import UIsystem from './UI.js';
import Player from './Player.js';
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
        this.loader.loadTexture(loadList);

        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this);
        this.uiSystem = new UIsystem(this);
        this.deltaTime = 0;

        this.isArriveBuilding = {};
        this.homeDefaultPos = { x: this.w * 0.35, y: this.h * 0.35 };
        this.playerPos = JSON.parse(JSON.stringify(this.homeDefaultPos));
        this.player = new Player(this);
        this.activeObj = new HomeObject(this);

        this.isMute = false;
        this.isUsePlayer = false;
    }
    setup() {
        this.uiSystem.setup();
        this.player.setup();
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
        this.playerPos.x += this.player.vx;
        this.playerPos.y += this.player.vy;
        this.player.update();
        this.activeObj.update();
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app.renderer.resize(this.w, this.h);
        this.app.stage.x = this.app.renderer.width * this.anchor;
        this.app.stage.y = this.app.renderer.height * this.anchor;

        this.uiSystem.resize();
        this.player.resize();
        this.activeObj.resize();
        this.mouse.resize();
        this.app.stage.sortChildren();
    }

    test() {
        if (k['Enter']) {
            //以中心比例定位(x,y)座標
            let mousePos = this.manager.app.renderer.plugins.interaction.mouse.global;
            let pos = {
                x: (mousePos.x / w) - 0.5,
                y: (mousePos.y / h) - 0.5
            }
            console.log(`mouse position (scale/center):${pos.x},${pos.y}`);
        }
    }

    arrived(building, bool = true) { this.isArriveBuilding[building] = bool }
    isArrive(building) { return this.isArriveBuilding[building] }

    addChild(...e) {
        this.activeObj.container.addChild(...e);
        this.activeObj.container.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.activeObj.container.removeChildren(); }
        else { this.activeObj.container.removeChild(...e); }
    }

    loadPage(obj) {
        this.loader.loadAsset(function () {
            this.app.renderer.backgroundColor = ColorSlip.lightBlue;
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.playerPos = this.homeDefaultPos;
            this.activeObj = obj;
            this.activeObj.setup().then(function () {
                this.app.stage.addChild(this.uiSystem.container, this.mouse.cursor)
                this.app.stage.sortChildren();
            }.bind(this));
        }.bind(this));
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
                this.loadPage(new HomeObject(this));
                break;
            case Page.bron:
                this.loadPage(new BronObject(this));
                break;
            case Page.childhood:
                this.loadPage(new ChildhoodObject(this));
                break;
            case Page.youth:
                this.loadPage(new YouthObject(this));
                break;
            case Page.elderly:
                this.loadPage(new ElderlyObject(this));
                break;
            case Page.company:
                this.loadPage(new CompanyObject(this));
                break;
            case Page.market:
                this.loadPage(new MarketObject(this));
                break;
            case Page.know:
                this.loadPage(new KnowObject(this));
                break;
        }
    }
}

const loadList = [
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
    //homepage
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
]

const loadList_other = [
    //bron
    "image/building/bron/bron.png",
    "image/building/bron/bron_bg.png",
    "image/building/bron/calendar.png",
    "image/building/bron/distributed.png",
    "image/building/bron/photo.png",
    "image/building/bron/calendar_shadow.png",
    "image/building/bron/distributed_shadow.png",
    "image/building/bron/photo_shadow.png",
    //childhood
    "image/building/childhood/childhood.png",
    "image/building/childhood/childhood_bg.png",
    "image/building/childhood/book.png",
    "image/building/childhood/doll.png",
    "image/building/childhood/toys.png",
    "image/building/childhood/wallCalendar.png",
    "image/building/childhood/book_shadow.png",
    "image/building/childhood/doll_shadow.png",
    "image/building/childhood/toys_shadow.png",
    "image/building/childhood/wallCalendar_shadow.png",
    //youth
    "image/building/youth/youth.png",
    "image/building/youth/youth_bg.png",
    "image/building/youth/graduate.png",
    "image/building/youth/info.png",
    "image/building/youth/bus.png",
    "image/building/youth/instruction.png",
    "image/building/youth/traffic.png",
    "image/building/youth/bus_shadow.png",
    "image/building/youth/instruction_shadow.png",
    "image/building/youth/traffic_shadow.png",
    //elderly
    "image/building/elderly/elderly.png",
    "image/building/elderly/elderly_bg.png",
    "image/building/elderly/distributed.png",
    "image/building/elderly/story.png",
    "image/building/elderly/distributed_shadow.png",
    "image/building/elderly/story_shadow.png",
    //event
    "image/building/market/market.png",
    "image/building/market/market_bg.png",
    "image/building/market/signup.png",
    "image/building/market/signup_shadow.png",
    //company
    "image/building/company/company.png",
    "image/building/company/company_bg.png",
    "image/building/company/commodity.png",
    "image/building/company/donate.png",
    "image/building/company/exit.png",
    "image/building/company/commodity_shadow.png",
    "image/building/company/donate_shadow.png",
    "image/building/company/exit_shadow.png",
    //education

];