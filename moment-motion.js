(()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches||!('IntersectionObserver' in window))return;
const targets=[...document.querySelectorAll('.section-head,.intro-grid,.about-promises>div,.offering-visual,.offering-copy,.approach-grid article,.partners article,.company dl,.message-teaser-copy,.contact-bottom,.recruit-copy')].filter(el=>!el.closest('#about,#approach'));
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;const target=entry.target.matches('.offering')?entry.target.querySelector('.offering-visual'):entry.target;target.classList.remove('is-pending');target.classList.add('is-shown');observer.unobserve(entry.target)}},{threshold:.08});
for(const el of targets){el.classList.add('motion-item');if(el.getBoundingClientRect().top>innerHeight*.92){el.classList.add('is-pending');observer.observe(el.classList.contains('offering-visual')?el.parentElement:el)}else{el.classList.add('is-shown')}}
document.documentElement.classList.add('motion-enabled');
let seen=true;try{seen=sessionStorage.getItem('moment-intro-seen')==='1';sessionStorage.setItem('moment-intro-seen','1')}catch{}
if(!seen&&!location.hash){const cut=document.createElement('div');cut.className='moment-cutin';cut.setAttribute('aria-hidden','true');document.body.append(cut);setTimeout(()=>cut.remove(),1100)}
reduced.addEventListener('change',e=>{if(!e.matches)return;observer.disconnect();document.documentElement.classList.remove('motion-enabled');for(const el of targets)el.classList.remove('is-pending');document.querySelector('.moment-cutin')?.remove()});
const groups=[...document.querySelectorAll('#about .section-head,#about .intro-grid,#about .about-promises,#approach .section-head,#approach .approach-grid')];
const focusObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('focus-in')}else if(entry.boundingClientRect.bottom<0||entry.boundingClientRect.top>innerHeight){entry.target.classList.remove('focus-in')}}},{threshold:.08});
for(const group of groups){group.classList.add('focus-group');const pieces=group.matches('.intro-grid')?group.querySelectorAll('.body-copy>p,.body-copy>.text-link'):group.matches('.approach-grid,.about-promises')?group.children:group.querySelectorAll('.eyebrow');Array.from(pieces).forEach((el,i)=>{el.classList.add('focus-piece');el.style.setProperty('--piece-delay',Math.min(i*130,390)+'ms')});focusObserver.observe(group)}
document.documentElement.classList.add('focus-motion-managed');
reduced.addEventListener('change',e=>{if(e.matches){focusObserver.disconnect();document.documentElement.classList.remove('focus-motion-managed')}});

})();