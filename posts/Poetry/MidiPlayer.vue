<template>
    <div id="Player">
        
        <button @click="PlayMidi()"><h2>Play {{ SongTitle }}</h2></button>
        <div class="box">
            <iframe :key="MD5SongTitle" src="/MidiPlayer.html" class="midiPlayer" :id="MD5SongTitle"></iframe>
        </div>
        <button @click="Change6MB()">Use TimGM6mb-MuseScore.sf2</button>
        <!--
        <button @click="UseLocalSF()">Use a local SoundFont</button>
        -->
    </div>
</template>
<style scoped>
#Player {
    border: 1px solid black;
    background-color: #39c5bc4f;
    text-align: center;
}
#Player button {
    padding: 5px 10px;
    background-color: #39c5bb;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    bottom: 0;
    display:block;
    margin: auto;
}
.box {
    width: 500px;
    height: 180px;
    margin: auto;
}

.midiPlayer {
    width: 1000px;
    height: 360px;
    transform-origin: top left;
    transform: scale(0.5);
    margin-right: -500px;
    margin-bottom: -180px;
}
</style>
<script lang="ts">
import { ref } from 'vue';
import { Md5 } from 'ts-md5';

export default {
    setup(props) {
        const MidiUrl = ref(props.MidiUrl);
        const SongTitle = ref(props.SongTitle);
        const MD5SongTitle = ref(Md5.hashStr(SongTitle.value));
        function relative2absolute(url: string, base: string) {
            if (!base) {
                base = location.protocol + location.host;
            }
            return new URL(url, base).href;
        }
        function PlayMidi() {
            fetch(relative2absolute(MidiUrl.value, location.href))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    var ifm = document.getElementById(MD5SongTitle.value);
                    var MIDIINT8 = new Int8Array(arrayBuffer);
                    console.log(MIDIINT8);
                    ifm.contentWindow.LoadMidi(SongTitle.value, MIDIINT8);
                });
        }

        function Change6MB() {
            fetch(relative2absolute("/TimGM6mb-MuseScore.sf2", location.href))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    var ifm = document.getElementById(MD5SongTitle.value);
                    var SoundFontInt8 = new Int8Array(arrayBuffer);
                    console.log(SoundFontInt8);
                    ifm.LoadSoundFont.LoadMidi("TimGM6mb-MuseScore.sf2", SoundFontInt8);
                });
        }


        return {
            MidiUrl,
            SongTitle,
            MD5SongTitle,
            PlayMidi,
            Change6MB,
        };
    },
    props: {
        MidiUrl: {
            type: String,
            required: true
        },
        SongTitle: {
            type: String,
            default: 'Song.mid'
        },
    }
}
</script>
