import * as PIXI from 'pixi.js';

export function debounce(f, delay = 250) {
    let timer = null;
    return () => {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => { f.apply(context, args); }, delay)
    }
}
export function deepclone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
export function addPointerEvent(e) {
    e.interactive = true;
    e.buttonMode = true;
    e.on("pointertap", onTap);
    e.on("pointerover", onOver);
    e.on("pointerout", onOut);

    function onTap(event) { e.clickEvent(e); }
    function onOver(event) { e.isPointerOver = true; }
    function onOut(event) { e.isPointerOver = false; }
}

export function scopeCollision(a, b) {
    let aa = a.getBounds();
    let bb = b.getBounds();
    let collision = undefined;
    //Left
    if (aa.x < bb.x) {
        aa.x = bb.x;
        collision = "left";
    }
    //Top
    if (aa.y < bb.y) {
        aa.y = bb.y;
        collision = "top";
    }
    //Right
    if (aa.x + aa.width > bb.width) {
        aa.x = bb.width - aa.width;
        collision = "right";
    }
    //Bottom
    if (aa.y + aa.height > bb.height) {
        aa.y = bb.height - aa.height;
        collision = "bottom";
    }
    return collision;
}
export function rectCollision(a, b) {
    let aa = a.getBounds();
    let bb = b.getBounds();
    return aa.x + aa.width > bb.x && aa.x < bb.x + bb.width && aa.y + aa.height > bb.y && aa.y < bb.y + bb.height;
}
export function directionCollision(a, b) {
    let aa = a.getBounds();
    let bb = b.getBounds();
    let collision = undefined;
    //left
    if (aa.x + aa.width > bb.x && aa.x < bb.x) {
        collision = "left";
    }
    //Right
    if (aa.x < bb.x + bb.width && aa.x + aa.width > bb.x + bb.width) {
        collision = "right";
    }
    return collision;
}
export function pointCollision(a, b) {
    let bb = b.getBounds();
    return a.x > bb.x && a.x < bb.x + bb.width && a.y > bb.y && a.y < bb.y + bb.height;
}
export function calcCircleHitArea(a, s = 1) {
    let aa = a.getBounds();
    return new PIXI.Circle(0, 0, (aa.x + aa.width) / s);
}

export function animateValue(id, start, end, duration, easing = linear) {
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let obj = document.getElementById(id);
    let startTime = new Date();
    let offset = 1;
    let remainderTime = 0;

    let step = function () {
        current += increment;
        obj.innerHTML = current;

        if (current != end) {
            setTimeout(step, easing(duration, range, current));
        }
    };

    setTimeout(step, easing(duration, range, start));
}
function linear(duration, range, current) {
    return ((duration * 2) / Math.pow(range, 2)) * current;
}