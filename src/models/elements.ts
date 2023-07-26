import { Duration, Time, Utility } from "./generic";
import { PokerChip } from "./poker_chip";

export class TournamentElement {
    note: string | null = null;
    description?: string;
    duration: Duration;
    expected_end = false;

    constructor(duration: Duration) {
        this.duration = duration;
    }

    static as_html(columns: any[]): string {
        let cells = columns.map(value => `<td>${value == null ? '' : value}</td>`);
        return `<tr>${cells.join('')}</tr>`;
    }

    static hydrate(obj: Record<string, any>): TournamentElement | null {
        var result = TournamentLevel.hydrate(obj);
        if (result != null) {
            return result;
        }
        result = TournamentBreak.hydrate(obj);
        if (result != null) {
            return result;
        }

        let duration = Duration.hydrate(obj['duration']) || new Duration();
        result = new TournamentElement(duration);
        result.note = obj['note'];
        result.description = obj['description'];
        result.duration = obj['duration'];
        result.expected_end = obj['expected_end'];
        return result;
    }

    as_html(time: Time, level: number): string {
        return TournamentLevel.as_html([time.toString(), level.toString(), null, null, null, this.note]);
    }

    debug_description(): string {
        return this.description || "";
    }
}

export class TournamentBreak extends TournamentElement {
    colorUp: PokerChip[] = [];

    constructor(duration: Duration, colorUp: PokerChip[] = []) {
        super(duration);
        this.colorUp = colorUp;
        if (colorUp.length > 0) {
            let color_up_text = colorUp.join(' & ');
            this.note = `color up ${color_up_text}`;
        }
    }

    static hydrate(obj: Record<string, any>): TournamentElement | null {
        let isBreakElement = obj['colorUp'] != undefined;
        if (isBreakElement) {
            let duration = Duration.hydrate(obj['duration']) || new Duration();
            let colorUp = obj['colorUp'] as Record<string, any>[];
            let level = new TournamentBreak(duration, colorUp.map(PokerChip.hydrate));
            level.note = obj['note'];
            level.description = obj['description'];
            level.duration = obj['duration'];
            level.expected_end = obj['expected_end'];
            return level;
        }
        return null;
    }
    
    as_html(time: Time, level: number): string {
        return TournamentLevel.as_html([
            time.toString(),
            level.toString(),
            this.duration,
            null,
            null,
            this.note
        ]);
    }

    debug_description(): string {
        let colorUpDescription = this.colorUp.map(chip => `${chip.value}s`).join("& ");
        let durationString = this.duration == undefined ? '' : `${this.duration}m break`;
        let colorUpString = `color up ${colorUpDescription}`;
        var result: string[] = [];
        if (durationString.length > 0) {
            result.push(durationString);
        }
        if (colorUpString.length > 0) {
            result.push(colorUpString);
        }

        return result.join(" - ");
    }
}

export class TournamentLevel extends TournamentElement {
    blinds: number[] = [];
    ante?: number;

    constructor(duration: Duration, blinds: number[] = []) {
        super(duration);
        this.blinds = blinds;
    }

    static hydrate(obj: Record<string, any>): TournamentElement | null {
        let isLevelElement = obj['blinds'] != undefined;
        if (isLevelElement) {
            let duration = Duration.hydrate(obj['duration']) || new Duration();
            let level = new TournamentLevel(duration, obj['blinds']);
            level.ante = obj['ante'];
            level.note = obj['note'];
            level.description = obj['description'];
            level.duration = obj['duration'];
            level.expected_end = obj['expected_end'];
            return level;
        }
        return null;
    }

    small_blind(): number | null {
        return this.blinds[0] || null;
    }

    big_blind(): number | null {
        return this.blinds[1] || null;
    }

    as_html(time: Time, level: number): string {
        return TournamentLevel.as_html([
            time.toString(),
            level.toString(),
            this.duration.toString(),
            Utility.shortNumberToString(this.small_blind()),
            Utility.shortNumberToString(this.big_blind()),
            this.note
        ]);
    }

    debug_description(): string {
        return `${this.small_blind()} - ${this.big_blind()}`;
    }
}
