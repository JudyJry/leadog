import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";

export default class ResourceLoader {
    constructor(app) {
        this.loader = app.loader;
        this.page = $(`<div id="loadingPage"><p>Loading...<br><span id="progress">0%<span></p></div>`);
        this.pageText = $(this.page).children("p");
        this.progress = $(this.pageText).children("#progress");

    }
    setProgress(progress) {
        this.progress.html(`${Math.floor(progress)}%`);
    }
    setupLoadingPage() {
        this.page.css('opacity', '1');
        $("body").prepend(this.page);
        this.setProgress(0);
    }
    loadProgressHandler(loader, _resource) {
        this.setProgress(loader.progress);
    }
    loadTexture(list) {
        this.setupLoadingPage();
        this.loader.add(list);
        this.loader.onProgress.add(this.loadProgressHandler.bind(this));
        this.loader.load(this.init.bind(this));
    }
    loadAsset(func) {
        this.setupLoadingPage();
        function process() {
            return new Promise((resolve, _reject) => {
                setTimeout(() => {
                    func.apply(this, arguments);
                    resolve();
                }, 1000);
            });
        };
        process()
            .then(() => {
                this.setProgress(100);
                this.init();
            })
            .catch(() => { console.log('fall reload') });
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