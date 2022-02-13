var videos = document.querySelectorAll(".video");

for (var i = 0; i < videos.length; i++) {

    const video = videos[i];
    const vid = video.querySelector("video");

    crearBotones(video, vid);
}

function crearBotones(video, vid) {

    var botones = video.querySelector(".botones");

    var btn1 = document.createElement("button");
    btn1.innerHTML = "play";

    var btn2 = document.createElement("button");
    btn2.innerHTML = "Pause";

    var btn3 = document.createElement("button");
    btn3.innerHTML = "Stop";

    var btn4 = document.createElement("button");
    btn4.innerHTML = "Rewind";

    botones.prepend(btn1, btn2, btn3, btn4);


    btn1.addEventListener("click", () => {
        vid.play();
    });
    btn2.addEventListener("click", () => {
        vid.pause();
    });

    btn3.addEventListener("click", () => {
        vid.currentTime = 0;
        vid.pause();
    });

    btn4.addEventListener("click", () => {
        vid.currentTime = 0;
    });


}



///////////////////////////
//solo va a funcionar con un video
//habria que cambiar el id, x clases
//e iterar todos los videos con transcripcion
var video, transcriptDiv;
var tracks, trackElems, tracksURLs = [];
var buttonEnglish, buttonDeutsch;

window.onload = function () {
    console.log("init");
    // when the page is loaded
    videos = document.querySelectorAll(".myVideo");

    for (video of videos) {

        vid = video.querySelector("#myVideo");

        transcriptDiv = document.querySelector("#transcript");

        // The tracks as HTML elements
        trackElems = vid.querySelectorAll("track");
        for (var i = 0; i < trackElems.length; i++) {
            var currentTrackElem = trackElems[i];
            tracksURLs[i] = currentTrackElem.src;
        }

        buttonEnglish = video.querySelector("#buttonEnglish");
        buttonDeutsch = video.querySelector("#buttonDeutsch");
        buttonEspañol = video.querySelector("#buttonEspañol");


        // we enable the buttons and show transcript
        buttonEnglish.disabled = false;
        buttonDeutsch.disabled = false;
        buttonEspañol.disabled = false;

        // The tracks as JS objects
        tracks = vid.textTracks;


    }


};

function loadTranscript(lang) {
    // clear current transcript
    clearTranscriptDiv();

    // set all track mode to disabled. We will only activate the
    // one whose content will be displayed as transcript
    disableAllTracks();

    // Locate the track with language = lang
    for (var i = 0; i < tracks.length; i++) {
        // current track
        var track = tracks[i];
        var trackAsHtmlElem = trackElems[i];

        if ((track.language === lang) && (track.kind !== "chapters")) {
            track.mode = "showing";

            if (trackAsHtmlElem.readyState === 2) {
                // the track has already been loaded
                displayCues(track);
            } else {
                displayCuesAfterTrackLoaded(trackAsHtmlElem, track);
            }


        }
    }
}


function displayCuesAfterTrackLoaded(trackElem, track) {
    // Create a listener that will be called only when the track has
    // been loaded
    trackElem.addEventListener('load', function (e) {
        console.log("track loaded");
        displayCues(track);
    });
}

function disableAllTracks() {
    for (var i = 0; i < tracks.length; i++)
        tracks[i].mode = "disabled";
}

function displayCues(track) {
    var cues = track.cues;

    //append all the subtitle texts to 
    for (var i = 0, len = cues.length; i < len; i++) {
        var cue = cues[i];
        addCueListeners(cue);

        var voices = getVoices(cue.text);
        var transText = "";
        if (voices.length > 0) {
            for (var j = 0; j < voices.length; j++) { // how many voices ?
                transText += voices[j].voice + ': ' + removeHTML(voices[j].text);
            }
        } else
            transText = cue.text; // not a voice text
        var clickableTransText = "<li class='cues' id=" + cue.id + " onclick='jumpTo(" + cue.startTime + ");'" + ">" + transText + "</li>";

        addToTranscriptDiv(clickableTransText);
    }
}

function getVoices(speech) { // takes a text content and check if there are voices 
    var voices = []; // inside
    var pos = speech.indexOf('<v'); // voices are like <v michel> ....
    while (pos != -1) {
        endVoice = speech.indexOf('>');
        var voice = speech.substring(pos + 2, endVoice).trim();
        var endSpeech = speech.indexOf('</v>');
        var text = speech.substring(endVoice + 1, endSpeech);
        voices.push({
            'voice': voice,
            'text': text
        });
        speech = speech.substring(endSpeech + 4);
        pos = speech.indexOf('<v');
    }
    return voices;
}

function removeHTML(text) {
    var div = document.createElement('div');
    div.innerHTML = text;
    return div.textContent || div.innerText || '';
}

function jumpTo(time) {
    video.currentTime = time;
    video.play();
}

function clearTranscriptDiv() {
    transcriptDiv.innerHTML = "";
}

function addToTranscriptDiv(htmlText) {
    transcriptDiv.innerHTML += htmlText;
}

function addCueListeners(cue) {
    cue.onenter = function () {
        console.log('enter id=' + this.id);
        var transcriptText = document.getElementById(this.id);
        transcriptText.classList.add("current");
    };

    cue.onexit = function () {
        console.log('exit id=' + cue.id);
        var transcriptText = document.getElementById(this.id);
        transcriptText.classList.remove("current");
    };
}