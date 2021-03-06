if(process.argv.length < 3) {
    console.log(`Usage: node main.js 'PATH/TO/object.srv'`)
    process.exit(0);
}

import {objectConveter} from './tibia_module/dat';

let oc = new objectConveter(process.argv[2]);
oc.exportToJsonFile("./output/objectTypes.json");