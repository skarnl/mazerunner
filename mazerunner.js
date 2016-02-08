// import Worker from 'worker';
var Application = (function () {
    function Application() {
        this.createCanvas();
    }
    Application.prototype.run = function () {
        console.log('Application.start');
        this.loadImage();
        // determine the entrance
        // seal the rest ^^
        // enter the maze, start a worker
    };
    Application.prototype.createCanvas = function () {
        this.canvas = document.getElementById('canvas');
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        this.context = this.canvas.getContext('2d');
        this.context.scale(4, 4);
    };
    Application.prototype.loadImage = function () {
        this.img = new Image();
        this.img.addEventListener('load', this.imageSuccessHandler.bind(this));
        this.img.addEventListener('error', this.imageErrorHandler.bind(this));
        this.img.src = "maze.png";
    };
    Application.prototype.imageSuccessHandler = function (event) {
        console.log(event);
        console.log('success');
        this.context.drawImage(this.img, 0, 0, this.img.width, this.img.height);
        this.spawnWorker();
    };
    Application.prototype.imageErrorHandler = function (event) {
        console.log('ERROR');
    };
    Application.prototype.spawnWorker = function () {
        var w = new Worker();
    };
    return Application;
})();
var Worker = (function () {
    function Worker() {
    }
    return Worker;
})();
//kickstart
var a = new Application();
a.run();
