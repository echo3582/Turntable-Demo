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
const translatedcanvasCenterX = 150;
const translatedcanvasCenterY = 150;

/**
* @description 绘制转盘
* @param {number} angle 本次绘制转盘应该旋转的角度
* @param {number} angleInside 本次绘制转盘应该旋转的角度
* @param {number} translatecanvasCenterBackToOriginX 将canvas的原点横坐标移回到初始原点
* @param {number} translatecanvasCenterBackToOriginY 将canvas的原点纵坐标移回到初始原点
* @param {number} bigMarkerStartPointX 大刻度标记的起始位置
* @param {number} smallMarderStartPointX 小刻度标记的起始位置
* @param {number} MarkerEndPointX 刻度标记的终止位置
* @param {number} bigMarkersNumber 大刻度标记个数
* @param {number} smallMarkersNumber 小刻度标记个数
*/
function drawTurntable(angle) {
  let angleInside;
  const translatecanvasCenterBackToOriginX = -150;
  const translatecanvasCenterBackToOriginY = -150;
  const bigMarkerStartPointX = 100;
  const smallMarderStartPointX = 117;
  const MarkerEndPointX = 120;
  const bigMarkersNumber = 12;
  const smallMarkersNumber = 120;
  // 清空页面元素，用于逐帧动画
  context.clearRect(0, 0, 300, 300);
  context.translate(translatedcanvasCenterX, translatedcanvasCenterY);
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
  context.arc(60 * Math.sin(angleInside), -60 * Math.cos(angleInside),10,0, Math.PI * 2,true);
  context.stroke();
  //恢复canvas原点
  context.translate(translatecanvasCenterBackToOriginX, translatecanvasCenterBackToOriginY);
}

/**
* @description 设置touch事件监听器
*/
function setTouchEventListner() {
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
* @param {number} angleTurned 转盘旋转的角度
*/
function handleTouchMove(event) {
  event.preventDefault();
  // 计算相邻触摸点之间的夹角并累加，将此累加后的夹角传递给drawTurntable
  angleTurned += calculateAngle([translatedcanvasCenterX, translatedcanvasCenterY], touchPoints.slice(-2), [event.changedTouches[0].pageX, event.changedTouches[0].pageY]);
  drawTurntable(angleTurned);
  touchPoints = [];
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
}
/**
* @description 已知三点坐标计算夹角
*/
function calculateAngle(pointA, pointB, pointC) {
  let lengthAB = Math.sqrt(Math.pow(pointA[0]-pointB[0], 2) + Math.pow(pointA[1]-pointB[1], 2));
  let lengthAC = Math.sqrt(Math.pow(pointA[0]-pointC[0], 2) + Math.pow(pointA[1]-pointC[1], 2));
  let lengthBC = Math.sqrt(Math.pow(pointB[0]-pointC[0], 2) + Math.pow(pointB[1]-pointC[1], 2));
  let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);

  let angleA = Math.acos(cosA);
  return angleA;
}

setTouchEventListner();