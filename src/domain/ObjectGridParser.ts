import ObjectGrid from "./ObjectGrid";


export default interface ObjectGridParser {
    parse(text: string | Buffer): ObjectGrid;
}
