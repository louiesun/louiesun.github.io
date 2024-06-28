<template>
    <div id="Player">
        <h2>This is a MidiPlayer</h2>
        <p>MidiUrl: {{ MidiUrl }}</p>
        <p>SongTitle: {{ SongTitle }}</p>
    </div>
</template>
<script lang="ts">
import { ref } from 'vue';

export default {
    setup(props) {
        const MidiUrl = ref(props.MidiUrl);
        const SongTitle = ref(props.SongTitle);
        function relative2absolute(url: string, base: string) {
            if (!base) {
                base = location.protocol + location.host;
            }
            return new URL(url, base).href;
        }

        function InitPlayer() {
            console.log(relative2absolute(MidiUrl.value, location.href))

            fetch(relative2absolute(MidiUrl.value, location.href))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    console.log(arrayBuffer);
                })
                .catch(error => console.error(error));

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
<style scoped>
#Player {
    border: 1px solid black;
}
</style>