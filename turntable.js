/**
 * @author Echo Qian <qianlu3582@163.com>
 */

/** canvas canvas元素 */
let canvas = document.getElementById('canvas');
/** context canvas上下文 */
let context = canvas.getContext('2d');
/** touchPoints 存储触摸点的数组 */
let touchPoints = [];
/** beforeReleaseAngle 手指离开转盘前旋转的总角度 */
let beforeReleaseAngle = 0;
/** timeToEnd 手指离开转盘后继续旋转的时间 */
let timeToEnd = 2000;
/** velocityWhenRelease 手指离开转盘时转盘的转速 */
let velocityWhenRelease = 0;
/** spinningTime 手指离开转盘后到当前的时间 */
let spinningTime = 0;
/** isMove 手指离开键盘之前是否执行过touchmove事件 */
let isMove = false;
/** timeMovePoints 存放每次触发touchmove事件的时间点 */
let timeMovePoints = [];

/**
 * @description 绘制转盘
 * @param {number} angle 本次绘制转盘应该旋转的角度
 */
function drawTurntable(angle) {
  adaptDPI();
  let angleInside;
  const translatedCanvasCenterX = canvas.width / 2;
  const translatedCanvasCenterY = canvas.height / 2;
  const translateCanvasCenterBackToOriginX = -(canvas.width / 2);
  const translateCanvasCenterBackToOriginY = -(canvas.height / 2);
  const bigMarkerStartPointX = canvas.width / 2 * 0.67;
  const smallMarkerStartPointX = canvas.width / 2 * 0.78;
  const MarkerEndPointX = canvas.width / 2 * 0.8;
  const bigMarkersNumber = 12;
  const smallMarkersNumber = 120;
  // 清空页面元素，用于逐帧动画
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(translatedCanvasCenterX, translatedCanvasCenterY);
  context.lineWidth = 5;
  // 第一次调用draw时angle参数为undefined，所以需要给它赋个初始值。
  if (angle !== undefined) {
    angleInside = angle;
  } else {
    angleInside = 0;
  }
  // 绘制长刻度
  for (let index = 0; index < bigMarkersNumber; index++) {
    context.beginPath();
    context.rotate(2 * Math.PI / bigMarkersNumber);
    context.moveTo(bigMarkerStartPointX * Math.cos(angleInside), bigMarkerStartPointX * Math.sin(angleInside));
    context.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
    context.stroke();
  }
  // 绘制短刻度
  context.lineWidth = 3;
  for (let index = 0; index < smallMarkersNumber; index++) {
    if (index % 10 !== 0) {
      context.beginPath();
      context.moveTo(smallMarkerStartPointX * Math.cos(angleInside), smallMarkerStartPointX * Math.sin(angleInside));
      context.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
      context.stroke();
    }
    context.rotate(2 * Math.PI / smallMarkersNumber);
  }

  // 绘制可识别图案
  context.beginPath();
  context.arc((canvas.width / 5) * Math.sin(angleInside), -(canvas.width / 5) * Math.cos(angleInside), 10, 0, Math.PI * 2, true);
  context.stroke();
  //恢复canvas原点
  context.translate(translateCanvasCenterBackToOriginX, translateCanvasCenterBackToOriginY);

  context.save();
}

/**
 * @description 设置touch事件监听器
 */
function setTouchEventListener() {
  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
  canvas.addEventListener("touchend", handleTouchEnd, false);
}

/**
 * @description 将初始触摸点横轴坐标存入touchPoints数组
 */
function handleTouchStart(event) {
  event.preventDefault();
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
  //使转盘可以再次被转动
  spinningTime = 0;
  isMove = false;
  // 停下转动中的转盘
  velocityWhenRelease = 0;
}

/**
 * @description 实现转盘跟随手指转动
 */
function handleTouchMove(event) {
  event.preventDefault();
  adaptDPI();
  // 相邻两点之间的夹角
  let distanceOfAdjacentTwoPoints = calculateBeforeReleaseAngle([canvas.width / 2, canvas.height / 2], [touchPoints.slice(-2)[0] * adaptDPI(), touchPoints.slice(-2)[1] * adaptDPI()], [event.changedTouches[0].pageX * adaptDPI(), event.changedTouches[0].pageY * adaptDPI()]);

  // 计算相邻触摸点之间的夹角并累加
  beforeReleaseAngle += distanceOfAdjacentTwoPoints;

  drawTurntable(beforeReleaseAngle);
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);

  let timeCurrent = Date.now() * 100;
  timeMovePoints.push(timeCurrent);

  let startTime = timeMovePoints.slice(-2, -1);
  let endTime = timeMovePoints.slice(-1);
  velocityWhenRelease = calculateVelocity(distanceOfAdjacentTwoPoints, timeMovePoints.slice(-2, -1), timeMovePoints.slice(-1));
  isMove = true;
}

/**
 * @description 如果手指离开转盘之前触发过touchmove事件则根据当前转速继续旋转转盘
 */
function handleTouchEnd(event) {
  event.preventDefault();
  if (isMove) {
    rotateWheel();
  }
}

/**
 * @description 已知三点坐标计算夹角
 * @param {array} pointA A点坐标
 * @param {array} pointB B点坐标
 * @param {array} pointC C点坐标
 */
function calculateBeforeReleaseAngle(pointA, pointB, pointC) {
  let lengthAB = Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2));
  let lengthAC = Math.sqrt(Math.pow(pointA[0] - pointC[0], 2) + Math.pow(pointA[1] - pointC[1], 2));
  let lengthBC = Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2));
  let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);

  let angleA = Math.acos(cosA) * judgeDirectionPointCToLineAB(pointA, pointB, pointC);
  return angleA;
}

/**
 * @description 判断旋转方向 如果点C在直线AB上方且点B横坐标大于等于canvas画布中心点横坐标，或者点C在直线AB下方且点B横坐标小于canvas画布中心点纵坐标则为逆时针，否则为顺时针
 * @param {array} pointA A点坐标
 * @param {array} pointB B点坐标
 * @param {array} pointC C点坐标
 */
function judgeDirectionPointCToLineAB(pointA, pointB, pointC) {
  //顺时针
  if (((pointC[1] > calculateStraightLineExpression(pointA, pointB, pointC[0])) && (pointB[0] > (canvas.width / 2))) || ((pointC[1] < calculateStraightLineExpression(pointA, pointB, pointC[0])) && (pointB[0] <= (canvas.width / 2)))) {
    return 1;
  } else {
    return -1;
  }
}

/**
 * @description 给定一个横坐标，计算直线AB上对应的纵坐标
 * @param {array} pointA A点坐标
 * @param {array} pointB B点坐标
 * @param {number} x 横坐标
 * @return {number} y 以x为横坐标，直线AB上对应的纵坐标
 */
function calculateStraightLineExpression(pointA, pointB, x) {
  /** slopeK 直线斜率k */
  let slopeK;
  /** interceptB 直线纵截距b*/
  let interceptB
  if (pointA[0] - pointB[0] === 0) {
    slopeK = 0;
  } else {
    slopeK = (pointA[1] - pointB[1]) / (pointA[0] - pointB[0]);
  }
  interceptB = pointA[1] - pointA[0] * slopeK;
  let y = slopeK * x + interceptB;
  return y;
}

/**
 * @description 保持canvas作图的清晰度
 * @returns {number} canvas的实际渲染倍率
 */
function adaptDPI() {
  canvas.width = 300;
  canvas.height = 300;
  // 屏幕的设备像素比
  let devicePixelRatio = window.devicePixelRatio || 1;

  // 浏览器在渲染canvas之前存储画布信息的像素比
  let backingStoreRatio = context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1;

  // canvas的实际渲染倍率
  let ratio = devicePixelRatio / backingStoreRatio;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  canvas.width = canvas.width * ratio;
  canvas.height = canvas.height * ratio;
  return ratio;
}

/**
 * @description 计算手离开转盘时转盘的速度
 * @param {number} rotatedAngle 转盘旋转的角度
 * @param {number} startTime 转盘开始旋转的时间
 * @param {number} endTime 转盘结束旋转的时间
 * @returns {number} 手离开转盘时转盘的速度
 */
function calculateVelocity(rotatedAngle, startTime, endTime) {
  return rotatedAngle / (endTime - startTime);
}

/**
 * @description 缓动函数，由快到慢
 * @param {number} currentTime 当前时间
 * @param {number} begin 初始值
 * @param {number} change 变化值
 * @param {number} delay 持续时间
 */
function easeOut(currentTime, begin, change, delay) {
  if ((currentTime /= delay / 2) < 1) return change / 2 * currentTime * currentTime + begin;
  return -change / 2 * ((--currentTime) * (currentTime - 2) - 1) + begin;
}

/**
 * @description 松手后开始旋转
 */
function rotateWheel() {
  let totalRotatedAngle;
  // 当 当前时间 大于 总时间，停止旋转，并返回当前值
  spinningTime += 20;
  if (spinningTime >= timeToEnd) {
    return
  }
  let _spinningChange = (velocityWhenRelease * 100000 - easeOut(spinningTime, 0, velocityWhenRelease * 100000, timeToEnd)) * (Math.PI / 180);
  beforeReleaseAngle += _spinningChange;
  totalRotatedAngle = beforeReleaseAngle;
  drawTurntable(totalRotatedAngle);
  window.requestAnimationFrame(rotateWheel);
}

setTouchEventListener();