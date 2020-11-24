import { ShapeBinaryData, ShapesMaxRotateTimes } from './shapesData.js'

export default class Shape {

  offsetX = 0;
  offsetY = 0;
  currentRotationBinaryData = [];
  nextRotationBinaryData = [];
  originCoordinate = [];
  currentCoordinate = [];

  constructor({ offsetX=0, offsetY=0 }) {

    this.currentRotationBinaryData = this.getRandomBinary();
    this.nextRotationBinaryData = this.rotateBinary();
    this.generateCoordinateFromBinary();
    this.applyTransform({ offsetX, offsetY });

  }

  rotate() {
    this.currentRotationBinaryData = this.nextRotationBinaryData;
    this.generateCoordinateFromBinary();
    this.applyTransform();

    this.nextRotationBinaryData = this.rotateBinary();
  }

  getRandomBinary() {
    const key = Math.floor(Math.random() * 10 % ShapeBinaryData.length);
    const shape = ShapeBinaryData[key];

    const maxRotateTimes = ShapesMaxRotateTimes[key];
    const randomRotateTimes = maxRotateTimes <= 1 ? maxRotateTimes : Math.ceil(Math.random() * 10 % maxRotateTimes);

    return this.rotateBinary(shape, randomRotateTimes);
  }


  rotateBinary(shape=this.currentRotationBinaryData, times = 1) {
    const shapeRows = shape.length;
    const resultArr = [];

    for (let rowIndex=0; rowIndex<shape.length; rowIndex ++) {
      for (let colIndex=0; colIndex<shape[rowIndex].length; colIndex ++) {
        resultArr[colIndex] = resultArr[colIndex] || [];
        resultArr[colIndex][shapeRows - rowIndex - 1] = shape[rowIndex][colIndex];
      }
    }

    times --;
    if(times > 0) {
      return this.rotateBinary(resultArr);
    }

    return resultArr;
  }

  // 生成一个自适应的坐标结果，使其在做“旋转”变换时更优雅
  generateCoordinateFromBinary(binaryData=this.currentRotationBinaryData) {
    const coordinateArray = [];

    const shapeHeightCenter = Math.floor(binaryData.length / 2);
    const shapeWidthCenter = Math.floor(binaryData[0].length / 2);

    for(let i = 0; i<binaryData.length; i++) {
      for(let j=0; j<binaryData[i].length; j++) {
        if(binaryData[i][j]) {
          coordinateArray.push(`${j-shapeWidthCenter},${i-shapeHeightCenter}`);
        }
      }
    }
    this.originCoordinate = coordinateArray;
  }

  applyTransform({ offsetX=0, offsetY=0 }={}) {
    const coordinates = this.getNewCoordinates({offsetX, offsetY});
    this.offsetX += offsetX;
    this.offsetY += offsetY;
    this.currentCoordinate = coordinates;
  }

  getNewCoordinates({ offsetX=0, offsetY=0 }) {
    let absX = this.offsetX + offsetX;
    let absY = this.offsetY + offsetY;

    let resultCoordinate = [];
    for(let coor of this.originCoordinate) {
      let [x, y] = coor.split(',');
      x = parseInt(x);
      y = parseInt(y);
      x += parseInt(absX);
      y += parseInt(absY);
      resultCoordinate.push(`${x},${y}`);
    }
    return resultCoordinate;
  }















}
