import * as PIXI from 'pixi.js';
import ResourceLoader from "./ResourceLoader.js";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import UIsystem from './UI.js';
import Player from './Player.js';
import HomeObject from "./HomeObject.js";
import BronObject from './BronObject.js';
import ChildhoodObject from './ChildhoodObject.js';
import { ColorSlip } from "./ColorSlip.js";

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
        this.homeObj = new HomeObject(this);
        this.bronObj = new BronObject(this);
        this.childhoodObj = new ChildhoodObject(this);
        this.activeObj = this.homeObj;
    }
    setup() {
        this.uiSystem.setup();
        this.player.setup();
        this.activeObj.setup();
        this.mouse.setup();
        this.app.stage.sortChildren();
        this.keyboard.pressed = (k) => {
            this.activeObj.addKeyEvent();
        }
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
        this.homeObj.resize();
        this.mouse.resize();
        this.app.stage.sortChildren();
    }

    test() {
        if (k['Enter']) {
            //以中心比例定位(x,y)座標
            let mousePos = manager.app.renderer.plugins.interaction.mouse.global;
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
        this.app.stage.addChild(...e);
        this.app.stage.sortChildren();
    }
    removeChild(...e) {
        if (e.length === 0) { this.app.stage.removeChildren(); }
        else { this.app.stage.removeChild(...e); }
    }

    loadPage(obj) {
        this.loader.loadAsset(function () {
            this.app.renderer.backgroundColor = ColorSlip.lightBlue;
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.removeChild();
            this.playerPos = this.homeDefaultPos;
            this.activeObj = obj;
            this.activeObj.setup();
            this.keyboard.pressed = (k) => {
                this.activeObj.addKeyEvent();
            }
            this.addChild(this.player.container, this.uiSystem.container, this.mouse.cursor);
            this.app.stage.sortChildren();
        }.bind(this));
    }
    loadAction(act) {
        this.loader.loadAsset(function () {
            this.app.renderer.backgroundColor = ColorSlip.white;
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.removeChild();
            this.activeObj = act;
            this.activeObj.setup();
            this.keyboard.pressed = (k) => { }
            this.addChild(this.mouse.cursor);
        }.bind(this));
    }
    toOtherPage(e) {
        switch (e.name) {
            case "出生":
                this.loadPage(this.bronObj);
                break;
            case "幼年":
                this.loadPage(this.childhoodObj);
                break;
            case "壯年":
                this.toUndonePage(e);
                break;
            case "老年":
                this.toUndonePage(e);
                break;
            case "捐款":
                this.toUndonePage(e);
                break;
            case "配對":
                this.toUndonePage(e);
                break;
            case "活動":
                this.toUndonePage(e);
                break;
            case "外部連結":
                this.toUndonePage(e);
                break;
            default:
                this.toUndonePage(e);
                break;
        }
    }
    toUndonePage(e) {
        this.loader.loadAsset(function () {
            this.removeChild();
            this.playerPos = this.homeDefaultPos;
            //this.homeObj.reload();
            let t = new PIXI.Text(`這是一個未完成的${e.name}頁面`, new PIXI.TextStyle({
                fontFamily: "GenSenRounded-B",
                fontSize: 30,
                fill: ColorSlip.darkOrange,
            }));
            t.anchor.set(0.5);
            t.position.set(0, 0);
            this.addChild(t, this.player.container, this.uiSystem.container);
            this.app.stage.sortChildren();
        }.bind(this), () => {
            e.isEntering = false;
        });
    }
}

const loadList = [
    //video
    "video/LOGO.mp4",
    "video/childhood_kelly.mp4",
    //uiSystem
    "image/home.svg",
    "image/location.svg",
    "image/logo.svg",
    "image/menu.svg",
    "image/notify.svg",
    "image/player.svg",
    "image/point.svg",
    "image/question.svg",
    "image/search.svg",
    "image/setting.svg",
    "image/user.svg",
    "image/wave.svg",
    //homepage
    "image/homepage/map.png",
    "image/homepage/island.png",
    "image/homepage/tree_front.png",
    "image/homepage/bron.png",
    "image/homepage/childhood.png",
    "image/homepage/youth.png",
    "image/homepage/elderly.png",
    "image/homepage/company.png",
    "image/homepage/education.png",
    "image/homepage/action.png",
    //bron
    //childhood
    "image/building/childhood/childhood.png",
    "image/building/childhood/childhood_bg.png",
    "image/building/childhood/book.png",
    "image/building/childhood/doll.png",
    "image/building/childhood/toys.png",
    "image/building/childhood/wallCalendar.png",
    //youth
    //elderly
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
    "image/video/childhood/Kelly/stage_1_title.png",
    "image/video/childhood/Kelly/stage_1_hint.png",
    "image/video/childhood/Kelly/stage_2_title.png",
    "image/video/childhood/Kelly/stage_2_hint.png",
    "image/video/childhood/Kelly/stage_3_title.png",
    "image/video/childhood/Kelly/stage_3_hint.png",
];