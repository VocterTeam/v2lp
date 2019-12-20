class Player {
    private container: HTMLDivElement;
    private video: Video;
    private audio: VAudio;
    private progress: Progress;

    constructor(div: HTMLDivElement, vidSrc: string, audSrc: string, height: number = 480) {
        var self = this;

        this.container = document.createElement("div");
        this.video = new Video(vidSrc, height);
        this.audio = new VAudio(audSrc);
        this.progress = new Progress();

        this.video.element.onloadedmetadata = function () {
            self.progress.duration = self.video.element.duration;
            
        }

        div.appendChild(this.container);
        this.container.appendChild(this.video.element);
        this.container.appendChild(this.progress.element)
        this.container.appendChild(this.audio.element);

        
    }

    get VideoVolume(): number {
        return this.video.element.volume;
    }
    set VideoVolume(value: number) {
        this.video.element.volume = value;
    }

    get audioVolume(): number {
        return this.audio.element.volume;
    }
    set audioVolume(value: number) {
        this.audio.element.volume = value;
    }

    get currentTime(): number {
        return this.video.currentTime;
    }
    set currentTime(timeStamp: number) {
        this.video.currentTime = timeStamp;
        this.audio.currentTime = timeStamp;
    }

    play() {
        this.video.play();
        this.audio.play();
    }

    pause() {
        this.video.pause();
        this.audio.pause();
    }

    stop() {
        this.video.stop();
        this.audio.stop();
    }

    get duration(): number {
        return this.video.element.duration;
    }

    private onTimeUpdateExternalHandler: (time: number) => any

    get onTimeUpdate(): (time: number) => any {
        return this.onTimeUpdateExternalHandler;
        // return this.video.onTimeupdate;
    }
    set onTimeUpdate(onTimeUpdate: (time: number) => any) {
        this.onTimeUpdateExternalHandler = onTimeUpdate;

        var self = this;

        var videoOnTimeupdateHandler = function (this: GlobalEventHandlers, ev: Event) {
            self.onTimeUpdateExternalHandler(self.video.currentTime);
        };

        this.video.onTimeupdate = videoOnTimeupdateHandler;
    }
    
    get height(): number{
        return this.video.element.height;
    }
    set height(height: number) {
        this.video.element.height = height;
    }
}

class Media {
    element: HTMLMediaElement;
    source: HTMLSourceElement;
    constructor(src: string) {
        this.source = <HTMLSourceElement>document.createElement("source");
        this.source.src = src;
    }

    play(): void {
        this.element.play();
    }

    pause(): void {
        this.element.pause();
    }

    stop(): void {
        this.element.pause();
        this.element.currentTime = 0;
    }

    get currentTime(): number {
        return this.element.currentTime;
    }
    set currentTime(timeStamp: number) {
        this.element.currentTime = timeStamp;
    }

    get onTimeupdate(): (this: GlobalEventHandlers, ev: Event) => any {
        return this.element.ontimeupdate;
    }
    set onTimeupdate(onTimeUpdate: (this: GlobalEventHandlers, ev: Event) => any) {
        this.element.ontimeupdate = onTimeUpdate;
    }
}

class Video extends Media {
    element: HTMLVideoElement;

    constructor(src: string, height: number, onTimeUpdate: (this: GlobalEventHandlers, ev: Event) => any = null) {
        super(src);
        this.element = document.createElement("video");
        this.element.height = height;
        this.element.ontimeupdate = onTimeUpdate;
        this.element.appendChild(this.source);
    }
}

class VAudio extends Media {
    element: HTMLAudioElement;

    constructor(src: string) {
        super(src);
        this.element = document.createElement("audio");
        this.element.appendChild(this.source);

    }
}
class Progress {
    element: HTMLProgressElement;

    constructor() {
        this.element = document.createElement("progress");
        this.element.value = 0;
    }

    set duration(duration: number) {
        this.element.max = duration;
    }
}