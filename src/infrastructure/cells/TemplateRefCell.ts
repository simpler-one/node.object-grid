import ObjectGridCell from "../../domain/ObjectGridCell";
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";


export default class TemplateRefCell implements ObjectGridCell {
    public eval(meta: ObjectGridCellMeta, env: object): any {
        throw new Error("NotImplemented");
    }
}
