import { TournamentLevel } from "../src/models/elements";
import { Duration } from "../src/models/generic";

describe('testing TournamentLevel models', () => {
    test('TournamentLevel defaults should make sense', () => {
        let level = new TournamentLevel(new Duration());
        expect(level.blinds).toStrictEqual([]);
        expect(level.ante).toBeUndefined();
        level.blinds = [1,2,3,4];
        expect(level.blinds).toStrictEqual([1,2,3,4]);
    });

    test('TournamentLevel small_blind()', () => {
        let level = new TournamentLevel(new Duration());
        expect(level.small_blind()).toBeNull();
        level.blinds = [25, 50, 75];
        expect(level.small_blind()).toBe(25);
    });

    test('TournamentLevel big_blind()', () => {
        let level = new TournamentLevel(new Duration());
        expect(level.big_blind()).toBeNull();
        level.blinds = [25, 50, 75];
        expect(level.big_blind()).toBe(50);
    });
});
