import TournamentDesigner, { TournamentDefaults } from "../src/designer";

describe('testing tournament designer behavior', () => {
    test('TournamentLevel defaults should make sense', () => {
        let designer = new TournamentDesigner();

        let result = designer.generate();

        // result.elements.forEach(element => {
          //  console.log(element.debug_description());
        // });
    });

    test('nearest_blind() should work', () => {
        let designer = new TournamentDesigner();

        designer.starting_stack = TournamentDefaults.starting_stack;

        let chipset = designer.chipset;
        expect(designer.nearest_blind(25)).toStrictEqual([chipset.chipForValue(25), 25]);
        expect(designer.nearest_blind(66.666)).toStrictEqual([chipset.chipForValue(25), 75]);
        expect(designer.nearest_blind(129.35)).toStrictEqual([chipset.chipForValue(25), 125]);
        expect(designer.nearest_blind(105)).toStrictEqual([chipset.chipForValue(100), 100]);
        expect(designer.nearest_blind(5.55)).toStrictEqual([chipset.chipForValue(25), 25]);
    });
});
