import { PokerChipSet } from "./poker_chip";
import { TournamentElement } from "./elements";
import Synthesizer from "../synthesizer";

export default class Tournament {
    name?: string;
    elements: TournamentElement[] = [];
    level_duration: number = 20;
    chipset?: PokerChipSet;
    predictedFinalElementIndex?: number;

    static decode(data: string | undefined): Tournament | undefined {
        if (data == undefined) {
            return undefined;
        }
        let obj = Synthesizer.decode(data);
        var tournament = new Tournament();
        tournament.name = obj['name'];
        let elementObjs = obj['elements'] as Record<string, any>[];
        tournament.elements = elementObjs.map(TournamentElement.hydrate).filter(x => x != null).map(x => x!);
        tournament.chipset = PokerChipSet.hydrate(obj['chipset']);
        tournament.predictedFinalElementIndex = obj['predictedFinalElementIndex'];
        return tournament;
    }
}
