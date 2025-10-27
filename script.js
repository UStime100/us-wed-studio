/* ========== Utilities ========== */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* ========== Elements ========== */
const reserveBtn = $('#reserveBtn');
const confirmModal = $('#confirmModal');
const confirmYes = $('#confirmYes');
const confirmNo = $('#confirmNo');
const successModal = $('#successModal');
const closeSuccess = $('#closeSuccess');
const mainTitle = $('#mainTitle');
const bgCanvas = $('#bg-canvas');
const aboutSection = $('#about');

/* ========= Safety checks ========= */
if (!bgCanvas || !mainTitle || !reserveBtn) {
  console.warn('必要元素不存在，請檢查 HTML（bg-canvas, mainTitle, reserveBtn）');
}

/* ========= Particle background (light weight) ========= */
(function particleInit(){
  const canvas = bgCanvas;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = [];
  const count = Math.max(30, Math.floor((w*h)/80000)); // responsive count

  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.6 + 0.6,
      vx: (Math.random()-0.5)*0.25,
      vy: (Math.random()-0.5)*0.25,
      alpha: 0.4 + Math.random()*0.4
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = w + 10;
      if(p.x > w + 10) p.x = -10;
      if(p.y < -10) p.y = h + 10;
      if(p.y > h + 10) p.y = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  let resizeTimer;
  window.addEventListener('resize', ()=> {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    },150);
  });
})();

/* ========= Smooth title glow based on mouse distance ========= */
(function titleGlow(){
  let glow = 0;
  const maxDist = 260;
  function onMove(e){
    const rect = mainTitle.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const d = Math.hypot(e.clientX - cx, e.clientY - cy);
    const target = Math.max(0, (maxDist - d) / maxDist);
    // smooth lerp
    glow += (target - glow) * 0.12;
    const blur = 8 + glow * 28; // 8~36px
    mainTitle.style.textShadow = `0 0 ${blur}px rgba(255,255,255,0.85)`;
    mainTitle.style.transform = `scale(${1 + glow*0.014})`;
  }
  document.addEventListener('mousemove', onMove);
})();

/* ========= Edge glow (small area) ========= */
(function edgeGlow(){
  const threshold = 90;
  let lastState = false;
  function onMove(e){
    const w = window.innerWidth, h = window.innerHeight;
    const near = (e.clientX < threshold) || (e.clientX > w - threshold) ||
                 (e.clientY < threshold) || (e.clientY > h - threshold);
    if (near !== lastState){
      lastState = near;
      if(near) document.body.classList.add('edge-glow');
      else document.body.classList.remove('edge-glow');
    }
  }
  document.addEventListener('mousemove', onMove);
})();

/* ========= Scroll reveal for About ========= */
(function scrollReveal(){
  function check(){
    if(!aboutSection) return;
    const rect = aboutSection.getBoundingClientRect();
    if(rect.top < window.innerHeight - 120){
      aboutSection.classList.add('visible');
      window.removeEventListener('scroll', check);
    }
  }
  window.addEventListener('scroll', check);
  // in case already visible
  check();
})();

/* ========= Modal handling (custom confirm & success) ========= */
function showModal(el){
  if(!el) return;
  el.style.display = 'flex';
  el.setAttribute('aria-hidden','false');
  // trap focus could be added later
}
function hideModal(el){
  if(!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden','true');
}

/* Reserve button flow:
   1) click reserveBtn -> open confirmModal
   2) if user clicks Yes -> close confirmModal, open successModal
   3) if user clicks No -> close confirmModal
*/
reserveBtn && reserveBtn.addEventListener('click', ()=>{
  showModal(confirmModal);
});

confirmNo && confirmNo.addEventListener('click', ()=> hideModal(confirmModal));
confirmYes && confirmYes.addEventListener('click', ()=>{
  hideModal(confirmModal);
  // simulate booking success flow: show success modal
  showModal(successModal);
  // NOTE: here is where you'd trigger server-side flow to message via IG API
  // e.g. call your backend endpoint: POST /api/notify-ig with payload { ig: userIG, ... }
});

closeSuccess && closeSuccess.addEventListener('click', ()=> hideModal(successModal));

/* Accessibility: press Esc to close modals */
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){
    hideModal(confirmModal);
    hideModal(successModal);
  }
});
