import { Duration } from "../src/models/generic";

describe('testing class Duration', () => {
    test('toString()', () => {
        let duration = new Duration(40);
        expect(duration.toString()).toStrictEqual('40m');
        expect(duration.toString(true)).toStrictEqual('0h 40m');
        
        duration = new Duration(0, 1);
        expect(duration.toString()).toStrictEqual('1h');
        expect(duration.toString(true)).toStrictEqual('1h 0m');

        duration.minutes = 0;
        expect(duration.toString()).toStrictEqual('');
        expect(duration.toString(true)).toStrictEqual('');

        duration = new Duration(55, 2);
        expect(duration.toString()).toStrictEqual('2h 55m');
    });
});
