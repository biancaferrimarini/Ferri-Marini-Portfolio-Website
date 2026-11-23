'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL = value => {
  if (!value) return '';
  if (value.startsWith('/assets/')) value=value.slice(1);
  try { const u = new URL(value, document.baseURI); return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? value : ''; } catch { return ''; }
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const viewerPreview = 'https://res.cloudinary.com/uwtywrfc/image/upload/v1791046611/CROPPED_SHIRT_WOMAN_MOIRAI_id525b.png';
const constructionFields = ['Fit', 'Collar / neckline', 'Pockets', 'Seams & topstitching', 'Fabric', 'Volume'];
function imageURL(value, size=1920) {
  const src=safeURL(value);
  if(!src)return '';
  const url=new URL(src,document.baseURI);
  if(url.hostname==='res.cloudinary.com'&&url.pathname.includes('/image/upload/v')){
    url.pathname=url.pathname.replace('/image/upload/',`/image/upload/f_auto,q_auto,c_limit,w_${size},h_${size}/`);
    return url.href;
  }
  return src;
}
const menu = $('#site-menu');
const menuButton = $('.menu-toggle');
menuButton.addEventListener('click', () => { menu.showModal(); menuButton.setAttribute('aria-expanded', 'true'); });
const closeMenu = () => menu.close();
$('.menu-close').addEventListener('click', closeMenu);
$$('nav a', menu).forEach(a => a.addEventListener('click', closeMenu));
menu.addEventListener('close', () => { menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus({preventScroll:true}); });
const onScroll = () => document.body.classList.toggle('is-scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
$$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
async function readJSON(path) {
  const staging=window.PORTFOLIO_STAGING_BASE;
  const remote=staging&&path==='data/portfolio.json';
  const response=await fetch(remote?`${staging}${path}?preview=${Date.now()}`:path,remote?{cache:'no-store'}:{});
  if(!response.ok)throw new Error(`Cannot load ${path}`);
  const data=await response.json();
  if(remote){
    // Staging uploads live on the isolated Git branch, not on the public site.
    const rewrite=value=>{
      if(Array.isArray(value))return value.map(rewrite);
      if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,rewrite(v)]));
      return typeof value==='string'&&/^\/?assets\//.test(value)?staging+value.replace(/^\//,''):value;
    };
    return rewrite(data);
  }
  return data;
}
function placeholder(label, number = '') {
  return `<div class="placeholder"><span class="placeholder-mark" aria-hidden="true">${escapeHTML(number)}</span><span class="placeholder-label">${escapeHTML(label)}</span><span class="placeholder-sub">IMAGE TO COME</span></div>`;
}
function media(item, label, number) {
  const src = imageURL(item?.src);
  return `<div class="image-surface">${src ? `<img src="${escapeHTML(src)}" alt="${escapeHTML(item.alt || label)}" loading="lazy" decoding="async">` : placeholder(label,number)}</div>`;
}
function renderProject(project, i, collectionId='design-remakes') {
  const n = String(i + 1).padStart(2,'0');
  const titleId=`title-${collectionId}-${n}`, constructionId=`construction-${collectionId}-${n}`;
  const renders = [...(project.renders || [])];
  if (!renders.length) renders.push({label:'RENDER 01',caption:'Render to come'});
  const software = (project.software || []).map(escapeHTML).join('<br>') || '—';
  const techniques = (project.techniques || []).map(escapeHTML).join('<br>') || '—';
  const modelMessage = project.model?.message || (project.model?.demo ? 'DEMO / T-SHIRT' : project.model?.src ? 'Explore the garment in three dimensions.' : '3D VIEW COMING SOON');
  const construction = project.construction || constructionFields.map(label => ({label, text:'To come'}));
  const preview = imageURL(project.model?.preview || viewerPreview,480);
  const article = document.createElement('article');
  article.className = `project ${project.layout === 'offset' ? 'offset' : 'wide'}`;
  article.id = project.anchor || project.id || `${collectionId}-project-${n}`;
  article.setAttribute('aria-labelledby', titleId);
  article.innerHTML = `<header class="project-heading reveal"><span class="project-number">${n}</span><div><h3 id="${titleId}">${escapeHTML(project.title)}</h3>${project.concept ? `<p class="project-concept">${escapeHTML(project.concept)}</p>` : ''}<p class="eyebrow">${escapeHTML(project.category)}</p></div><span class="project-year">${escapeHTML(project.year)}</span></header>
  <div class="gallery reveal" role="region" aria-roledescription="carousel" aria-label="${escapeHTML(project.title)} render gallery"><div class="gallery-track" tabindex="0" aria-label="Render slides. Use left and right arrow keys.">${renders.map((r,index) => `<figure class="gallery-slide" role="group" aria-roledescription="slide" aria-label="${index+1} of ${renders.length}">${media(r,r.label || `RENDER ${index+1}`,n)}</figure>`).join('')}</div><div class="gallery-toolbar"><span class="gallery-caption">${escapeHTML(renders[0].caption || renders[0].label)}</span><span class="gallery-count"><span class="current-slide">01</span> / ${String(renders.length).padStart(2,'0')}</span><button class="gallery-playback" aria-label="Pause automatic slideshow" title="Pause automatic slideshow"><span aria-hidden="true">Ⅱ</span></button><div class="gallery-controls"><button class="previous" aria-label="Previous render" title="Previous render"><span aria-hidden="true">←</span></button><button class="next" aria-label="Next render" title="Next render"><span aria-hidden="true">→</span></button></div></div></div>
  <div class="project-information reveal"><p class="project-description">${escapeHTML(project.description)}</p><dl class="metadata"><dt>SOFTWARE</dt><dd>${software}</dd></dl><dl class="metadata"><dt>TECHNIQUES</dt><dd>${techniques}</dd></dl></div>
  <section class="construction-notes reveal" aria-labelledby="${constructionId}"><h4 id="${constructionId}">CONSTRUCTION NOTES</h4><dl>${construction.map(note=>`<div><dt>${escapeHTML(note.label)}</dt><dd>${escapeHTML(note.text)}</dd></div>`).join('')}</dl></section>
  <div class="project-pair"><figure class="reference reveal"><div class="media-label"><span>PHYSICAL REFERENCE</span><span>${n} / A</span></div>${media(project.reference,'REFERENCE IMAGE','')}<figcaption>${escapeHTML(project.reference?.caption || 'Physical reference')}${project.reference?.credit ? `<br>${escapeHTML(project.reference.credit)}` : ''}</figcaption></figure>
  <div class="viewer-wrap reveal"><div class="media-label"><span>DIGITAL FORM</span><span>${n} / B</span></div><div class="viewer-stage"><div class="viewer-empty"><img class="viewer-preview" src="${escapeHTML(preview)}" alt="" loading="lazy" decoding="async"><button class="load-model">LOAD 3D VIEWER</button><p class="viewer-message" role="status">${escapeHTML(modelMessage)}</p><div class="viewer-progress" hidden><span></span></div></div><button class="viewer-exit">Close fullscreen</button></div><div class="viewer-toolbar"><p class="viewer-instructions"><span class="mouse-instructions"><b>Rotate</b> Left-click + drag<br><b>Pan</b> Right-click + drag<br><b>Zoom</b> Mouse wheel</span><span class="touch-instructions"><b>Rotate</b> Drag with one finger<br><b>Pan</b> Drag with two fingers<br><b>Zoom</b> Pinch with two fingers</span></p><div class="viewer-actions"><button class="reset-view" disabled>Reset view</button><button class="fullscreen-view" disabled>Fullscreen</button></div></div></div></div>`;
  setupGallery(article, renders);

  setupViewer($('.viewer-wrap',article), project.model || {});
  $$('.image-surface img',article).forEach(img => img.addEventListener('error', () => { const holder=img.parentElement; holder.innerHTML=placeholder('IMAGE UNAVAILABLE'); },{once:true}));
  $('.viewer-preview',article).addEventListener('error',event=>{event.target.hidden=true;},{once:true});
  return article;
}
// Keep photographic numbering independent of desktop page grouping.
function galleryPages(renders, mobile) {
  const pages=[];
  for(let i=0;i<renders.length;i++){
    const page=[i];
    if(!mobile&&renders[i].desktopPair!==undefined&&renders[i+1]?.desktopPair===renders[i].desktopPair)page.push(++i);
    pages.push(page);
  }
  return pages;
}
function setupGallery(article, renders) {
  const gallery=$('.gallery',article),track=$('.gallery-track',article),previous=$('.previous',article),next=$('.next',article),playback=$('.gallery-playback',article),caption=$('.gallery-caption',article);
  const small=matchMedia('(max-width:600px)');
  let pages=[],current=0,destination=0,navigating=false,timer,settleTimer,paused=reducedMotion,visible=false,hovering=false,focused=false;
  let populated=[];
  function schedule(){
    clearTimeout(timer);
    if(populated.length<2||paused||navigating||!visible||hovering||focused||document.hidden||menu.open||document.querySelector('.image-dialog[open]')||gallery.closest('[hidden]'))return;
    timer=setTimeout(()=>go(populated[(populated.indexOf(current)+1)%populated.length]),1000);
  }
  function update(){
    const indices=pages[current]||[0];
    $('.current-slide',article).textContent=indices.map(i=>String(i+1).padStart(2,'0')).join('–');
    caption.textContent=indices.map(i=>renders[i].caption||renders[i].label||'').filter(Boolean).join(' / ');
    playback.hidden=populated.length<2;
    $('.gallery-controls',article).hidden=pages.length<2;
    const label=paused?'Play automatic slideshow':'Pause automatic slideshow';
    playback.setAttribute('aria-label',label);playback.title=label;playback.firstElementChild.textContent=paused?'▷':'Ⅱ';
    caption.setAttribute('aria-live',paused?'polite':'off');schedule();
  }
  function stop(){paused=true;update();}
  function settle(){clearTimeout(settleTimer);settleTimer=setTimeout(()=>{navigating=false;destination=current;schedule();},150);}
  function go(index,behavior=reducedMotion?'instant':'smooth'){
    clearTimeout(timer);if(!track.clientWidth||!pages.length)return;
    destination=(index+pages.length)%pages.length;navigating=true;
    track.scrollTo({left:destination*track.clientWidth,behavior});settle();
  }
  function build(){
    const selected=pages[current]?.[0]||0;
    pages=galleryPages(renders,small.matches);
    current=Math.max(0,pages.findIndex(p=>p.includes(selected)));destination=current;
    track.innerHTML=pages.map(indices=>`<figure class="gallery-slide" role="group" aria-roledescription="slide" aria-label="${indices.map(i=>i+1).join(' and ')} of ${renders.length}"><div class="gallery-frame ${indices.length===2?'gallery-frame-pair':''}">${indices.map(i=>{
      const r=renders[i],src=imageURL(r.src),label=r.alt||r.caption||`Render ${i+1}`;
      return src?`<button class="gallery-photo" data-photo="${i}" aria-label="Open full image: ${escapeHTML(label)}"><img src="${escapeHTML(src)}" alt="${escapeHTML(label)}" loading="lazy" decoding="async"></button>`:`<div class="gallery-photo">${placeholder(r.label||`RENDER ${i+1}`)}</div>`;
    }).join('')}</div></figure>`).join('');
    populated=pages.map((p,i)=>p.some(n=>safeURL(renders[n].src))?i:-1).filter(i=>i>=0);
    track.scrollTo({left:current*track.clientWidth,behavior:'instant'});navigating=false;update();
    $$('img',track).forEach(img=>img.addEventListener('error',()=>{const b=img.parentElement;b.disabled=true;b.innerHTML=placeholder('IMAGE UNAVAILABLE');},{once:true}));
  }
  track.addEventListener('click',event=>{const button=event.target.closest('[data-photo]');if(!button)return;stop();openImage(renders[Number(button.dataset.photo)],button);});
  previous.addEventListener('click',()=>{stop();go(destination-1);});next.addEventListener('click',()=>{stop();go(destination+1);});
  playback.addEventListener('click',()=>{paused=!paused;update();});
  track.addEventListener('pointerdown',stop,{passive:true});track.addEventListener('wheel',stop,{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stop();go(destination+(e.key==='ArrowRight'?1:-1));}});
  track.addEventListener('scroll',()=>{
    if(!track.clientWidth)return;
    current=Math.max(0,Math.min(pages.length-1,Math.round(track.scrollLeft/track.clientWidth)));
    if(navigating)settle();else destination=current;update();
  },{passive:true});
  gallery.addEventListener('mouseenter',()=>{hovering=true;schedule();});gallery.addEventListener('mouseleave',()=>{hovering=false;schedule();});
  gallery.addEventListener('focusin',()=>{focused=true;schedule();});gallery.addEventListener('focusout',()=>{focused=false;schedule();});
  ['visibilitychange','portfolio:collectionchange','portfolio:lightbox'].forEach(e=>document.addEventListener(e,schedule));
  menu.addEventListener('close',schedule);menuButton.addEventListener('click',schedule);
  if('IntersectionObserver'in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;schedule();},{threshold:.25}).observe(gallery);else visible=true;
  new ResizeObserver(()=>{track.scrollTo({left:current*track.clientWidth,behavior:'instant'});}).observe(track);
  small.addEventListener('change',build);build();
}
let imageDialog;
function openImage(item,opener){
  const src=safeURL(item.src);if(!src)return;
  if(!imageDialog)imageDialog=createImageDialog();
  imageDialog.openPhoto(src,item.alt||'Original garment render',item.caption||'',opener);
}
function createImageDialog(){
  const dialog=document.createElement('dialog');dialog.className='image-dialog';dialog.setAttribute('aria-label','Full image viewer');
  const glass=sign=>`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6M6.5 10h7${sign==='+'?'M10 6.5v7':''}"/></svg>`;
  dialog.innerHTML=`<button class="image-close" aria-label="Close image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button><div class="image-viewport"><img draggable="false" alt=""><span class="image-status" role="status">Loading image…</span></div><div class="image-dialog-footer"><p class="image-caption"></p><p class="image-help"><span class="image-desktop-help">Zoom + / − · Left-click and drag to pan</span><span class="image-touch-help">Pinch to zoom · Drag to move</span></p><div class="image-zoom-controls"><button class="image-zoom-out" aria-label="Zoom out">${glass('−')}</button><output class="image-zoom-value" aria-live="polite">100%</output><button class="image-zoom-in" aria-label="Zoom in">${glass('+')}</button></div></div>`;
  document.body.append(dialog);
  const viewport=$('.image-viewport',dialog),img=$('img',dialog),status=$('.image-status',dialog),zoomOut=$('.image-zoom-out',dialog),zoomIn=$('.image-zoom-in',dialog);
  let scale=1,x=0,y=0,returnFocus,gesture;const pointers=new Map();
  function paint(){
    x=Math.max(-img.clientWidth*(scale-1)/2,Math.min(img.clientWidth*(scale-1)/2,x));
    y=Math.max(-img.clientHeight*(scale-1)/2,Math.min(img.clientHeight*(scale-1)/2,y));
    img.style.transform=`translate(${x}px,${y}px) scale(${scale})`;
    $('.image-zoom-value',dialog).textContent=`${Math.round(scale*100)}%`;
    zoomOut.disabled=scale<=1;zoomIn.disabled=scale>=5;viewport.classList.toggle('is-zoomed',scale>1);
  }
  function zoom(value){scale=Math.max(1,Math.min(5,value));paint();}
  zoomOut.addEventListener('click',()=>zoom(scale/1.4));zoomIn.addEventListener('click',()=>zoom(scale*1.4));
  $('.image-close',dialog).addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{pointers.clear();gesture=null;returnFocus?.focus({preventScroll:true});document.dispatchEvent(new Event('portfolio:lightbox'));});
  dialog.addEventListener('keydown',e=>{if(e.key==='+'||e.key==='='){e.preventDefault();zoom(scale*1.4);}if(e.key==='-'){e.preventDefault();zoom(scale/1.4);}if(e.key==='0'){e.preventDefault();zoom(1);}});
  function rebase(){
    const p=[...pointers.values()];const rect=viewport.getBoundingClientRect();
    const mid=p.length>1?{x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2}:p[0];
    gesture=mid?{scale,x,y,mid,distance:p.length>1?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0,cx:rect.x+rect.width/2,cy:rect.y+rect.height/2}:null;
  }
  viewport.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});rebase();});
  viewport.addEventListener('pointermove',e=>{
    if(!pointers.has(e.pointerId)||!gesture)return;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const p=[...pointers.values()];
    if(p.length>1&&gesture.distance){
      const mid={x:(p[0].x+p[1].x)/2,y:(p[0].y+p[1].y)/2};
      scale=Math.max(1,Math.min(5,gesture.scale*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/gesture.distance));
      x=mid.x-gesture.cx-(gesture.mid.x-gesture.cx-gesture.x)*scale/gesture.scale;
      y=mid.y-gesture.cy-(gesture.mid.y-gesture.cy-gesture.y)*scale/gesture.scale;
    }else{x=gesture.x+e.clientX-gesture.mid.x;y=gesture.y+e.clientY-gesture.mid.y;}
    paint();
  });
  for(const type of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(type,e=>{pointers.delete(e.pointerId);rebase();});
  viewport.addEventListener('wheel',e=>{e.preventDefault();zoom(scale*Math.exp(-e.deltaY*.002));},{passive:false});
  new ResizeObserver(()=>{if(dialog.open)paint();}).observe(viewport);
  img.addEventListener('load',()=>{status.hidden=true;paint();});
  img.addEventListener('error',()=>{status.hidden=false;status.textContent='The original image could not be loaded.';});
  dialog.openPhoto=(src,alt,caption,opener)=>{
    returnFocus=opener;scale=1;x=0;y=0;pointers.clear();gesture=null;
    status.hidden=false;status.textContent='Loading image…';img.alt=alt;img.src=src;$('.image-caption',dialog).textContent=caption;
    dialog.showModal();paint();$('.image-close',dialog).focus();document.dispatchEvent(new Event('portfolio:lightbox'));
  };
  return dialog;
}

let viewerLibrary;
function loadViewerLibrary() {
  if (!viewerLibrary) {
    // The module preloads decoders during import; configure local paths first.
    const base=new URL('js/main.js',document.baseURI);
    const config=window.ModelViewerElement||{};
    config.dracoDecoderLocation=new URL('../assets/vendor/draco/',base).href;
    config.ktx2TranscoderLocation=new URL('../assets/vendor/basis/',base).href;
    window.ModelViewerElement=config;
    viewerLibrary=import('../assets/vendor/model-viewer.min.js').then(()=>customElements.whenDefined('model-viewer')).catch(error=>{viewerLibrary=null;throw error;});
  }
  return viewerLibrary;
}
function setupViewer(wrap, config) {
  const stage=$('.viewer-stage',wrap), empty=$('.viewer-empty',wrap), load=$('.load-model',wrap), message=$('.viewer-message',wrap), reset=$('.reset-view',wrap), fullscreen=$('.fullscreen-view',wrap), progress=$('.viewer-progress',wrap);
  let viewer;
  const orbit=config.cameraOrbit||'0deg 75deg 105%';
  const showError=text=>{ stage.classList.remove('is-loading','is-ready');stage.setAttribute('aria-busy','false');progress.hidden=true;if(viewer){viewer.remove();viewer=null;}empty.hidden=false;load.hidden=false;load.disabled=false;load.textContent='TRY AGAIN';message.textContent=text;reset.disabled=fullscreen.disabled=true;};
  async function mount(src) {
    load.disabled=true;load.hidden=true;message.textContent='Loading Digital Garment';progress.hidden=false;
    progress.firstElementChild.style.transform='scaleX(0)';stage.classList.add('is-loading');stage.setAttribute('aria-busy','true');
    try {
      // Fail gracefully on browsers without the WebGL 2 renderer required by model-viewer.
      const probe=document.createElement('canvas');
      const gl=probe.getContext('webgl2');
      if(!gl){showError('3D needs WebGL 2. Try a recent browser with hardware acceleration enabled.');return;}
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      await loadViewerLibrary();
      if(viewer)viewer.remove();
      viewer=document.createElement('model-viewer');
      viewer.setAttribute('alt',config.alt||'Interactive 3D garment');
      viewer.setAttribute('camera-controls','');viewer.setAttribute('touch-action','pan-y');viewer.setAttribute('camera-orbit',orbit);
      // Shared studio environment: soft dome, side key/fill and rear separation.
      // Local HDR is requested only after the visitor opens a 3D view.
      viewer.setAttribute('environment-image',new URL('assets/environments/ferri-marini-studio.hdr',document.baseURI).href);
      viewer.setAttribute('tone-mapping','neutral');
      viewer.setAttribute('shadow-intensity','0.65');viewer.setAttribute('shadow-softness','0.9');
      viewer.setAttribute('exposure','1.25');viewer.setAttribute('interaction-prompt','none');
      viewer.setAttribute('loading','eager');viewer.setAttribute('reveal','auto');
      if(safeURL(config.poster))viewer.setAttribute('poster',config.poster);
      const active=viewer;
      viewer.addEventListener('progress',event=>{if(viewer===active)progress.firstElementChild.style.transform=`scaleX(${event.detail.totalProgress})`;});
      viewer.addEventListener('load',()=>{if(viewer!==active)return;empty.hidden=true;stage.classList.remove('is-loading');stage.classList.add('is-ready');stage.setAttribute('aria-busy','false');reset.disabled=fullscreen.disabled=false;if(!wrap.closest('[hidden]'))reset.focus({preventScroll:true});},{once:true});
      viewer.addEventListener('error',()=>{if(viewer===active)showError('The 3D view could not be loaded. Please try again.');},{once:true});
      viewer.setAttribute('src',src);stage.append(viewer);
    } catch { showError('The 3D viewer could not start. Please reload and try again.'); }
  }
  load.addEventListener('click',()=>{const src=safeURL(config.src);if(src)mount(src);else {message.textContent='The 3D view will be available soon.';}});
  reset.addEventListener('click',()=>{if(!viewer)return;viewer.cameraOrbit=orbit;viewer.cameraTarget='auto auto auto';viewer.fieldOfView='auto';viewer.jumpCameraToGoal();});
  const closeExpanded=()=>{stage.classList.remove('expanded');document.body.style.overflow='';fullscreen.focus({preventScroll:true});};
  const exit=async()=>{if(document.fullscreenElement===stage)await document.exitFullscreen();else closeExpanded();};
  $('.viewer-exit',wrap).addEventListener('click',exit);
  fullscreen.addEventListener('click',async()=>{if(stage.requestFullscreen){try{await stage.requestFullscreen();return;}catch{}}
    stage.classList.add('expanded');document.body.style.overflow='hidden';$('.viewer-exit',wrap).focus();
  });
  stage.addEventListener('keydown',e=>{if(e.key==='Escape'&&stage.classList.contains('expanded'))closeExpanded();
    if(e.key==='Tab'&&stage.classList.contains('expanded')){const items=$$('button,model-viewer',stage);const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
}
function revealContent(parent=document) {
  if(reducedMotion||!('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target);}}),{threshold:.05});
  $$('.reveal',parent).forEach(el=>{el.classList.add('pending');observer.observe(el);});
}
async function setupCollections() {
  const switcher=$('.collection-switch');
  let collections;
  try {
    const data=await readJSON('data/portfolio.json');
    if(!Array.isArray(data.collections))throw new Error('Invalid portfolio');
    collections=data.collections;
  } catch {
    switcher.hidden=true;
    $('#projects').innerHTML='<p class="loading-copy" role="status">The portfolio could not be loaded. Please refresh the page.</p>';
    return;
  }
  if(!collections.length){switcher.hidden=true;$('#projects').innerHTML='<p class="loading-copy">New work coming soon.</p>';return;}
  switcher.style.setProperty('--collection-count',String(collections.length));
  switcher.replaceChildren(...collections.map((collection,index)=>{
    const tab=document.createElement('button');
    tab.type='button';tab.id=`collection-${collection.id}`;tab.setAttribute('role','tab');
    tab.setAttribute('aria-controls',`projects-${collection.id}`);tab.setAttribute('aria-selected',String(index===0));
    tab.tabIndex=index===0?0:-1;tab.textContent=collection.title.toUpperCase();
    return tab;
  }));
  $('#projects').replaceChildren(...collections.map((collection,index)=>{
    const panel=document.createElement('div');panel.id=`projects-${collection.id}`;panel.className='collection-panel';
    panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',`collection-${collection.id}`);panel.tabIndex=0;panel.hidden=index!==0;
    panel.replaceChildren(...collection.projects.map((project,i)=>renderProject(project,i,collection.id)));
    if(!collection.projects.length)panel.innerHTML='<p class="loading-copy">New work coming soon.</p>';
    return panel;
  }));
  const tabs=$$('[role="tab"]',switcher);
  const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
  let selected=0;
  function select(index, focus=false) {
    const direction=index>selected?1:-1;
    selected=index;
    switcher.style.setProperty('--collection-index',String(index));
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].style.setProperty('--collection-direction',String(direction));panels[i].hidden=i!==index;});
    document.dispatchEvent(new Event('portfolio:collectionchange'));
    if(focus)tabs[index].focus({preventScroll:true});
    tabs[index].scrollIntoView({block:'nearest',inline:'nearest',behavior:reducedMotion?'instant':'smooth'});
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(index));
    tab.addEventListener('keydown',event=>{
      let target;
      if(event.key==='ArrowRight')target=(selected+1)%tabs.length;
      if(event.key==='ArrowLeft')target=(selected+tabs.length-1)%tabs.length;
      if(event.key==='Home')target=0;
      if(event.key==='End')target=tabs.length-1;
      if(target!==undefined){event.preventDefault();select(target,true);}
    });
  });
  panels.forEach(panel=>revealContent(panel));
}
async function init(){
  const footer=$('.footer');
  if(footer){const link=document.createElement('a');link.href='admin.html';link.className='footer-admin';link.textContent='Gestisci portfolio';footer.append(link);}
  if($('#projects')){
    await setupCollections();
  }
  if(document.body.dataset.page!=='index'){
    try{const site=await readJSON('data/site.json');
      if($('#biography'))$('#biography').innerHTML=site.biography.map(p=>`<p>${escapeHTML(p)}</p>`).join('');
      if($('#about-details'))$('#about-details').innerHTML=site.about.map(row=>`<div class="practice-row"><h3>${escapeHTML(row.title)}</h3>${row.items?`<ul class="practice-list">${row.items.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>`:`<p>${safeURL(row.href)?`<a class="cta" href="${escapeHTML(row.href)}">${escapeHTML(row.text)}</a>`:escapeHTML(row.text)}</p>`}</div>`).join('');
      if($('#contact-list'))$('#contact-list').innerHTML=site.contact.map(item=>`<div class="contact-item"><span class="contact-label">${escapeHTML(item.label)}</span><span class="contact-value">${safeURL(item.href)?`<a href="${escapeHTML(item.href)}" ${/^https?:/.test(item.href)?'target="_blank" rel="noopener noreferrer"':''}>${escapeHTML(item.value)}</a>`:escapeHTML(item.value)}</span></div>`).join('');
    }catch{if($('#contact-list'))$('#contact-list').textContent='Contact details are currently unavailable.';}
  }
}
init();
