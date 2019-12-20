class V2LP {
    constructor(div, vidSrc, audSrc, subtitlesStr = null) {
        this.currentTimeStampIndex = 0;
        var self = this;
        this.container = document.getElementById(div);
        this.player = new Player(this.container, vidSrc, audSrc);
        this.languagesMixer = document.createElement("input");
        this.languagesMixer.type = 'range';
        this.languagesMixer.min = '0';
        this.languagesMixer.max = '1';
        this.languagesMixer.step = '.1';
        this.languagesMixer.value = '0'; //'.5';
        this.languagesMixer.oninput = function (ev) {
            self.languagesLevels = this.value;
        };
        this.languagesLevels = this.languagesMixer.value;
        this.playButton = document.createElement('button');
        this.playButton.innerText = "Play();";
        this.playButton.onclick = function (ev) {
            self.player.play();
        };
        this.timeStamps = [...subtitlesStr.matchAll(/\d{2,3}:\d{2,3}:\d{2,3},\d{1,3}.*-->/gm)]
            .map(row => row[0].substring(0, row[0].indexOf(' ')))
            .map(ts => [...ts.matchAll(/\d{2,3}/gm)].map(row => row[0]))
            .map(ts => Number.parseInt(ts[0]) * 3600 // hours to seconds conversion
            + Number.parseInt(ts[1]) * 60 // minutes to seconds conversion
            + Number.parseInt(ts[2])
            + Number.parseInt(ts[3]) / 1000); //milliseconds to seconds conversion;
        this.player.onTimeUpdate = function (newTime) {
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
        this.prevStampButton = document.createElement('button');
        this.prevStampButton.innerText = "Previous Stamp";
        this.prevStampButton.onclick = function (ev) {
            if (self.player.currentTime - self.timeStamps[self.currentTimeStampIndex] >= 3) { //If it's more than 3 seconds of current time-stamp, we'll restart it
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex];
            }
            else if (self.currentTimeStampIndex > 0) { //if it's less than 3 seconds of current time-stamp playing we'll rewind to the pervious one
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex - 1];
            }
        };
        this.nextStampButton = document.createElement('button');
        this.nextStampButton.innerText = "Next Stamp";
        this.nextStampButton.onclick = function (ev) {
            if (self.currentTimeStampIndex < self.timeStamps.length - 1) {
                self.player.currentTime = self.timeStamps[self.currentTimeStampIndex + 1];
            }
        };
        this.fullScreenButton = document.createElement('button');
        this.fullScreenButton.innerText = "Full Screen";
        this.fullScreenButton.onclick = function (ev) {
            self.requestFullScreen(self.container);
        };
        this.container.appendChild(this.languagesMixer);
        this.container.appendChild(this.playButton);
        this.container.appendChild(this.prevStampButton);
        this.container.appendChild(this.nextStampButton);
        this.container.appendChild(this.fullScreenButton);
    }
    set languagesLevels(valueStr) {
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
    requestFullScreen(element) {
        // Supports most browsers and their versions.
        if (!document.fullscreenElement) {
            var requestMethod = element.requestFullscreen || element["webkitRequestFullScreen"] || element['mozRequestFullScreen'] || element['msRequestFullScreen'];
            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
            }
            else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
            var self = this;
            element.onfullscreenchange = function (ev) {
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
}
//# sourceMappingURL=v2lp.js.map