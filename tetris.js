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
        this.activeShape.currentCoordinates.concat(this.fixedShapeCoordinate)
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

    const { outOfBottomBound, overlapping } = this.handleShapeRotate();
    if(outOfBottomBound || overlapping) return;

    this.activeShape.rotate();
    this.generateOutput();
  }

  activeShapeSet() {
    this.fixedShapeCoordinate = this.activeShape.currentCoordinates.concat(this.fixedShapeCoordinate);
    delete this.activeShape;
    
    this.handleKeyUp({ code: this.KEY_CODE_DOWN });
    this.stopKeydownInterval = true;
  }

  moveActiveShape({ offsetX=0, offsetY=0 }) {
    if(!this.activeShape) return;

    const overlapping = this.isOverlapping({ offsetX, offsetY });
    if(overlapping && offsetY === 1) this.activeShapeSet();
    if(overlapping) return;

    const newCoordinates = this.activeShape.transformCoordinates({
      offsetX,
      offsetY,
    });
    if(this.outOfBounds({coordinates: newCoordinates, offsetX, offsetY})) return;

    this.activeShape.applyTransform({ coordinates: newCoordinates, offsetX, offsetY });
  }

  isOverlapping({ coordinates=this.activeShape.currentCoordinates, offsetX=0, offsetY=0 }) {
    const newCoordinates = this.activeShape.transformCoordinates({
      coordinates,
      offsetX,
      offsetY,
    });

    return this.checkoutOverlapping(newCoordinates, this.fixedShapeCoordinate);
  }

  outOfBounds({ coordinates=this.activeShape.currentCoordinates }) {
    let oobResult = false;

    const oob = this.checkOutOfBounds(coordinates);
    for(let key in oob) {
      if(oob[key] !== 0) oobResult = true;
    }

    if(oobResult) {
      if(oob.bottom !== 0) {
        this.activeShapeSet();
      }
      return true;
    }

    return false;
  }

  handleShapeRotate() {
    let offsetX = 0;
    let oobResult = false;
    let outOfBottomBound = false;
    let overlapping = false;
    const { coordinates } = this.activeShape.nextRotationCoordinates;
    const oob = this.checkOutOfBounds(coordinates);

    for(let key in oob) {
      if(oob[key] !== 0) oobResult = true;
    }

    if(oobResult) {
      oob.left !== 0 ? (offsetX = oob.left) : (offsetX = -oob.right);
      if(oob.bottom !== 0) {
        outOfBottomBound = true;
      }
    }

    overlapping =
       // 在边界处旋转“活动块”，边界空间不够自动向边界内方向移动
       // 边界内方向的空间也不够
      this.isOverlapping({ offsetX })
      // 边界空间足够但靠近“固定块”
      || this.checkoutOverlapping(coordinates, this.fixedShapeCoordinate);

    if(!overlapping  && !outOfBottomBound) this.activeShape.applyTransform({ offsetX });

    return { outOfBottomBound, overlapping }
  }













}
