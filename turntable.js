/**
 * @author Echo Qian <qianlu3582@163.com>
 */

/**
 * @param {string} CANVAS canvas元素
 * @param {string} CONTEXT canvas上下文
 * @param {array} TOUCHPOINTS canvas上下文
 * @param {string} CONTEXT canvas上下文
 */
let CANVAS = document.getElementById('canvas');
let CONTEXT = CANVAS.getContext('2d');
//touchpoints为存储触摸点的数组
let TOUCHPOINTS = [];
//ANGLETURNED为转盘旋转的角度
let ANGLETURNED = 0;

function drawTurntable(angle) {
  let angleInside;
  const translatedCanvasCenterX = 150;
  const translatedCanvasCenterY = 150;
  const translateCanvasCenterBackToOriginX = -150;
  const translateCanvasCenterBackToOriginY = -150;
  const bigMarkerStartPointX = 100;
  const smallMarderStartPointX = 117;
  const MarkerEndPointX = 120;
  const bigMarkersNumber = 12;
  const smallMarkersNumber = 120;
  // --- 清空页面元素，用于逐帧动画
  CONTEXT.clearRect(0, 0, 300, 300);
  CONTEXT.translate(translatedCanvasCenterX, translatedCanvasCenterY);
  CONTEXT.lineWidth = 5;
  //第一次调用draw时angle参数为undefined，所以需要给它赋个初始值。
  if (angle !== undefined) {
    angleInside = angle;
  } else {
    angleInside = 0;
  }
  // 长刻度
  for (let i = 0; i < bigMarkersNumber; i++) {
    CONTEXT.beginPath();
    CONTEXT.rotate(2 * Math.PI / bigMarkersNumber);
    CONTEXT.moveTo(bigMarkerStartPointX * Math.cos(angleInside), bigMarkerStartPointX * Math.sin(angleInside));
    CONTEXT.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
    CONTEXT.stroke();
  }
  // 短刻度
  CONTEXT.lineWidth = 3;
  for (let i = 0; i < smallMarkersNumber; i++) {
    if (i % 10 !== 0) {
      CONTEXT.beginPath();
      CONTEXT.moveTo(smallMarderStartPointX * Math.cos(angleInside), smallMarderStartPointX * Math.sin(angleInside));
      CONTEXT.lineTo(MarkerEndPointX * Math.cos(angleInside), MarkerEndPointX * Math.sin(angleInside));
      CONTEXT.stroke();
    }
    CONTEXT.rotate(2 * Math.PI / smallMarkersNumber);
  }

  // 画可识别图案
  CONTEXT.beginPath();
  CONTEXT.arc(60 * Math.sin(angleInside), -60 * Math.cos(angleInside),10,0, Math.PI * 2,true); // 绘制
  CONTEXT.stroke();
  //恢复canvas原点
  CONTEXT.translate(translateCanvasCenterBackToOriginX, translateCanvasCenterBackToOriginY);
}

function setEventListner() {
  CANVAS.addEventListener("touchstart", handleTouchStart, false);
  CANVAS.addEventListener("touchmove", handleTouchMove, false);
}

function handleTouchStart(event) {
  TOUCHPOINTS.push(event.changedTouches[0].pageX);
  TOUCHPOINTS.push(event.changedTouches[0].pageY);
}

function handleTouchMove(event) {
  event.preventDefault();
  ANGLETURNED += calculateAngle([150, 150], TOUCHPOINTS.slice(-2), [event.changedTouches[0].pageX, event.changedTouches[0].pageY]);
  drawTurntable(ANGLETURNED);
  TOUCHPOINTS = [];
  TOUCHPOINTS.push(event.changedTouches[0].pageX);
  TOUCHPOINTS.push(event.changedTouches[0].pageY);
}

function calculateAngle(pointA, pointB, pointC) {
  let lengthAB = Math.sqrt(Math.pow(pointA[0]-pointB[0], 2) + Math.pow(pointA[1]-pointB[1], 2));
  let lengthAC = Math.sqrt(Math.pow(pointA[0]-pointC[0], 2) + Math.pow(pointA[1]-pointC[1], 2));
  let lengthBC = Math.sqrt(Math.pow(pointB[0]-pointC[0], 2) + Math.pow(pointB[1]-pointC[1], 2));
  let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);

  let angleA = Math.acos(cosA);
  return angleA;
}

setEventListner();