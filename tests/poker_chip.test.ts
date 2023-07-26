import { PokerChip, PokerChipSet } from "../src/models/poker_chip";
import Synthesizer from "../src/synthesizer";

describe('testing class PokerChip', () => {
    test('constructor', () => {
        let chip = new PokerChip(25, 100, 'green');

        expect(chip.value).toStrictEqual(25);
        expect(chip.count).toStrictEqual(100);
        expect(chip.color).toStrictEqual('green');
    });

    test('decode()', () => {
        let text = 'eyJ2YWx1ZSI6NTAsImNvdW50IjowfQ==';
        let chip = PokerChip.decode(text);
        expect(chip.value).toStrictEqual(50);
    });
});

describe('testing class PokerChipSet', () => {
    test('createDefaultChipSet()', () => {
        let chipset = PokerChipSet.createDefaultChipSet();
        expect(chipset.chips).toHaveLength(7);
    });

    test('minimumChipForForcedBet produces sane values', () => {
        let chipset = PokerChipSet.createDefaultChipSet();
        expect(chipset.chipForValue(25)).toEqual(chipset.chips[0]);
        expect(chipset.chipForValue(75)).toEqual(chipset.chips[0]);
        expect(chipset.chipForValue(125)).toEqual(chipset.chips[0]);
        expect(chipset.chipForValue(100)).toEqual(chipset.chips[1]);
        expect(chipset.chipForValue(400)).toEqual(chipset.chips[1]);
    });

    test('decode()', () => {
        let chipset = PokerChipSet.createDefaultChipSet();
        chipset.name = 'test';
        let text = Synthesizer.encode(chipset);
        console.log(text);
        let hydrated = PokerChipSet.decode(text);
        expect(hydrated.name).toStrictEqual('test');
        expect(hydrated.chips.length).toStrictEqual(7);
    });
});
