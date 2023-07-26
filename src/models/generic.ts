export class Utility {
    static shortNumberToString(input: number | undefined | null): string {
        if (input == undefined || input == null) {
            return '';
        }
        if (input >= 1_000_000) {
            return `${input / 1_000_000}m`;
        } else if (input >= 10_000) {
            return `${input / 1_000}k`;
        } else {
            return input.toString();
        }
    }
}

export class Duration {
    minutes: number;

    constructor(minutes = 0, hours = 0) {
        this.minutes = minutes + (60 * hours);
    }
    
    static hydrate(obj: Record<string ,any>): Duration | undefined {
        if (obj == undefined) {
            return undefined;
        }
        let minutes = obj['minutes'];
        return minutes == undefined ? undefined : new Duration(minutes);
    }

    toString(force_full: boolean = false): string {
        if (this.minutes == 0) {
            return '';
        }
        let hasHours = this.minutes >= 60;
        let minutes = hasHours ? this.minutes % 60 : this.minutes;
        var output: string[] = [];
        if (hasHours || force_full) {
            let hours = Math.floor(this.minutes / 60);
            output.push(`${hours}h`);
        }
        if (minutes > 0 || force_full) {
            output.push(`${minutes}m`);
        }
        return output.join(' ');
    }
}

export class Time {
    hour: number;
    minute: number;

    constructor(hour: number = 0, minute: number = 0) {
        this.hour = hour;
        this.minute = minute;
    }

    static from_string(input: string | undefined) {
        let time = new Time();
        if (input == undefined) {
            return time;
        }
        let values = input.split(':');
        time.hour = Number(values[0]);
        time.minute = Number(values[1]);
        return time;
    }

    static hydrate(obj: Record<string ,any>): Time {
        let time = new Time();
        if (obj == undefined) {
            return time;
        }
        time.hour = obj['hour'];
        time.minute = obj['minute'];
        return time;
    }

    clone(): Time {
        return new Time(this.hour, this.minute);
    }

    append(input: Duration) {
        let minute = this.minute + input.minutes;
        this.minute = minute % 60;
        this.hour += Math.floor(minute / 60);
    }

    toString(): string {
        let hour = this.hour < 10 ? `0${this.hour}` : this.hour;
        let minute = this.minute < 10 ? `0${this.minute}` : this.minute;
        return `${hour}:${minute}`;
    }
}
