export default class GameBase {


  stage;
  width = 24;
  height = 36;
  STATUS_PLAYING = 'PLAYING';
  STATUS_PAUSING = 'PAUSING';
  STATUS_INIT = 'INIT';
  status = this.STATUS_INIT;

  gameWorkerDelay = 1000; // ms
  gameWorkerTimer;

  keyDownInterval = {};
  keyDownIntervalDelay = 35;
  keyDownTimeout = {};
  keyDownTimeoutDelay = 130;


  KEY_CODE_UP = 'w';
  KEY_CODE_DOWN = 's';
  KEY_CODE_LEFT = 'a';
  KEY_CODE_RIGHT = 'd';
  KEY_CODE_ATTACK = 'j';
  stopKeydownInterval = false;

  constructor() {

    this.start = this.start.bind(this);
    this.gameWorker = this.gameWorker.bind(this);
    this.initialStage();
    // console.log();
  }

  initialStage() {
    // key binding
    this.initKeyBinding();
  }


  // get gameWorkerDelay() { return this.gameWorkerDelay; }
  // set gameWorkerDelay(time) { this.gameWorkerDelay = time; }


  gameWorker() {

    this.generateOutput();
  }

  generateOutput(dataToDisplay=[]) {
    let screenString = '';
    for(let i=0; i<this.height; i++) {
      for(let j=0; j<this.width; j++) {
        if(dataToDisplay.indexOf(`${j},${i}`) !== -1) {
          screenString += '■';
        } else {
          screenString += '&emsp;';
        }
      }
    }
    this.stage.innerHTML = screenString;
  }

  start() {
    if(this.status === this.STATUS_PLAYING) return;

    this.gameWorkerTimer = setInterval(this.gameWorker, this.gameWorkerDelay);
    this.status = this.STATUS_PLAYING;
  }

  pause() {
    if(this.status === this.STATUS_PLAYING) {
      clearInterval(this.gameWorkerTimer);
      this.status = this.STATUS_PAUSING;
    } else if(this.status === this.STATUS_PAUSING) {
      this.start();
    }
  }

  playOn(selector) {
    this.stage = document.querySelector(selector);
    return this;
  }

  up() { }
  down() { }
  left() { }
  right() { }
  attack() { }

  initKeyBinding() {
    const startButton = document.getElementById('button-start');
    const pauseButton = document.getElementById('button-pause');
    const upButton = document.getElementById('button-up');
    const rightButton = document.getElementById('button-right');
    const downButton = document.getElementById('button-down');
    const leftButton = document.getElementById('button-left');
    const attackButton = document.getElementById('button-attack');

    startButton.onclick = () => { this.start(); }
    pauseButton.onclick = () => { this.pause(); }

    upButton.onclick = () => this.runAction(this.KEY_CODE_UP);
    rightButton.onclick = () => this.runAction(this.KEY_CODE_RIGHT);
    downButton.onclick = () => this.runAction(this.KEY_CODE_DOWN);
    leftButton.onclick = () => this.runAction(this.KEY_CODE_LEFT);
    attackButton.onclick = () => this.runAction(this.KEY_CODE_ATTACK);

    window.onkeypress = e => this.handleKeyDown({code: e.key});
    window.onkeyup = e => this.handleKeyUp({code: e.key});
  }

  // 方向键与attack键事件不冲突，可同时触发，例如可以一边向右移动一边attack
  // 方向键与方向键之间有事件冲突，不可同时触发，例如不可以一边向右移动同时又向下移动
  handleKeyDown({
    code='',
    intervalDelay = this.keyDownIntervalDelay,
    timeoutDelay = this.keyDownTimeoutDelay,
  }={}) {
    if(this.stopKeydownInterval) return;
    if(this.status !== this.STATUS_PLAYING) return;
    if(code === this.KEY_CODE_ATTACK) {
      this.runAction(code);
      return;
    }
    if(this.keyDownTimeout[code]) return;

    for(let inProgressEvent in this.keyDownTimeout) {
      this.handleKeyUp(inProgressEvent);
    }

    this.runAction(code);

    this.keyDownTimeout[code] = setTimeout(() => {
      this.keyDownInterval[code] = setInterval(() => {
        this.runAction(code);
      }, intervalDelay);
    }, timeoutDelay);
  }

  handleKeyUp({code=''}={}) {
    this.stopKeydownInterval = false;

    if(this.keyDownTimeout[code]) {
      clearTimeout(this.keyDownTimeout[code]);
      delete this.keyDownTimeout[code];
    }

    if(this.keyDownInterval[code]) {
      clearInterval(this.keyDownInterval[code]);
      delete this.keyDownInterval[code];
    }
  }


  runAction(key='') {
    switch(key) {
      case this.KEY_CODE_UP: this.up(); break;
      case this.KEY_CODE_RIGHT: this.right(); break;
      case this.KEY_CODE_DOWN: this.down(); break;
      case this.KEY_CODE_LEFT: this.left(); break;
      case this.KEY_CODE_ATTACK: this.attack(); break;
      default: break;
    }
  }

  checkoutOverlapping(coordinatesA=[], coordinatesB=[]) {
    for(let coorA of coordinatesA) {
      if(coordinatesB.indexOf(coorA) !== -1) {
        return true;
      }
    }

    return false;
  }

  checkOutOfBounds(coordinates=[]) {
    let
      xs = [],
      ys = [],
      top = 0,
      right = 0,
      bottom = 0,
      left = 0;

    for(let point of coordinates) {
      let [x, y] = point.split(',');
      xs.push(x);
      ys.push(y);
    }
    const xOOR =  this.getOutOfRange(xs, { min: 0, max: this.width-1 });
    const yOOR = this.getOutOfRange(ys, { min: 0, max: this.height-1 });

    top = yOOR.lesserThanMin;
    bottom = yOOR.greaterThanMax;
    right = xOOR.greaterThanMax;
    left = xOOR.lesserThanMin;

    return { top, right, bottom, left }
  }

  getOutOfRange(numbers=[0, 7, -2, 6], range={min: 0, max: 5}) {
    let
      lesserThanMin = 0,
      greaterThanMax = 0,
      min = parseInt(range.min),
      max = parseInt(range.max);

    numbers.map(num => {
      num = parseInt(num);
      let currentLesserThanMin = (num<min) ? (min-num) : 0;
      let currentGreaterThanMax = (num>max) ? (num-max) : 0;
      if(currentLesserThanMin !== 0 && currentLesserThanMin > lesserThanMin) {
        lesserThanMin = currentLesserThanMin;
      }
      if(currentGreaterThanMax !== 0 && currentGreaterThanMax > greaterThanMax) {
        greaterThanMax = currentGreaterThanMax;
      }
    })

    return { lesserThanMin, greaterThanMax }
  }










}
