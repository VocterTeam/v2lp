class V2LP {
    player: Player;
    languagesMixer: HTMLInputElement;
    playButton: HTMLButtonElement;

    constructor(div: string, vidSrc: string, audSrc: string) {
        var self = this;

        var divBlock = <HTMLDivElement>document.getElementById(div);
        this.player = new Player(divBlock, vidSrc, audSrc);

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

    }

    set languagesLevels(value: string) {
        this.player.audioVolume = Number.parseFloat(value); 
        this.player.VideoVolume = 1 - this.player.audioVolume;;
    }
}   