import { GlowFilter } from 'pixi-filters';
import { ColorSlip } from './ColorSlip';


let BlinkGlowFilterOptions = {
    distance: 10,
    outerStrength: 5,
    innerStrength: 0.1,
    color: ColorSlip.yellow,
    quality: 0.1,
    knockout: false,
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
            quality: this.options.quality,
            knockout: this.options.knockout
        });
        this.Maxblink = this.options.outerStrength;
        this.blinkSpeed = this.options.blinkSpeed;
    }
    effect() {
        if (this.filter.outerStrength > this.Maxblink || this.filter.outerStrength <= 0) {
            this.blinkSpeed = -this.blinkSpeed;
        }
        this.filter.outerStrength += this.blinkSpeed;
    }
    /**
     * @param {number} number
     */
    get distance() { return this.filter.distance; }
    set distance(number) { this.filter.distance = number; }
    /**
     * @param {number} number
     */
    get outerStrength() { return this.filter.outerStrength; }
    set outerStrength(number) { this.filter.outerStrength = number; }
    /**
     * @param {number} number
     */
    get innerStrength() { return this.filter.innerStrength; }
    set innerStrength(number) { this.filter.innerStrength = number; }
    /**
     * @param {number} number
     */
    get color() { return this.filter.color; }
    set color(number) { this.filter.color = number; }
    /**
     * @param {number} number
     */
    get quality() { return this.filter.quality; }
    set quality(number) { this.filter.quality = number; }
    /**
    * @param {boolean} boolean
    */
    get knockout() { return this.filter.knockout; }
    set knockout(boolean) { this.filter.knockout = boolean; }
}
const FilterSet = {
    link: () => new GlowFilter({
        distance: 5,
        outerStrength: 5,
        innerStrength: 0,
        color: ColorSlip.yellow,
        quality: 0.1
    }),
    blink: () => new BlinkGlowFilter(),
    blink_alpha: () => new BlinkGlowFilter({
        innerStrength: 0,
        knockout: true
    })
}
export { FilterSet };