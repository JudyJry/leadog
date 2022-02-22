import { GlowFilter } from 'pixi-filters';
import { ColorSlip } from './ColorSlip';

const FilterSet = {
    link: new GlowFilter({
        distance: 10,
        outerStrength: 5,
        innerStrength: 0.1,
        color: ColorSlip.yellow,
        quality: 0.1
    }),

}
export { FilterSet };