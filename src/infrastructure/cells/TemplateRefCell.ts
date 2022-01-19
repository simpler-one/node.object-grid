import ObjectGridCell from "../../domain/ObjectGridCell";
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";
import ObjectGridEvalConfig from "../../domain/ObjectGridEvalConfig";


export default class TemplateRefCell implements ObjectGridCell {
    public get isEmpty(): boolean {
        return false;
    }

    public eval(config: ObjectGridEvalConfig, meta: ObjectGridCellMeta): any {
        throw new Error("NotImplemented");
    }
}
