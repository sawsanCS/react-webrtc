onmessage = (e) => {
    console.log('whatever', e.data)
    const osc = e.data.canvas;
    const ctx = osc.getContext("2d");
  
    // setInterval(function () {ctx.drawImage(e.data.video, 0, 0, 200, 200, 0, 0, 150, 150);
    // },20); 
    postMessage("whatever", ctx)

}