import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";
import ObjectGridEvalConfig from "../../domain/ObjectGridEvalConfig";


export default class ConstCell implements ObjectGridCell {
    public get isEmpty(): boolean {
        return false;
    }

    public constructor(
        private readonly value: any,
    ) {
    }

    public eval(config: ObjectGridEvalConfig, meta: ObjectGridCellMeta): any {
        return this.value;
    }
}
