import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";

export default class ResourceLoader {
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