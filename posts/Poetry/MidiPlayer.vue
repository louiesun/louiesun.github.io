<template>
    <h2>This is a MidiPlayer</h2>
    <p>MidiUrl: {{ MidiUrl }}</p>
    <p>SongTitle: {{ SongTitle }}</p>
    <div id="player"></div>
</template>
<script lang="ts">
/*
import { JZZ } from 'jzz';
import { SMF } from 'jzz-midi-smf';
import { Player } from 'jzz-gui-player';
*/
import { ref } from 'vue';

export default {
    setup(props) {
        /*SMF(JZZ);
        Player(JZZ);*/
        const MidiUrl = ref(props.MidiUrl);
        const SongTitle = ref(props.SongTitle);
        var player;
        function relative2absolute(url: string, base: string) {
            if (!base) {
                base = location.protocol + location.host;
            }
            return new URL(url, base).href;
        }
        function InitPlayer() {
            console.log(relative2absolute(MidiUrl.value,location.href))
            //fetch(MidiUrl.value)
            /*fetch(relative2absolute(MidiUrl.value,location.href))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    console.log(arrayBuffer);
                    player = new JZZ.gui.Player('player');
                    var smf = new JZZ.MIDI.SMF(arrayBuffer);
                    player.load(smf); // MIDI 1.0, or
                    console.log(player);
                    // player.load(new JZZ.MIDI.Clip(data)); // MIDI 2.0
                    console.log("WebMidi enabled!Trying to play " + MidiUrl.value + ".");
                })
                .catch(error => console.error(error));
                */
        }
        InitPlayer();


        return {
            MidiUrl,
            SongTitle,
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