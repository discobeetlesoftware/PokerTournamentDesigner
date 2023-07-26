import Synthesizer from "../synthesizer";
import { Utility } from "./generic";

export class PokerChip {
    value: number;
    count: number;
    color?: string;

    constructor(value: number, count: number = 0, color?: string) {
        this.value = value;
        this.count = count;
        this.color = color;
    }

    static hydrate(obj: Record<string, any>): PokerChip {
        return new PokerChip(obj['value'], obj['count'], obj['color']);
    }

    static decode(data: string): PokerChip {
        return PokerChip.hydrate(Synthesizer.decode(data));
    }

    clone(): PokerChip {
        let chip = new PokerChip(this.value, this.count, this.color);
        return chip;
    }

    toString(): string {
        return Utility.shortNumberToString(this.value);
    }
}

export class PokerChipSet {
    name?: string;
    chips: PokerChip[];

    constructor(chips: PokerChip[]) {
        this.chips = chips;
    }

    static hydrate(obj: Record<string ,any>): PokerChipSet {
        if (obj == undefined) {
            return new PokerChipSet([]);
        }
        let chips = obj['chips'] as Record<string, any>[];
        let chipset = new PokerChipSet(chips.map(PokerChip.hydrate));
        chipset.name = obj['name'];
        return chipset;
    }

    static decode(data: string): PokerChipSet {
        let obj = Synthesizer.decode(data);
        return PokerChipSet.hydrate(obj);
    }

    static createDefaultChipSet(): PokerChipSet {
        var chipset = new PokerChipSet([
            new PokerChip(25),
            new PokerChip(100),
            new PokerChip(500),
            new PokerChip(1000),
            new PokerChip(5000),
            new PokerChip(25000),
            new PokerChip(100000)
        ]);
        return chipset;
    }

    clone(): PokerChipSet {
        let chipset = new PokerChipSet(this.chips.map(x => x.clone()));
        return chipset;
    }

    chipForValue(value: number): PokerChip | null {
        for (var index = this.chips.length - 1; index >= 0; index--) {
            var chip = this.chips[index];
            if (value % chip.value == 0) {
                return chip;
            }
        }
        return null;
    }
}
