export default class Synthesizer {
    static encode(obj: any): string {
        let jsonString = JSON.stringify(obj);
        let result = Buffer.from(jsonString, 'utf8').toString('base64');
        return result;
    }

    static decode(str: string): Record<string, any> {
        let jsonString = Buffer.from(str, 'base64').toString('utf8');
        let result = JSON.parse(jsonString);
        return result;
    }
}
