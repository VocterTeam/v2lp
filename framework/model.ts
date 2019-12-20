class Player {
    container: HTMLDivElement;
    video: Video;
    audio: VAudio;

    constructor(div: HTMLDivElement, vidSrc: string, audSrc: string, width: number = 640, height: number = 480) {
        this.container = document.createElement("div");
        div.appendChild(this.container);

        this.video = new Video(vidSrc, width, height);
        this.container.appendChild(this.video.element);

        this.audio = new VAudio(audSrc);
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

    get onTimeUpdate(): (this: GlobalEventHandlers, ev: Event) => any {
        return this.video.onTimeupdate;
    }
    set onTimeUpdate(onTimeUpdate: (this: GlobalEventHandlers, ev: Event) => any) {
        this.video.onTimeupdate = onTimeUpdate;
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

    constructor(src: string, width: number, height: number, onTimeUpdate: (this: GlobalEventHandlers, ev: Event) => any = null) {
        super(src);
        this.element = document.createElement("video");
        this.element.width = width;
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