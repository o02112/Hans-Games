import { ShapeBinaryData, ShapesMaxRotateTimes } from './shapesData.js'

export default class Shape {

  offsetX = 0;
  offsetY = 0;
  currentBinaryData = [];
  originCoordinate = [];
  currentCoordinates = [];

  constructor({ offsetX=0, offsetY=0 }) {

    const binaryData = this.getRandomBinary();
    const coordinates = this.getCoordinatefromBinaryData({ binaryData, offsetX, offsetY })

    this.applyTransform({ binaryData, coordinates, offsetX, offsetY });
  }

  get nextRotationCoordinates() {
    const binaryData = this.rotateBinary();
    const coordinates = this.getCoordinatefromBinaryData({ binaryData })

    return { binaryData, coordinates }
  }

  rotate() {
    this.applyTransform(this.nextRotationCoordinates);
  }

  applyTransform({
    binaryData = this.currentBinaryData,
    coordinates = this.currentCoordinates,
    offsetX=0,
    offsetY=0,
  }={}) {
    this.currentBinaryData = binaryData;
    this.currentCoordinates = coordinates;
    this.offsetX += offsetX;
    this.offsetY += offsetY;
  }

  getCoordinatefromBinaryData({
    binaryData,
    offsetX=this.offsetX,
    offsetY=this.offsetY,
  }) {
    const coordinates = this.generateCoordinateFromBinary(binaryData);
    const coordinatesResult = this.transformCoordinates({
      coordinates,
      offsetX,
      offsetY,
    });

    return coordinatesResult;
  }

  getRandomBinary() {
    const key = Math.floor(Math.random() * 10 % ShapeBinaryData.length);
    const shape = ShapeBinaryData[key];

    const maxRotateTimes = ShapesMaxRotateTimes[key];
    const randomRotateTimes = maxRotateTimes <= 1 ? maxRotateTimes : Math.ceil(Math.random() * 10 % maxRotateTimes);

    return this.rotateBinary(shape, randomRotateTimes);
  }


  rotateBinary(shape=this.currentBinaryData, times = 1) {
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
  generateCoordinateFromBinary(binaryData=this.currentBinaryData) {
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
    return coordinateArray;
  }

  transformCoordinates({ coordinates=this.currentCoordinates, offsetX=0, offsetY=0 }) {
    // let absX = this.offsetX + offsetX;
    // let absY = this.offsetY + offsetY;

    let resultCoordinate = [];
    for(let coor of coordinates) {
      let [x, y] = coor.split(',');
      x = parseInt(x);
      y = parseInt(y);
      x += parseInt(offsetX);
      y += parseInt(offsetY);
      resultCoordinate.push(`${x},${y}`);
    }
    return resultCoordinate;
  }















}
