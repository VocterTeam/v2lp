class Player {
    constructor(div, vidSrc, audSrc, width = 640, height = 480) {
        var self = this;
        this.container = document.createElement("div");
        this.video = new Video(vidSrc, width, height);
        this.audio = new VAudio(audSrc);
        this.progress = new Progress();
        this.video.element.onloadedmetadata = function () {
            self.progress.duration = self.video.element.duration;
        };
        div.appendChild(this.container);
        this.container.appendChild(this.video.element);
        this.container.appendChild(this.progress.element);
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
    get currentTime() {
        return this.video.currentTime;
    }
    set currentTime(timeStamp) {
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
    get duration() {
        return this.video.element.duration;
    }
    get onTimeUpdate() {
        return this.onTimeUpdateExternalHandler;
        // return this.video.onTimeupdate;
    }
    set onTimeUpdate(onTimeUpdate) {
        this.onTimeUpdateExternalHandler = onTimeUpdate;
        var self = this;
        var videoOnTimeupdateHandler = function (ev) {
            self.onTimeUpdateExternalHandler(self.video.currentTime);
        };
        this.video.onTimeupdate = videoOnTimeupdateHandler;
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
    get currentTime() {
        return this.element.currentTime;
    }
    set currentTime(timeStamp) {
        this.element.currentTime = timeStamp;
    }
    get onTimeupdate() {
        return this.element.ontimeupdate;
    }
    set onTimeupdate(onTimeUpdate) {
        this.element.ontimeupdate = onTimeUpdate;
    }
}
class Video extends Media {
    constructor(src, width, height, onTimeUpdate = null) {
        super(src);
        this.element = document.createElement("video");
        this.element.width = width;
        this.element.height = height;
        this.element.ontimeupdate = onTimeUpdate;
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
class Progress {
    constructor() {
        this.element = document.createElement("progress");
        this.element.value = 0;
    }
    set duration(duration) {
        this.element.max = duration;
    }
}
//# sourceMappingURL=model.js.map