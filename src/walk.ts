if(process.argv.length < 4) {
    console.log(`Usage: node walk.js 'PATH/TO/objectTypes.json' 'PATH/TO/Tibia.dat'`);
    process.exit(0);
}

console.log(process.cwd());

import fs from 'fs';
import type {objectTypes} from './tibia_module/dat'
import {Parser} from './tibia_module/dat'

let contents: string = fs.readFileSync(process.argv[2], {encoding: 'utf8'});
let json: objectTypes = JSON.parse(contents);

let server: string[] = Object.keys(json.server).sort((a: string, b: string) => {
    return parseInt(a) - parseInt(b);
});
let client: string[] = Object.keys(json.client).sort((a: string, b: string) => {
    return parseInt(a) - parseInt(b);
});

console.log(server.length + client.length);

let parser: Parser = new Parser(process.argv[3]);
//parser.parse();