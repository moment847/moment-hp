(()=>{
 const nodes=document.querySelectorAll('.editorial-heading,.business-group-title,.featured-business,.business-card,.hero-caption');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!('IntersectionObserver'in window)||reduced.matches)return;
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-animated');observer.unobserve(e.target)}})},{threshold:.08});
 nodes.forEach(n=>{n.classList.add('editorial-reveal');observer.observe(n)});
})();
