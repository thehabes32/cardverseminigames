/* CardVerse shared share-card generator — cosmic themed PNG for stories/posts.
   Usage: cvShareImage({game, gameColor, big, small, sub, rows, day, gem, filename})
   rows: array of strings, each a line of emoji (e.g. "🟩🟨⬛"). */
(function(){
  var saucer=new Image();
  saucer.src='images/saucer.png';

  function draw(o, cb){
    var W=1080, H=1080, c=document.createElement('canvas');
    c.width=W; c.height=H;
    var x=c.getContext('2d');

    // deep space background
    x.fillStyle='#070510'; x.fillRect(0,0,W,H);
    var g1=x.createRadialGradient(W*0.2,0,0,W*0.2,0,W*0.9);
    g1.addColorStop(0,'rgba(124,108,252,0.40)'); g1.addColorStop(0.55,'rgba(124,108,252,0)');
    x.fillStyle=g1; x.fillRect(0,0,W,H);
    var g2=x.createRadialGradient(W*0.9,H*0.15,0,W*0.9,H*0.15,W*0.8);
    g2.addColorStop(0,'rgba(252,108,143,0.32)'); g2.addColorStop(0.55,'rgba(252,108,143,0)');
    x.fillStyle=g2; x.fillRect(0,0,W,H);
    var g3=x.createRadialGradient(W*0.5,H,0,W*0.5,H,W*0.9);
    g3.addColorStop(0,'rgba(78,224,214,0.16)'); g3.addColorStop(0.5,'rgba(78,224,214,0)');
    x.fillStyle=g3; x.fillRect(0,0,W,H);

    // stars
    x.fillStyle='#ffffff';
    for(var i=0;i<140;i++){ var sx=Math.random()*W, sy=Math.random()*H, r=Math.random()*2.2+0.4; x.globalAlpha=Math.random()*0.6+0.15; x.beginPath(); x.arc(sx,sy,r,0,7); x.fill(); }
    x.globalAlpha=1;

    // gem frame
    if(o.gem){ x.strokeStyle='rgba(252,217,108,0.7)'; x.lineWidth=10; x.strokeRect(24,24,W-48,H-48); }

    // saucer logo
    if(saucer.complete && saucer.naturalWidth){ var sw=150, sh=sw*saucer.naturalHeight/saucer.naturalWidth; x.drawImage(saucer,(W-sw)/2,120,sw,sh); }

    x.textAlign='center';
    // wordmark
    x.fillStyle='#f2f0ff'; x.font='900 46px Orbitron, sans-serif';
    x.fillText('CARDVERSE', W/2, 340);
    // game name
    x.fillStyle=o.gameColor||'#fcd96c'; x.font='800 34px Orbitron, sans-serif';
    x.fillText((o.game||'').toUpperCase(), W/2, 400);

    // big score — draw "5" and "/8" as one centered group so the number sits dead-center
    var big=String(o.big||'');
    var bigFont='900 140px Orbitron, sans-serif';
    var smallFont='900 56px Orbitron, sans-serif';
    x.textBaseline='alphabetic';
    x.font=bigFont; var bw=x.measureText(big).width;
    var sw2=0, gap=8;
    if(o.small){ x.font=smallFont; sw2=x.measureText(o.small).width; }
    var total=bw + (o.small ? gap+sw2 : 0);
    var sx=(W-total)/2;
    x.textAlign='left';
    x.font=bigFont; x.fillStyle=o.gem?'#fcd96c':'#f2f0ff'; x.fillText(big, sx, 558);
    if(o.small){ x.font=smallFont; x.fillStyle='rgba(242,240,255,0.5)'; x.fillText(o.small, sx+bw+gap, 558); }
    x.textAlign='center';

    // sub
    if(o.sub){ x.fillStyle='rgba(242,240,255,0.72)'; x.font='800 32px Nunito, sans-serif'; x.fillText(o.sub, W/2, 620); }

    // emoji grid — auto-fit rows into the space above the footer, with breathing room
    var rows=o.rows||[];
    var n=rows.length||1;
    var top=666, area=316;                 // vertical band reserved for the grid
    var lh=Math.min(78, area/n);           // per-row height, capped
    var fs=Math.min(56, Math.round(lh-16));// emoji size follows the row height
    var blockH=n*lh;
    var startY=top + (area-blockH)/2 + fs; // baseline of the first row (block centered)
    x.font=fs+'px Nunito, "Apple Color Emoji","Segoe UI Emoji", sans-serif';
    try{ x.letterSpacing=Math.round(fs*0.16)+'px'; }catch(e){}
    for(var r=0;r<rows.length;r++){ x.fillText(rows[r], W/2, startY + r*lh); }
    try{ x.letterSpacing='0px'; }catch(e){}

    // footer
    x.fillStyle='#4ee0d6'; x.font='800 30px Orbitron, sans-serif';
    x.fillText('◆ cardverseminigames.com ◆', W/2, H-70);

    c.toBlob(function(b){ cb(b,c); }, 'image/png');
  }

  window.cvShareImage=function(o){
    var run=function(){
      draw(o, function(blob, canvas){
        var fname=(o.filename||'cardverse')+'.png';
        var file=new File([blob], fname, {type:'image/png'});
        if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
          navigator.share({files:[file], title:'CardVerse'}).catch(function(){ dl(canvas,fname); });
        } else { dl(canvas,fname); }
      });
    };
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(run); } else { run(); }
    function dl(canvas,fname){ var a=document.createElement('a'); a.download=fname; a.href=canvas.toDataURL('image/png'); a.click(); }
  };
})();
