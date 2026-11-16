const menu=document.querySelector('.menutoggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#nav').classList.toggle('open',open)});
document.querySelectorAll('.copylink').forEach(button=>button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);button.textContent='Link copied';setTimeout(()=>button.textContent='Copy link',2500)}catch{button.textContent='Copy from address bar'}}));

const articleGroups=[...document.querySelectorAll('.nav-group')];
function setArticleMenu(group,open){
  group.querySelector('.nav-disclosure').setAttribute('aria-expanded',String(open));
  group.querySelector('.nav-dropdown').hidden=!open;
}
function closeArticleMenus(except){articleGroups.forEach(group=>{if(group!==except)setArticleMenu(group,false)});}
articleGroups.forEach(group=>{
  const button=group.querySelector('.nav-disclosure');
  const open=()=>{closeArticleMenus(group);setArticleMenu(group,true);};
  group.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'&&matchMedia('(min-width:761px)').matches)open();});
  group.addEventListener('pointerleave',()=>{if(!group.contains(document.activeElement))setArticleMenu(group,false);});
  group.querySelector('a').addEventListener('focus',()=>{if(matchMedia('(min-width:761px)').matches)open();});
  button.addEventListener('click',()=>{const expanded=button.getAttribute('aria-expanded')==='true';closeArticleMenus();setArticleMenu(group,!expanded);});
  group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))setArticleMenu(group,false);});
  group.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setArticleMenu(group,false);button.focus();}
    if(event.key==='ArrowDown'&&(event.target===button||event.target===group.querySelector('a'))){event.preventDefault();open();group.querySelector('.nav-dropdown a').focus();}
  });
});
document.addEventListener('click',event=>{if(!event.target.closest('.nav-group'))closeArticleMenus();});
menu?.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='false')closeArticleMenus();});
