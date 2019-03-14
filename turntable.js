function draw(){
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.save();
  ctx.clearRect(0,0,300,300);
  ctx.translate(75,75);
  ctx.scale(0.5,0.5);
  ctx.rotate(-Math.PI/2);
  ctx.lineWidth = 5;

  // 长刻度
  ctx.save();
  for (var i=0;i<12;i++){
    ctx.beginPath();
    ctx.rotate(Math.PI/6);
    ctx.moveTo(100,0);
    ctx.lineTo(120,0);
    ctx.stroke();
  }
  ctx.restore();

  // 短刻度
  ctx.save();
  ctx.lineWidth = 5;
  for (i=0;i<60;i++){
    if (i%5!=0) {
      ctx.beginPath();
      ctx.moveTo(117,0);
      ctx.lineTo(120,0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI/30);
  }
  ctx.restore();

  // 画可识别图案
  ctx.beginPath();
  ctx.arc(30,30,10,0,Math.PI*2,true); // 绘制
  ctx.stroke();
}