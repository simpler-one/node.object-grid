import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";
import ObjectGridEvalConfig from "../../domain/ObjectGridEvalConfig";


export default class EmptyCell implements ObjectGridCell {
    public static readonly Instance: EmptyCell = new EmptyCell();


    public get isEmpty(): boolean {
        return true;
    }

    public eval(config: ObjectGridEvalConfig, meta: ObjectGridCellMeta): any {
        return config.emptyValue;
    }
}
