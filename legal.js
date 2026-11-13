/* Shared behaviour for Veducore legal pages */
(function(){
  var doc = document.querySelector('.doc');
  var list = document.getElementById('tocList');
  var toc = document.querySelector('.toc');
  var sections = [].slice.call(doc.querySelectorAll('section[id]'));

  // numbered headings + anchor links + TOC
  sections.forEach(function(s,i){
    var h = s.querySelector('h2');
    var title = h.textContent.trim();
    h.insertAdjacentHTML('afterbegin','<span class="n">'+String(i+1).padStart(2,'0')+'</span>');
    h.insertAdjacentHTML('beforeend','<a class="anchor" href="#'+s.id+'" aria-label="Copy link to '+title+'">#</a>');
    var li = document.createElement('li');
    li.innerHTML = '<a href="#'+s.id+'">'+title+'</a>';
    list.appendChild(li);
  });
  var links = [].slice.call(list.querySelectorAll('a'));

  // TOC open on desktop, collapsed on mobile
  function syncToc(){ if(innerWidth>960) toc.setAttribute('open',''); }
  syncToc(); if(innerWidth<=960) toc.removeAttribute('open');
  addEventListener('resize',syncToc);
  list.addEventListener('click',function(e){ if(e.target.tagName==='A' && innerWidth<=960) toc.removeAttribute('open'); });

  // copy anchor link
  var toast = document.createElement('div'); toast.className='toast'; document.body.appendChild(toast);
  function say(t){ toast.textContent=t; toast.classList.add('show'); clearTimeout(say.t); say.t=setTimeout(function(){toast.classList.remove('show')},1800); }
  doc.addEventListener('click',function(e){
    var a = e.target.closest('.anchor'); if(!a) return;
    e.preventDefault();
    var url = location.href.split('#')[0]+a.getAttribute('href');
    history.replaceState(null,'',a.getAttribute('href'));
    document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
    if(navigator.clipboard) navigator.clipboard.writeText(url).then(function(){say('Link copied')},function(){});
  });

  // progress, scroll-spy, back to top
  var bar = document.querySelector('.progress'), top = document.querySelector('.top');
  function onScroll(){
    var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max>0 ? scrollY/max*100 : 0)+'%';
    top.classList.toggle('show', scrollY>600);
    var cur = sections[0];
    sections.forEach(function(s){ if(s.getBoundingClientRect().top < 140) cur = s; });
    if(innerHeight + scrollY >= h.scrollHeight - 4) cur = sections[sections.length-1];
    links.forEach(function(l){ l.classList.toggle('on', l.getAttribute('href')==='#'+cur.id); });
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  top.addEventListener('click',function(){ scrollTo({top:0,behavior:'smooth'}); });

  // timeline steps light up as they scroll in
  var steps = document.querySelectorAll('.tl li');
  if(steps.length && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(x){ if(x.isIntersecting){ x.target.classList.add('in'); io.unobserve(x.target); } });
    },{rootMargin:'0px 0px -30% 0px'});
    steps.forEach(function(s){ io.observe(s); });
  }
})();
