export default class Keyboard {
    constructor() {
        this.key = {};
        this.pressed = () => { };
        onkeydown = onkeyup = (e) => {
            this.key[e.code] = e.type == 'keydown';
            this.pressed(this.key);
        }
    }
}