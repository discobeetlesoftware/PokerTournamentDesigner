import Cookies = require("js-cookie");
import Tournament from "./models/tournament";
import Synthesizer from "./synthesizer";
import TournamentDesigner from "./designer";

export default class Jar {
    static prefix = 'poker-tournament-designer';

    designer_key = 'cached.designer';
    tournament_key = 'cached.tournament';

    read(token: string): string | undefined {
        let key = `${Jar.prefix}.${token}`;
        return Cookies.get(key);
    }

    write(token: string, value: string) {
        let key = `${Jar.prefix}.${token}`;
        Cookies.set(key, value);
    }

    get designer(): TournamentDesigner | undefined {
        let data = this.read(this.designer_key);
        return TournamentDesigner.decode(data);
    }

    set designer(value: TournamentDesigner) {
        value.reset();
        let data = Synthesizer.encode(value);
        this.write(this.designer_key, data);
    }

    get tournament(): Tournament | undefined {
        let data = this.read(this.tournament_key);
        return Tournament.decode(data);
    }

    set tournament(value: Tournament) {
        let data = Synthesizer.encode(value);
        this.write(this.tournament_key, data);
    }
}
