import GameBase from './gameBase.js'
import Shape from './shape.js'

export default class Tetris extends GameBase {

  activeShape;
  fixedShapeCoordinate = [];

  // constructor() {
  //   super();
  //
  // }

  handleKeyDown({ code }) {
    const intervalDelay = (code === this.KEY_CODE_DOWN) ? 13 : undefined
    super.handleKeyDown({code, intervalDelay});
  }

  generateOutput() {
    if(this.activeShape) {
      super.generateOutput(
        this.activeShape.currentCoordinate.concat(this.fixedShapeCoordinate)
      );
    }
  }


  gameWorker() {

    this.activeShape ? this.activeShapeFall() : this.spawnActiveShape();
    this.generateOutput();
  }

  spawnActiveShape() {
    this.activeShape = new Shape({ offsetX: 10, offsetY: 2 });
  }

  activeShapeFall() {
    this.moveActiveShape({ offsetY: 1 });
  }

  up() { } // 不触发动作

  down() {
    this.moveActiveShape({ offsetY: 1 });
    this.generateOutput();
  }

  left() {

    this.moveActiveShape({ offsetX: -1 });
    this.generateOutput();
  }

  right() {
    this.moveActiveShape({ offsetX: 1 });
    this.generateOutput();
  }

  attack() {
    if(!this.activeShape) return;



    this.activeShape.rotate();
    this.generateOutput();
  }

  activeShapeSet() {
    this.fixedShapeCoordinate = this.fixedShapeCoordinate.concat(this.activeShape.currentCoordinate);
    delete this.activeShape;
  }

  moveActiveShape(offset={offsetX: 0, offsetY: 0}) {
    if(!this.activeShape) return;

    let oobResult = false;
    const coordinates = this.activeShape.getNewCoordinates(offset);
    const oob = this.outOfBounds(coordinates);
    for(let key in oob) {
      if(oob[key] !== 0) oobResult = true;
    }

    if(oobResult) {
      if(oob.bottom !== 0) {
        this.activeShapeSet();
      }

      // console.warn('out of bounds.');
      return;
    }

    this.activeShape.applyTransform(offset);
  }













}
