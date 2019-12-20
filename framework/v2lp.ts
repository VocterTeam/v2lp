class V2LP {
    player: Player;
    languagesMixer: HTMLInputElement;
    playButton: HTMLButtonElement;
    timeStamps: number[];
    currentTimeStampIndex: number;

    constructor(div: string, vidSrc: string, audSrc: string, subtitlesStr: string = null) {
        var self = this;

        var divBlock = <HTMLDivElement>document.getElementById(div);
        this.player = new Player(divBlock, vidSrc, audSrc);
        this.player.onTimeUpdate = function(this: GlobalEventHandlers, ev: Event){
            var v = 0;
        }

        this.languagesMixer = document.createElement("input");
        this.languagesMixer.type = 'range';
        this.languagesMixer.min = '0';
        this.languagesMixer.max = '1';
        this.languagesMixer.step = '.1';
        this.languagesMixer.value = '.5';
        this.languagesMixer.oninput = function (this: GlobalEventHandlers, ev: Event) {
            self.languagesLevels = (<HTMLInputElement>this).value;
        };
        divBlock.appendChild(this.languagesMixer);
        this.languagesLevels = this.languagesMixer.value;

        this.playButton = <HTMLButtonElement>document.createElement('button');
        this.playButton.innerText = "Play();";
        this.playButton.onclick = function (this: GlobalEventHandlers, ev: Event) {
            self.player.play()
        };
        divBlock.appendChild(this.playButton);

        var timesStrings = [...subtitlesStr.matchAll(/\d{2,3}:\d{2,3}:\d{2,3},\d{1,3}.*-->/gm)]
            .map(row => row[0].substring(0, row[0].indexOf(' ')))
            .map(ts => [...ts.matchAll(/\d{2,3}/gm)].map(row => row[0]));

        this.timeStamps = timesStrings.map(ts =>
            Number.parseInt(ts[0]) * 3600 // hours to seconds conversion
            + Number.parseInt(ts[1]) * 60 // minutes to seconds conversion
            + Number.parseInt(ts[2])
            + Number.parseInt(ts[3]) / 1000); //milliseconds to seconds conversion

        
        var v = 0;

    }

    set languagesLevels(value: string) {
        this.player.audioVolume = Number.parseFloat(value);
        this.player.VideoVolume = 1 - this.player.audioVolume;;
    }
}

// function readTextFile(file) //from stackOverflow https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
// {
//     debugger;
//     var rawFile = new XMLHttpRequest();
//     rawFile.open("GET", file, false);
//     rawFile.onreadystatechange = function ()
//     {
//         if(rawFile.readyState === 4)
//         {
//             if(rawFile.status === 200 || rawFile.status == 0)
//             {
//                 var allText = rawFile.responseText;
//                 alert(allText);
//             }
//         }
//     }
//     rawFile.send(null);
// }