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
            backgroundColor: 0xe0f9fd,
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
        this.app.stage.sortChildren();
        this.keyboard.pressed = (k) => {
            this.homeObj.children.building.addEnterEvent();
            this.bronObj.children.actionTest.addEnterEvent();
            if (k['Enter']) {
                /*
                //以中心比例定位(x,y)座標
                let mousePos = manager.app.renderer.plugins.interaction.mouse.global;
                let pos = {
                    x: (mousePos.x / w) - 0.5,
                    y: (mousePos.y / h) - 0.5
                }
                console.log(mouse position (scale/center):`${pos.x},${pos.y}`);
                */
            }
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
        this.app.stage.sortChildren();
    }

    arrived(building, bool = true) { this.isArriveBuilding[building] = bool }
    isArrive(building) { return this.isArriveBuilding[building] }

    loadPage(obj) {
        this.loader.loadAsset(function () {
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.app.stage.removeChildren();
            this.playerPos = this.homeDefaultPos;
            this.activeObj = obj;
            this.activeObj.setup();
            this.app.stage.addChild(this.player.container, this.uiSystem.container);
            this.app.stage.sortChildren();
        }.bind(this));
    }
    loadAction(act) {
        this.loader.loadAsset(function () {
            this.app.stage.x = this.app.renderer.width * this.anchor;
            this.app.stage.y = this.app.renderer.height * this.anchor;
            this.app.stage.removeChildren();
            this.activeObj = act;
            this.activeObj.setup();
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
            this.app.stage.removeChildren();
            this.playerPos = this.homeDefaultPos;
            //this.homeObj.reload();
            let t = new PIXI.Text(`這是一個未完成的${e.name}頁面`, new PIXI.TextStyle({
                fontFamily: "GenSenRounded-B",
                fontSize: 30,
                fill: ColorSlip.darkOrange,
            }));
            t.anchor.set(0.5);
            t.position.set(0, 0);
            this.app.stage.addChild(t, this.player.container, this.uiSystem.container);
            this.app.stage.sortChildren();
        }.bind(this), () => {
            e.isEntering = false;
        });
    }
}

const loadList = [
    "image/home.svg",
    "image/location.svg",
    "image/logo.svg",
    "image/map.jpeg",
    "image/menu.svg",
    "image/notify.svg",
    "image/player.svg",
    "image/point.svg",
    "image/question.svg",
    "image/search.svg",
    "image/setting.svg",
    "image/user.svg",
    "image/wave.svg",
    "image/video/count5.png",
    "image/video/count4.png",
    "image/video/count3.png",
    "image/video/count2.png",
    "image/video/count1.png",
    "image/video/know.png",
    "image/video/cursor.png",
    "image/video/cursorHint.png",
    "image/video/Goodjob.png",
    "video/childhood_kelly.mp4",
    "image/video/childhood/Kelly/stage_1_title.png",
    "image/video/childhood/Kelly/stage_1_hint.png",
];