import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import HomeObject from './HomeObject.js';
import { TextStyle } from './TextStyle.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class UIsystem {
    constructor(manager) {
        this.manager = manager;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container = new PIXI.Container();
        this.uiContainer = new PIXI.Container();
        this.uiSpacing = -75;
        this.container.zIndex = 100;
        this.uiContainer.zIndex = 100;
        this.ui = {
            "book": new Book(this.manager, this),
            "menu": new Menu(this.manager, this),
            "notify": new Notify(this.manager, this),
            "user": new User(this.manager, this),
            "home": new Home(this.manager, this),
        }
        this.logo = new Logo(this.manager, this);
        this.crol = new CrolArrow(this.manager, this);
    }
    setup() {
        for (let [_, e] of Object.entries(this.ui)) { e.setup(); }
        this.uiContainer.position.set((0.45 * this.w), (-0.4 * this.h));
        this.logo.setup();
        this.crol.setup();
        this.crol.addCrolEvent();
        this.container.addChild(this.uiContainer);
        this.container.position.set(0, 0);
        this.manager.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        for (let [_, e] of Object.entries(this.ui)) { e.resize(); }
        this.uiContainer.position.set((0.45 * this.w), (-0.4 * this.h));
        this.logo.resize();
        this.crol.resize();
    }
    update() {
        for (let [_, e] of Object.entries(this.ui)) { e.update(); }
        this.crol.update();
    }
}
export class UI {
    constructor(manager, UIsystem) {
        this.manager = manager;
        this.UIsystem = UIsystem;
        this.name = "UI";
        this.container = new PIXI.Container();
        this.draw = undefined;
        this.icon = undefined;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.scale = 0.75;
        this.ts = TextStyle.UI;
        this.tsm = TextStyle.UI_small;
    }
    drawIcon(path, anchor = 0.5) {
        let icon = PIXI.Sprite.from(path);
        icon.scale.set(this.scale);
        icon.anchor.set(anchor);
        return icon;
    }
    addPointerEvent() {
        this.icon.interactive = true;
        this.icon.buttonMode = true;
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
    setup() {
        this.draw();
        if (this.icon) this.addPointerEvent();
        this.UIsystem.uiContainer.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
        if (this.icon) this.addPointerEvent();
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
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Logo";
        this.sprite = new PIXI.Sprite();
        this.scale = 0.2;
        this.draw = function (x = -0.47, y = -0.47) {
            let _x = (x * this.w);
            let _y = (y * this.h);
            this.sprite.texture = PIXI.Texture.from("image/logo.png");
            this.sprite.anchor.set(0);
            this.sprite.scale.set(this.scale);
            this.sprite.position.set(_x, _y);
            this.container.addChild(this.sprite);
        }
    }
    setup() {
        this.draw();
        if (this.icon) this.addPointerEvent();
        this.UIsystem.container.addChild(this.container);
    }
}
class Book extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Book";
        this.draw = function () {
            this.icon = this.drawIcon('image/book.svg');
            this.container.position.set(4 * this.UIsystem.uiSpacing, 0);
            this.container.addChild(this.icon);
        }
    }
}
class Menu extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Menu";
        this.draw = function () {
            this.icon = this.drawIcon('image/menu.svg');
            this.container.position.set(3 * this.UIsystem.uiSpacing, 0);
            this.container.addChild(this.icon);
        }
    }
}
class Notify extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Notify";
        this.draw = function () {
            this.icon = this.drawIcon('image/notify.svg');
            this.container.position.set(2 * this.UIsystem.uiSpacing, 0);
            this.container.addChild(this.icon);
        }
    }
}
class User extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "User";
        this.draw = function () {
            this.icon = this.drawIcon('image/user.svg');
            this.container.position.set(1 * this.UIsystem.uiSpacing, 0);
            this.container.addChild(this.icon);
        }
    }
}
class Home extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Home";
        this.draw = function () {
            this.icon = this.drawIcon('image/home.svg');
            this.container.position.set(0 * this.UIsystem.uiSpacing, 0);
            this.container.addChild(this.icon);
        }
    }
    clickEvent() {
        this.manager.loadPage(new HomeObject(this.manager));
    }
}
class CrolArrow extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.draw = function (x = 0.5, y = 0.5) {
            if (this.manager.isUsePlayer) {
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
            }
            function clone(s, p, r) {
                let c = s.clone();
                c.pivot.set(c.width / 2, c.height / 2);
                c.rotation = r * (Math.PI / 180);
                c.position.set(p[0], p[1]);
                return c;
            }
        }
    }
    addCrolEvent(p = this.manager.player) {
        if (this.manager.isUsePlayer) {
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
    }
    setup() {
        this.draw();
        if (this.icon) this.addPointerEvent();
        this.UIsystem.container.addChild(this.container);
    }
    update(p = this.manager.player, k = this.manager.keyboard.key, m = this.manager.mouse.isPressed) {
        if (this.manager.isUsePlayer) {
            this.container.children.forEach(e => { e.alpha = 1; });
            if ((this.up.isPointerOver && m) || k['ArrowUp']) { this.up.downEvent(); }
            else if ((this.down.isPointerOver && m) || k['ArrowDown']) { this.down.downEvent(); }
            else { p.vy = 0; }
            if ((this.left.isPointerOver && m) || k['ArrowLeft']) { this.left.downEvent(); }
            else if ((this.right.isPointerOver && m) || k['ArrowRight']) { this.right.downEvent(); }
            else { p.vx = 0; }
        }
    }
    resize() {
        if (this.manager.isUsePlayer) {
            this.w = window.innerWidth;
            this.h = window.innerHeight;
            this.container.removeChildren();
            this.draw();
            this.addCrolEvent();
        }
    }
}