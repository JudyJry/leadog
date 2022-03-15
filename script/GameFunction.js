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
export function createSprite(url, anchor = 0.5, scale = 1) {
    let s = PIXI.Sprite.from(url);
    switch (Object.prototype.toString.call(anchor)) {
        case "[object Number]":
            s.anchor.set(anchor);
            break;
        case "[object Array]":
            s.anchor.set(anchor[0], anchor[1]);
            break;
        case "[object Object]":
            s.anchor.set(anchor.x, anchor.y);
            break;
    }
    switch (Object.prototype.toString.call(scale)) {
        case "[object Number]":
            s.scale.set(scale);
            break;
        case "[object Array]":
            s.scale.set(scale[0], scale[1]);
            break;
        case "[object Object]":
            s.scale.set(scale.x, scale.y);
            break;
    }
    return s
}
export function createText(string, style, anchor = 0.5, scale = 1) {
    let s = new PIXI.Text(string, style);
    switch (Object.prototype.toString.call(anchor)) {
        case "[object Number]":
            s.anchor.set(anchor);
            break;
        case "[object Array]":
            s.anchor.set(anchor[0], anchor[1]);
            break;
        case "[object Object]":
            s.anchor.set(anchor.x, anchor.y);
            break;
    }
    switch (Object.prototype.toString.call(scale)) {
        case "[object Number]":
            s.scale.set(scale);
            break;
        case "[object Array]":
            s.scale.set(scale[0], scale[1]);
            break;
        case "[object Object]":
            s.scale.set(scale.x, scale.y);
            break;
    }
    return s
}
export function addPointerEvent(e) {
    e.interactive = true;
    e.buttonMode = true;
    if (e._events.pointertap || e._events.pointerover || e._events.pointerout) {
        e.removeAllListeners();
    }
    e.on("pointertap", onTap);
    if (e.overEvent) {
        e.on("pointerover", onOverE);
        e.on("pointerout", onOutE);
    } else {
        e.on("pointerover", onOver);
        e.on("pointerout", onOut);
    }

    function onTap(event) { e.clickEvent(e); }
    function onOver(event) { e.isPointerOver = true; }
    function onOut(event) { e.isPointerOver = false; }
    function onOverE(event) { e.isPointerOver = true; e.overEvent(e); }
    function onOutE(event) { e.isPointerOver = false; e.overEvent(e); }
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