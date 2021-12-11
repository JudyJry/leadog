import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";

export class Manager {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.canvasScale = 1;
        this.app = new PIXI.Application({
            width: w,
            height: h,
            backgroundColor: 0xc1f9f8,
            antialias: true,
            view: document.getElementById("mainPIXI")
        });
        this.app.stage.x = this.app.renderer.width * 0.5;
        this.app.stage.y = this.app.renderer.height * 0.5;
        this.app.resize = (w, h) => {
            this.w = w;
            this.h = h;
            this.app.renderer.resize(w, h);
            this.app.stage.x = this.app.renderer.width * 0.5;
            this.app.stage.y = this.app.renderer.height * 0.5;
        }
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

        this.isArriveBuilding = {};
        this.playerDefaultPos = { x: w * 0.35, y: h * 0.35 };
        this.playerPos;
        this.mousePos;
        this.ui = undefined;
        this.player = undefined;
        this.homeObj = [];
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
        this.playerPos = { x: this.playerDefaultPos.x, y: this.playerDefaultPos.y };
        for (let i = 0; i < this.homeObj.length; i++) {
            this.app.stage.addChild(this.homeObj[i].container);
        }
        this.app.stage.addChild(this.player.container, this.ui.container);
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