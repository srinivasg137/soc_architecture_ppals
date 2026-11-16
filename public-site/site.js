const menu=document.querySelector('.menutoggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#nav').classList.toggle('open',open)});
document.querySelectorAll('.copylink').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);button.textContent='Link copied';setTimeout(()=>button.textContent='Copy link',2500)}catch{button.textContent='Copy from address bar'}}));

// Desktop hover plus native click, touch and keyboard disclosure controls.
document.querySelectorAll('.nav-dropdown').forEach(dropdown=>{
 dropdown.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse' && matchMedia('(min-width:761px)').matches) dropdown.open=true});
 dropdown.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse' && !dropdown.contains(document.activeElement)) dropdown.open=false});
 dropdown.addEventListener('focusout',()=>{setTimeout(()=>{if(!dropdown.contains(document.activeElement)) dropdown.open=false},0)});
 dropdown.addEventListener('keydown',event=>{if(event.key==='Escape'){dropdown.open=false;dropdown.querySelector('summary').focus();event.preventDefault()}});
});
document.addEventListener('click',event=>{document.querySelectorAll('.nav-dropdown[open]').forEach(dropdown=>{if(!dropdown.contains(event.target)) dropdown.open=false})});
