import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";
import Keyboard from "./KeyBoard.js";
import Mouse from './Mouse.js';
import * as GameObject from "./GameObject.js";

export class Manager {
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
        this.UItextStyle = new PIXI.TextStyle({
            fontFamily: "GenSenRounded-B",
            fontSize: 30,
            fill: 0x666803,
        });
        this.UItextStyleSmall = new PIXI.TextStyle({
            fontFamily: "GenSenRounded-B",
            fontSize: 18,
            fill: 0x666803,
        });

        this.keyboard = new Keyboard();
        this.mouse = new Mouse(this);
        this.ui = new GameObject.UI(this);

        this.isArriveBuilding = {};
        this.homeDefaultPos = { x: this.w * 0.35, y: this.h * 0.35 };
        this.playerPos = JSON.parse(JSON.stringify(this.homeDefaultPos));
        this.player = undefined;
        this.homeObj = [];
    }
    setup(){
        this.keyboard.pressed = (k) => {
            if (k['Enter']) {
                building.container.children.forEach((e) => {
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
    update(){
        this.mouse.update();
        this.playerPos.x += this.player.vx;
        this.playerPos.y += this.player.vy;
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.app.renderer.resize(this.w, this.h);
        this.app.stage.x = this.app.renderer.width * 0.5;
        this.app.stage.y = this.app.renderer.height * 0.5;
    }
    arrived(building, bool = true) { this.isArriveBuilding[building] = bool }
    isArrive(building) { return this.isArriveBuilding[building] }
    toHomePage() {
        let loader = new ResourceLoader();
        loader.load([
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
        this.app.stage.removeChildren();
        this.playerPos = this.homeDefaultPos;
        for (let i = 0; i < this.homeObj.length; i++) {
            this.app.stage.addChild(this.homeObj[i].container);
        }
        this.app.stage.addChild(this.player.container, this.ui.container);
        console.log(this.w);
    }
}

export class ResourceLoader {
    constructor() {
        this.loader = new PIXI.Loader();
        this.page = $(`<div id="loadingPage"><p>Loading...<br>0%</p></div>`);
        this.pageText = $(this.page).children("p");
        $("body").prepend(this.page);
    }
    load(list) {
        this.loader.add(list);
        this.loader.onProgress.add(this.loadProgressHandler.bind(this));
        this.loader.load(this.init.bind(this));
    }
    loadProgressHandler(loader, resource) {

        // 顯示已載入的檔案路徑
        //console.log("loading: " + resource.url);

        // 顯示已載入資源百分比
        this.pageText.html(
            `Loading...<br>
            ${Math.floor(loader.progress)}%`
        );
        //console.log("progress: " + loader.progress + "%");
    }

    init() {
        gsap.to(this.page, {
            duration: 2,
            alpha: 0,
            onComplete: function () { $("#loadingPage").remove(); }
        });

        console.log("All files loaded");
    }
}