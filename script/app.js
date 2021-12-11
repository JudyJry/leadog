import Keyboard from "./KeyBoard.js";
import * as GameObject from "./GameObject.js";
import { Manager, ResourceLoader } from "./GameObjectManager.js";

const loader = new ResourceLoader();
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

//build app
let w = window.innerWidth;
let h = window.innerHeight;

//build gameObject

const manager = new Manager(w, h);

const kb = new Keyboard();
const ui = new GameObject.UI(manager);

const player = new GameObject.Player(manager);

const building = new GameObject.Building(manager);

const tree = new GameObject.Tree(manager);
const wave = new GameObject.Wave(manager);

const background = new GameObject.Background(manager);

//keyboard event
const pos = { x: w * 0.35, y: h * 0.35 };
let speed = -5;
let vx = 0, vy = 0;

manager.homeObj = [background, wave, building, tree];
manager.player = player;
manager.ui = ui;

kb.pressed = (k) => {
    ui.crolEvent(k);
    if (k['ArrowLeft']) {
        vx = speed;
        player.sprite.scale.set(player.scale * -1, player.scale);
    }
    else if (k['ArrowRight']) {
        vx = -speed;
        player.sprite.scale.set(player.scale * 1, player.scale);
    }
    else { vx = 0; }
    if (k['ArrowUp']) {
        vy = speed;
    }
    else if (k['ArrowDown']) {
        vy = -speed;
    }
    else { vy = 0; }

    if (k['Enter']) {
        building.forEach((e) => {
            if (manager.isArrive(e.name)) {
                alert(`You enter the ${e.name}!`)
                return;
            }
        });
        let mousePos = manager.app.renderer.plugins.interaction.mouse.global;
        let pos = {
            x: (mousePos.x / w) - 0.5,
            y: (mousePos.y / h) - 0.5
        }
        console.log(pos);
    }
}

//setup
window.onload = function () {
    background.setup();
    wave.setup();
    building.setup();
    tree.setup();
    player.setup();
    ui.setup();
    //update
    manager.app.ticker.add((d) => {
        manager.mousePos = manager.app.renderer.plugins.interaction.mouse.global;
        pos.x += vx;
        pos.y += vy;
        building.update();
        tree.update();
        player.update(pos);
        ui.update();
    });
}

//resize
onresize = function () {
    w = window.innerWidth;
    h = window.innerHeight;
    manager.app.resize(w, h);
    background.resize();
    wave.resize();
    building.resize();
    tree.resize();
    player.resize();
    ui.resize();
};



