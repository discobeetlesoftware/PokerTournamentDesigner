import { PokerChipSet, PokerChip } from "./models/poker_chip";
import { TournamentBreak, TournamentElement, TournamentLevel } from "./models/elements";
import Tournament from "./models/tournament";
import { Duration, Time } from "./models/generic";
import Synthesizer from "./synthesizer";

export class TournamentDefaults {
    static player_count = 10;
    static starting_stack = 20000;
    static level_duration = new Duration(20);
    static break_duration = new Duration(10);
    static color_up_threshold = 0.15;
    static target_blind_ratio = 0.4;
    static level_overflow = 3;
}

export default class TournamentDesigner {
    name?: string;
    start_time: Time = new Time();
    target_duration?: Duration;
    starting_stack: number = TournamentDefaults.starting_stack;
    player_count: number = TournamentDefaults.player_count;
    level_duration: Duration = TournamentDefaults.level_duration;
    break_duration: Duration = TournamentDefaults.break_duration;
    target_blind_ratio: number = TournamentDefaults.target_blind_ratio;
    color_up_threshold: number = TournamentDefaults.color_up_threshold;
    target_levels: Map<number, TournamentElement> = new Map();

    private __chipset: PokerChipSet = PokerChipSet.createDefaultChipSet();
    private _chipset: PokerChipSet = this.__chipset.clone();

    get chipset(): PokerChipSet { return this._chipset; }
    set chipset(input: PokerChipSet | undefined) {
        this.__chipset = input == undefined ? this.__chipset : input;
    }

    static decode(data: string | undefined): TournamentDesigner | undefined {
        if (data == undefined) {
            return undefined;
        }
        let obj = Synthesizer.decode(data);
        var designer = new TournamentDesigner();
        designer.name = obj['name'];
        designer.start_time = Time.hydrate(obj['start_time']);
        designer.target_duration = Duration.hydrate(obj['target_duration']);
        designer.starting_stack = obj['starting_stack'];
        designer.player_count = obj['player_count'];
        designer.level_duration = Duration.hydrate(obj['level_duration']) || new Duration();
        designer.break_duration = Duration.hydrate(obj['break_duration']) || new Duration();
        designer.target_blind_ratio = obj['target_blind_ratio'];
        designer.color_up_threshold = obj['color_up_threshold'];
        designer.chipset = PokerChipSet.hydrate(obj['__chipset']);
        let levels = obj['target_levels'];
        // for (let [key, value] of levels) {
        //     let element = TournamentElement.hydrate(value);
        //     if (element) {
        //         designer.target_levels.set(key, element);
        //     }
        // }
        return designer;
    }

    reset() {
        this._chipset = this.__chipset.clone();
    }
    
    predicted_final_blind() : number {
        return (this.player_count * this.starting_stack) / 20.0;
    }

    nearest_blind(candidate: number): [PokerChip, number] {
        if (!this.chipset || !this.chipset.chips) {
            return [new PokerChip(1), 1];
        }
        let chips = this.chipset.chips;
        let closestChip: PokerChip = chips[0];
        let closestValue: number = Math.round(candidate / closestChip.value) * closestChip.value;
        if (closestValue == 0) {
            return [closestChip, closestChip.value];
        }
        for (let i = 1; i < chips.length; i++) {
            let chip = chips[i];
            let value = Math.round(candidate / chip.value) * chip.value;
            
            if (Math.abs(candidate - value) <= Math.abs(candidate - closestValue)) {
                closestChip = chip;
                closestValue = value;
            }
        }
    
        return [closestChip, closestValue];
    }

    default_size(): number {
        if (this.chipset.chips.length == 0) {
            return 1;
        }
        return this.chipset.chips[0].value;
    }

    size(): number {
        function is_level_element(candidate?: TournamentElement): candidate is TournamentLevel {
            if (candidate == undefined) { return false; }
            return (candidate as TournamentLevel).blinds !== undefined;
        }

        let element = this.target_levels.get(0);

        if (is_level_element(element)) {
            return element.small_blind() || this.default_size();
        }
        return this.default_size();
    }

    generate(): Tournament {
        this.reset();
        var tournament = new Tournament();
        tournament.name = this.name;
        tournament.chipset = this.chipset;

        let finalBlind = this.predicted_final_blind();
        var small_blind = this.size();
        small_blind = small_blind == 0 ? 1 : small_blind;
        var level_overflow = TournamentDefaults.level_overflow;
        let is_overflowing = function(): boolean { return small_blind * 2 > finalBlind; }
        let should_overflow = function(): boolean { return level_overflow >= 0; }
        
        while (!is_overflowing() || should_overflow()) {        
            let level = new TournamentLevel(this.level_duration);
            level.blinds = [small_blind, small_blind * 2];
            if (level_overflow < TournamentDefaults.level_overflow) {
                level.expected_end = true;
            }
            tournament.elements.push(level);

            let ratio = this.chipset.chips[0].value / small_blind;
            if (!is_overflowing() && ratio < this.color_up_threshold) {
                let colorUpChip = this.chipset.chips.shift();
                if (colorUpChip) {
                    tournament.elements.push(new TournamentBreak(this.break_duration, [colorUpChip]));
                }
            }
            
            small_blind = small_blind + (small_blind * this.target_blind_ratio);
            small_blind = this.nearest_blind(small_blind)[1];
            if (small_blind == level.small_blind()) {
                small_blind += this.chipset.chips[0].value;
            }

            if (is_overflowing()) {
                level_overflow -= 1;
            }
        }
        return tournament;
    }
}

/*
The following blind structure begins each player with 200 Big Blinds (relatively deep),
 and has consistent blind increases that range from 33% to 50%, averaging 40%::
L1 50/100
L2 75/150
L3 100/200
L4 150/300
remove T25 chips
L5 200/400
L6 300/600 (optional end re-buys - 33BB)
L7 400/800
L8 600/1200
break (optional end re-buys - 17BB)
L9 800/1600
L10 1100/2200
L11 1500/3000
L12 2000/4000
remove T100/T500 chips
L13 3000/6000
L14 4000/8000 *** typical EOT
L15 6000/12000
L16 8000/16000
L17 10000/20000
*/

/*

These are commonly used single-table payouts for friendly home games:
9-10 players: pays 3 places --50%-30%-20%, or 55%-30%-15%, or 60%-30%-10%
6-8 players: pays 2 places -- 60%-40%, or 65%-35%, or 70%-30%
5 or fewer: pays 1 place -- 100% WTA
*/