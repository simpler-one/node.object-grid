import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";


export default class EvalCell implements ObjectGridCell {
    public constructor(
        private readonly expression: string,
    ) {
    }

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return eval(this.expression);
    }
}
