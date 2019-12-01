class V2LP {
    constructor(div, vidSrc, audSrc) {
        var self = this;
        var divBlock = document.getElementById(div);
        this.player = new Player(divBlock, vidSrc, audSrc);
        this.languagesMixer = document.createElement("input");
        this.languagesMixer.type = 'range';
        this.languagesMixer.min = '0';
        this.languagesMixer.max = '1';
        this.languagesMixer.step = '.1';
        this.languagesMixer.value = '.5';
        this.languagesMixer.oninput = function (ev) {
            self.languagesLevels = this.value;
        };
        divBlock.appendChild(this.languagesMixer);
        this.languagesLevels = this.languagesMixer.value;
        this.playButton = document.createElement('button');
        this.playButton.innerText = "Play();";
        this.playButton.onclick = function (ev) {
            self.player.play();
        };
        divBlock.appendChild(this.playButton);
    }
    set languagesLevels(value) {
        this.player.audioVolume = Number.parseFloat(value);
        this.player.VideoVolume = 1 - this.player.audioVolume;
        ;
    }
}
//# sourceMappingURL=v2lp.js.map