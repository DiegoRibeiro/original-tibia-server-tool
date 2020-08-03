import {JsonUtil} from './tibia_module/util';
import {Parser} from './tibia_module/dat';
import type {objectTypes} from './tibia_module/dat';

const parser = new Parser(process.argv[2]);

let mapBytes: any = {};

parser.mapHeader(mapBytes);
console.log(mapBytes);

const countItems = parser.readChunk(mapBytes.header.countItems);
const countCreatures = parser.readChunk(mapBytes.header.countCreatures);
const countEffects = parser.readChunk(mapBytes.header.countEffects);
const countMissiles = parser.readChunk(mapBytes.header.countMissiles);

const total = countItems + countCreatures + countEffects + countMissiles;

parser.mapObject(mapBytes, total, 5300);


// 00 00 on sprite id means the sprite 0 transparent from Tibia.spr