import { GlowFilter } from 'pixi-filters';
import { ColorSlip } from './ColorSlip';


let BlinkGlowFilterOptions = {
    distance: 10,
    outerStrength: 5,
    innerStrength: 0.1,
    color: ColorSlip.yellow,
    quality: 0.1,
    blinkSpeed: 0.05
}
class BlinkGlowFilter {
    constructor(options = BlinkGlowFilterOptions) {
        this.options = Object.assign({}, BlinkGlowFilterOptions, options);
        this.filter = new GlowFilter({
            distance: this.options.distance,
            outerStrength: this.options.outerStrength,
            innerStrength: this.options.innerStrength,
            color: this.options.color,
            quality: this.options.quality
        });
        this.Maxblink = this.filter.outerStrength;
        this.blinkSpeed = this.options.blinkSpeed;
    }
    effect() {
        if (this.filter.outerStrength >= this.Maxblink || this.filter.outerStrength <= 0) {
            this.blinkSpeed = -this.blinkSpeed;
        }
        this.filter.outerStrength += this.blinkSpeed;
    }
    setOuter(number) {
        this.filter.outerStrength = number;
    }
}
const FilterSet = {
    link: new GlowFilter({
        distance: 10,
        outerStrength: 5,
        innerStrength: 0.1,
        color: ColorSlip.yellow,
        quality: 0.1
    }),
    blink: new BlinkGlowFilter()
}
export { FilterSet };