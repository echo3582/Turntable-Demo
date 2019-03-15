function draw(){
  let ctx = document.getElementById('canvas').getContext('2d');
  ctx.translate(150,150);
  ctx.scale(0.4,0.4);
  ctx.lineWidth = 5;

  // 长刻度
  for (var i=0;i<12;i++){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(200,0);
    ctx.lineTo(240,0);
    ctx.stroke();
  }

  // 短刻度
  ctx.lineWidth = 5;
  for (i=0;i<120;i++){
    if (i%10!=0) {
      ctx.beginPath();
      ctx.moveTo(234,0);
      ctx.lineTo(240,0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI/60);
  }

  // 画可识别图案
  ctx.beginPath();
  ctx.arc(0,-60,10,0,Math.PI*2,true); // 绘制
  ctx.stroke();
}

function startup() {
  let turntable = document.getElementById("canvas");
  turntable.addEventListener("touchstart", handleStart, false);
  turntable.addEventListener("touchend", handleEnd, false);
  turntable.addEventListener("touchmove", handleMove, false);
}

function handleStart() {
  console.log("I'm touched");
}

function handleEnd() {
  console.log("I'm released");
}

function handleMove() {
  console.log("I'm moving")
}

startup();
