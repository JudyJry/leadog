import * as HomeObject from "./HomeObject.js";
import Manager from "./GameObjectManager.js";


//build app
const manager = new Manager();

//build gameObject
manager.homeObj = {
    "background":new HomeObject.Background(manager),
    "wave":new HomeObject.Wave(manager),
    "building":new HomeObject.Building(manager),
    "tree":new HomeObject.Tree(manager)
};
//setup
onload = function () {
    manager.setup();
    manager.homeObj.background.setup();
    manager.homeObj.wave.setup();
    manager.homeObj.building.setup();
    manager.homeObj.tree.setup();
    manager.app.stage.sortChildren();
    //update
    manager.app.ticker.add((d) => {
        manager.update();
        manager.homeObj.building.update();
        manager.homeObj.tree.update();
    });
}
//resize
onresize = function () {
    manager.resize();
    manager.homeObj.background.resize();
    manager.homeObj.wave.resize();
    manager.homeObj.building.resize();
    manager.homeObj.tree.resize();
    manager.app.stage.sortChildren();
};



