import ObjectGridCellMeta from "./ObjectGridCellMeta";


export default interface ObjectGridCell {
    eval(meta: ObjectGridCellMeta, env: object): any;
}
