import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { PageObject, linkObject, Background, Player, Door, Video } from './GameObject.js';
import { ChildhoodAction_Dora, ChildhoodAction_Kelly } from './ChildhoodAction.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class ChildhoodObject extends PageObject {
    constructor(manager) {
        super(manager);
        this.name = "ChildhoodObject";
        this.userData = this.manager.userData.childhood;
        this.children = {
            "background": new Background(this.manager, this, "image/building/childhood/bg.png"),
            "door": new Door(this.manager, this, -0.404, -0.032, "image/building/childhood/door.png"),
            "video": new ChildhoodVideo(this.manager, this),
            "book": new Book(this.manager, this),
            "puzzle": new Puzzle(this.manager, this),
            "player": new Player(this.manager, this)
        };
    }
}
class ChildhoodVideo extends Video {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Video";
        this.x = 0.372;
        this.y = -0.059;
        this.url = "image/building/childhood/video.png";
        this.videoList = [
            function () { return new ChildhoodAction_Kelly(this.manager, this) }.bind(this),
            function () { return new ChildhoodAction_Dora(this.manager, this) }.bind(this),
        ];
    }
}
class Book extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.name = "Book";
        this.x = -0.302;
        this.y = -0.103;
        this.url = "image/building/childhood/book.png";
        this.zoomIn = 2;
        this.spriteHeight = 120;
    }
}
class Puzzle extends linkObject {
    constructor(manager, page) {
        super(manager, page);
        this.isComplete = this.page.userData.puzzle_complete;
        this.x = -0.083;
        this.y = -0.046;
        this.url = this.isComplete ? "image/building/childhood/puzzle_complete.png" : "image/building/childhood/puzzle.png";
        this.zoomIn = 1.4;
        this.hintList = [
            "黃金獵犬個性聰明、有主見在教導指令時可以快速學會！",
            "黃金獵犬的臉比較短、且耳朵也比較短。",
            "黃金獵犬的的毛髮較長，多為奶油或深咖啡色。",
            "黃金獵犬的的尾巴蓬鬆且有裝飾毛。",
            "拉不拉多的個性溫和、活潑，較沒有攻擊性。",
            "拉不拉多的臉比較長且耳朵也比較長。",
            "拉不拉多多為短毛，毛色有黑色、米黃色、巧克力色。",
            "拉不拉多的尾巴為短毛無裝飾毛。",
            "黃金拉拉個性平易近人、服從性高，面對危險能更加的敏銳！",
        ]
    }
    clickEvent() {
        this.blink.outerStrength = 0;
        this.sprite.interactive = false;
        let tl = gsap.timeline({ onComplete: gameStart.bind(this) });
        tl.to(this.page.container.scale, { duration: 0.5, x: this.zoomIn, y: this.zoomIn });
        tl.to(this.page.container, { duration: 0.5, x: -this._x * this.zoomIn, y: (-this._y + 90) * this.zoomIn }, 0);
        this.page.children.player.move(this._x, this.sprite.width);
        this.page.isZoomIn = true;
        this.isClick = true;
        if (!this.cancel) { this.drawCancel(); }
        this.cancel.visible = true;

        function gameStart() {

        }
    }
}

const loadList = {
    toys: [
        "image/video/childhood/Kelly/stage_1_title.png",
        "image/video/childhood/Kelly/stage_1_hint.png",
        "image/video/childhood/Kelly/stage_2_title.png",
        "image/video/childhood/Kelly/stage_2_hint.png",
        "image/video/childhood/Kelly/stage_2_img.jpg",
        "image/video/childhood/Kelly/stage_3_title.png",
        "image/video/childhood/Kelly/stage_3_hint.png"
    ]
}
