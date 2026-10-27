const menu=document.querySelector('.menutoggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#nav').classList.toggle('open',open)});
document.querySelectorAll('.copylink').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);button.textContent='Link copied';setTimeout(()=>button.textContent='Copy link',2500)}catch{button.textContent='Copy from address bar'}}));
