var note_offsets = {
	// LEAD
	"lead" : {
		"60": {"left": 159, "top": 317},
		"61": {"left": 54, "top": 15},
		"62": {"left": 303, "top": 216},
		"63": {"left": 10, "top": 162},
		"64": {"left": 285, "top": 45},
		"65": {"left": 71, "top": 300},
		"66": {"left": 136, "top": 4},
		"67": {"left": 251, "top": 291},
		"68": {"left": 16, "top": 78},
		"69": {"left": 325, "top": 133},
		"70": {"left": 23, "top": 245},
		"71": {"left": 228, "top": 8},

		"72": {"left": 183, "top": 251},
		"73": {"left": 129, "top": 104},
		"74": {"left": 248, "top": 209},
		"75": {"left": 86, "top": 185},
		"76": {"left": 243, "top": 128},
		"77": {"left": 139, "top": 251},
		"78": {"left": 175, "top": 84},
		"79": {"left": 230, "top": 248},
		"80": {"left": 93, "top": 142},
		"81": {"left": 261, "top": 169},
		"82": {"left": 105, "top": 230},
		"83": {"left": 220, "top": 95},

		"84": {"left": 158, "top": 206},
		"85": {"left": 193, "top": 152},
		"86": {"left": 203, "top": 213},
		"87": {"left": 155, "top": 172},
		"88": {"left": 220, "top": 179}
	},

	// TENORS
	"tenors": {
		"53": {"left": 0, "top": 70},
		"54": {"left": 510, "top": 207},
		"55": {"left": 333, "top": 74},
		"56": {"left": 242, "top": 70},
		"57": {"left": 36, "top": 9},
		"58": {"left": 578, "top": 95},
		"59": {"left": 363, "top": 6},
	
		"60": {"left": 89, "top": 246},
		"61": {"left": 158, "top": 6},
		"62": {"left": 355, "top": 203},
		"63": {"left": 204, "top": 205},
		"64": {"left": 480, "top": 7},
		"65": {"left": 19, "top": 207},
		"66": {"left": 422, "top": 246},
		"67": {"left": 415, "top": 134},
		"68": {"left": 170, "top": 134},
		"69": {"left": 124, "top": 88},
		"70": {"left": 540, "top": 33},
		"71": {"left": 456, "top": 89},

		"72": {"left": 138, "top": 188},
		"73": {"left": 170, "top": 90},
		"74": {"left": 449, "top": 185},
		"75": {"left": 177, "top": 180},
		"76": {"left": 505, "top": 102},
		"77": {"left": 92, "top": 172},
		"78": {"left": 505, "top": 190},
		"79": {"left": 484, "top": 147},
		"80": {"left": 133, "top": 147},
		"81": {"left": 85, "top": 129},
		"82": {"left": 528, "top": 146}
	},

	// SECONDS
	"seconds": {
		"54": {"left": 40, "top": 213},
		"55": {"left": 380, "top": 8},
		"56": {"left": 62, "top": 6},
		"57": {"left": 364, "top": 205},
		"58": {"left": 206, "top": 192},
		"59": {"left": 540, "top": 192},
	
		"60": {"left": 210, "top": 35},
		"61": {"left": 344, "top": 62},
		"62": {"left": 7, "top": 45},
		"63": {"left": 558, "top": 51},
		"64": {"left": 237, "top": 123},
		"65": {"left": 472, "top": 229},
		"66": {"left": 7, "top": 157},
		"67": {"left": 519, "top": 13},
		"68": {"left": 166, "top": 8},
		"69": {"left": 341, "top": 158},
		"70": {"left": 157, "top": 232},
		"71": {"left": 574, "top": 122},

		"72": {"left": 181, "top": 130},
		"73": {"left": 448, "top": 136},
		"74": {"left": 117, "top": 131},
		"75": {"left": 520, "top": 128},
		"76": {"left": 192, "top": 165},
		"77": {"left": 493, "top": 187},
		"78": {"left": 123, "top": 173},
		"79": {"left": 485, "top": 110},
		"80": {"left": 155, "top": 106},
		"81": {"left": 459, "top": 169},
		"82": {"left": 157, "top": 191},
		"83": {"left": 521, "top": 169},

		"84": {"left": 150, "top": 149},
		"85": {"left": 488, "top": 150}
	}
};

var track_nums = {
	"lead": 1,
	"tenors": 2,
	"seconds": 3,
	"triples": 4
};

var num_drums = {
	"lead": 1,
	"tenors": 2,
	"seconds": 2,
	"triples": 3
};

/*********************************
 * Class Drum
 * ----------
 * Represents a single steel drum part.
 * Provides support for setting up notes
 * on screen and handling note on and
 * note off events.
 */
function Drum(type) {
	var this_drum = this;
	this.type = type;
	this.midi_file = {};
	this.my_notes = note_offsets[this.type];
	this.elem = $("#" + this.type);
	this.old_width = this.elem.width();
	this.old_height = this.elem.height();
	this.scale = 1;
	this.click_initialized = false;
	this.hidden = false;

	// Set up this drum
	this.setup = function(left_offset, max_width) {
		var new_scale = Math.min(1, max_width / this.old_width);
		var scale_by = new_scale / this.scale;
		this.scale = new_scale;
		this.elem.width(this.elem.width() * scale_by);

		var offset = this.elem.offset();
		this.elem.offset({
			"top": offset.top,
			"left": left_offset
		});
		offset = this.elem.offset();
		
		// Put notes in place
		for (var key in this.my_notes) {
			var id = this.type + "_" + key;
			var note_elem = $("#" + id);
			old_width = note_elem.width();
			old_height = note_elem.height();
			note_elem
				.attr("name", key)
				.width(old_width * scale_by)
				.height(old_height * scale_by)
				.offset({
					left: offset.left + (note_offsets[this.type][key]["left"] * this.scale),
					top: offset.top + (note_offsets[this.type][key]["top"] * this.scale)
				})

			if (!this.click_initialized) {
				note_elem
					.click(function() {
						this_drum.note_on($(this).attr("name"));
						this_drum.note_off($(this).attr("name"));
					});
			}
		}
		this.click_initialized = true;
	}

	this.hide = function() {
		if (this.hidden)
			return;
			
		this.hidden = true;
		this.elem.hide();
		for (var key in this.my_notes) {
			var id = this.type + "_" + key;
			var note_elem = $("#" + id);
			note_elem.hide();
		}
	}

	this.show = function() {
		if (!this.hidden)
			return;
	
		this.hidden = false;
		this.elem.show();
		for (var key in this.my_notes) {
			var id = this.type + "_" + key;
			var note_elem = $("#" + id);
			note_elem.show();
		}
	}

	this.note_on = function(note) {
		if (this.hidden)
			return;
	
		id = this.type + "_" + note;
		$("#" + id).fadeTo(0, 1);
	}

	this.note_off = function(note) {
		id = this.type + "_" + note;
		$("#" + id).fadeTo(0, 0);
	}
}

/****************************
 * Class Manager
 * -------------
 * Class for managing the layout and
 * playback of each drum type. Also handles
 * reading and playing a MIDI file.
 */
function Manager(drums) {
	var this_manager = this;
	this.screen_width = 1000.0;
	this.buffer = 50.0;
	this.midi_step = 10.0;
	this.tempo = 1.5;
	this.next_timeout = undefined;

	this.drums = {}
	this.drum_statuses = {};
	this.drums_active = 0;
	this.types_active = 0;
	for (var i = 0; i < drums.length; i++) {
		var drum_type = drums[i];
		this.drums[drum_type] = new Drum(drum_type);
		this.drum_statuses[drum_type] = true;
		this.drums_active += num_drums[drum_type];
		this.types_active++;
	}

	this.midi_file = {};
	this.midi_schedule = [];
	this.stopped = true;

	// Responsible for drawing the drums correctly on screen
	this.setup_drums = function() {
		var max_width = (this.screen_width - this.buffer * (this.types_active - 1)) /
				this.drums_active;
		var drums_before = 0;
		var types_before = 0;
		for (var drum_type in this.drum_statuses) {
			var status = this.drum_statuses[drum_type];
			var my_num_drums = num_drums[drum_type];
			if (status) {	
				this.drums[drum_type].show();
				this.drums[drum_type].setup(drums_before * max_width + 
						types_before * this.buffer,
						my_num_drums * max_width);
				drums_before += my_num_drums;
				types_before++;	
			} else {
				this.drums[drum_type].hide();
			}
		}
	}

	// Hiding and showing drums
	this.show_drum = function(type) {
		if (!this.drum_statuses[type]) {
			this.drum_statuses[type] = true;
			this.drums_active += num_drums[type];
			this.types_active++;
			this.setup_drums();
		}
	}

	this.hide_drum = function(type) {
		if (this.drum_statuses[type]) {
			this.drum_statuses[type] = false;
			this.drums_active -= num_drums[type];
			this.types_active--;
			this.setup_drums();
		}
	}

	// Finds the next note on event or note off event,
	// and schedules that event to take place after the
	// appropriate amount of time.
	this.find_next_event = function(index) {
		if (this_manager.stopped) return;
		if (index >= this_manager.midi_schedule.length) return;
		var pos = parseFloat($("#slider").attr("value"));
		var effective_pos = pos / this_manager.midi_step;
		
		while (true) {
			var delta = this_manager.midi_schedule[index]["delta"];
			if (effective_pos - delta > this_manager.midi_step * this_manager.tempo) {
				index++;
				continue;
			}
			if (delta > effective_pos) break;
			this_manager.handle_event(index);
			index++;
			if (index >= this_manager.midi_schedule.length) break;
		}

		$("#slider").val(pos + this_manager.midi_step * this_manager.tempo);
		
		this_manager.next_timeout = setTimeout(function() {
			this_manager.find_next_event(index);
		}, 1);
	}

	// Callback for setTimeout
	this.handle_event = function(index) {
		if (this_manager.stopped) return;
		
		var ev = this_manager.midi_schedule[index];
		var drum = this_manager.drums[ev["drum_type"]];
		if (drum === undefined) return;

		var note = ev["note"];
		if (ev["event_type"] == "noteOn")
			drum.note_on(note);
		else if (ev["event_type"] == "noteOff")
			drum.note_off(note);
	}

	// Start playing from MIDI file
	this.play = function() {
		if (!this.stopped) return;
		this.stopped = false;
		this.find_next_event(0, 0);
	}

	// Stop playing
	this.stop = function() {
		this.stopped = true;
		for (var type in this.drums) {
			var drum = this.drums[type];
			for (var key in note_offsets[type]) {
				drum.note_off(key);
			}
		}
	}
	
	// Put MIDI note events into a schedule
	this.process_midi = function(file) {
		var tracks = file["tracks"];
		
		for (var type in track_nums) {
			var events = tracks[track_nums[type]];
			var total_delta = 0;
			for (var i = 0; i < events.length; i++) {
				var ev = events[i];
				total_delta = total_delta + ev.deltaTime;
				if (ev.subtype == "noteOn" || ev.subtype == "noteOff") {
				
					// make note cut-offs a little early
					var eff_total_delta = total_delta;
					if (ev.subtype == "noteOff")
						eff_total_delta = eff_total_delta - 10;
						
					var to_insert = {
						"delta": eff_total_delta,
						"drum_type": type,
						"event_type": ev.subtype,
						"note": ev.noteNumber
					};
					this_manager.midi_schedule.push(to_insert);
				}
			}
		}
		
		this_manager.midi_schedule.sort(function(a, b) {
			return a["delta"] - b["delta"];
		});
	}
	
	// Constructs MIDI visualization inside controls component
	this.construct_midi_vis = function() {
		var new_thing = $("<div>")
			.css("background-color", "#ffffff")
			.css("position", "absolute")
			.css("bottom", "10px")
			.css("left", "0px")
			.css("width", "100%")
			.css("height", "80px");
		$("body").append(new_thing);
	}

	// Load MIDI file and set up controls	
	this.load_midi = function(midi_filename) {
		console.log(midi_filename);
		loadRemote(midi_filename, function(data) {
			this_manager.midi_file = MidiFile(data);
			this_manager.midi_schedule = [];
			this_manager.process_midi(this_manager.midi_file);
			$("#slider").attr("max", this_manager.midi_schedule
					[this_manager.midi_schedule.length - 1].delta
					* this_manager.midi_step);
		});
	}	

	// Add controls at bottom of screen
	this.add_controls = function() {
		// Controller elements
		var play_button = $("<input>", {type: "button", value: "PLAY"})
			.click(function() {
				this_manager.play();
			});
		var stop_button = $("<input>", {type: "button", value: "STOP"})
			.click(function() {
				this_manager.stop();
			});
		var which_drums = [];
		for (var drum_type in this_manager.drum_statuses) {
			var check = $("<input>", {type: "checkbox", value: drum_type,
					checked: "checked"})
				.click(function() {
					if($(this).attr("checked") == "checked") {
						this_manager.show_drum($(this).attr("value"));
					} else {
						this_manager.hide_drum($(this).attr("value"));
					}
				});
			which_drums.push(check);
		}
		var slider = $("<input>", 
			{
				type: "range",
				min: "0",
				max: "1",
				value: "0",
				width: "95%",
				id: "slider"
			})
			.change(function() {
				if (this_manager.next_timeout != undefined) {
					clearTimeout(this_manager.next_timeout);
					this_manager.next_timeout = undefined;
				}
				if (!this_manager.stopped) {
					this_manager.stop();
					this_manager.play();
				}
			});
		
		// MIDI upload management
		var upload_div = $("<div>",
			{
				id: "upload_div"
			})
			.css("float", "right");
		var midis = $("<div>",
			{
				id: "midis"
			})
			.css("float", "right");
		var uploader = $("<input>",
			{
				type: "file"
			});
		var upload_button = $("<input>",
			{
				type: "button",
				value: "Submit MIDI File"
			})
			.click(function() {
				
				//TODO do this, you shit
				
				
				
				
				
				
			});
		upload_div
			.append(uploader)
			.append(upload_button)
			.append("<br>")
			.append(midis);
			
		
		// Add dat shit
		$("#controls")
			.html("")
			.append(slider)
			.append(upload_div)
			.append("<br>")
			.append(play_button)
			.append(stop_button)
			.append("<br>");
		for (var i = 0; i < which_drums.length; i++) {
			$("#controls")
				.append(which_drums[i].attr("value"))
				.append(which_drums[i])
				.append("&nbsp;&nbsp;&nbsp;");
		}
		
		this_manager.construct_midi_vis();
		this_manager.load_midis_control();
	}
	
	this.load_midis_control = function() {
		var select_button = $("<input>",
			{
				type: "button",
				value: "Load MIDI File"
			})
			.click(function() {
				if (!this_manager.stopped) {
					this_manager.stop();
				}
				this_manager.load_midi("midi/" + $("#midiselect").attr("value"));
			});
		loadRemote("midis.php", function(data) {
			console.log("got midis");
			$("#midis")
				.html(data)
				.append(select_button);
		});
	}
}

/****************************
 * Taken from:
 * https://github.com/gasman/jasmid/blob/master/index.html
 ***************************/
function loadRemote(path, callback) {
	var fetch = new XMLHttpRequest();
	fetch.open('GET', path);
	fetch.overrideMimeType("text/plain; charset=x-user-defined");
	fetch.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			/* munge response into a binary string */
			var t = this.responseText || "" ;
			var ff = [];
			var mx = t.length;
			var scc= String.fromCharCode;
			for (var z = 0; z < mx; z++) {
				ff[z] = scc(t.charCodeAt(z) & 255);
			}
			callback(ff.join(""));
		}
	}
	fetch.send();
}
/****************************/

