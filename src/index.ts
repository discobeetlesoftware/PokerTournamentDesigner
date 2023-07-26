require("inputmask");
import Cookies = require("js-cookie");
import TournamentDesigner, { TournamentDefaults } from "./designer";
import Jar from "./jar";
import Tournament from "./models/tournament";
import { Duration, Time } from "./models/generic";

var designer: TournamentDesigner;
var tournament: Tournament | undefined;

class Page {
    static element = {
        save_button: $('#save_button'),
        generate_button: $('#generate_button'),
        reset_button: $('#reset_button'),
        load_button: $('#load_button'),

        tournament_name: $("#tournament_name"),
        start_time: $('#start_time'),

        target_blind_ratio: $('#target_blind_ratio'),
        target_blind_ratio_slider: $('#target_blind_ratio_slider'),

        level_duration: $('#level_duration'),
        level_duration_slider: $('#level_duration_slider'),

        break_duration: $('#break_duration'),
        break_duration_slider: $('#break_duration_slider'),

        starting_stack: $('#starting_stack'),
        starting_stack_slider: $('#starting_stack_slider'),

        target_duration: $('#target_duration'),
        target_duration_slider: $('#target_duration_slider'),

        color_up_threshold: $('#color_up_threshold'),
        color_up_threshold_slider: $('#color_up_threshold_slider'),

        player_count: $('#player_count'),
        player_count_slider: $('#player_count_slider')
    }

    static load_designer(designer: TournamentDesigner | undefined) {
        if (designer == undefined) {
            return;
        }

        this.tournament_name = designer.name;
        this.start_time = designer.start_time;

        this.target_blind_ratio = designer.target_blind_ratio;
        this.target_blind_ratio_slider = designer.target_blind_ratio;
        
        this.level_duration = designer.level_duration.minutes;
        this.level_duration_slider = designer.level_duration.minutes;
        
        this.break_duration = designer.break_duration.minutes;
        this.break_duration_slider = designer.break_duration.minutes;
        
        this.starting_stack = designer.starting_stack;
        this.starting_stack_slider = designer.starting_stack;
        
        this.target_duration = designer.target_duration?.minutes;
        this.target_duration_slider = designer.target_duration?.minutes;
        
        this.color_up_threshold = designer.color_up_threshold;
        this.color_up_threshold_slider = designer.color_up_threshold;

        this.player_count = designer.player_count;
        this.player_count_slider = designer.player_count;
    }

    static load_tournament(tournament: Tournament | undefined) {
        if (tournament == undefined) {
            return;
        }

        $('#tournament_title').html(tournament.name || 'Tournament');
        let table_body = $('#tournament_elements tbody');
        let rows = $('tr', table_body);
        let count = rows.length;
        let element_count = tournament.elements.length;
        let time_offset = designer.start_time.clone();

        for (let index = 0; index < element_count; index++) {
            let element = tournament.elements[index];
            let should_replace = count > 0;
            let html = element.as_html(time_offset, index + 1);
            if (should_replace) {
                rows.eq(index).replaceWith(html);
                count -= 1;
            } else {
                table_body.append(html);
            }

            if (rows.length > element_count) {
                rows.slice(element_count).remove();
            }

            time_offset.append(element.duration);
        }
    }

    static get tournament_name(): string {
        return <string>this.element.tournament_name.val();
    }

    static set tournament_name(input: string | undefined) {
        let value = input || '';
        this.element.tournament_name.val(value);
        designer.name = value;
    }

    static get start_time(): Time {
        let value = (this.element.start_time.val() || '00:00').toString();
        return Time.from_string(value);
    }

    static set start_time(input: Time | undefined) {
        let time = input == undefined ? new Time() : input;
        this.element.start_time.val(time.toString());
        designer.start_time = time;
    }
    
    static get target_blind_ratio(): number {
        return Number(this.element.target_blind_ratio.val());
    }

    static set target_blind_ratio(input: number | string | undefined) {
        let value = (input || TournamentDefaults.target_blind_ratio);
        this.element.target_blind_ratio.val(value.toString());
        designer.target_blind_ratio = Number(value);
    }

    static set target_blind_ratio_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.target_blind_ratio_slider.slider("value", Number(input));
    }

    static get break_duration(): number {
        return Number(this.element.break_duration.val());
    }

    static set break_duration(input: number | string | undefined) {
        let value = (input || TournamentDefaults.break_duration);
        Page.element.break_duration.val(value.toString());
        designer.break_duration.minutes = Number(value);
    }

    static set break_duration_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.break_duration_slider.slider("value", Number(input));
    }

    static get level_duration(): number {
        return Number(this.element.level_duration.val());
    }

    static set level_duration(input: number | string | undefined) {
        let value = (input || TournamentDefaults.level_duration);
        Page.element.level_duration.val(value.toString());
        designer.level_duration.minutes = Number(value);
    }

    static set level_duration_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.level_duration_slider.slider("value", Number(input));
    }

    static get starting_stack(): number {
        return Number(this.element.starting_stack.val());
    }

    static set starting_stack(input: number | string | undefined) {
        let value = (input || TournamentDefaults.starting_stack);
        Page.element.starting_stack.val(value.toString());
        designer.starting_stack = Number(value);
    }

    static set starting_stack_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.starting_stack_slider.slider("value", Number(input));
    }

    static get target_duration(): number {
        return Number(this.element.target_duration.val());
    }

    static set target_duration(input: number | string | undefined) {
        let value = (input || 0);
        let duration = new Duration(Number(value));
        Page.element.target_duration.val(duration.toString(true));
        designer.target_duration = duration;
    }

    static set target_duration_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.target_duration_slider.slider("value", Number(input));
    }

    static get color_up_threshold(): number {
        return Number(this.element.color_up_threshold.val());
    }

    static set color_up_threshold(input: number | string | undefined) {
        let value = (input || TournamentDefaults.color_up_threshold);
        Page.element.color_up_threshold.val(value.toString());
        designer.color_up_threshold = Number(value);
    }

    static set color_up_threshold_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.color_up_threshold_slider.slider("value", Number(input));
    }

    static get player_count(): number {
        return Number(this.element.player_count.val());
    }

    static set player_count(input: number | string | undefined) {
        let value = (input || TournamentDefaults.player_count);
        Page.element.player_count.val(value.toString());
        designer.player_count = Number(value);
    }

    static set player_count_slider(input: number | string | undefined) {
        if (input == undefined) {
            return;
        }
        Page.element.player_count_slider.slider("value", Number(input));
    }
}

window.onload = () => {
    let jar = new Jar();
    designer = jar.designer || new TournamentDesigner();

    let generate = function() {
        tournament = designer.generate();
        Page.load_tournament(tournament);
    }

    Inputmask({ regex: "\\d*m", autoUnmask: true }).mask(Page.element.break_duration);
    Inputmask({ regex: "\\d*m", autoUnmask: true }).mask(Page.element.level_duration);
    Inputmask({ mask: "9{1,2}h 9{1,2}m", autoUnmask: false }).mask(Page.element.target_duration);
    Inputmask({ mask: "99:99", autoUnmask: false }).mask(Page.element.start_time);

    Page.element.generate_button.on('click', generate);

    Page.element.save_button.on('click', function() {
        jar.designer = designer;
    });

    Page.element.reset_button.on('click', function() {
        designer = new TournamentDesigner();
        Page.load_designer(designer);
    });

    Page.element.load_button.on('click', function() {
        designer = jar.designer || new TournamentDesigner();
        Page.load_designer(designer);
    });

    Page.element.level_duration.on("change paste keyup", function() {
        let value = Page.level_duration;
        Page.level_duration_slider = value;
        designer.level_duration.minutes = value;
    });

    Page.element.start_time.on("change paste keyup", function() {
        let value = Page.start_time;
        designer.start_time = value;
    });

    Page.element.level_duration_slider.slider({
        min: 1,
        max: new Duration(0, 4).minutes,
        step: 1,
        value: Page.level_duration,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.level_duration = ui.value;
        }
    });

    Page.element.break_duration.on("change paste keyup", function() {
        let value = Page.break_duration;
        Page.break_duration_slider = value;
        designer.break_duration.minutes = value;
    });

    Page.element.break_duration_slider.slider({
        min: 1,
        max: new Duration(0, 2).minutes,
        step: 1,
        value: Page.break_duration,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.break_duration = ui.value;
        }
    });

    Page.element.tournament_name.on("change paste keyup", function() {
        let value = Page.tournament_name;
        designer.name = value;
    });

    Page.element.target_blind_ratio.on("change paste keyup", function() {
        let value = Page.target_blind_ratio;
        Page.target_blind_ratio_slider = value;
        designer.target_blind_ratio = value;
    });

    Page.element.target_blind_ratio_slider.slider({
        min: 0.05,
        max: 5.0,
        step: 0.05,
        value: Page.target_blind_ratio,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.target_blind_ratio = ui.value;
        }
    });

    Page.element.starting_stack.on("change paste keyup", function() {
        let value = Page.starting_stack;
        Page.starting_stack_slider = value;
        designer.starting_stack = value;
    });

    Page.element.starting_stack_slider.slider({
        min: 1000,
        max: 100000,
        step: 500,
        value: Page.starting_stack,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.starting_stack = ui.value;
        }
    });

    Page.element.target_duration.on("change paste keyup", function() {
        let value = Page.target_duration;
        Page.target_duration_slider = value;
        designer.starting_stack = value;
    });

    Page.element.target_duration_slider.slider({
        min: 30,
        max: new Duration(0, 24).minutes,
        step: 30,
        value: Page.target_duration,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.target_duration = ui.value;
        }
    });

    Page.element.color_up_threshold.on("change paste keyup", function() {
        let value = Page.color_up_threshold;
        Page.color_up_threshold_slider = value;
        designer.color_up_threshold = value;
    });

    Page.element.color_up_threshold_slider.slider({
        min: 0.01,
        max: 0.99,
        step: 0.01,
        value: Page.color_up_threshold,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.color_up_threshold = ui.value;
        }
    });

    Page.element.player_count.on("change paste keyup", function() {
        let value = Page.player_count;
        Page.player_count_slider = value;
        designer.player_count = value;
    });

    Page.element.player_count_slider.slider({
        min: 2,
        max: 200,
        step: 1,
        value: Page.player_count,
        slide: function(_event: any, ui: JQueryUI.SliderUIParams) {
            Page.player_count = ui.value;
        }
    });

    $("[title]").tooltip({
        position: {
          my: "left top",
          at: "left bottom+5",
          collision: "none"
        }
      });

    Page.load_designer(designer);
    generate();
};