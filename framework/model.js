class Player {
    constructor(div, vidSrc, audSrc, width = 640, height = 480) {
        this.container = document.createElement("div");
        div.appendChild(this.container);
        this.video = new Video(vidSrc);
        this.video.element.width = width;
        this.video.element.height = height;
        this.container.appendChild(this.video.element);
        this.audio = new VAudio(audSrc);
        this.container.appendChild(this.audio.element);
    }
    get VideoVolume() {
        return this.video.element.volume;
    }
    set VideoVolume(value) {
        this.video.element.volume = value;
    }
    get audioVolume() {
        return this.audio.element.volume;
    }
    set audioVolume(value) {
        this.audio.element.volume = value;
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
}
class Media {
    constructor(src) {
        this.source = document.createElement("source");
        this.source.src = src;
    }
    play() {
        this.element.play();
    }
    pause() {
        this.element.pause();
    }
    stop() {
        this.element.pause();
        this.element.currentTime = 0;
    }
}
class Video extends Media {
    constructor(src) {
        super(src);
        this.element = document.createElement("video");
        this.element.appendChild(this.source);
    }
}
class VAudio extends Media {
    constructor(src) {
        super(src);
        this.element = document.createElement("audio");
        this.element.appendChild(this.source);
    }
}
//# sourceMappingURL=model.js.map