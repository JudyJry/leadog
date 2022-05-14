import * as PIXI from 'pixi.js';
import gsap from "gsap";
import $ from "jquery";
import { AnimatedGIFLoader } from '@pixi/gif';
PIXI.Loader.registerPlugin(AnimatedGIFLoader);

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
    async loadTexture(list, onComplete = () => { }) {
        this.setupLoadingPage();
        console.log("load texture");
        try {
            await new Promise((resolve, _reject) => {
                console.log("load texture Promise ");
                this.loader.add(list);
                this.loader.onProgress.add(this.loadProgressHandler.bind(this));
                this.loader.onError.add((_loader, resource) => { console.log("load error:" + resource.url) });
                this.loader.onLoad.add((_loader, resource) => { console.log("onload:" + resource.url); });
                this.loader.onComplete.add(() => { console.log("load texture resolve "); resolve(); });
                this.loader.load(() => { this.loader.reset(); this.detachAll(); console.log("load texture reset "); });
            })
            this.init();
            onComplete();
        }
        catch {
            setTimeout(() => {
                this.setProgress(100);
                this.init();
                onComplete();
            }, 100);
        }

    }
    async loadAsset(func, onComplete = () => { }, list = undefined) {
        this.setupLoadingPage();
        console.log("load Asset");
        await new Promise((resolve, _reject) => {
            if (list !== undefined) {
                console.log("load Asset Promise ");
                this.loader.add(list);
                this.loader.onProgress.add(this.loadProgressHandler.bind(this));
                this.loader.onError.add((_loader, resource) => { console.log("load error:" + resource.url) });
                this.loader.onLoad.add((_loader, resource) => { console.log("onload:" + resource.url); });
                this.loader.onComplete.add(() => { console.log("load Asset resolve "); resolve(); });
                this.loader.load(() => { this.loader.reset(); this.detachAll(); console.log("load Asset reset "); });
            }
            else {
                setTimeout(() => {
                    resolve();
                }, 200);
            }
        })
            .then(() => {
                func.apply(this, arguments);
                setTimeout(() => {
                    this.setProgress(100);
                    this.init();
                    onComplete();
                }, 100);
            })
            .catch(() => {
                func.apply(this, arguments);
                setTimeout(() => {
                    this.setProgress(100);
                    this.init();
                    onComplete();
                }, 200);
            });
    }
    detachAll() {
        this.loader.onProgress.detachAll();
        this.loader.onError.detachAll();
        this.loader.onLoad.detachAll();
        this.loader.onComplete.detachAll();
    }
    init() {
        gsap.to(this.page, {
            duration: 0.2,
            alpha: 0,
            onComplete: function () { $("#loadingPage").remove(); }
        });
        //console.log("All files loaded");
    }
}