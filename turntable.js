let angle = 0;
let ctx = document.getElementById('canvas').getContext('2d');
function draw(angle){
  // --- 清空页面元素，用于逐帧动画
  ctx.clearRect(0,0,300,300);

  ctx.translate(150,150);
  ctx.lineWidth = 5;
  //第一次调用draw时angle参数为undefined，所以需要给它赋个初始值。
  if (angle!==undefined) {
    angleInside = angle;
  } else {
    angleInside = 0;
  }
  // 长刻度
  for (var i=0;i<12;i++){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(100*Math.cos(angleInside),100*Math.sin(angleInside));
    ctx.lineTo(120*Math.cos(angleInside),120*Math.sin(angleInside));
    ctx.stroke();
  }
  // 短刻度
  ctx.lineWidth = 3;
  for (i=0;i<120;i++){
    if (i%10!=0) {
      ctx.beginPath();
      ctx.moveTo(117*Math.cos(angleInside),117*Math.sin(angleInside));
      ctx.lineTo(120*Math.cos(angleInside),120*Math.sin(angleInside));
      ctx.stroke();
    }
    ctx.rotate(Math.PI/60);
  }

  // 画可识别图案
  ctx.beginPath();
  ctx.arc(60*Math.sin(angleInside),-60*Math.cos(angleInside),10,0,Math.PI*2,true); // 绘制
  ctx.stroke();
  //恢复canvas原点
  ctx.translate(-150,-150);
}

function startup() {
  let turntable = document.getElementById("canvas");
  turntable.addEventListener("touchstart", handleStart, false);
  turntable.addEventListener("touchmove", handleMove, false);
}

let touchPoints = [];
function handleStart(event) {
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
  let angleTest = calculateAngle([0,0], [1,0], [0,1]);
}

let angleTurned = 0;
function handleMove(event) {
  event.preventDefault();
  angleTurned += calculateAngle([150, 150], touchPoints.slice(-2), [event.changedTouches[0].pageX, event.changedTouches[0].pageY]);
  draw(angleTurned);
  touchPoints = [];
  touchPoints.push(event.changedTouches[0].pageX);
  touchPoints.push(event.changedTouches[0].pageY);
}

function calculateAngle(pointA, pointB, pointC) {
  let lengthAB = Math.sqrt(Math.pow(pointA[0]-pointB[0], 2) + Math.pow(pointA[1]-pointB[1], 2));
  let lengthAC = Math.sqrt(Math.pow(pointA[0]-pointC[0], 2) + Math.pow(pointA[1]-pointC[1], 2));
  let lengthBC = Math.sqrt(Math.pow(pointB[0]-pointC[0], 2) + Math.pow(pointB[1]-pointC[1], 2));
  let cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);

  let angleA = Math.acos(cosA);
  return angleA;
}

startup();