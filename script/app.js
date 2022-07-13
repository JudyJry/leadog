import Manager from "./Manager.js";

//build app
const manager = new Manager();
//setup
//onload = function () { manager.setup(); }
//resize
onresize = function () { manager.resize(); };

console.log("window.innerWidth:" + window.innerWidth + ", window.innerHeight:" + window.innerHeight);
console.log("window.outerWidth:" + window.outerWidth + ", window.outerHeight:" + window.outerHeight);
console.log("screen.width:" + screen.width + ", screen.height:" + screen.height);
console.log("screen.availWidth:" + screen.availWidth + ", screen.availHeight:" + screen.availHeight);