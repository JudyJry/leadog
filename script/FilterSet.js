import { GlowFilter } from 'pixi-filters';
import { ColorSlip } from './ColorSlip';

const FilterSet = {
    link: new GlowFilter({
        distance: 10,
        outerStrength: 7,
        innerStrength: 0,
        color: ColorSlip.yellow,
        quality: 0.5
    }),
    
}
export { FilterSet };