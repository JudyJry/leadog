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
const manager = new Manager();
manager.setup();
//build gameObject
const player = new GameObject.Player(manager);
const building = new GameObject.Building(manager);
const tree = new GameObject.Tree(manager);
const wave = new GameObject.Wave(manager);
const background = new GameObject.Background(manager);

manager.homeObj = [background, wave, building, tree];
manager.player = player;

//keyboard event

//setup
onload = function () {
    background.setup();
    wave.setup();
    building.setup();
    tree.setup();
    player.setup();
    manager.ui.setup();
    //update
    manager.app.ticker.add((d) => {
        manager.update();
        building.update();
        tree.update();
        player.update();
        manager.ui.update();
    });
}

//resize
onresize = function () {
    manager.resize();
    background.resize();
    wave.resize();
    building.resize();
    tree.resize();
    player.resize();
    manager.ui.resize();
};



