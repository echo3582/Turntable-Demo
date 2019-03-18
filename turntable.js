/**
 * @author Echo Qian <qianlu3582@163.com>
 */

/**
 * @param {string} canvas canvas元素
 * @param {string} context canvas上下文
 * @param {array} touchPoints 存储触摸点的数组
 * @param {number} angleTurned 转盘旋转的角度
 * @param {number} translatedcanvasCenterX 将canvas的原点横坐标移动到原画布的中心位置
 * @param {number} translatedcanvasCenterY 将canvas的原点纵坐标移动到原画布的中心位置
*/
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let touchPoints = [];
let angleTurned = 0;

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
  const smallMarderStartPointX = canvas.width / 2 * 0.78;
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
  for (let i = 0; i < bigMarkersNumber; i++) {
    context.beginPath();
    context.rotate(2 * Math.PI / bigMarkersNumber);
    context.moveTo(bigMarkerStartPointX * Math.cos(angleInside), bigMarkerStartPointX * Math.sin(angleInside));
    context.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
    context.stroke();
  }
  // 绘制短刻度
  context.lineWidth = 3;
  for (let i = 0; i < smallMarkersNumber; i++) {
    if (i % 10 !== 0) {
      context.beginPath();
      context.moveTo(smallMarderStartPointX * Math.cos(angleInside), smallMarderStartPointX * Math.sin(angleInside));
      context.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
      context.stroke();
    }
    context.rotate(2 * Math.PI / smallMarkersNumber);
  }

  // 绘制可识别图案
  context.beginPath();
  context.arc((canvas.width / 5) * Math.sin(angleInside), -(canvas.width / 5) * Math.cos(angleInside),10,0, Math.PI * 2,true);
  context.stroke();
  //恢复canvas原点
  context.translate(translateCanvasCenterBackToOriginX, translateCanvasCenterBackToOriginY);
}

/**
* @description 设置touch事件监听器
*/
function setTouchEventListener() {
  canvas.addEventListener("touchstart", handleTouchStart, false);
  canvas.addEventListener("touchmove", handleTouchMove, false);
}
/**
* @description 将初始触摸点横轴坐标存入touchPoints数组
*/
function handleTouchStart(event) {
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
}
/**
* @description 实现转盘跟随手指转动
*/
function handleTouchMove(event) {
  event.preventDefault();
  adaptDPI();
  // 计算相邻触摸点之间的夹角并累加，将此累加后的夹角传递给drawTurntable
  angleTurned += calculateAngle([canvas.width / 2, canvas.height / 2], [touchPoints.slice(-2)[0] * adaptDPI(), touchPoints.slice(-2)[1] * adaptDPI()], [event.changedTouches[0].pageX * adaptDPI(), event.changedTouches[0].pageY * adaptDPI()]);
  drawTurntable(angleTurned);
  touchPoints = [];
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
}
/**
* @description 已知三点坐标计算夹角
* @param {array} pointA A点坐标
* @param {array} pointB B点坐标
* @param {array} pointC C点坐标
*/
function calculateAngle(pointA, pointB, pointC) {
  let lengthAB = Math.sqrt(Math.pow(pointA[0]-pointB[0], 2) + Math.pow(pointA[1]-pointB[1], 2));
  let lengthAC = Math.sqrt(Math.pow(pointA[0]-pointC[0], 2) + Math.pow(pointA[1]-pointC[1], 2));
  let lengthBC = Math.sqrt(Math.pow(pointB[0]-pointC[0], 2) + Math.pow(pointB[1]-pointC[1], 2));
  let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);

  let angleA = Math.acos(cosA) * judgeDirectionPointCToLineAB(pointA, pointB, pointC);
  return angleA;
}
/**
* @description 判断旋转方向 如果点C在直线AB上方且点B横坐标大于等于150，或者点C在直线AB下方且点B横坐标小于150则为逆时针，否则为顺时针
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
* @param {number} y 以x为横坐标，直线AB上对应的纵坐标
*/
function calculateStraightLineExpression(pointA, pointB, x) {
  let k;
  if (pointA[0] - pointB[0] === 0) {
    k = 0;
  } else {
    k = (pointA[1] - pointB[1]) / (pointA[0] - pointB[0]);
  }
  let b = pointA[1] - pointA[0] * k;
  let y = k * x + b;
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

setTouchEventListener();