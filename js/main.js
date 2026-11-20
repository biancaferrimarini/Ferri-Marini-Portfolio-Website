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
async function readJSON(path) { const response = await fetch(path); if (!response.ok) throw new Error(`Cannot load ${path}`); return response.json(); }
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
  if(renders.length===1)$('.gallery-controls',article).hidden=true;
  setupViewer($('.viewer-wrap',article), project.model || {});
  $$('.image-surface img',article).forEach(img => img.addEventListener('error', () => { const holder=img.parentElement; holder.innerHTML=placeholder('IMAGE UNAVAILABLE'); },{once:true}));
  $('.viewer-preview',article).addEventListener('error',event=>{event.target.hidden=true;},{once:true});
  return article;
}
function setupGallery(article, renders) {
  const gallery=$('.gallery',article), track=$('.gallery-track',article), previous=$('.previous',article), next=$('.next',article), playback=$('.gallery-playback',article), caption=$('.gallery-caption',article);
  // Reserved detail slots remain reachable manually, but never enter autoplay.
  const populated=renders.map((render,index)=>safeURL(render.src)?index:-1).filter(index=>index>=0);
  let current=0, destination=0, navigating=false, timer, settleTimer, paused=reducedMotion, visible=false, hovering=false, focused=false;
  const canPlay=populated.length>1;
  playback.hidden=!canPlay;
  function schedule() {
    clearTimeout(timer);
    if(!canPlay||paused||navigating||!visible||hovering||focused||document.hidden||menu.open||gallery.closest('[hidden]'))return;
    timer=setTimeout(()=>{
      const nextIndex=populated[(populated.indexOf(current)+1)%populated.length];
      go(nextIndex);
    },1000);
  }
  function updatePlayback() {
    const label=paused?'Play automatic slideshow':'Pause automatic slideshow';
    playback.setAttribute('aria-label',label);playback.title=label;
    playback.firstElementChild.textContent=paused?'▷':'Ⅱ';
    caption.setAttribute('aria-live',paused?'polite':'off');
    schedule();
  }
  function stop() {paused=true;updatePlayback();}
  function settle() {
    clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>{navigating=false;destination=current;schedule();},150);
  }
  function go(index, behavior=reducedMotion?'instant':'smooth') {
    clearTimeout(timer);
    if(!track.clientWidth)return;
    const target=(index+renders.length)%renders.length;
    destination=target;navigating=true;
    track.scrollTo({left:target*track.clientWidth,behavior});
    settle();
  }
  previous.addEventListener('click',()=>{stop();go(destination-1);});
  next.addEventListener('click',()=>{stop();go(destination+1);});
  playback.addEventListener('click',()=>{paused=!paused;updatePlayback();});
  const manualScroll=()=>{stop();navigating=false;destination=current;clearTimeout(settleTimer);};
  track.addEventListener('pointerdown',manualScroll,{passive:true});
  track.addEventListener('wheel',manualScroll,{passive:true});
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();stop();go(destination+(e.key==='ArrowRight'?1:-1));}});
  track.addEventListener('scroll',()=>{
    if(!track.clientWidth)return;
    const index=Math.max(0,Math.min(renders.length-1,Math.round(track.scrollLeft/track.clientWidth)));
    if(index!==current){current=index;$('.current-slide',article).textContent=String(index+1).padStart(2,'0');caption.textContent=renders[index].caption||renders[index].label||'';}
    if(navigating)settle();else destination=current;
    schedule();
  },{passive:true});
  gallery.addEventListener('mouseenter',()=>{hovering=true;schedule();});
  gallery.addEventListener('mouseleave',()=>{hovering=false;schedule();});
  gallery.addEventListener('focusin',()=>{focused=true;schedule();});
  gallery.addEventListener('focusout',()=>{focused=false;schedule();});
  document.addEventListener('visibilitychange',schedule);
  document.addEventListener('portfolio:collectionchange',schedule);
  menu.addEventListener('close',schedule);
  menuButton.addEventListener('click',schedule);
  if('IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(gallery);}else{visible=true;}
  new ResizeObserver(()=>go(current,'instant')).observe(track);
  updatePlayback();
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
      await loadViewerLibrary();
      if(viewer)viewer.remove();
      viewer=document.createElement('model-viewer');
      viewer.setAttribute('alt',config.alt||'Interactive 3D garment');
      viewer.setAttribute('camera-controls','');viewer.setAttribute('touch-action','pan-y');viewer.setAttribute('camera-orbit',orbit);
      viewer.setAttribute('shadow-intensity','0.5');viewer.setAttribute('exposure','1.35');viewer.setAttribute('interaction-prompt','none');
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
