const MAX_DECIBEL = 96;

var audioCtx = new AudioContext();
var gainNode = audioCtx.createGain();
var panner = audioCtx.createStereoPanner();

panner.connect(audioCtx.destination);
gainNode.connect(panner);

const frequencies = [250, 500, 1000, 1500, 2000, 4000, 5000, 8000];
let l_min_volume = [MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL];
let r_min_volume = [MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL, MAX_DECIBEL];
let current_phase = 1;


//TODO:
// Implement second array for right-ear versus left-ear
// Differentiate which phase of the test the user is on (left or right)
// Construct a graph based on their hearing test that they can download
// Possibly (?) create some EQ settings so they can adjust their computer sounds to compensate for their hearing loss
// Style everything

let frequency_index = 0;
let finding_boundary = false;

let decibel_delta = 0;

function displayResults() {

    localStorage.setItem("l_min_volume", JSON.stringify(l_min_volume));
    localStorage.setItem("r_min_volume", JSON.stringify(r_min_volume));
    window.location.href="results.html";

}

function dbToGain(delta) {

    // Calcualte the new gain ratio based on change in decibal
    return (10**(delta/20));
}

function enableButton() {
    document.getElementById("test_yes").disabled = false;
    document.getElementById("test_no").disabled = false;
}

// Initial tone
playTone(frequencies[frequency_index], 2, 1);

function noTone() {

    finding_boundary = true;

    if (decibel_delta <= -2) {
        decibel_delta += 2;
    }

    playTone(frequencies[frequency_index], 2, dbToGain(decibel_delta));

}

function yesTone() {

    // If previous tone was not heard, and this one was, consider the boundary found
    if (finding_boundary) {
        finding_boundary = false;

        if (current_phase == 1) {
            l_min_volume[frequency_index] = MAX_DECIBEL + decibel_delta;
        }
        else {
            r_min_volume[frequency_index] = MAX_DECIBEL + decibel_delta;
        }
        
        decibel_delta = 0;
        
        if (frequency_index < frequencies.length - 1) {
            frequency_index += 1;
        }
        else {
            if (current_phase == 1) {
                current_phase = 2;
                frequency_index = 0;
            }
            else {
                console.log("TEST COMPLETE - by finding boundary")
                displayResults();
            }
        }
    }

    else {

        if (MAX_DECIBEL + decibel_delta >= 10) {

            decibel_delta -= 10;
        }
        else {
            decibel_delta = 0;
    
            if (frequency_index < frequencies.length - 1) {

                if (current_phase == 1) {
                    l_min_volume[frequency_index] = 0;
                }
                else {
                    r_min_volume[frequency_index] = 0;
                }
                frequency_index += 1;
            }
            else {

                if (current_phase == 1) {
                    current_phase = 2;
                    frequency_index = 0;
                }
                else {
                    console.log("TEST COMPLETE - by hearing everything")
                    displayResults();
                }
            }
        }
    }

    console.log(l_min_volume);
    console.log(r_min_volume);
    
    playTone(frequencies[frequency_index], 2, dbToGain(decibel_delta));

}

function playTone(frequency, initial_delay, volume) {

    if (current_phase == 1) {
        panner.pan.setValueAtTime(-1, audioCtx.currentTime);
    }
    else {
        panner.pan.setValueAtTime(1, audioCtx.currentTime);
    }

    document.getElementById("test_yes").disabled = true;
    document.getElementById("test_no").disabled = true;

    var tone = audioCtx.createOscillator();

    // Construct tone
    tone.type = "sine";
    tone.connect(gainNode);

    tone.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    tone.start(audioCtx.currentTime + initial_delay);

    // 0.1s fade-in
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + initial_delay);
    gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.1 + initial_delay);

    // 0.1s fade-out
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime + 0.4 + initial_delay);
    gainNode.gain.linearRampToValueAtTime(0.00001, audioCtx.currentTime + 0.5 + initial_delay);

    // Stop tone after fade-out
    tone.stop(audioCtx.currentTime + 0.5 + initial_delay);

    setTimeout(enableButton, (0.5 + initial_delay)*1000);

}