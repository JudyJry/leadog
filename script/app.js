import Manager from "./Manager.js";

//build app
const manager = new Manager();
//setup
onload = function () {
    manager.setup();
    //update
    manager.app.ticker.add((d) => {
        manager.update();
    });
}
//resize
onresize = function () { manager.resize(); };