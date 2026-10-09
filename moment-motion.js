(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches||!('IntersectionObserver' in window))return;
const targets=[...document.querySelectorAll('.section-head,.intro-grid,.about-promises>div,.offering-visual,.offering-copy,.approach-grid article,.partners article,.company dl,.message-teaser-copy,.contact-bottom,.recruit-copy')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;entry.target.classList.remove('is-pending');entry.target.classList.add('is-shown');observer.unobserve(entry.target)}},{threshold:.08});
for(const el of targets){el.classList.add('motion-item');if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add('is-pending');observer.observe(el)}else{el.classList.add('is-shown')}}
document.documentElement.classList.add('motion-enabled');
let seen=true;try{seen=sessionStorage.getItem('moment-intro-seen')==='1';sessionStorage.setItem('moment-intro-seen','1')}catch{}
if(!seen&&!location.hash){const cut=document.createElement('div');cut.className='moment-cutin';cut.setAttribute('aria-hidden','true');document.body.append(cut);setTimeout(()=>cut.remove(),1100)}
reduced.addEventListener('change',e=>{if(!e.matches)return;observer.disconnect();document.documentElement.classList.remove('motion-enabled');for(const el of targets)el.classList.remove('is-pending');document.querySelector('.moment-cutin')?.remove()});
})();