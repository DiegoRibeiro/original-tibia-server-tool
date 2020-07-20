/**
 * module for parsing the contents of dat folder from tibia virgin files
 */
import fs from "fs";

interface entry {
    Name: string;
    Flags?: string;
    Attributes?: string;
    Description?: string;
}

interface key {
    [index: number]: entry;
}

interface objectTypes {
    server: key;
    client: key;
}

export class objectConveter {
    private path: string;

    constructor(path: string) {
        this.path = path;
    }

    private parseLines(lines: string[]): objectTypes {
        let left: number = lines.length;
        let i: number = 0;
        let typeId: number = -1;

        let json: objectTypes = {
            server: {},
            client: {}
        };

        while(left > 0) {
            let line = lines[i];

            // ignoring coments
            if(line.startsWith("#")) {
                left--;
                i++;
                continue;
            }
            else if(line === '') {
                left--;
                i++;
                continue;
            }
            else if(line.startsWith("TypeID")) {
                let t: string[] = line.split(/\s/);
                typeId = parseInt(t[7]);

                if(typeId < 100) {
                    json.server[typeId] = {
                        Name: ""
                    };
                }
                else {
                    json.client[typeId] = {
                        Name: ""
                    };
                }

                left--;
                i++;
            }
            else if(line.startsWith("Name")) {
                let t: string[] = line.split(/"/);

                if(typeId < 100) {
                    json.server[typeId].Name = t[t.length - 2];
                }
                else {
                    json.client[typeId].Name = t[t.length - 2];
                }

                left--;
                i++;
            }
            else if(line.startsWith("Flags")) {
                let t: string[] = line.split(/\s/);

                if(typeId < 100) {
                    json.server[typeId].Flags = t[t.length - 1];
                }
                else {
                    json.client[typeId].Flags = t[t.length - 1];
                }

                left--;
                i++;
            }
            else if(line.startsWith("Attributes")) {
                let t: string[] = line.split(/\s/);

                if(typeId < 100) {
                    json.server[typeId].Attributes = t[t.length - 1];
                }
                else {
                    json.client[typeId].Attributes = t[t.length - 1];
                }

                left--;
                i++;
            }
            else if(line.startsWith("Description")) {
                let t: string[] = line.split(/"/);

                if(typeId < 100) {
                    json.server[typeId].Description = t[t.length - 2];
                }
                else {
                    json.client[typeId].Description = t[t.length - 2];
                }

                left--;
                i++;
            }
            else {
                console.log(json);
                console.log("something went wrong");
                process.exit(-1);
            }
        }

        return json;
    }

    public exportToJsonFile(jsonPath: string): void {
        let contents: string = fs.readFileSync(this.path, {encoding: 'utf8'});
        let lines: string[] = contents.split(/\r?\n/);
        let json: objectTypes = this.parseLines(lines);
        fs.writeFileSync(jsonPath, JSON.stringify(json));
    }
}