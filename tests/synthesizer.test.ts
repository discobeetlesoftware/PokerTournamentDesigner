import { PokerChip } from "../src/models/poker_chip";
import Synthesizer from "../src/synthesizer";

describe('testing class Synthesizer', () => {
    test('encode() should work pretty well', () => {
        let chip = new PokerChip(50);
        let text = Synthesizer.encode(chip);
        expect(text).toBeDefined();
        expect(text).toStrictEqual('eyJ2YWx1ZSI6NTAsImNvdW50IjowfQ==');
    });

    test('decode() should work pretty well', () => {
        let text = 'eyJ2YWx1ZSI6NTAsImNvdW50IjowfQ==';
        let obj = Synthesizer.decode(text);
        expect(obj).toBeDefined();
        expect(obj['value']).toStrictEqual(50);
    });
});
