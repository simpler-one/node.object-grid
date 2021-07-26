import ObjectGridCellMeta from "./ObjectGridCellMeta";


export default abstract class ObjectGridCell {
    public abstract eval(meta: ObjectGridCellMeta, env: object): any;
}

export class ConstCell extends ObjectGridCell {
    public constructor(
        private readonly value: any,
    ) {
        super();
    }

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return this.value;
    }
}

export class EvalCell extends ObjectGridCell {
    public constructor(
        private readonly expression: string,
    ) {
        super();
    }

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return eval(this.expression);
    }
}

export class DittoCell extends ObjectGridCell {
    public static Instance = new DittoCell();

    public eval(meta: ObjectGridCellMeta, env: object): any {
        return meta.prev;
    }
}


export class TemplateRefCell extends ObjectGridCell {
    public eval(meta: ObjectGridCellMeta, env: object): any {
        throw new Error("NotImplemented")
    }
}
