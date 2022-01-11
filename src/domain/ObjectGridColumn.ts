import { setProperty } from "./util";


export default class ObjectGridColumn {
    public readonly path: string[];

    public constructor(
        path: string[],
    ) {
        this.path = Object.freeze([...path]) as any;
    }

    public setTo(target: object, value: any): void {
        setProperty(target, this.path, value);
    }
}
