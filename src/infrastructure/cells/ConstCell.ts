import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";


export default class ConstCell implements ObjectGridCell {
    public constructor(
        private readonly value: any,
    ) {
    }

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return this.value;
    }
}
