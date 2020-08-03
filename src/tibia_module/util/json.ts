import fs from 'fs';

export class JsonUtil {
    constructor() {

    }

    public static open(filename: string): any {
        if(filename === undefined) {
            throw "filename is undefined";
        }
        const strJson = fs.readFileSync(filename, {encoding: 'utf8'});
        return JSON.parse(strJson);
    }
}