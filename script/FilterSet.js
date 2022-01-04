import { GlowFilter } from 'pixi-filters';
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