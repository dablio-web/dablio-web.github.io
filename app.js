const slides=[
{eyebrow:"01 / HELLO, WORLD",title:"Yo, I'm Dablio.",body:"Web & UI Designer. I turn ideas, brands and Figma files into digital experiences people enjoy using.",cta:"Meet Wander",href:"#next"},
{eyebrow:"02 / BRAZIL → PORTUGAL",title:"Wander Guimarães —\nBrazilian by nature, based in Porto.",body:"I design for the web, obsess over the details, and recharge with football, video games and a new place on the map.",cta:"My Instagram",href:"https://www.instagram.com/dabliowg_/reels/"},
{eyebrow:"03 / THE STORY",title:"6+ years shaping digital ideas.",body:"UI/UX, graphic design, branding and websites — from first wireframe to a responsive experience ready for real people.",cta:"View my CV",href:"./Wander-Guimaraes-CV.pdf"},
{eyebrow:"04 / NOW — BILA WEB",title:"From Figma prototype to working website.",body:"Today I build responsive experiences with WordPress, Webflow, HTML and CSS — translating visual systems into useful interfaces.",cta:"See my work",href:"https://www.behance.net/wandersant"},
{eyebrow:"05 / SCALE",title:"Interfaces made to feel obvious.",body:"At Scale I designed wireframes, prototypes and interaction flows, collaborating with developers to make products clearer and easier to use.",cta:"Connect on LinkedIn",href:"https://pt.linkedin.com/in/wandersantosmkt/en"},
{eyebrow:"06 / LEAF + HIGROW",title:"Good design needs a strong visual voice.",body:"Websites, landing pages, logos, campaigns, social content and visual identities — always grounded in the brand and the people behind it.",cta:"Open Behance",href:"https://www.behance.net/wandersant"},
{eyebrow:"07 / TOOLBOX",title:"Figma. WordPress. Webflow. Adobe. HTML + CSS.",body:"My sweet spot is where visual design, interaction and implementation overlap. That's where pixels start behaving like a product.",cta:"Download CV",href:"./Wander-Guimaraes-CV.pdf"},
{eyebrow:"08 / AFTER HOURS",title:"I also create, play, travel and press record.",body:"Follow Dablio WG on YouTube for the other side of the screen — and yes, there will probably be games, stories and football.",cta:"Watch YouTube",href:"https://www.youtube.com/@dablio_wg"},
{eyebrow:"09 / LET'S MAKE SOMETHING",title:"Have a website, interface or visual idea in mind?",body:"Let's turn it into something clear, useful and difficult to forget. I reply in Portuguese or English.",cta:"Email me",href:"mailto:wandersantos11@icloud.com"}
];

const $=s=>document.querySelector(s),titleEl=$("#typed-title"),bodyEl=$("#typed-body"),eyebrowEl=$("#eyebrow"),ctaEl=$("#card-cta"),currentEl=$("#current"),progressEl=$("#progress-bar"),prevBtn=$("#prev"),nextBtn=$("#next"),deck=$(".deck"),prefersReduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let index=0,typingToken=0,pinchActive=false;
const wait=ms=>new Promise(r=>setTimeout(r,ms));

async function typeText(el,text,speed,token){el.textContent="";if(prefersReduced){el.textContent=text;return}for(let i=0;i<text.length;i++){if(token!==typingToken)return;el.textContent+=text[i];await wait(speed+Math.random()*speed*.55)}}
async function renderSlide(nextIndex,direction=1){
  if(nextIndex<0||nextIndex>=slides.length||(nextIndex===index&&titleEl.textContent))return;
  index=nextIndex;typingToken++;const token=typingToken,slide=slides[index];
  deck.classList.remove("card-changing");void deck.offsetWidth;deck.classList.add("card-changing");deck.style.setProperty("--direction",direction);
  eyebrowEl.textContent=slide.eyebrow;bodyEl.textContent="";titleEl.textContent="";ctaEl.textContent="";ctaEl.style.opacity="0";ctaEl.href=slide.href;ctaEl.target=slide.href.startsWith("http")?"_blank":"_self";ctaEl.rel=slide.href.startsWith("http")?"noreferrer":"";
  currentEl.textContent=String(index+1);progressEl.style.width=`${((index+1)/slides.length)*100}%`;prevBtn.disabled=index===0;nextBtn.disabled=index===slides.length-1;
  await wait(prefersReduced?0:150);await typeText(titleEl,slide.title,24,token);await wait(prefersReduced?0:80);await typeText(bodyEl,slide.body,8,token);if(token!==typingToken)return;ctaEl.innerHTML=`${slide.cta} <span>↗</span>`;ctaEl.style.opacity="1";
}
function step(delta){renderSlide(Math.max(0,Math.min(slides.length-1,index+delta)),delta)}
prevBtn.addEventListener("click",()=>step(-1));nextBtn.addEventListener("click",()=>step(1));ctaEl.addEventListener("click",e=>{if(slides[index].href==="#next"){e.preventDefault();step(1)}});
$(".active-card").addEventListener("click",e=>{if(e.target.closest("a,button")||index>=slides.length-1)return;step(1)});
addEventListener("keydown",e=>{if(e.target.matches("input,textarea,button")||!$("#modal-layer").hidden)return;if(["ArrowDown","ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault();step(1)}if(["ArrowUp","ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();step(-1)}if(e.key==="Home")renderSlide(0,-1);if(e.key==="End")renderSlide(slides.length-1,1)});

const stickers=[...document.querySelectorAll(".sticker")];
stickers.forEach(item=>item.addEventListener("animationend",e=>{if(e.animationName==="sticker-in")item.classList.add("entrance-complete")},{once:true}));
[$(".portrait-wrap"),$(".glasses-wrap")].forEach(item=>item?.addEventListener("animationend",e=>{if(e.animationName.endsWith("-in"))item.classList.add("entrance-complete")},{once:true}));

// These objects used to sit in a fixed UI layer. Keeping them inside the
// collage makes them pan, zoom and drag with the rest of the wall.
const collageScene=$(".collage");
[$(".brand-stamp"),$(".visitor-pill"),$(".guestbook-dock")].forEach(item=>item&&collageScene.append(item));

// Every image on the wall can be picked up and rearranged. Linked stickers
// still open normally when clicked without dragging.
const draggableItems=[...document.querySelectorAll(".sticker,.portrait-wrap,.glasses-wrap,.visitor-pill,.availability,.brand-stamp,.guestbook-dock")];
draggableItems.forEach(item=>{
  if(item.matches("img"))item.draggable=false;
  item.querySelectorAll("img").forEach(img=>img.draggable=false);
  let startX=0,startY=0,originX=0,originY=0,targetX=0,targetY=0,moved=false,dragFrame=0;
  const paintDrag=()=>{dragFrame=0;item.dataset.dragX=String(targetX);item.dataset.dragY=String(targetY);item.style.setProperty("--drag-x",`${targetX}px`);item.style.setProperty("--drag-y",`${targetY}px`)};
  item.addEventListener("pointerdown",e=>{
    if(pinchActive||document.body.classList.contains("drawing")||e.button!==0)return;
    if(item.matches(".guestbook-dock")&&e.target.closest("button"))return;
    startX=e.clientX;startY=e.clientY;originX=Number(item.dataset.dragX||0);originY=Number(item.dataset.dragY||0);targetX=originX;targetY=originY;moved=false;
    if(item.matches(".guestbook-dock"))document.body.classList.add("dragging-guestbook");
    item.classList.add("is-dragging");item.setPointerCapture(e.pointerId);
  });
  item.addEventListener("pointermove",e=>{
    if(pinchActive||!item.classList.contains("is-dragging"))return;
    const point=e.getCoalescedEvents?.().at(-1)||e,dx=(point.clientX-startX)/sceneZoom,dy=(point.clientY-startY)/sceneZoom;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;
    targetX=originX+dx;targetY=originY+dy;if(!dragFrame)dragFrame=requestAnimationFrame(paintDrag);
  });
  const stop=e=>{if(dragFrame){cancelAnimationFrame(dragFrame);paintDrag()}if(item.hasPointerCapture?.(e.pointerId))item.releasePointerCapture(e.pointerId);item.classList.remove("is-dragging");if(item.matches(".guestbook-dock"))document.body.classList.remove("dragging-guestbook");if(moved)item.dataset.suppressClick="true"};
  item.addEventListener("pointerup",stop);item.addEventListener("pointercancel",stop);
  item.addEventListener("click",e=>{if(item.dataset.suppressClick==="true"){e.preventDefault();e.stopImmediatePropagation();item.dataset.suppressClick="false"}},true);
});

// Click reactions and Milo-style link cards. Social stickers open a small
// explanatory card first; the actual navigation stays inside that card.
const popover=$("#social-popover"),popoverTitle=$("#popover-title"),popoverCopy=$("#popover-copy"),popoverLink=$("#popover-link"),popoverClose=$("#popover-close");
const socialMeta={
  "s-linkedin":{title:"LinkedIn",copy:"Experience, skills and the professional side of Wander.",action:"Open LinkedIn"},
  "s-youtube":{title:"Dablio WG on YouTube",copy:"Videos, games, ideas and life on the other side of the screen.",action:"Watch the channel"},
  "s-behance":{title:"Behance",copy:"A selection of web, UI and visual design projects.",action:"View projects"},
  "s-instagram":{title:"Instagram",copy:"Reels, travels and everyday moments beyond design.",action:"Open Instagram"}
};
function replayIconAnimation(item){item.classList.remove("icon-pop");void item.offsetWidth;item.classList.add("icon-pop");setTimeout(()=>item.classList.remove("icon-pop"),640)}
function closePopover(){popover.hidden=true}
function openPopover(anchor){
  const key=Object.keys(socialMeta).find(name=>anchor.classList.contains(name)),meta=socialMeta[key];if(!meta)return;
  popoverTitle.textContent=meta.title;popoverCopy.textContent=meta.copy;popoverLink.href=anchor.href;popoverLink.innerHTML=`${meta.action} <span>↗</span>`;popover.hidden=false;
  const rect=anchor.getBoundingClientRect(),boxWidth=Math.min(300,innerWidth-32);let left=rect.right+16;if(left+boxWidth>innerWidth-16)left=rect.left-boxWidth-16;left=Math.max(16,Math.min(left,innerWidth-boxWidth-16));let top=Math.max(16,Math.min(rect.top-8,innerHeight-220));popover.style.left=`${left}px`;popover.style.top=`${top}px`;
}
stickers.forEach(item=>item.addEventListener("click",e=>{
  if(!item.matches(".linked,.s-plane,.s-football,.s-sun,.s-camera,.s-headphones,.s-polaroid,.s-macbook,.s-dino,.s-controller,.s-dog,.s-brazil"))replayIconAnimation(item);
  if(item.matches("a.linked")){e.preventDefault();e.stopPropagation();openPopover(item)}
}));
popoverClose.addEventListener("click",closePopover);popover.addEventListener("click",e=>e.stopPropagation());document.addEventListener("click",e=>{if(!e.target.closest("a.linked"))closePopover()});addEventListener("keydown",e=>{if(e.key==="Escape")closePopover()});

// Scene zoom — like moving closer to or farther from the wall, without
// allowing cursor movement to push the composition around.
let sceneZoom=1;
const zoomLabel=$("#zoom-label"),zoomOut=$("#zoom-out"),zoomIn=$("#zoom-in");
function syncSceneView(){document.documentElement.style.setProperty("--scene-scale",String(sceneZoom));document.documentElement.style.setProperty("--scene-x",`${sceneX}px`);document.documentElement.style.setProperty("--scene-y",`${sceneY}px`);document.documentElement.style.setProperty("--grid-size",`${Math.max(14,48*sceneZoom)}px`);document.documentElement.style.setProperty("--grid-x",`calc(50% + ${sceneX}px)`);document.documentElement.style.setProperty("--grid-y",`calc(50% + ${sceneY}px)`);const paths=$("#draw-paths");if(paths){const cx=innerWidth/2,cy=innerHeight/2;paths.setAttribute("transform",`translate(${sceneX} ${sceneY}) translate(${cx} ${cy}) scale(${sceneZoom}) translate(${-cx} ${-cy})`)}}
function setSceneZoom(next){sceneZoom=Math.max(.1,Math.min(1.4,next));syncSceneView();zoomLabel.textContent=`${Math.round(sceneZoom*100)}%`;zoomOut.disabled=sceneZoom<=.1001;zoomIn.disabled=sceneZoom>=1.3999}
zoomOut.addEventListener("click",e=>{e.stopPropagation();setSceneZoom(sceneZoom-.1)});
zoomIn.addEventListener("click",e=>{e.stopPropagation();setSceneZoom(sceneZoom+.1)});

// Hold and drag any empty part of the wall to pan the whole composition.
const stage=$(".stage"),scene=collageScene;let sceneX=0,sceneY=0,panActive=false,panMoved=false,panJustMoved=false,panStartX=0,panStartY=0,panOriginX=0,panOriginY=0;
setSceneZoom(innerWidth<=760?.82:1);
const panBlockers="button,a,input,textarea,.sticker,.portrait-wrap,.glasses-wrap,.deck,.controls,.zoom-tools,.guestbook-dock,.guestbook-launch,.visitor-pill,.availability,.brand-stamp,.social-popover,.quick-note,.wall-note,.modal-layer";
document.body.classList.add("can-pan");
stage.addEventListener("pointerdown",e=>{if(e.button!==0||document.body.classList.contains("drawing")||e.target.closest(panBlockers))return;panActive=true;panMoved=false;panStartX=e.clientX;panStartY=e.clientY;panOriginX=sceneX;panOriginY=sceneY;document.body.classList.add("panning");stage.setPointerCapture(e.pointerId)});
stage.addEventListener("pointermove",e=>{if(pinchActive||!panActive)return;const dx=e.clientX-panStartX,dy=e.clientY-panStartY;if(Math.abs(dx)+Math.abs(dy)>5)panMoved=true;sceneX=panOriginX+dx;sceneY=panOriginY+dy;syncSceneView()});
function endPan(e){if(!panActive)return;panActive=false;panJustMoved=panMoved;document.body.classList.remove("panning");if(stage.hasPointerCapture?.(e.pointerId))stage.releasePointerCapture(e.pointerId);setTimeout(()=>panJustMoved=false,0)}
stage.addEventListener("pointerup",endPan);stage.addEventListener("pointercancel",endPan);

// Native two-finger scene zoom on phones and tablets. The point between the
// fingers stays anchored, so pinching also feels natural after the wall moves.
let pinchDistance=0,pinchZoom=1,pinchWorldX=0,pinchWorldY=0;
const touchDistance=touches=>Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
const touchMidpoint=touches=>({x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2});
stage.addEventListener("touchstart",e=>{
  if(e.touches.length!==2||!modalLayer.hidden)return;
  e.preventDefault();pinchActive=true;panActive=false;document.body.classList.remove("panning");
  document.querySelectorAll(".is-dragging").forEach(item=>item.classList.remove("is-dragging"));
  pinchDistance=touchDistance(e.touches);pinchZoom=sceneZoom;
  const mid=touchMidpoint(e.touches),cx=innerWidth/2,cy=innerHeight/2;
  pinchWorldX=cx+(mid.x-cx-sceneX)/sceneZoom;pinchWorldY=cy+(mid.y-cy-sceneY)/sceneZoom;
},{passive:false,capture:true});
stage.addEventListener("touchmove",e=>{
  if(!pinchActive||e.touches.length!==2)return;
  e.preventDefault();const mid=touchMidpoint(e.touches),cx=innerWidth/2,cy=innerHeight/2;
  const nextZoom=Math.max(.1,Math.min(1.4,pinchZoom*(touchDistance(e.touches)/pinchDistance)));
  sceneX=mid.x-cx-nextZoom*(pinchWorldX-cx);sceneY=mid.y-cy-nextZoom*(pinchWorldY-cy);setSceneZoom(nextZoom);
},{passive:false,capture:true});
const endPinch=e=>{if(!pinchActive)return;if(e.touches.length<2){pinchActive=false;panJustMoved=true;setTimeout(()=>panJustMoved=false,120)}};
stage.addEventListener("touchend",endPinch,{passive:true,capture:true});stage.addEventListener("touchcancel",endPinch,{passive:true,capture:true});

// Modal system used by the MacBook, headphones, Polaroid, dinosaur,
// controller and guestbook.
const modalLayer=$("#modal-layer"),allModals=[...document.querySelectorAll(".site-modal")],musicPlayer=$("#music-player"),musicToggle=$("#music-toggle"),audioState=$("#audio-state");let musicPlaying=false;
function openModal(id){closePopover();allModals.forEach(modal=>modal.hidden=modal.id!==id);modalLayer.classList.toggle("photo-open",id==="photo-modal");modalLayer.hidden=false;document.body.classList.add("modal-open");setTimeout(()=>document.querySelector(`#${id} input, #${id} textarea, #${id} button:not(.modal-close)`)?.focus(),80)}
function closeModal(){if(musicPlaying)sendMusicCommand("pauseVideo");modalLayer.hidden=true;modalLayer.classList.remove("photo-open");allModals.forEach(modal=>modal.hidden=true);document.body.classList.remove("modal-open");setMusicState(false);stopGame()}
modalLayer.addEventListener("click",e=>{if(e.target===modalLayer||e.target.closest(".modal-close,.modal-dismiss"))closeModal()});
addEventListener("keydown",e=>{if(e.key==="Escape"&&!modalLayer.hidden)closeModal()});

const contactForm=$("#contact-form");
contactForm.addEventListener("submit",e=>{
  e.preventDefault();
  const from=$("#contact-email").value.trim(),message=$("#contact-message").value.trim();
  const subject=encodeURIComponent(`Portfolio message from ${from}`),body=encodeURIComponent(`From: ${from}\n\n${message}`);
  showToast("OPENING YOUR EMAIL APP ↗");
  location.href=`mailto:wandersantos11@icloud.com?subject=${subject}&body=${body}`;
});

function setMusicState(playing){musicPlaying=playing;musicToggle.classList.toggle("is-playing",playing);musicToggle.setAttribute("aria-label",playing?"Pause Yukon":"Play Yukon");audioState.textContent=playing?"PLAYING · TAP THE RECORD TO PAUSE":"PAUSED · TAP THE RECORD TO PLAY"}
function sendMusicCommand(func){const frame=musicPlayer.querySelector("iframe");frame?.contentWindow?.postMessage(JSON.stringify({event:"command",func,args:[]}),"*")}
function openMusic(){openModal("music-modal");sendMusicCommand("playVideo");setMusicState(true)}
musicToggle.addEventListener("click",()=>{musicPlaying?sendMusicCommand("pauseVideo"):sendMusicCommand("playVideo");setMusicState(!musicPlaying)});

// A page-turning local guestbook inspired by a physical visitor book. Visitor
// pages stay on this device so no personal information is sent elsewhere.
const guestbookKey="dablio-guestbook-v1",guestbookCount=$("#guestbook-count"),bookPage=$("#book-page"),bookDate=$("#book-date"),bookMessage=$("#book-message"),bookAuthor=$("#book-author"),bookPageNo=$("#book-page-no"),bookCounter=$("#book-counter"),guestForm=$("#guestbook-form"),signToggle=$("#book-sign-toggle");
const housePages=[
  {name:"Dablio",date:"OCT 12, 2026",message:"Hey, welcome to my corner of the internet. Move things around, click the strange objects and make yourself at home."},
  {name:"Wander",date:"PORTO, PORTUGAL",message:"Brazilian mind, Porto base. I design interfaces, brands and websites — usually with music playing and too many tabs open."},
  {name:"Dablio",date:"AFTER HOURS",message:"Football, video games, trips and videos keep the ideas moving. If you found a hidden interaction, tell me which one."}
];
let guestEntries=[];try{guestEntries=JSON.parse(localStorage.getItem(guestbookKey)||"[]")}catch{guestEntries=[]}
let bookIndex=0;
function allBookPages(){return [...housePages,...guestEntries.map(entry=>({...entry,date:entry.date||"VISITOR NOTE"}))]}
function renderGuestbook(direction=1){const pages=allBookPages();bookIndex=Math.max(0,Math.min(bookIndex,pages.length-1));const entry=pages[bookIndex];bookPage.classList.remove("page-turning");void bookPage.offsetWidth;bookPage.style.setProperty("--turn-direction",direction);bookPage.classList.add("page-turning");bookDate.textContent=entry.date;bookMessage.textContent=entry.message;bookAuthor.textContent=`— ${entry.name}`;bookPageNo.textContent=String(bookIndex+2);bookCounter.textContent=`${bookIndex+1} / ${pages.length}`;guestbookCount.textContent=pages.length;$("#dock-date").textContent=entry.date;$("#dock-message").textContent=entry.message;$("#dock-author").textContent=`— ${entry.name}`;$("#dock-counter").textContent=`${bookIndex+1} / ${pages.length}`}
function turnGuestbook(){bookIndex=(bookIndex+1)%allBookPages().length;renderGuestbook(1)}
function turnGuestbookWithKeyboard(e){if(e.key!=="Enter"&&e.key!==" ")return;e.preventDefault();turnGuestbook()}
renderGuestbook();
$("#guestbook-launch").addEventListener("click",()=>{openModal("guestbook-modal");renderGuestbook()});
$("#dock-expand").addEventListener("click",()=>{openModal("guestbook-modal");renderGuestbook()});
$("#dock-book").addEventListener("click",turnGuestbook);
$("#dock-book").addEventListener("keydown",turnGuestbookWithKeyboard);
$("#guestbook-book").addEventListener("click",turnGuestbook);
$("#guestbook-book").addEventListener("keydown",turnGuestbookWithKeyboard);
signToggle.setAttribute("aria-expanded","false");
signToggle.addEventListener("click",()=>{const opening=guestForm.hidden;guestForm.hidden=!opening;signToggle.setAttribute("aria-expanded",String(opening));signToggle.innerHTML=opening?'CLOSE FORM <span>×</span>':'SIGN THE BOOK <span>✎</span>';if(opening)$("#guest-name").focus()});
guestForm.addEventListener("submit",e=>{e.preventDefault();const name=$("#guest-name").value.trim(),message=$("#guest-message").value.trim();if(!name||!message)return;const date=new Intl.DateTimeFormat("en",{month:"short",day:"numeric",year:"numeric"}).format(new Date()).toUpperCase();guestEntries.push({name,message,date});guestEntries=guestEntries.slice(-12);localStorage.setItem(guestbookKey,JSON.stringify(guestEntries));bookIndex=allBookPages().length-1;renderGuestbook(1);e.target.reset();guestForm.hidden=true;signToggle.setAttribute("aria-expanded","false");signToggle.innerHTML='SIGN THE BOOK <span>✎</span>';showToast("A NEW PAGE WAS ADDED ✦")});

// Individual object reactions.
const plane=$(".s-plane"),football=$(".s-football"),sun=$(".s-sun"),gym=$(".s-camera");let reps=0,repResetTimer=null;
const galleryPhotos=[
  {src:"./assets/gallery-desert.jpg",alt:"Wander riding a camel in the desert"},
  {src:"./assets/gallery-spain.jpg",alt:"Wander with friends at the Spain border sign"},
  {src:"./assets/gallery-style.jpg",alt:"Wander on a white terrace in Portugal"}
];
galleryPhotos.forEach(photo=>{const preload=new Image();preload.src=photo.src});
let galleryIndex=0;
function renderGalleryPhoto(){const photo=galleryPhotos[galleryIndex],image=$("#gallery-image"),card=$("#polaroid-gallery");card.classList.remove("changing");void card.offsetWidth;image.src=photo.src;image.alt=photo.alt;card.classList.add("changing")}
function resetRepsAfterRest(){clearTimeout(repResetTimer);repResetTimer=setTimeout(()=>{reps=0;$("#rep-counter").textContent="0 REPS"},30*60*1000)}
plane.addEventListener("click",()=>{plane.classList.remove("flying");void plane.offsetWidth;plane.classList.add("flying");setTimeout(()=>plane.classList.remove("flying"),1520)});
$(".s-headphones").addEventListener("click",openMusic);
$(".s-polaroid").addEventListener("click",()=>{galleryIndex=0;renderGalleryPhoto();openModal("photo-modal")});
$("#polaroid-gallery").addEventListener("click",()=>{galleryIndex=(galleryIndex+1)%galleryPhotos.length;renderGalleryPhoto()});
$(".s-macbook").addEventListener("click",()=>openModal("contact-modal"));
$(".s-dino").addEventListener("click",()=>openModal("error-modal"));
$(".s-controller").addEventListener("click",()=>openModal("game-modal"));
sun.addEventListener("click",()=>sun.classList.toggle("spinning"));
gym.addEventListener("click",()=>{reps++;resetRepsAfterRest();$("#rep-counter").textContent=`${reps} ${reps===1?"REP":"REPS"}`;showToast(`REP ${reps}  💪`)});
football.addEventListener("click",()=>{football.classList.remove("goal-flight");$("#goal-banner").classList.remove("active");void football.offsetWidth;football.classList.add("goal-flight");$("#goal-banner").classList.add("active");setTimeout(()=>{$("#goal-banner").classList.remove("active");football.classList.remove("goal-flight")},1750)});

const effectToast=$("#effect-toast");
function showToast(text){effectToast.textContent=text;effectToast.classList.remove("show");void effectToast.offsetWidth;effectToast.classList.add("show")}

// Ten-second notes can be dropped on empty parts of the black wall.
const quickNote=$("#quick-note"),quickNoteInput=$("#quick-note-input");let noteX=0,noteY=0;
document.addEventListener("click",e=>{
  if(matchMedia("(max-width:760px), (pointer:coarse)").matches||panJustMoved||document.body.classList.contains("drawing")||!modalLayer.hidden||e.target.closest(".sticker,.portrait-wrap,.glasses-wrap,.deck,.controls,.zoom-tools,.guestbook-dock,.guestbook-launch,.visitor-pill,.availability,.brand-stamp,.social-popover,.quick-note,.wall-note"))return;
  noteX=e.clientX;noteY=e.clientY;quickNote.style.left=`${Math.max(12,Math.min(noteX-40,innerWidth-470))}px`;quickNote.style.top=`${Math.max(12,Math.min(noteY-30,innerHeight-100))}px`;quickNote.hidden=false;quickNoteInput.value="";quickNoteInput.focus();
});
quickNoteInput.addEventListener("keydown",e=>{if(e.key==="Escape"){quickNote.hidden=true;return}if(e.key!=="Enter")return;const value=quickNoteInput.value.trim();if(!value)return;dropWallNote(value,noteX,noteY);quickNote.hidden=true});
function dropWallNote(text,x,y){const note=document.createElement("div");note.className="wall-note";note.textContent=text;note.style.left=`${Math.max(8,Math.min(x,innerWidth-250))}px`;note.style.top=`${Math.max(8,Math.min(y,innerHeight-70))}px`;document.body.append(note);makeTemporaryNoteDraggable(note);setTimeout(()=>note.remove(),10000)}
function makeTemporaryNoteDraggable(note){let active=false,sx=0,sy=0,left=0,top=0;note.addEventListener("pointerdown",e=>{active=true;sx=e.clientX;sy=e.clientY;left=note.offsetLeft;top=note.offsetTop;note.setPointerCapture(e.pointerId)});note.addEventListener("pointermove",e=>{if(!active)return;note.style.left=`${left+e.clientX-sx}px`;note.style.top=`${top+e.clientY-sy}px`});note.addEventListener("pointerup",()=>active=false);note.addEventListener("pointercancel",()=>active=false)}

// Mini Tetris in the controller popup.
const tetrisCanvas=$("#tetris-canvas"),tctx=tetrisCanvas.getContext("2d"),gameScore=$("#game-score"),gameLines=$("#game-lines"),tetrisStatus=$("#tetris-status"),gameStart=$("#game-start"),COLS=10,ROWS=15,SIZE=20;
const tetrisColors=[null,"#ffd633","#a44dff","#1687ff","#ff6b35","#5cff8b","#ff4f81","#f7f7f2"],tetrominoes=[[[1,1,1,1]],[[2,0,0],[2,2,2]],[[0,0,3],[3,3,3]],[[4,4],[4,4]],[[0,5,5],[5,5,0]],[[0,6,0],[6,6,6]],[[7,7,0],[0,7,7]]];
let tGrid=makeGrid(),piece=null,tScore=0,tLines=0,gameTimer=null;
function makeGrid(){return Array.from({length:ROWS},()=>Array(COLS).fill(0))}
function newPiece(){const shape=tetrominoes[Math.floor(Math.random()*tetrominoes.length)].map(row=>[...row]);piece={shape,x:Math.floor((COLS-shape[0].length)/2),y:0};if(collides(piece.shape,piece.x,piece.y))endGame()}
function collides(shape,x,y){return shape.some((row,py)=>row.some((value,px)=>value&&(x+px<0||x+px>=COLS||y+py>=ROWS||(y+py>=0&&tGrid[y+py][x+px]))))}
function mergePiece(){piece.shape.forEach((row,py)=>row.forEach((value,px)=>{if(value&&piece.y+py>=0)tGrid[piece.y+py][piece.x+px]=value}))}
function clearTetrisLines(){let cleared=0;for(let y=ROWS-1;y>=0;y--){if(tGrid[y].every(Boolean)){tGrid.splice(y,1);tGrid.unshift(Array(COLS).fill(0));cleared++;y++}}if(cleared){tLines+=cleared;tScore+=[0,100,300,500,800][cleared];gameLines.textContent=tLines;gameScore.textContent=tScore}}
function rotatePiece(){if(!piece)return;const rotated=piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse());if(!collides(rotated,piece.x,piece.y))piece.shape=rotated;drawTetris()}
function movePiece(dx,dy){if(!piece)return;if(!collides(piece.shape,piece.x+dx,piece.y+dy)){piece.x+=dx;piece.y+=dy}else if(dy>0){mergePiece();clearTetrisLines();newPiece()}drawTetris()}
function drawTetris(){tctx.fillStyle="#080808";tctx.fillRect(0,0,tetrisCanvas.width,tetrisCanvas.height);tctx.strokeStyle="rgba(255,255,255,.08)";for(let x=0;x<=COLS;x++){tctx.beginPath();tctx.moveTo(x*SIZE,0);tctx.lineTo(x*SIZE,ROWS*SIZE);tctx.stroke()}for(let y=0;y<=ROWS;y++){tctx.beginPath();tctx.moveTo(0,y*SIZE);tctx.lineTo(COLS*SIZE,y*SIZE);tctx.stroke()}function block(value,x,y){tctx.fillStyle=tetrisColors[value];tctx.fillRect(x*SIZE+1,y*SIZE+1,SIZE-2,SIZE-2)}tGrid.forEach((row,y)=>row.forEach((value,x)=>value&&block(value,x,y)));piece?.shape.forEach((row,py)=>row.forEach((value,px)=>value&&block(value,piece.x+px,piece.y+py)))}
function endGame(){const finalScore=tScore;stopGame();piece=null;tGrid=makeGrid();drawTetris();tetrisStatus.textContent=`Game over · ${finalScore} points. Press start to try again.`;gameStart.textContent="Start again";showToast(`TETRIS · ${finalScore} POINTS`)}
function startGame(){stopGame();tGrid=makeGrid();piece=null;tScore=0;tLines=0;gameScore.textContent="0";gameLines.textContent="0";tetrisStatus.textContent="Playing…";gameStart.textContent="Restart game";newPiece();drawTetris();gameTimer=setInterval(()=>movePiece(0,1),520)}
function stopGame(){if(gameTimer){clearInterval(gameTimer);gameTimer=null}}
gameStart.addEventListener("click",startGame);document.querySelectorAll("[data-tetris]").forEach(button=>button.addEventListener("click",()=>{if(!gameTimer)return;const action=button.dataset.tetris;if(action==="left")movePiece(-1,0);if(action==="right")movePiece(1,0);if(action==="down")movePiece(0,1);if(action==="rotate")rotatePiece()}));
addEventListener("keydown",e=>{if($("#game-modal").hidden||!gameTimer)return;if(["ArrowLeft","ArrowRight","ArrowDown","ArrowUp"].includes(e.key))e.preventDefault();if(e.key==="ArrowLeft")movePiece(-1,0);if(e.key==="ArrowRight")movePiece(1,0);if(e.key==="ArrowDown")movePiece(0,1);if(e.key==="ArrowUp")rotatePiece()});drawTetris();

const canvas=$("#draw-canvas"),drawPaths=$("#draw-paths"),drawToggle=$("#draw-toggle");let drawing=false,currentPath=null;
function screenToWorld(x,y){const cx=innerWidth/2,cy=innerHeight/2;return{x:cx+(x-cx-sceneX)/sceneZoom,y:cy+(y-cy-sceneY)/sceneZoom}}
function setDrawingMode(active){document.body.classList.toggle("drawing",active);drawToggle.setAttribute("aria-pressed",String(active));drawToggle.setAttribute("aria-label",active?"Exit drawing mode":"Draw on the wall");drawToggle.innerHTML=active?"×":'<span class="pencil">✎</span>'}
syncSceneView();addEventListener("resize",syncSceneView);drawToggle.addEventListener("click",e=>{e.stopPropagation();setDrawingMode(!document.body.classList.contains("drawing"))});$("#draw-exit").addEventListener("click",()=>setDrawingMode(false));addEventListener("keydown",e=>{if(e.key==="Escape"&&document.body.classList.contains("drawing"))setDrawingMode(false)});
canvas.addEventListener("pointerdown",e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=screenToWorld(e.clientX,e.clientY);currentPath=document.createElementNS("http://www.w3.org/2000/svg","path");currentPath.setAttribute("d",`M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);currentPath.setAttribute("fill","none");currentPath.setAttribute("stroke","#a44dff");currentPath.setAttribute("stroke-width",String(4/sceneZoom));currentPath.setAttribute("stroke-linecap","round");currentPath.setAttribute("stroke-linejoin","round");drawPaths.append(currentPath)});canvas.addEventListener("pointermove",e=>{if(!drawing||!currentPath)return;const p=screenToWorld(e.clientX,e.clientY);currentPath.setAttribute("d",`${currentPath.getAttribute("d")} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)});canvas.addEventListener("pointerup",()=>{drawing=false;currentPath=null});canvas.addEventListener("pointercancel",()=>{drawing=false;currentPath=null});canvas.addEventListener("dblclick",()=>drawPaths.replaceChildren());

// An automatic front-door vignette: the name types itself, then the wall opens
// without asking the visitor to click or wait on a control.
const entryScreen=$("#entry-screen"),entryLogo=$("#entry-logo"),entryWord="{dablio;}";
function enterWall(){if(!entryScreen||entryScreen.classList.contains("leaving"))return;entryScreen.classList.add("leaving");setTimeout(()=>entryScreen.remove(),720)}
async function playEntrance(){entryLogo.textContent="";if(prefersReduced){entryLogo.textContent=entryWord;setTimeout(enterWall,450);return}for(let i=1;i<=entryWord.length;i++){entryLogo.textContent=entryWord.slice(0,i);await wait(i===1?180:92)}await wait(720);enterWall()}
playEntrance();
renderSlide(0);
