const trigger=document.querySelector('.menu-trigger');
const panel=document.querySelector('#mobile-menu');
const menuLabel=trigger?.querySelector('.menu-label');
const header=document.querySelector('.site-header');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const preview=Number(new URLSearchParams(location.search).get('preview'));
if([320,375,390].includes(preview))document.querySelector('.mobile-canvas').style.width=`${preview}px`;
const reviewFrame=Number(new URLSearchParams(location.search).get('frame'));
if(Number.isInteger(reviewFrame)&&reviewFrame>0)window.addEventListener('load',()=>{
  const canvas=document.querySelector('.mobile-canvas');
  const frameHeight=844;
  const step=760;
  const total=canvas.scrollHeight;
  const offset=Math.min((reviewFrame-1)*step,Math.max(0,total-frameHeight));
  document.body.classList.add('export-view');
  canvas.style.setProperty('--export-offset',`${-offset}px`);
  canvas.dataset.exportFrame=String(reviewFrame);
  canvas.dataset.exportOffset=String(offset);
  canvas.dataset.exportTotal=String(total);
});
function openMenu(){panel.hidden=false;trigger.setAttribute('aria-expanded','true');menuLabel.textContent='Close';if(!reduced.matches)panel.animate([{opacity:0},{opacity:1}],{duration:180,easing:'cubic-bezier(.2,0,0,1)'})}
function closeMenu(returnFocus=false){trigger.setAttribute('aria-expanded','false');menuLabel.textContent='Menu';if(reduced.matches)panel.hidden=true;else{const a=panel.animate([{opacity:1},{opacity:0}],{duration:180,easing:'cubic-bezier(.2,0,0,1)'});a.addEventListener('finish',()=>panel.hidden=true,{once:true})}if(returnFocus)trigger.focus()}
trigger?.addEventListener('click',()=>trigger.getAttribute('aria-expanded')==='true'?closeMenu():openMenu());
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&trigger?.getAttribute('aria-expanded')==='true')closeMenu(true)});
panel?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
let headerFrame=0;
function updateHeader(){header?.classList.toggle('is-compact',window.scrollY>180);headerFrame=0}
window.addEventListener('scroll',()=>{if(!headerFrame)headerFrame=requestAnimationFrame(updateHeader)},{passive:true});
updateHeader();
const comparison=document.querySelector('.comparison');
const groupTabs=[...document.querySelectorAll('.jump-links [role="tab"]')];
const groupTargets=groupTabs.map(tab=>document.querySelector(`#${tab.getAttribute('aria-controls')}`)).filter(Boolean);
function activateComparisonGroup(groupId,{focusTab=false,updateHash=false,animate=false}={}){
  const activeTab=groupTabs.find(tab=>tab.getAttribute('aria-controls')===groupId);
  const activePanel=document.querySelector(`#${groupId}`);
  if(!activeTab||!activePanel)return;
  groupTabs.forEach(tab=>{const selected=tab===activeTab;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1});
  groupTargets.forEach(panel=>panel.hidden=panel!==activePanel);
  if(updateHash)history.replaceState(null,'',`#${groupId}`);
  if(focusTab)activeTab.focus();
  if(animate&&!reduced.matches)activePanel.animate([{opacity:.15,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.2,0,0,1)'});
}
if(comparison&&groupTabs.length){
  comparison.classList.add('comparison-enhanced');
  const requestedGroup=location.hash.slice(1);
  const initialGroup=groupTabs.some(tab=>tab.getAttribute('aria-controls')===requestedGroup)?requestedGroup:'basics';
  activateComparisonGroup(initialGroup);
  groupTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activateComparisonGroup(tab.getAttribute('aria-controls'),{updateHash:true,animate:true}));
    tab.addEventListener('keydown',event=>{
      let nextIndex=null;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')nextIndex=(index+1)%groupTabs.length;
      if(event.key==='ArrowLeft'||event.key==='ArrowUp')nextIndex=(index-1+groupTabs.length)%groupTabs.length;
      if(event.key==='Home')nextIndex=0;
      if(event.key==='End')nextIndex=groupTabs.length-1;
      if(nextIndex===null)return;
      event.preventDefault();
      const nextTab=groupTabs[nextIndex];
      activateComparisonGroup(nextTab.getAttribute('aria-controls'),{focusTab:true,updateHash:true,animate:true});
    });
  });
  window.addEventListener('hashchange',()=>{const groupId=location.hash.slice(1);if(groupTabs.some(tab=>tab.getAttribute('aria-controls')===groupId))activateComparisonGroup(groupId)});
}
function setupProgramTabs(switcherSelector,panelSelector,defaultPanelId){
  const switcher=document.querySelector(switcherSelector);
  if(!switcher)return;
  const tabs=[...switcher.querySelectorAll('[role="tab"]')];
  const panels=[...document.querySelectorAll(panelSelector)];
  if(!tabs.length||!panels.length)return;
  const vertical=switcher.getAttribute('aria-orientation')==='vertical';
  const validPanel=id=>panels.find(item=>item.id===id);
  function activate(panelId,{focusTab=false,updateHash=false,animate=false}={}){
    const activePanel=validPanel(panelId);
    const activeTab=tabs.find(tab=>tab.getAttribute('aria-controls')===panelId);
    if(!activePanel||!activeTab)return;
    tabs.forEach(tab=>{const selected=tab===activeTab;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1});
    panels.forEach(item=>item.hidden=item!==activePanel);
    if(updateHash)history.replaceState(null,'',`#${panelId}`);
    if(focusTab)activeTab.focus();
    if(animate&&!reduced.matches)activePanel.animate([{opacity:.15,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.2,0,0,1)'});
  }
  switcher.closest('section')?.classList.add('program-tabs-enhanced');
  const requested=location.hash.slice(1);
  activate(validPanel(requested)?requested:defaultPanelId);
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.getAttribute('aria-controls'),{updateHash:true,animate:true}));
    tab.addEventListener('keydown',event=>{
      let nextIndex=null;
      if(event.key==='ArrowDown'||(!vertical&&event.key==='ArrowRight'))nextIndex=(index+1)%tabs.length;
      if(event.key==='ArrowUp'||(!vertical&&event.key==='ArrowLeft'))nextIndex=(index-1+tabs.length)%tabs.length;
      if(event.key==='Home')nextIndex=0;
      if(event.key==='End')nextIndex=tabs.length-1;
      if(nextIndex===null)return;
      event.preventDefault();
      activate(tabs[nextIndex].getAttribute('aria-controls'),{focusTab:true,updateHash:true,animate:true});
    });
  });
  window.addEventListener('hashchange',()=>{const panelId=location.hash.slice(1);if(validPanel(panelId))activate(panelId)});
}
setupProgramTabs('.eligibility-switcher','.eligibility .qualification-block','qualification-ssdi-panel');
setupProgramTabs('.payment-summary-grid','.payments .payment-detail-panel','payment-detail-ssdi');
setupProgramTabs('.scenario-selector','.scenarios .scenario-result-panel','scenario-panel-1');
const revealSelector=['.program-card','.help-band .button-stack','.factor-group','.health-row','.scenario-help','.quiz-card','.evaluation-trust','.footer-group','.newsletter','.disclaimer'].join(',');
if(!reduced.matches&&'IntersectionObserver'in window){
  const revealTargets=[...document.querySelectorAll(revealSelector)];
  const visibleLimit=window.innerHeight*.94;
  for(const target of revealTargets){
    target.classList.add('scroll-reveal');
    if(target.getBoundingClientRect().top<visibleLimit)target.classList.add('is-visible');
  }
  document.documentElement.classList.add('motion-ready');
  const revealObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  revealTargets.filter(target=>!target.classList.contains('is-visible')).forEach(target=>revealObserver.observe(target));
  const accentTargets=[...document.querySelectorAll('.eyebrow')];
  for(const target of accentTargets){
    target.classList.add('scroll-accent');
    if(target.getBoundingClientRect().top<visibleLimit)target.classList.add('is-drawn');
  }
  const accentObserver=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('is-drawn');
      accentObserver.unobserve(entry.target);
    }
  },{threshold:.5,rootMargin:'0px 0px -10% 0px'});
  accentTargets.filter(target=>!target.classList.contains('is-drawn')).forEach(target=>accentObserver.observe(target));
}
const quiz=document.querySelector('#case-evaluation');
if(quiz){
  const steps=[...quiz.querySelectorAll('.quiz-step')];
  const stepLabel=quiz.querySelector('.quiz-step-label');
  const progress=quiz.querySelector('.progress');
  const progressBar=progress.querySelector('span');
  const status=quiz.querySelector('.quiz-status');
  const back=quiz.querySelector('.quiz-back');
  const next=quiz.querySelector('.quiz-next');
  const review=quiz.querySelector('.quiz-review');
  let current=0;
  const labels={receiving:'Receiving benefits',working:'Current work',work_impact:'Condition impact',duration:'Expected duration',work_history:'Recent work history',first_name:'First name',last_name:'Last name',case_email:'Email',case_phone:'Phone'};

  function valueFor(name){return new FormData(quiz).get(name)?.trim()||''}
  function setStatus(message='',isError=false){status.textContent=message;status.classList.toggle('error',isError)}
  function focusStep(){const target=steps[current].querySelector('legend,.review-heading');if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}}
  function buildReview(){
    const values=['receiving','working','work_impact','duration','work_history','first_name','last_name','case_email','case_phone'];
    review.replaceChildren(...values.filter(name=>valueFor(name)).map(name=>{
      const row=document.createElement('div');
      const term=document.createElement('dt');
      const detail=document.createElement('dd');
      term.textContent=labels[name];
      detail.textContent=valueFor(name);
      row.append(term,detail);
      return row;
    }));
  }
  function renderStep(shouldFocus=false){
    steps.forEach((step,index)=>step.hidden=index!==current);
    const number=current+1;
    stepLabel.textContent=`Step ${number} of ${steps.length}`;
    progress.setAttribute('aria-valuenow',String(number));
    progress.setAttribute('aria-valuetext',`Step ${number} of ${steps.length}`);
    progressBar.style.width=`${(number/steps.length)*100}%`;
    back.hidden=current===0;
    next.textContent=current===steps.length-1?'Complete review':'Continue';
    if(current===steps.length-1)buildReview();
    setStatus(current<5?'Choose one answer to continue.':current===5?'Complete all required fields to continue.':'Your answers have not been sent.');
    if(shouldFocus){quiz.scrollIntoView({block:'start',behavior:reduced.matches?'auto':'smooth'});focusStep()}
  }
  function validateStep(){
    const step=steps[current];
    if(current<5){
      const selected=step.querySelector('input[type=radio]:checked');
      if(!selected){setStatus('Choose an answer before continuing.',true);step.querySelector('input')?.focus();return false}
      return true;
    }
    if(current===5){
      const required=[...step.querySelectorAll('input[required]')];
      for(const field of required){
        const empty=!field.value.trim();
        const invalidEmail=field.type==='email'&&!/^\S+@\S+\.\S+$/.test(field.value.trim());
        field.toggleAttribute('aria-invalid',empty||invalidEmail);
        if(empty||invalidEmail){setStatus(invalidEmail?'Enter an email address in the format name@example.com.':'Complete all required fields before continuing.',true);field.focus();return false}
      }
    }
    return true;
  }
  quiz.addEventListener('change',event=>{
    if(event.target.matches('input[type=radio]'))setStatus(`${event.target.value} selected. Select Continue when ready.`);
  });
  quiz.addEventListener('input',event=>{
    if(event.target.matches('.quiz-field input')){event.target.removeAttribute('aria-invalid');if(status.classList.contains('error'))setStatus('Complete all required fields to continue.')}
  });
  next.addEventListener('click',()=>{
    if(!validateStep())return;
    if(current<steps.length-1){current++;renderStep(true);return}
    const firstName=valueFor('first_name');
    quiz.innerHTML=`<div class="quiz-complete" tabindex="-1"><div class="quiz-complete-mark" aria-hidden="true">✓</div><h3>Review complete, ${firstName}.</h3><p>This interaction is working. Because this is a local design prototype, no personal information or answers were transmitted.</p><p>On a production site, this state would confirm delivery and explain when and how the team will respond.</p><button class="button primary quiz-restart" type="button">Start another review</button></div>`;
    quiz.querySelector('.quiz-complete').focus();
    quiz.querySelector('.quiz-restart').addEventListener('click',()=>location.reload());
  });
  back.addEventListener('click',()=>{if(current>0){current--;renderStep(true)}});
  quiz.addEventListener('submit',event=>{event.preventDefault();next.click()});
  renderStep();
}
const newsletter=document.querySelector('.newsletter');
newsletter?.addEventListener('submit',e=>{e.preventDefault();const input=new FormData(newsletter).get('email')?.trim()||'';const feedback=document.querySelector('#email-feedback');feedback.className='field-feedback';if(!/^\S+@\S+\.\S+$/.test(input)){feedback.textContent='Enter an email address in the format name@example.com.';feedback.classList.add('error');newsletter.email.setAttribute('aria-invalid','true');newsletter.email.focus();return}newsletter.email.removeAttribute('aria-invalid');feedback.textContent='Success state demonstrated. No information was sent.';feedback.classList.add('success')});
