import fs from 'fs';

export class FileUtil {
    public static write(path: string, data: any) {
        fs.writeFileSync(path, data, {encoding: 'utf8'})
    }
}