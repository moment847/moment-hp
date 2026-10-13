(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const image=new Image();image.src='/moment-logo-v3.png';image.alt='';image.width=554;image.height=410;image.className='moment-logo-intro__image';
  let started=false;
  const show=()=>{
    if(started)return;started=true;
    const layer=document.createElement('div');layer.className='moment-logo-intro';layer.setAttribute('aria-hidden','true');
    const scene=document.createElement('div');scene.className='moment-logo-intro__scene';
    const shadow=document.createElement('div');shadow.className='moment-logo-intro__shadow';
    scene.append(shadow,image);layer.append(scene);document.body.append(layer);
    const dismiss=()=>layer.remove();
    setTimeout(dismiss,reduced.matches?650:2850);
    addEventListener('pointerdown',dismiss,{once:true});
    addEventListener('wheel',dismiss,{once:true,passive:true});
    addEventListener('keydown',dismiss,{once:true});
  };
  // If the logo cannot load, content remains available immediately.
  if(image.complete&&image.naturalWidth)show();else image.addEventListener('load',show,{once:true});
})();
