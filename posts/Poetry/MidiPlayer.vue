<template>
    <div id="Player">
        <button @click="PlayMidi()">
            <h3>Play {{ SongTitle }}</h3>
        </button>
        <div class="box">
            <iframe :key="MD5SongTitle" src="/MidiPlayer.html" @load="FrameReady()" class="midiPlayer" scrolling="no"
                :id="MD5SongTitle"></iframe>
        </div>
        <div class="buttons">
            <button @click="Change6MB()">Use TimGM6mb-MuseScore.sf2</button>
            <input type="file" accept=".sf2" style="display:none" id="SFfile" @change="getSFdata()" />
            <button @click="UseLocalSF()">Use a local SoundFont</button>
            <button @click="FrameReload()">Reload if error. </button>
            <p><font color="red">请注意：由于这玩意全是bug，如果发现问题请在新标签页打开并（从首页重新进入或在菜单切到另一个页面再切回来）。</font> </p>
        </div>
    </div>
</template>
<script lang="ts">
import { ref } from 'vue';
import { Md5 } from 'ts-md5';

export default {
    setup(props) {
        const MidiUrl = ref(props.MidiUrl);
        const SongTitle = ref(props.SongTitle);
        const MD5SongTitle = ref(Md5.hashStr(SongTitle.value));
        const IFRAMEscale = ref(1);
        const IFRAMEmarginright = ref(0);
        const IFRAMEmarginbottom = ref(0);
        var CurrentSF2 = "none";
        window.addEventListener("resize", AdjustSize);
        var IFRAMEokay = false;
        function FrameReady() {

            IFRAMEokay = true;
            AdjustSize();
        }
        function AdjustSize() {
            IFRAMEokay = true;
            var FatherWidth = document.getElementById("Player").offsetWidth - 5;
            var ifm = document.getElementById(MD5SongTitle.value);
            if (FatherWidth == null || ifm == null) throw Error("Dom not ready! ");

            var NowWidth = 960;
            IFRAMEscale.value = FatherWidth / NowWidth;
            IFRAMEmarginright.value = IFRAMEscale.value * 960 - 960;
            IFRAMEmarginbottom.value = IFRAMEscale.value * 320 - 320;

            console.log(FatherWidth / NowWidth);


        }
        function GetPublicUrl(url: string) {
            return location.protocol + "//" + location.host + url;
        }
        function UseLocalSF() {
            var FileInput = document.getElementById("SFfile");
            if (FileInput == null) throw Error("Dom not ready! ");
            FileInput.dispatchEvent(new MouseEvent("click"));
        }
        function getSFdata() {

            var FileInput = document.getElementById("SFfile");
            if (FileInput == null) throw Error("Dom not ready! ");

            const inputFile = FileInput.files[0];
            if (inputFile.size > 10485760)
                alert("File size exceeds 10MB. It may takes some time to load. ");
            let filename = inputFile.name;
            let reader = new FileReader();
            reader.onload = function (e) {
                alert("File loaded!");
                var data: ArrayBuffer = e.target.result;
                var SFINT8 = new Int8Array(data)
                var ifm = document.getElementById(MD5SongTitle.value);
                if (!IFRAMEokay) {
                    alert("Please wait for the MIDI player to load. ");
                    return -1;
                }
                ifm.contentWindow.location.reload(true);
                //console.log(SFINT8);
                ifm.onload = function () {
                    CurrentSF2 = "ToLoad";
                    ifm.contentWindow.LoadSoundFont(inputFile.name, SFINT8);
                    ifm.onload = FrameReady;
                }
            };
            reader.readAsArrayBuffer(inputFile);
        }
        function Change6MB() {
            var ifm = document.getElementById(MD5SongTitle.value);
            if (!IFRAMEokay) {
                alert("Please wait for the MIDI player to load. ");
                return -1;
            }
            alert("The File is about 6MB, and may take some time to load. ");
            fetch(GetPublicUrl("/TimGM6mb-MuseScore.sf2"))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    var ifm = document.getElementById(MD5SongTitle.value);
                    var SFINT8 = new Int8Array(arrayBuffer);
                    alert("SoundFont loaded!");
                    //console.log(SFINT8);
                    if (!IFRAMEokay) {
                        alert("Please wait for the MIDI player to load. ");
                        return -1;
                    }
                    ifm.contentWindow.location.reload(true);
                    //console.log(SFINT8);
                    ifm.onload = function () {
                        CurrentSF2 = "6MB";
                        ifm.contentWindow.LoadSoundFont("TimGM6mb-MuseScore.sf2", SFINT8);
                        ifm.onload = FrameReady;
                    }

                });
        }
        function PlayMidi() {
            //alert(GetPublicUrl(MidiUrl.value));
            fetch(GetPublicUrl(MidiUrl.value))
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => {
                    var ifm = document.getElementById(MD5SongTitle.value);
                    var MIDIINT8 = new Int8Array(arrayBuffer);
                    //console.log(MIDIINT8);
                    if (!IFRAMEokay) {
                        alert("Please wait for the MIDI player to load. ");
                        return -1;
                    }
                    ifm.contentWindow.LoadMidi(SongTitle.value, MIDIINT8);
                });
        }
        function FrameReload() {
            if (CurrentSF2 == "ToLoad")
                getSFdata();
            else if (CurrentSF2 == "6MB")
                Change6MB();
            else if (CurrentSF2 == "none") {
                var ifm = document.getElementById(MD5SongTitle.value);
                ifm.contentWindow.location.reload(true);
            }

        }
        return {
            MidiUrl,
            SongTitle,
            MD5SongTitle,
            IFRAMEscale,
            IFRAMEmarginright,
            IFRAMEmarginbottom,
            UseLocalSF,
            Change6MB,
            getSFdata,
            PlayMidi,
            FrameReady,
            FrameReload,
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
    background-color: #39c5bc4f;
    text-align: center;
}

#Player h3 {
    margin-top: 2px;
    margin-bottom: 2px;
    margin-left: 5px;
    margin-right: 5px;
}
.butttons {
    
}

#Player button {
    padding: 5px 10px;
    background-color: #39c5bb;
    color: #fff;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    bottom: 0;
    display: block;
    margin: auto;
}

.box {
    margin-left: 2px;
    margin-right: 2px;
}

.midiPlayer {
    width: 960px;
    height: 320px;
    transform-origin: top left;
    transform: scale(v-bind("IFRAMEscale"));
    margin-right: calc(v-bind("IFRAMEmarginright")*1px);
    margin-bottom: calc(v-bind("IFRAMEmarginbottom")*1px);
    /*margin-bottom: -144.72px;*/
}
</style>