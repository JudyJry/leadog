import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import * as gf from "./GameFunction.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class UIsystem {
    constructor(manager) {
        this.manager = manager;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container = new PIXI.Container();
        this.container.zIndex = 100;
        this.ui = {
            "user": new User(this.manager),
            "point": new Point(this.manager),
            "search": new Search(this.manager),
            "notify": new Notify(this.manager),
            "setting": new Setting(this.manager),
            "menu": new Menu(this.manager),
            "question": new Question(this.manager),
            "home": new Home(this.manager)
        }
        this.logo = new Logo(this.manager);
        this.crol = new CrolArrow(this.manager);
    }
    setup() {
        for (let [_, value] of Object.entries(this.ui)) { value.setup(this.container); }
        this.logo.setup(this.container);
        this.crol.setup(this.container);
        this.crol.crolEvent();
        this.container.position.set(0, 0);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        for (let [_, value] of Object.entries(this.ui)) { value.resize(); }
    }
    update() {
        for (let [_, value] of Object.entries(this.ui)) { value.update(); }
        this.crol.update();
    }
}

class UI {
    constructor(manager) {
        this.manager = manager;
        this.name = "UI";
        this.container = new PIXI.Container();
        this.draw = undefined;
        this.icon = undefined;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.scale = 0.25;
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
    }
    drawIcon(path, anchor = 0.5) {
        let icon = PIXI.Sprite.from(path);
        icon.scale.set(this.scale);
        icon.anchor.set(anchor);
        icon.interactive = true;
        icon.buttonMode = true;
        icon.hitArea = gf.calcCircleHitArea(icon, this.scale);
        return icon;
    }
    addPointerEvent() {
        this.icon.on("pointertap", onTap.bind(this));
        this.icon.on("pointerover", onOver.bind(this));
        this.icon.on("pointerout", onOut.bind(this));

        function onTap(event) { this.clickEvent(); }
        function onOver(event) { this.isPointerOver = true; }
        function onOut(event) { this.isPointerOver = false; }
    }
    clickEvent() {
        alert("click " + this.name);
    }
    setup(systemContainer) {
        this.draw();
        if (this.icon) this.addPointerEvent();
        systemContainer.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        if (this.isPointerOver) {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
class Logo extends UI {
    constructor() {
        super();
        this.name = "Logo";
        this.sprite = new PIXI.Sprite();
        this.draw = function (x = -0.45, y = 0.45) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/logo.svg");
            this.sprite.anchor.set(0, 1);
            this.sprite.scale.set(this.scale);
            this.sprite.position.set(_x, _y);
            this.container.addChild(this.sprite);
        }
    }
}
class User extends UI {
    constructor() {
        super();
        this.name = "User";
        this.userName = "遊客";
        this.userLevel = 1;
        this.draw = function (x = -0.42, y = -0.4) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon("image/user.svg");
            let g = new PIXI.Graphics()
                .beginFill(0x000000, 0.1)
                .drawRoundedRect(0, -35, 250, 70, 100)
                .endFill();
            this.userNameText = new PIXI.Text(this.userName, this.UItextStyle);
            this.userLevelText = new PIXI.Text(`Level.${this.userLevel}`, this.UItextStyleSmall);
            this.userNameText.anchor.set(0, 0.5);
            this.userNameText.position.set(100, 0);
            this.userLevelText.anchor.set(0, 0.5);
            this.userLevelText.position.set(100, 55);
            this.container.position.set(_x, _y);
            this.container.addChild(g, this.userNameText, this.userLevelText, this.icon);
        }
    }
}
class Point extends UI {
    constructor() {
        super();
        this.name = "Point";
        this.number = 100;
        this.draw = function (x = -0.25, y = -0.4) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon("image/point.svg");
            let g = new PIXI.Graphics()
                .beginFill(0x000000, 0.1)
                .drawRoundedRect(-25, -35, 200, 70, 100)
                .endFill();
            this.pointText = new PIXI.Text(`${this.number}`, this.UItextStyle);
            this.pointText.anchor.set(0, 0.5);
            this.pointText.position.set(50, 0);
            this.container.position.set(_x, _y);
            this.container.addChild(g, this.pointText, this.icon);
        }
    }
}
class Search extends UI {
    constructor() {
        super();
        this.name = "Search";
        this.searchString = "搜尋";
        this.draw = function (x = 0.33, y = -0.4) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon("image/search.svg");
            let g = new PIXI.Graphics()
                .beginFill(0x000000, 0.1)
                .drawRoundedRect(-325, -35, 350, 70, 100)
                .endFill();
            this.searchText = new PIXI.Text(`${this.searchString}`, this.UItextStyle);
            this.searchText.anchor.set(0, 0.5);
            this.searchText.position.set(-290, 0);
            this.container.position.set(_x, _y);
            this.container.addChild(g, this.searchText, this.icon);
        }
    }
}
class Setting extends UI {
    constructor() {
        super();
        this.name = "Setting";
        this.draw = function (x = 0.38, y = -0.4) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon('image/setting.svg');
            this.text = new PIXI.Text("設定", this.UItextStyleSmall);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50);
            this.container.position.set(_x, _y);
            this.container.addChild(this.text, this.icon);
        }
    }
}
class Menu extends UI {
    constructor() {
        super();
        this.name = "Menu";
        this.draw = function (x = 0.43, y = -0.4) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon('image/menu.svg');
            this.text = new PIXI.Text("選單", this.UItextStyleSmall);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50);
            this.container.position.set(_x, _y);
            this.container.addChild(this.text, this.icon);
        }
    }
}
class Question extends UI {
    constructor() {
        super();
        this.name = "Question";
        this.draw = function (x = 0.43, y = -0.28) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon('image/question.svg');
            this.text = new PIXI.Text("問題", this.UItextStyleSmall);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50);
            this.container.position.set(_x, _y);
            this.container.addChild(this.text, this.icon);
        }
    }
}
class Home extends UI {
    constructor(manager) {
        super(manager);
        this.name = "Home";
        this.draw = function (x = 0.43, y = -0.16) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon('image/home.svg');
            this.text = new PIXI.Text("首頁", this.UItextStyleSmall);
            this.text.anchor.set(0.5);
            this.text.position.set(0, 50);
            this.container.position.set(_x, _y);
            this.container.addChild(this.text, this.icon);
        }
    }
    clickEvent() {
        this.manager.toHomePage();
    }
}
class Notify extends UI {
    constructor() {
        super();
        this.name = "Notify";
        this.donateName = "喵喵";
        this.donateSum = 100;
        this.donateString = `感謝"${this.donateName}"捐贈${this.donateSum}元`;
        this.notifyString = JSON.parse(JSON.stringify(this.donateString));
        this.draw = function (x = 0, y = 0.43) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.icon = this.drawIcon("image/notify.svg");
            let g = new PIXI.Graphics()
                .beginFill(0x000000, 0.1)
                .drawRoundedRect(-25, -30, 500, 60, 100)
                .endFill();
            this.notifyText = new PIXI.Text(this.notifyString, this.UItextStyle);
            this.notifyText.anchor.set(0, 0.5);
            this.notifyText.position.set(50, 0);
            this.container.addChild(g, this.notifyText, this.icon);
            this.container.pivot.set(this.container.width / 2, 0);
            this.container.position.set(_x, _y);
        }
    }
}
class CrolArrow extends UI {
    constructor(manager) {
        super(manager);
        this.draw = function (x = 0.5, y = 0.5) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.right = new PIXI.Graphics()
                .beginFill(0x0, 0.1)
                .drawRoundedRect(0, 0, 90, 90, 10)
                .endFill()
                .beginFill(0xffffff)
                .moveTo(30, 25)
                .lineTo(30, 65)
                .lineTo(64, 45);
            this.right.pivot.set(this.right.width / 2, this.right.height / 2);
            this.down = clone(this.right, [-100, 0], 90);
            this.left = clone(this.right, [-200, 0], 180);
            this.up = clone(this.right, [-100, -100], 270);

            this.container.addChild(this.up, this.down, this.left, this.right);
            this.container.children.forEach((e) => { e.interactive = true; e.buttonMode = true; });
            this.container.pivot.set(this.container.width / 2, this.container.height / 2);
            this.container.position.set(_x, _y);
            function clone(s, p, r) {
                let c = s.clone();
                c.pivot.set(c.width / 2, c.height / 2);
                c.rotation = r * (Math.PI / 180);
                c.position.set(p[0], p[1]);
                return c;
            }
        }
    }
    crolEvent(p = this.manager.player) {
        this.container.children.forEach((e) => {
            e.on("pointerover", onOver.bind(e));
            e.on("pointerout", onOver.bind(e));
        });
        function onOver(e) { this.isPointerOver = e.type == "pointerover"; }

        this.up.downEvent = () => { p.vy = p.speed; this.up.alpha = 2; };
        this.down.downEvent = () => { p.vy = -p.speed; this.down.alpha = 2; };
        this.left.downEvent = () => { p.vx = p.speed; this.left.alpha = 2; p.sprite.scale.set(p.scale * -1, p.scale); };
        this.right.downEvent = () => { p.vx = -p.speed; this.right.alpha = 2; p.sprite.scale.set(p.scale * 1, p.scale); };
    }
    update(p = this.manager.player, k = this.manager.keyboard.key, m = this.manager.mouse.isPressed) {
        this.container.children.forEach(e => { e.alpha = 1; });
        if ((this.up.isPointerOver && m) || k['ArrowUp']) { this.up.downEvent(); }
        else if ((this.down.isPointerOver && m) || k['ArrowDown']) { this.down.downEvent(); }
        else { p.vy = 0; }
        if ((this.left.isPointerOver && m) || k['ArrowLeft']) { this.left.downEvent(); }
        else if ((this.right.isPointerOver && m) || k['ArrowRight']) { this.right.downEvent(); }
        else { p.vx = 0; }
    }
}