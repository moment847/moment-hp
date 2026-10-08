function openMessageAnchor(){const hash=location.hash;if(!hash||hash==='#top')return;const target=document.getElementById(hash.slice(1));const details=target?.closest('details');if(details){details.open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}))}}
openMessageAnchor();window.addEventListener('hashchange',openMessageAnchor);
