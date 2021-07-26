/**
 * Set a property value.
 *
 * プロパティの値を設定します。
 * @param obj object
 * @param path path to property
 * @param value value
 * @param createsChildren 
 * @returns success to set
 */
export function setProperty(obj: object, path: string[], value: any, createsChildren: boolean = true): boolean {
    if (obj === null || obj === undefined) {
        return false;
    }

    let cur = obj;
    for (const k of path.slice(0, -1)) {
        if (cur[k] === null || cur[k] === undefined) {
            if (!createsChildren) {
                return false;
            }

            cur[k] = {};
        }

        cur = cur[k];
    }

    cur[path[path.length - 1]] = value;
    return true;
}



export function transpose<T>(array: T[][]): T[][] {
    const rowLen = array.length;
    const colLen = array[0].length;

    const result = [];
    for (let c = 0; c < colLen; c++) {
        const col = [];
        for (let r = 0; r < rowLen; r++) {
            col.push(array[r][c]);
        }
        result.push(col);
    }

    return result;
}
