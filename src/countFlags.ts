import { JsonUtil, FileUtil } from './tibia_module/util';
import type { objectTypes } from './tibia_module/dat';

try {
    const json: objectTypes = JsonUtil.open(process.argv[2]);
    //console.log(json);

    let map: any = {};
    let seen: any = {};
    let flag: any = null;
    let lastFlag: any = null;
    let currentId: any = 100;
    let client = json.client;

    for(let key in client) {
        flag = client[key].Flags;

        if(lastFlag == null || lastFlag != flag) {
            seen[flag] = seen[flag] === undefined ? 1 : seen[flag] + 1;
        }
        //console.log(flag+seen[flag])
        if(map[flag+seen[flag]] === undefined) {
            map[flag+seen[flag]] = currentId + "";
        }
        else {
            map[flag+seen[flag]] += " - " + currentId;
        }

        lastFlag = flag;
        currentId++;
    }

    FileUtil.write("./output/map.json", JSON.stringify(map));
} catch(e) {
    console.log(e);
}