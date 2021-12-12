import * as PIXI from 'pixi.js';
import ResourceLoader from "./ResourceLoader.js";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import UIsystem from './UI.js';
import Player from './Player.js';
import * as HomeObject from "./HomeObject.js";

export default class Manager {
    constructor() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvasScale = 1;
        this.app = new PIXI.Application({
            width: this.w,
            height: this.h,
            backgroundColor: 0xc1f9f8,
            antialias: true,
            view: document.getElementById("mainPIXI")
        });
        this.app.stage.x = this.app.renderer.width * 0.5;
        this.app.stage.y = this.app.renderer.height * 0.5;
        this.loader = new ResourceLoader(this.app);
        this.loader.loadTexture([
            "image/home.svg",
            "image/location.svg",
            "image/logo.svg",
            "image/map.svg",
            "image/menu.svg",
            "image/notify.svg",
            "image/player.svg",
            "image/point.svg",
            "image/question.svg",
            "image/search.svg",
            "image/setting.svg",
            "image/user.svg",
            "image/wave.svg",
        ]);

        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this);
        this.uiSystem = new UIsystem(this);

        this.isArriveBuilding = {};
        this.homeDefaultPos = { x: this.w * 0.35, y: this.h * 0.35 };
        this.playerPos = JSON.parse(JSON.stringify(this.homeDefaultPos));
        this.player = new Player(this);
        this.homeObj = {};
    }
    setup() {
        this.uiSystem.setup();
        this.player.setup();
        this.keyboard.pressed = (k) => {
            if (k['Enter']) {
                this.homeObj.building.container.children.forEach((e) => {
                    if (this.isArrive(e.children.at(-1).text)) {
                        alert(`You enter the ${e.children.at(-1).text}!`)
                        return;
                    }
                });
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
    }
    update() {
        this.uiSystem.update();
        this.mouse.update();
        this.playerPos.x += this.player.vx;
        this.playerPos.y += this.player.vy;
        this.player.update();
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app.renderer.resize(this.w, this.h);
        this.app.stage.x = this.app.renderer.width * 0.5;
        this.app.stage.y = this.app.renderer.height * 0.5;
        this.uiSystem.resize();
        this.player.resize();
    }
    
    arrived(building, bool = true) { this.isArriveBuilding[building] = bool }
    isArrive(building) { return this.isArriveBuilding[building] }

    toHomePage() {
        this.loader.loadAsset(function(){
            this.app.stage.removeChildren();
            this.playerPos = this.homeDefaultPos;
            for (let [_, value] of Object.entries(this.homeObj)) { this.app.stage.addChild(value.container); }
            this.app.stage.addChild(this.player.container, this.uiSystem.container);
            this.app.stage.sortChildren();
        }.bind(this));
    }
}