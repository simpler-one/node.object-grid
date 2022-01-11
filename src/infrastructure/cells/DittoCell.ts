import ObjectGridCell from "../../domain/ObjectGridCell"
import ObjectGridCellMeta from "../../domain/ObjectGridCellMeta";


export default class DittoCell implements ObjectGridCell {
    public static Instance = new DittoCell();

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return meta.prev;
    }
}
