class V2LP {
    player: Player;

    container: HTMLDivElement;
    fullScreenButton: HTMLButtonElement;
    languagesMixer: HTMLInputElement;
    nextStampButton: HTMLButtonElement;
    playButton: HTMLButtonElement;
    prevStampButton: HTMLButtonElement;
    replayStampButton: HTMLButtonElement;

    currentTimeStampIndex: number = 0;
    timeStamps: number[];

    notFullScreenHeight: number;
    notFullScreenWidth: number;

    constructor(div: string, vidSrc: string, audSrc: string, subtitlesStr: string = null) {
        var self = this;

        this.container = <HTMLDivElement>document.getElementById(div);
        this.player = new Player(this.container, vidSrc, audSrc);

        this.languagesMixer = document.createElement("input");
        this.languagesMixer.type = 'range';
        this.languagesMixer.min = '0';
        this.languagesMixer.max = '1';
        this.languagesMixer.step = '.1';
        this.languagesMixer.value = '0'; //'.5';
        this.languagesMixer.oninput = function (this: GlobalEventHandlers, ev: Event) {
            self.languagesLevels = (<HTMLInputElement>this).value;
        };
        this.languagesLevels = this.languagesMixer.value;

        this.playButton = <HTMLButtonElement>document.createElement('button');
        this.playButton.innerText = "Play();";
        this.playButton.onclick = function (this: GlobalEventHandlers, ev: Event) {
            self.player.play();
        };

        this.timeStamps = [...subtitlesStr.matchAll(/\d{2,3}:\d{2,3}:\d{2,3},\d{1,3}.*-->/gm)]
            .map(row => row[0].substring(0, row[0].indexOf(' ')))
            .map(ts => [...ts.matchAll(/\d{2,3}/gm)].map(row => row[0]))
            .map(ts =>
                Number.parseInt(ts[0]) * 3600 // hours to seconds conversion
                + Number.parseInt(ts[1]) * 60 // minutes to seconds conversion
                + Number.parseInt(ts[2])
                + Number.parseInt(ts[3]) / 1000); //milliseconds to seconds conversion;

        this.player.onTimeUpdate = function (newTime: any) {
            while (self.currentTimeStampIndex < self.timeStamps.length - 1
                && newTime >= self.timeStamps[self.currentTimeStampIndex + 1]) {
                self.currentTimeStampIndex++;
                console.log(self.currentTimeStampIndex + " - " + self.timeStamps[self.currentTimeStampIndex]);
            }

            while (self.currentTimeStampIndex > 0
                && newTime < self.timeStamps[self.currentTimeStampIndex]) {
                self.currentTimeStampIndex--;
                console.log(self.currentTimeStampIndex + " - " + self.timeStamps[self.currentTimeStampIndex]);
            }
        };

        this.prevStampButton = <HTMLButtonElement>document.createElement('button');
        this.prevStampButton.innerText = "Previous Stamp";
        this.prevStampButton.onclick = function (this: GlobalEventHandlers, ev: Event) {
            if (self.player.currentTime - self.timeStamps[self.currentTimeStampIndex] >= 3) { //If it's more than 3 seconds of current time-stamp, we'll restart it
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex];
            }
            else if (self.currentTimeStampIndex > 0) { //if it's less than 3 seconds of current time-stamp playing we'll rewind to the pervious one
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex - 1];
            }
        };

        this.nextStampButton = <HTMLButtonElement>document.createElement('button');
        this.nextStampButton.innerText = "Next Stamp";
        this.nextStampButton.onclick = function (this: GlobalEventHandlers, ev: Event) {
            if (self.currentTimeStampIndex < self.timeStamps.length - 1) {
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex + 1];
            }
        };

        this.fullScreenButton = <HTMLButtonElement>document.createElement('button');
        this.fullScreenButton.innerText = "Full Screen";
        this.fullScreenButton.onclick = function (this: GlobalEventHandlers, ev: Event) {
            self.requestFullScreen(self.container);
        };

        this.container.appendChild(this.languagesMixer);
        this.container.appendChild(this.playButton);
        this.container.appendChild(this.prevStampButton);
        this.container.appendChild(this.nextStampButton);
        this.container.appendChild(this.fullScreenButton);
    }

    set languagesLevels(valueStr: string) {
        var value = Number.parseFloat(valueStr);
        if (value >= .5) {
            this.player.VideoVolume = (1 - value) * 2;
            this.player.audioVolume = 1;
        }
        else {
            this.player.VideoVolume = 1;
            this.player.audioVolume = value * 2;
        }

        this.player.audioVolume = value;
    }


    requestFullScreen(element: Element) {
        // Supports most browsers and their versions.
        var requestMethod = element.requestFullscreen || element["webkitRequestFullScreen"] || element['mozRequestFullScreen'] || element['msRequestFullScreen'];

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }

        var self = this;
        element.onfullscreenchange = function (this: Element, ev: Event) {
            if (!document.fullscreenElement) {
                self.player.height = self.notFullScreenHeight;
            }
        };

        setTimeout(() => {
            this.notFullScreenHeight = this.player.height;

            this.player.height = this.container.scrollHeight - 54;
            //this.player.width = '100%';

            console.log('divBlock.scrollHeight = ' + this.container.scrollHeight);
            console.log('self.player.height = ' + this.player.height);
        }, 150);
    }
}