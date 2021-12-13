export default class Mouse {
    constructor(manager) {
        this.position = {
            x: 0,
            y: 0
        };
        this.x = this.position.x;
        this.y = this.position.y;
        this.isPressed = false;
        this.mousePos = function () {
            this.position = manager.app.renderer.plugins.interaction.mouse.global;
            this.x = this.position.x;
            this.y = this.position.y;
        };
        onpointerdown = onpointerup = (e) => {
            this.isPressed = e.type == 'pointerdown';
        }
    }
    update(){
        this.mousePos();
    }
}