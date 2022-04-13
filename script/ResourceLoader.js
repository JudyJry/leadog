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
    loadTexture(list) {
        this.setupLoadingPage();
        this.loader.add(list);
        this.loader.onProgress.add(this.loadProgressHandler.bind(this));
        this.loader.onError.add((loader, resource) => { console.log("load error:" + resource.url) });
        this.loader.load(this.init.bind(this));
    }
    loadAsset(func, onComplete = () => { }, list = undefined) {
        this.setupLoadingPage();
        let self = this;
        function process() {
            return new Promise((resolve, _reject) => {
                if (list !== undefined) {
                    self.loader.add(list);
                    self.loader.onProgress.add(self.loadProgressHandler.bind(self));
                    self.loader.onError.add((loader, resource) => { console.log("load error:" + resource.url) });
                    self.loader.load(
                        function () {
                            func.apply(this, arguments);
                            resolve();
                        }.bind(self));
                }
                else {
                    func.apply(this, arguments);
                    setTimeout(() => {
                        resolve();
                    }, 200);
                }
            });
        };
        process()
            .then(() => {
                this.setProgress(100);
                this.init();
                onComplete();
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
    init() {
        gsap.to(this.page, {
            duration: 0.2,
            alpha: 0,
            onComplete: function () { $("#loadingPage").remove(); }
        });
        //console.log("All files loaded");
    }
}