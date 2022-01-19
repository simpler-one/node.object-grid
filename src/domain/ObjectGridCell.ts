import ObjectGridCellMeta from "./ObjectGridCellMeta";
import ObjectGridEvalConfig from "./ObjectGridEvalConfig";


export default interface ObjectGridCell {
    get isEmpty(): boolean;

    eval(config: ObjectGridEvalConfig, meta: ObjectGridCellMeta): any;
}
