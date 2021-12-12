import Player from "./Player.js";
import * as HomeObject from "./HomeObject.js";
import { Manager } from "./GameObjectManager.js";


//build app
const manager = new Manager();

//build gameObject
const player = new Player(manager);
const building = new HomeObject.Building(manager);
const tree = new HomeObject.Tree(manager);
const wave = new HomeObject.Wave(manager);
const background = new HomeObject.Background(manager);

manager.homeObj = {
    "background":background,
    "wave":wave,
    "building":building,
    "tree":tree
};
manager.player = player;

//keyboard event

//setup
onload = function () {
    manager.setup();
    background.setup();
    wave.setup();
    building.setup();
    tree.setup();
    player.setup();
    manager.app.stage.sortChildren();
    //update
    manager.app.ticker.add((d) => {
        manager.update();
        building.update();
        tree.update();
        player.update();
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
    manager.app.stage.sortChildren();
};



