import * as PIXI from 'pixi.js';
import gsap from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GlowFilter } from 'pixi-filters';
import * as gamef from "./GameFunction.js";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

export class GameObject {
    constructor(manager, name = undefined) {
        this.name = name;
        this.container = new PIXI.Container();
        this.manager = manager;
        this.draw = undefined;
        this.setup = () => { this.manager.app.stage.addChild(this.draw()); };
        this.resize = () => { this.draw() };
        this.update = undefined;
    }
}

export class Player {
    constructor(manager) {
        this.manager = manager;
        this.container = new PIXI.Container();
        this.scale = 0.21;
        this.sprite = new PIXI.Sprite();
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(this.scale);
        this.w = this.manager.w;
        this.h = this.manager.h;
    }
    setPosition(x, y) {
        let _x = x / this.w;
        let _y = y / this.h;
        this.container.position.set(_x, _y);
    }
    draw() {
        this.sprite.texture = PIXI.Texture.from("image/player.svg");
        this.sprite.position.set(this.w / -2, this.h / -2);
        this.setPosition(this.manager.playerDefaultPos.x,this.manager.playerDefaultPos.y);
    }
    setup() {
        this.draw();
        this.container.addChild(this.sprite)
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.draw();
    }
    update() {
        gsap.to(this.container, { duration: 0.2, x: this.manager.playerPos.x, y: this.manager.playerPos.y });
    }
}

export class Background {
    constructor(manager) {
        this.manager = manager;
        this.container = new PIXI.Container();
        this.sprite = new PIXI.Sprite();
        this.spriteHeight = this.sprite.texture.height;
        this.w = this.manager.w;
        this.h = this.manager.h;
    }
    setup() {
        this.sprite.texture = PIXI.Texture.from("image/map.svg");
        this.spriteHeight = this.sprite.texture.height + 900;
        this.sprite.anchor.set(0.5);
        this.manager.canvasScale = this.h / this.spriteHeight;
        this.sprite.scale.set(this.manager.canvasScale);
        this.container.addChild(this.sprite);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.manager.canvasScale = this.h / this.spriteHeight;
        this.sprite.scale.set(this.manager.canvasScale);
    }
    update() {

    }
}

export class Building {
    constructor(manager) {
        this.manager = manager;
        this.filter = new GlowFilter({
            distance: 6,
            outerStrength: 6,
            innerStrength: 0,
            color: 0xedda6e,
            quality: 0.5
        });
        this.container = new PIXI.Container();
        this.scale = 0.2;
        this.spriteHeight = 50;
        this.textHeight = this.spriteHeight + 10;
        this.w = 1920;
        this.h = this.manager.h;
    }
    drawBuilding(n, x, y) {
        let c = new PIXI.Container();
        let s = new PIXI.Sprite();
        let t = new PIXI.Text(n, this.manager.UItextStyle);
        let _x = (x * this.w);
        let _y = (y * this.h);

        s.anchor.set(0.5);
        s.scale.set(this.scale);
        s.filters = [this.filter];
        s.texture = PIXI.Texture.from("image/location.svg");
        t.anchor.set(0.5);
        t.position.set(0, this.spriteHeight * -1);
        t.alpha = 0;

        c.position.set(_x, _y);
        c.addChild(s, t);
        this.container.addChild(c);
    }
    draw() {
        this.drawBuilding("捐款", -0.008, -0.319);
        this.drawBuilding("配對", 0.028, -0.08);
        this.drawBuilding("活動", -0.14, 0.02);
        this.drawBuilding("外部連結", -0.004, 0.25);
        this.drawBuilding("出生", 0.129, -0.228);
        this.drawBuilding("幼年", 0.195, -0.091);
        this.drawBuilding("壯年", 0.209, 0.111);
        this.drawBuilding("老年", 0.142, 0.205);
    }
    setup() {
        this.draw();
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        for (let i = 0; i < this.container.children.length; i++) {
            let building = this.container.children[i];
            let t = building.children.at(-1);
            let s = building.children[0];
            this.manager.arrived(t.text, gamef.rectCollision(this.manager.player.container, building));
            if (this.manager.isArrive(t.text)) {
                s.filters = [this.filter];
                gsap.to(t, {
                    duration: 1,
                    y: this.textHeight * -1,
                    alpha: 1
                });
            }
            else {
                s.filters = [];
                gsap.to(t, {
                    duration: 0.5,
                    y: this.spriteHeight * -1,
                    alpha: 0
                });
            }
        }
    }
}

export class Tree {
    constructor(manager) {
        this.name = 'tree';
        this.manager = manager;
        this.container = new PIXI.Container();
        this.filter = new GlowFilter({
            distance: 5,
            outerStrength: 5,
            innerStrength: 0,
            color: 0xedda6e,
            quality: 0.5
        });
        this.angle = 15 * (Math.PI / 180);
        this.w = this.manager.w;
        this.h = this.manager.h;
    }
    drawTree(x, y) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let tree = PIXI.Sprite.from("image/tree.png");
        tree.anchor.set(0.5, 1);
        tree.scale.set(0.25);
        tree.filters = [this.filter];
        tree.position.set(_x, _y);
        this.container.addChild(tree);
    }
    draw() {
        this.drawTree(0.25, 0.1);
        this.drawTree(0.1, -0.1);
    }
    setup() {
        this.draw();
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        for (let i = 0; i < this.container.children.length; i++) {
            let e = this.container.children[i];
            this.manager.arrived(this.name + i, gamef.rectCollision(this.manager.player.container, e));
            if (this.manager.isArrive(this.name + i)) {
                let collision = gamef.directionCollision(this.manager.player.container, e);
                if (collision == "left") {
                    gsap.to(e, {
                        duration: 1,
                        rotation: this.angle
                    });
                }
                else if (collision == "right") {
                    gsap.to(e, {
                        duration: 1,
                        rotation: this.angle * -1
                    });
                }
            }
            else {
                gsap.to(e, {
                    duration: 5,
                    rotation: 0
                });
            }
        }
    }
}

export class Wave {
    constructor(manager) {
        this.name = 'wave';
        this.manager = manager;
        this.container = new PIXI.Container();
        this.time = 2;
        this.delay = 0.8;
        this.scale = 0.2;
        this.w = 1920;
        this.h = this.manager.h;
    }
    drawWave(x, y, d) {
        let _x = (x * this.w);
        let _y = (y * this.h);
        let s = PIXI.Sprite.from("image/wave.svg");
        s.scale.set(this.scale);
        s.alpha = 0;
        s.position.set(_x, _y);
        let tl = gsap.timeline({ repeat: -1, repeatDelay: 1, delay: d });
        tl.to(s, { duration: this.time, x: _x + 50, alpha: 1, ease: "none" });
        tl.to(s, { duration: this.time, x: _x + 100, alpha: 0, ease: "none" });
        this.container.addChild(s);
    }
    draw() {
        this.drawWave(-0.3, -0.4, this.delay * 0);
        this.drawWave(-0.5, -0.3, this.delay * 1);
        this.drawWave(0.3, 0.4, this.delay * 2);
        this.drawWave(-0.5, 0.3, this.delay * 3);
        this.drawWave(0.3, -0.4, this.delay * 4);
    }
    setup() {
        this.draw();
        this.container.position.set(0, 0);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() {

    }
}

export class UI {
    constructor(manager) {
        this.name = 'UI';
        this.manager = manager;
        this.scale = 0.25;
        this.container = new PIXI.Container();
        this.logo = new PIXI.Sprite();
        this.logo.anchor.set(0, 1);
        this.user = new PIXI.Container();
        this.point = new PIXI.Container();
        this.search = new PIXI.Container();
        this.notify = new PIXI.Container();
        this.setting = new PIXI.Container();
        this.menu = new PIXI.Container();
        this.question = new PIXI.Container();
        this.home = new PIXI.Container();
        this.crol = new PIXI.Container();
        this.w = this.manager.w;
        this.h = this.manager.h;
    }
    drawIcon(path, anchor = 0.5) {
        let icon = PIXI.Sprite.from(path);
        icon.scale.set(this.scale);
        icon.anchor.set(anchor);
        icon.interactive = true;
        icon.buttonMode = true;
        icon.hitArea = gamef.calcCircleHitArea(icon, this.scale);
        return icon;
    }
    drawLogo(x, y) {
        this.logo.texture = PIXI.Texture.from("image/logo.svg");
        let _x = (x * this.w);
        let _y = (y * this.h);
        this.logo.scale.set(this.scale);
        this.logo.position.set(_x, _y);
        this.container.addChild(this.logo);
    }
    drawUser(x, y) {
        this.user.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let icon = this.drawIcon("image/user.svg");
        let g = new PIXI.Graphics()
            .beginFill(0x000000, 0.1)
            .drawRoundedRect(0, -35, 250, 70, 100)
            .endFill();
        let userName = new PIXI.Text("遊客", this.manager.UItextStyle);
        let userLevel = new PIXI.Text("Level.1", this.manager.UItextStyleSmall);
        userName.anchor.set(0, 0.5);
        userName.position.set(100, 0);
        userLevel.anchor.set(0, 0.5);
        userLevel.position.set(100, 55);
        this.user.addChild(g, userName, userLevel, icon);
        this.user.position.set(_x, _y);
        this.container.addChild(this.user);
    }
    drawPoint(x, y) {
        this.point.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let icon = this.drawIcon("image/point.svg");
        let g = new PIXI.Graphics()
            .beginFill(0x000000, 0.1)
            .drawRoundedRect(-25, -35, 200, 70, 100)
            .endFill();
        let pointText = new PIXI.Text("100", this.manager.UItextStyle);
        pointText.anchor.set(0, 0.5);
        pointText.position.set(50, 0);
        this.point.addChild(g, pointText, icon);
        this.point.position.set(_x, _y);
        this.container.addChild(this.point);
    }
    drawSearch(x, y) {
        this.search.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let icon = this.drawIcon("image/search.svg");
        let g = new PIXI.Graphics()
            .beginFill(0x000000, 0.1)
            .drawRoundedRect(-325, -35, 350, 70, 100)
            .endFill();
        let searchText = new PIXI.Text("搜尋", this.manager.UItextStyle);
        searchText.anchor.set(0, 0.5);
        searchText.position.set(-290, 0);
        this.search.addChild(g, searchText, icon);
        this.search.position.set(_x, _y);
        this.container.addChild(this.search);
    }
    drawNotify(x, y) {
        this.notify.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let icon = this.drawIcon("image/notify.svg");
        let g = new PIXI.Graphics()
            .beginFill(0x000000, 0.1)
            .drawRoundedRect(-25, -30, 500, 60, 100)
            .endFill();
        let notifyText = new PIXI.Text("感謝\"喵喵\"捐贈100元", this.manager.UItextStyle);
        notifyText.anchor.set(0, 0.5);
        notifyText.position.set(50, 0);
        this.notify.addChild(g, notifyText, icon);
        this.notify.pivot.set(this.notify.width / 2, 0);
        this.notify.position.set(_x, _y);
        this.container.addChild(this.notify);
    }
    drawOther(x, y, t, c, u) {
        c.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let icon = this.drawIcon(u);
        let text = new PIXI.Text(t, this.manager.UItextStyleSmall);
        text.anchor.set(0.5);
        text.position.set(0, 50);
        c.addChild(text, icon);
        c.position.set(_x, _y);
        this.container.addChild(c);
    }
    drawCrol(x, y) {
        this.crol.removeChildren();
        let _x = (x * this.w);
        let _y = (y * this.h);
        let right = new PIXI.Graphics()
            .beginFill(0x0, 0.1)
            .drawRoundedRect(0, 0, 90, 90, 10)
            .endFill()
            .beginFill(0xffffff)
            .moveTo(30, 25)
            .lineTo(30, 65)
            .lineTo(64, 45);
        right.pivot.set(right.width / 2, right.height / 2);

        let down = clone(right, [-100, 0], 90);
        let left = clone(right, [-200, 0], 180);
        let up = clone(right, [-100, -100], 270);

        this.crol.addChild(up, down, left, right);
        this.crol.children.forEach((e) => {
            e.interactive = true;
            e.buttonMode = true;
        });
        this.crol.pivot.set(this.crol.width / 2, this.crol.height / 2);
        this.crol.position.set(_x, _y);
        this.container.addChild(this.crol);
        function clone(s, p, r) {
            let c = s.clone();
            c.pivot.set(c.width / 2, c.height / 2);
            c.rotation = r * (Math.PI / 180);
            c.position.set(p[0], p[1]);
            return c;
        }
    }
    draw() {
        this.drawLogo(-0.45, 0.45);
        this.drawUser(-0.42, -0.4);
        this.drawPoint(-0.25, -0.4);
        this.drawSearch(0.33, -0.4);
        this.drawOther(0.38, -0.4, "設定", this.setting, 'image/setting.svg');
        this.drawOther(0.43, -0.4, "選單", this.menu, 'image/menu.svg');
        this.drawOther(0.43, -0.28, "問題", this.question, 'image/question.svg');
        this.drawOther(0.43, -0.16, "首頁", this.home, 'image/home.svg');
        this.drawNotify(0, 0.43);
        this.drawCrol(0.5, 0.5);
    }
    crolEvent(k) {
        //0:up, 1:down, 2:left, 3:right
        this.crol.children.forEach(e => {
            e.alpha = 1;
        });
        if (k['ArrowUp']) {
            this.crol.children[0].alpha = 2;
        }
        if (k['ArrowDown']) {
            this.crol.children[1].alpha = 2;
        }
        if (k['ArrowLeft']) {
            this.crol.children[2].alpha = 2;
        }
        if (k['ArrowRight']) {
            this.crol.children[3].alpha = 2;
        }
    }
    mouseEvent() {
        for (let i = 1; i < this.container.children.length - 1; i++) {
            let e = this.container.children[i].children.at(-1);
            e.on("pointerdown", onDown.bind(e));
            e.on("pointerup", onUp.bind(e));
            e.on("pointerover", onOver.bind(e));
            e.on("pointerout", onOut.bind(e));
        }
        function onDown(event) { this.clickEvent(); }
        function onUp(event) { }
        function onOver(event) { this.isPointerOver = true; }
        function onOut(event) { this.isPointerOver = false; }

        this.user.children.at(-1).clickEvent = () => { alert("Home Click") }
        this.point.children.at(-1).clickEvent = () => { alert("point Click") }
        this.search.children.at(-1).clickEvent = () => { alert("search Click") }
        this.notify.children.at(-1).clickEvent = () => { alert("notify Click") }
        this.setting.children.at(-1).clickEvent = () => { alert("setting Click") }
        this.menu.children.at(-1).clickEvent = () => { alert("menu Click") }
        this.question.children.at(-1).clickEvent = () => { alert("question Click") }
        this.home.children.at(-1).clickEvent = () => { this.manager.toHomePage(); }
    }
    setup() {
        this.draw();
        this.mouseEvent();
        this.container.position.set(0, 0);
        this.manager.app.stage.addChild(this.container);
    }
    resize() {
        this.w = this.manager.w;
        this.h = this.manager.h;
        this.container.removeChildren();
        this.draw();
    }
    update() {
        for (let i = 1; i < this.container.children.length - 1; i++) {
            let e = this.container.children[i].children.at(-1);
            if (e.isPointerOver) {
                gsap.to(e, { duration: 0.5, pixi: { brightness: 0.9 } });
            }
            else {
                gsap.to(e, { duration: 0.5, pixi: { brightness: 1 } });
            }
        }
    }
}