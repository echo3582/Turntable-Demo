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
  turntable.addEventListener("touchend", handleEnd, false);
  turntable.addEventListener("touchmove", handleMove, false);
}

function handleStart(event) {
  console.log("I'm touched");
  draw(Math.PI/3);
}

function handleEnd() {
  console.log("I'm released");
}

function handleMove() {
  console.log("I'm moving")
}

startup();