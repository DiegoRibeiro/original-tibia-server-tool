/**
 * parser of the binary format Tibia.dat 7.70 version
 */
import fs from 'fs';

interface chunk {
    address: number,
    byteSize: number
}

enum Hex {
    x00 = 0,
    x01 = 1,
    x02 = 2,
    x03 = 3,
    x04 = 4,
    x05 = 5,
    x07 = 7,
    x08 = 8,
    x09 = 9,
    x0C = 12,
    x0D = 13,
    x0F = 15,
    x10 = 16,
    x15 = 21,
    x18 = 24,
    x1A = 26,
    x1B = 27,
    x1C = 28,
    xFF = 255
}

enum ObjectType {
    BankTile = Hex.x00,
    ClipTile = Hex.x01,
    BottomTile = Hex.x02,
    TopTile = Hex.x03,
    Container = Hex.x04,
    Cumulative = Hex.x05,
    MultiUse = Hex.x07,
    TextWrite = Hex.x08,
    WriteOnce = Hex.x09,
    UnpassTile = Hex.x0C,
    UseEventTile = Hex.x0D,         // used in two diferent flags (usable?)
    Item = Hex.x0F,                 // item ???
    TakeObject = Hex.x10,
    ChangeUseLight = Hex.x15,
    ChangeUse = Hex.x18,
    Corpse = Hex.x1A,
    NotAdded = Hex.x1B,
    DisguiseTile = Hex.xFF
}



export class Parser {
    private path: string;
    private offset: number;
    private buffer: Buffer;

    constructor(path: string) {
        this.path = path;
        this.offset = 0;
        this.buffer = fs.readFileSync(this.path);
    }

    public read(byteSize: number) {
        let data = null;

        switch (byteSize) {
            case 1:
                data = this.buffer.readUInt8(this.offset);
                this.offset += 1;
                break;
            case 2:
                data = this.buffer.readUInt16LE(this.offset);
                this.offset += 2;
                break;
            case 4:
                data = this.buffer.readUInt32LE(this.offset);
                this.offset += 4;
                break;
            default:
                throw "not implemented yet";
        }

        return data;
    }

    public readChunk(info: chunk) {
        let data = null;
        this.offset = info.address;

        switch (info.byteSize) {
            case 1:
                data = this.buffer.readUInt8(this.offset);
                break;
            case 2:
                data = this.buffer.readUInt16LE(this.offset);
                break;
            case 4:
                data = this.buffer.readUInt32LE(this.offset);
                break;
            default:
                throw "not implemented yet";
        }

        return data;
    }

    public mapHeader(objMap: any): void {
        objMap.header = {};

        objMap.header.version = {
            address: 0,
            byteSize: 4
        };

        objMap.header.countItems = {
            address: 4,
            byteSize: 2
        };

        objMap.header.countCreatures = {
            address: 6,
            byteSize: 2
        };

        objMap.header.countEffects = {
            address: 8,
            byteSize: 2
        };

        objMap.header.countMissiles = {
            address: 10,
            byteSize: 2
        }
    }

    public mapObject(objMap: any, untilId: number, printAfter: number) {
        if (objMap.header === undefined) throw "call map header first";
        if (untilId < 100) throw "id start at 100";

        const missiles: chunk = objMap.header.countMissiles;
        this.offset = missiles.address + missiles.byteSize;

        for (let i = 100; i <= untilId; i++) {
            if(i > printAfter)
                console.log("processing object id: ", i);

            // breakpoint based on id
            if (i == untilId) {
                console.log("break");
            }

            // read object type
            const objectType = this.read(1);

            switch (objectType) {
                case ObjectType.BankTile:
                    // read speed
                    const speed = this.read(2);

                    this.readTileDescription();
                    this.readSpriteData(i, printAfter);
                    break;
                case ObjectType.ClipTile:
                case ObjectType.BottomTile:
                case ObjectType.TopTile:
                case ObjectType.Container:
                case ObjectType.Cumulative:
                case ObjectType.MultiUse:
                case ObjectType.TextWrite:
                case ObjectType.WriteOnce:
                case ObjectType.UnpassTile:
                case ObjectType.UseEventTile:
                case ObjectType.Item:
                case ObjectType.TakeObject:
                case ObjectType.ChangeUseLight:
                case ObjectType.ChangeUse:
                case ObjectType.Corpse:
                case ObjectType.NotAdded:
                    this.readTileDescription();
                    this.readSpriteData(i, printAfter);
                    break;
                case ObjectType.DisguiseTile:
                    // read sprite data
                    this.readSpriteData(i, printAfter);
                    break;
                default:
                    console.log(i);
                    throw "not implemented yet";
            }

            if(i > printAfter)
                console.log("address next sprite ", i + 1, " = ", this.offset);
        }
    }

    readTileDescription() {
        // read object description until end flag (0xFF)
        let byte;
        do {
            byte = this.read(1);
        } while (byte != Hex.xFF);
    }

    readSpriteData(k: any, a: any) {
        let width = this.read(1);
        let height = this.read(1);
        if (width > 1 || height > 1) {
            let unknownByte = this.read(1);
        }
        let blendFrames = this.read(1);
        let xRepeat = this.read(1);
        let yRepeat = this.read(1);
        let zRepeat = this.read(1);
        let animationLength = this.read(1);

        let spriteLength = width * height * blendFrames * xRepeat * yRepeat * zRepeat * animationLength;

        let spritesId = [];
        for (let i = 0; i < spriteLength; i++) {
            spritesId.push(this.read(2));
        }

        if(k > a)
            console.log(spritesId);
    }
}