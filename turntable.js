function draw() {
  var canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.arc(100,100,75,0,Math.PI*2,true); // 绘制
    ctx.stroke();
  }
}