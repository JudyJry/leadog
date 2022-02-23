import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextStyle } from './TextStyle.js';
import { addPointerEvent } from './GameFunction.js';
import { uiData } from './Data.js';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export default class UIsystem {
    constructor(manager) {
        this.manager = manager;
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container = new PIXI.Container();
        this.uiContainer = new PIXI.Container();
        this.uiSpacing = 85;
        this.container.zIndex = 100;
        this.uiContainer.zIndex = 100;
        this.ui = {
            "book": new Book(this.manager, this),
            "notify": new Notify(this.manager, this),
            "user": new User(this.manager, this),
            "menu": new Menu(this.manager, this),
            "home": new Index(this.manager, this),
        }
        this.logo = undefined;
    }
    drawLogo() {
        this.logo = PIXI.Sprite.from("image/logo.svg");
        this.logo.scale.set(0.8);
        this.logo.position.set((-0.5 * this.w) + 30, (-0.5 * this.h) + 10);
        this.container.addChild(this.logo);
    }
    setup() {
        for (let [_, e] of Object.entries(this.ui)) { e.setup(); }
        this.uiContainer.position.set((-0.5 * this.w) + 110, (-0.5 * this.h) + 240);
        this.drawLogo();
        this.container.addChild(this.uiContainer);
        this.container.position.set(0, 0);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        for (let [_, e] of Object.entries(this.ui)) { e.resize(); }
        this.uiContainer.position.set((-0.5 * this.w) + 110, (-0.5 * this.h) + 240);
        this.logo.position.set((-0.5 * this.w) + 30, (-0.5 * this.h) + 10);
    }
    update() {
        for (let [_, e] of Object.entries(this.ui)) { e.update(); }
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
        icon.clickEvent = this.clickEvent.bind(this);
        return icon;
    }
    clickEvent() {
        alert("click " + this.name);
    }
    setup() {
        this.draw();
        if (this.icon) addPointerEvent(this.icon);
        this.UIsystem.uiContainer.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
        if (this.icon) addPointerEvent(this.icon);
    }
    update() {
        if (this.icon.isPointerOver) {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
}
class Book extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Book";
        this.draw = function () {
            this.icon = this.drawIcon('image/book.svg');
            this.container.position.set(0, 0 * this.UIsystem.uiSpacing);
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
            this.container.position.set(0, 1 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
}
class User extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "User";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/user.svg');
            this.drawIndex();
            this.container.position.set(0, 2 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_1.svg");
        this.indexBg.anchor.set(0.05, 0.5);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        drawItem(this, 0, "image/buy.svg",
            function () { }.bind(this));
        drawItem(this, 1, "image/info.svg",
            function () { }.bind(this));

        function drawItem(self, index, path, clickEvent) {
            let i = PIXI.Sprite.from(path);
            i.anchor.set(0.5, 1);
            i.scale.set(0.8);
            i.position.set(90 + (index * 75), 25);
            i.clickEvent = clickEvent;
            addPointerEvent(i);
            self.index.addChild(i);
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}
class Menu extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Menu";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/menu.svg');
            this.drawIndex();
            this.container.position.set(0, 3 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_1.svg");
        this.indexBg.anchor.set(0.05, 0.5);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        drawItem(this, 0, "image/question.svg",
            function () { }.bind(this));
        this.sound = drawItem(this, 1, "image/soundon.svg",
            function () {
                let e = this.sound;
                if (this.manager.isMute == false) {
                    e.texture = PIXI.Texture.from("image/soundoff.svg");
                    this.manager.isMute = true;
                }
                else if (this.manager.isMute == true) {
                    e.texture = PIXI.Texture.from("image/soundon.svg");
                    this.manager.isMute = false;
                }
            }.bind(this));
        function drawItem(self, index, path, clickEvent) {
            let i = PIXI.Sprite.from(path);
            i.anchor.set(0.5, 1);
            i.scale.set(0.8);
            i.position.set(90 + (index * 75), 25);
            i.clickEvent = clickEvent;
            addPointerEvent(i);
            self.index.addChild(i);
            return i;
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}
class Index extends UI {
    constructor(manager, UIsystem) {
        super(manager, UIsystem);
        this.name = "Index";
        this.turn = false;
        this.index = new PIXI.Container();
        this.draw = function () {
            this.icon = this.drawIcon('image/index.svg');
            this.drawIndex();
            this.container.position.set(0, 4 * this.UIsystem.uiSpacing);
            this.container.addChild(this.icon);
        }
    }
    drawIndex() {
        this.indexBg = PIXI.Sprite.from("image/ui_2.svg");
        this.indexBg.anchor.set(0, 0.24);
        this.indexBg.scale.set(this.scale);
        this.index.addChild(this.indexBg);
        for (let i = 0; i < uiData.length; i++) {
            let s = PIXI.Sprite.from(uiData[i].url);
            s.anchor.set(0.5, 1);
            s.scale.set(0.8);
            if (i < 4) { s.position.set(90 + (i * 75), 25); }
            else if (i >= 4) { s.position.set(90 + ((i - 4) * 75), 95); }
            s.clickEvent = function () { this.manager.toOtherPage(uiData[i].name); }.bind(this);
            addPointerEvent(s);
            this.index.addChild(s);
        }
    }
    clickEvent() {
        if (!this.turn) {
            this.container.addChildAt(this.index, 0);
            this.turn = true;
        }
        else {
            this.container.removeChild(this.index);
            this.turn = false;
        }
    }
}

export class Cancel {
    constructor(manager, x, y, clickEvent) {
        this.manager = manager;
        this.name = "Cancel";
        this.container = new PIXI.Container();
        this.container.zIndex = 100;
        this.icon = undefined;
        this.clickEvent = clickEvent;
        this.scale = 1;
        this.x = x;
        this.y = y;
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.draw = function () {
            this.icon = this.drawIcon('image/cancel.svg');
            this.container.position.set(this.x, this.y);
            this.container.addChild(this.icon);
            addPointerEvent(this.icon);
        }
    }
    drawIcon(path, anchor = 0.5) {
        let icon = PIXI.Sprite.from(path);
        icon.scale.set(this.scale);
        icon.anchor.set(anchor);
        icon.clickEvent = this.clickEvent;
        return icon;
    }
    setup() {
        this.draw();
        this.manager.addChild(this.container);
    }
    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        if (this.icon.isPointerOver) {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 0.9 } });
        }
        else {
            gsap.to(this.icon, { duration: 0.5, pixi: { brightness: 1 } });
        }
    }
    remove() {
        this.manager.removeChild(this.container);
    }
}