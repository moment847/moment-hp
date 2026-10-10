(()=>{
  if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const active=new Map();
  const selectors=[
    '.section-head', '#about .intro-grid>.large-copy', '#about .intro-grid .body-copy>p',
    '#about .intro-grid .body-copy>.text-link', '.about-promises>div',
    '.offering-visual', '.offering-copy>*', '.beyond-head',
    '.beyond-image', '.beyond-card .service-main>*', '.approach-grid article',
    '.regional-copy', '.partners article', '.recruit>figure',
    '.recruit-copy>*', '.company dl>div', '.message-teaser-copy>*',
    '.contact h2', '.contact .contact-bottom'
  ];
  const elements=[...document.querySelectorAll(selectors.join(','))];
  // Observe stable layout boxes, never the animated or clipped image itself.
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      const box=entry.target;
      if(entry.isIntersecting){
        if(box.dataset.motionState==='shown')continue;
        box.dataset.motionState='shown';
        const photo=box.matches('.offering-visual,.beyond-image,.recruit>figure');
        const target=photo?box.querySelector('img'):box;
        if(!target)continue;
        active.get(box)?.cancel();
        const frames=reduced.matches?
          [{opacity:.65},{opacity:1}]:
          photo?[{clipPath:'inset(0 100% 0 0)',transform:'scale(1.04)'},{clipPath:'inset(0 0% 0 0)',transform:'scale(1)'}]:
          [{opacity:.12,transform:'translateY(34px)'},{opacity:1,transform:'translateY(0)'}];
        const animation=target.animate(frames,{duration:reduced.matches?180:photo?1150:850,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'});
        active.set(box,animation);
        animation.onfinish=()=>active.delete(box);
      }else if(entry.boundingClientRect.bottom<=0||entry.boundingClientRect.top>=innerHeight){
        box.dataset.motionState='ready';
      }
    }
  },{threshold:0,rootMargin:'0px 0px -12% 0px'});
  elements.forEach(el=>observer.observe(el));
  // The hero also replays on a fresh visit; no per-session suppression.
  if(!reduced.matches&&!location.hash){
    const cut=document.createElement('div');cut.className='moment-cutin';cut.setAttribute('aria-hidden','true');
    document.body.append(cut);setTimeout(()=>cut.remove(),1150);
  }
  reduced.addEventListener('change',()=>{active.forEach(a=>a.cancel());active.clear();document.querySelector('.moment-cutin')?.remove()});
  addEventListener('pageshow',e=>{if(e.persisted){elements.forEach(el=>{el.dataset.motionState='ready';observer.unobserve(el);observer.observe(el)})}});
})();
