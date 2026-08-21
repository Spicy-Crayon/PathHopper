async function zombiePoolSize(folder){
  if (zombiePoolSizeCache[folder] != null) return zombiePoolSizeCache[folder];
  let count = 0;
  for (let i = 1; i <= 300; i++){
    try{
      const res = await fetch(`${ZOMBIE_AUDIO_BASE}/${folder}/${i}.mp3`, { method:'HEAD' });
      if (!res.ok) break;
      count = i;
    }catch(e){ break; }
  }
  zombiePoolSizeCache[folder] = count;
  return count;
}

function zombieFilePath(folder, n){ return `${ZOMBIE_AUDIO_BASE}/${folder}/${n}.mp3`; }

async function zombieRandomFile(kindKey){
  const folder = ZOMBIE_FOLDERS[kindKey];
  const size = await zombiePoolSize(folder);
  if (!size) return null;
  return zombieFilePath(folder, 1 + Math.floor(Math.random()*size));
}

function zombieStoryFolder(storyline){ return `Zombie-storie/${storyline}`; }

async function zombieStoryPoolSize(storyline){
  const folder = zombieStoryFolder(storyline);
  if (zombieStoryPoolCache[folder] != null) return zombieStoryPoolCache[folder];
  let count = 0;
  for (let i = 1; i <= 100; i++){
    try{
      const res = await fetch(`${ZOMBIE_AUDIO_BASE}/${folder}/deel${i}.mp3`, { method:'HEAD' });
      if (!res.ok) break;
      count = i;
    }catch(e){ break; }
  }
  zombieStoryPoolCache[folder] = count;
  return count;
}

function zombieStoryFilePath(storyline, n){ return `${ZOMBIE_AUDIO_BASE}/${zombieStoryFolder(storyline)}/deel${n}.mp3`; }

async function pickZombieStoryline(){
  const candidates = [1,2,3,4,5];
  for (let i = candidates.length - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [candidates[i],candidates[j]] = [candidates[j],candidates[i]]; }
  for (const c of candidates){ if (await zombieStoryPoolSize(c) > 0) return c; }
  return 1; // geen enkele verhaallijn heeft bestanden — sessie loopt gewoon door zonder verhaal
}

async function zombieStorylineStatusText(){
  const sizes = await Promise.all([1,2,3,4,5].map(zombieStoryPoolSize));
  const available = sizes.filter(s => s > 0).length;
  if (!available) return curLang()==='en' ? 'No storyline files found yet (Zombie-storie/1../5/).' : 'Nog geen verhaallijn-bestanden gevonden (Zombie-storie/1../5/).';
  return curLang()==='en' ? `${available}/5 storylines have content — one is picked at random each run.` : `${available}/5 verhaallijnen hebben inhoud — per run wordt er willekeurig één gekozen.`;
}

async function estimateZombieBaseSpeedKmh(){
  try{
    const hist = await storageGet('run_history').then(v => v ? JSON.parse(v) : []).catch(() => []);
    const usable = hist.filter(r => r.km > 0.5 && r.durationSec > 60).slice(0, 10);
    if (usable.length >= 2){
      const avgPaceSecPerKm = usable.reduce((s,r) => s + (r.durationSec / r.km), 0) / usable.length;
      return Math.round((3600 / avgPaceSecPerKm) * 10) / 10;
    }
  }catch(e){ /* val terug op standaardwaarde */ }
  return 8;
}

function setupZombieDualSlider(minInput, maxInput, fillEl, labelEl, unitLabel, formatFn){
  const fmt = formatFn || (v => v);
  function render(){
    let lo = parseFloat(minInput.value), hi = parseFloat(maxInput.value);
    if (lo > hi){ [lo, hi] = [hi, lo]; minInput.value = lo; maxInput.value = hi; }
    const range = parseFloat(minInput.max) - parseFloat(minInput.min) || 1;
    const pctLo = ((lo - parseFloat(minInput.min)) / range) * 100;
    const pctHi = ((hi - parseFloat(minInput.min)) / range) * 100;
    fillEl.style.left = pctLo + '%';
    fillEl.style.width = Math.max(0, pctHi - pctLo) + '%';
    labelEl.textContent = `${fmt(lo)} ${curLang()==='en' ? 'to' : 'tot'} ${fmt(hi)} ${unitLabel}`;
  }
  minInput.addEventListener('input', render);
  maxInput.addEventListener('input', render);
  render();
  return render;
}

async function startZombieRun(opts){
  await startRunSession({
    mode:'free', targetKm: opts.targetKm || null, // "Doel op afstand" hergebruikt het bestaande targetKm-mechanisme (melding + voortgang)
    zombieConfig: {
      lives: opts.lives, baseSpeedKmh: opts.baseSpeedKmh, rampKmh: opts.rampKmh, rampIntervalMin: opts.rampIntervalMin,
      chaseMin: opts.chaseMin, chaseMax: opts.chaseMax,
      interludeMin: opts.interludeMin, interludeMax: opts.interludeMax,
      consequence: opts.consequence, targetMinutes: opts.targetMinutes || null, difficulty: opts.difficulty || 'normal'
    }
  });
}

async function initZombieState(zombieConfig){
  rsState.zombie = {
    livesStart: zombieConfig.lives, lives: zombieConfig.lives,
    baseSpeedKmh: zombieConfig.baseSpeedKmh, rampKmh: zombieConfig.rampKmh, rampIntervalMin: zombieConfig.rampIntervalMin,
    currentThresholdKmh: zombieConfig.baseSpeedKmh,
    chaseMin: zombieConfig.chaseMin, chaseMax: zombieConfig.chaseMax,
    interludeMin: zombieConfig.interludeMin, interludeMax: zombieConfig.interludeMax,
    consequence: zombieConfig.consequence, targetMinutes: zombieConfig.targetMinutes || null, targetTimeReached: false, difficulty: zombieConfig.difficulty || 'normal',
    phase: 'intro', // 'intro'|'story'|'interlude'|'alarm'|'startcue'|'chase'|'stopcue'
    interludeNext: null, interludeTimeoutId: null, chaseDurationSec: 0,
    score: 0, escapedCount: 0, caughtCount: 0,
    chaseEndAt: 0, belowThresholdStreak: 0, finished: false, died: false,
    storyline: 1, storyPartIndex: 1, currentMusicPace: null,
    // Beloningssysteem (Supply Drop): een aanhoudende sprint — zowel tijdens het rustige verhaaldeel als
    // tijdens de achtervolging zelf — levert bonuspunten op, die (per volle punt) automatisch een
    // verloren leven kunnen terugwinnen. Zie tickZombieSprintReward().
    sprintActive: false, sprintPhase: null, sprintStartAt: 0, sprintPeakRatio: 0, bonusAccum: 0, totalBonusEarned: 0,
    // "Op het nippertje": kleinste snelheidsmarge waarmee je ooit aan een achtervolging ontsnapte deze run.
    chaseMinMarginKmh: Infinity, bestMarginKmh: Infinity, nipperCount: 0, lastHeartbeatFired: false
  };
  $('zrRadarWrap').classList.remove('hidden');
  rsState.zombie.storyline = await pickZombieStoryline();
  await switchZombieMusic('low');
  const introFile = await zombieRandomFile('intro');
  if (introFile){
    const player = $('runMusicPlayer');
    player.src = introFile; player.volume = 1; rsCurrentAudioPool = null;
    player.play().catch(() => {});
    updateZombieBanner();
  } else {
    await playZombieStoryPart(); // geen intro-bestand gevonden — meteen door naar het verhaal
  }
}

function updateZombieCurrentSpeed(){
  const z = rsState.zombie;
  if (!z || !rsState.startedAt) return;
  const elapsedMin = (Date.now() - rsState.startedAt - (rsState.pausedMs||0)) / 60000;
  const steps = z.rampIntervalMin > 0 ? Math.floor(elapsedMin / z.rampIntervalMin) : 0;
  z.currentThresholdKmh = Math.round((z.baseSpeedKmh + steps * z.rampKmh) * 10) / 10;
}

function tickZombieSprintReward(){
  const z = rsState.zombie;
  if (!z) return;
  const activePhase = (z.phase === 'story' || z.phase === 'chase') ? z.phase : null;
  if (!activePhase){
    if (z.sprintActive) cancelZombieSprint();
    return;
  }
  const kmh = rsState.currentSpeedKmh != null ? rsState.currentSpeedKmh : 0;
  const base = activePhase === 'story' ? (z.baseSpeedKmh || 8) : (z.currentThresholdKmh || z.baseSpeedKmh || 8);
  const ratio = base > 0 ? kmh / base : 0;
  if (ratio >= 1.2){
    if (!z.sprintActive || z.sprintPhase !== activePhase){
      z.sprintActive = true; z.sprintPhase = activePhase; z.sprintStartAt = Date.now(); z.sprintPeakRatio = ratio;
      if (activePhase === 'story') speakForRun(curLang()==='en' ? 'Supplies nearby — sprint to reach them!' : 'Voorraad in de buurt — sprint ernaartoe!');
    } else {
      z.sprintPeakRatio = Math.max(z.sprintPeakRatio, ratio);
    }
  } else if (z.sprintActive){
    endZombieSprint();
  }
}

function cancelZombieSprint(){
  const z = rsState.zombie;
  z.sprintActive = false; z.sprintPhase = null; z.sprintStartAt = 0; z.sprintPeakRatio = 0;
}

function endZombieSprint(){
  const z = rsState.zombie;
  const durationSec = (Date.now() - z.sprintStartAt) / 1000;
  const peak = z.sprintPeakRatio;
  const phase = z.sprintPhase;
  cancelZombieSprint();
  const tiers = ZOMBIE_REWARD_TIERS[phase] || ZOMBIE_REWARD_TIERS.story;
  const hit = tiers.find(t => peak >= t.ratio && durationSec >= t.dur);
  if (hit) awardZombieBonus({ icon:hit.icon, pts:hit.pts, label: ZOMBIE_REWARD_LABELS[hit.key][curLang()==='en' ? 'en' : 'nl'] });
}

function awardZombieBonus(reward){
  const z = rsState.zombie;
  z.bonusAccum = (z.bonusAccum||0) + reward.pts;
  z.totalBonusEarned = Math.round(((z.totalBonusEarned||0) + reward.pts) * 10) / 10;
  z.score += reward.pts;
  toast(`${reward.icon} ${reward.label}! +${reward.pts}`, 3500);
  speakForRun(curLang()==='en' ? `${reward.label} secured!` : `${reward.label} veiliggesteld!`);
  triggerZombieFlash('reward');
  while (z.bonusAccum >= 1 && z.lives < z.livesStart){
    z.bonusAccum -= 1; z.lives += 1;
    toast(curLang()==='en' ? '❤️ Extra life regained!' : '❤️ Extra leven teruggewonnen!', 3000);
  }
  updateZombieBanner();
}

function awardZombieNipperBonus(minMarginKmh){
  if (!isFinite(minMarginKmh)) return;
  const z = rsState.zombie;
  const tier = ZOMBIE_NIPPER_TIERS.find(t => minMarginKmh <= t.max);
  if (!tier) return; // ruim ontsnapt — geen extra bonus nodig, de gewone +10 volstaat
  z.nipperCount = (z.nipperCount||0) + 1;
  awardZombieBonus({ icon:tier.icon, pts:tier.pts, label: curLang()==='en' ? tier.en : tier.nl });
}

function triggerZombieFlash(type){
  const screen = $('runSessionScreen');
  if (!screen) return;
  const cls = type === 'bite' ? 'zr-bite-flash' : 'zr-reward-flash';
  screen.classList.add(cls);
  setTimeout(() => screen.classList.remove(cls), 650);
}

function zombieBitePopupContent(variant, livesLeft){
  const en = curLang()==='en';
  if (variant === 1) return `<div class="zr-bp-title zr-bp-blood">${en?'Bitten':'Gebeten'}</div><div class="zr-bp-sub">${en?'-1 life':'-1 leven'}</div>`;
  if (variant === 2) return `<div class="zr-bp-title zr-bp-static"><i class="ti ti-alert-triangle" aria-hidden="true"></i> ${en?'CAUGHT':'INGEHAALD'}</div><div class="zr-bp-sub">${en?'life point lost':'levenspunt verloren'}</div>`;
  return `<div class="zr-bp-title zr-bp-claw">${en?'They got you':'Ze hebben je te pakken'}</div><div class="zr-bp-sub">${en?'-1 life':'-1 leven'} · ${Math.max(0,livesLeft)} ${en?'left':'over'}</div>`;
}

function showZombieBitePopup(){
  const z = rsState.zombie;
  const variant = 1 + Math.floor(Math.random()*3);
  const el = document.createElement('div');
  el.className = `zr-bitepopup zr-bitepopup-${variant}`;
  el.innerHTML = `<div class="zr-bitepopup-inner">${zombieBitePopupContent(variant, z.lives)}</div>`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('zr-bitepopup-out'), 1100);
  setTimeout(() => el.remove(), 1600);
}

function computeZombieChaseProximity(){
  const z = rsState.zombie;
  const kmh = rsState.currentSpeedKmh != null ? rsState.currentSpeedKmh : 0;
  const ratio = z.currentThresholdKmh > 0 ? kmh / z.currentThresholdKmh : 1;
  const danger = Math.max(0, 1 - ratio); // >0 zodra je trager loopt dan nodig
  const streakFactor = (z.belowThresholdStreak||0) / 4;
  return Math.min(0.95, Math.max(0.08, danger*0.5 + streakFactor*0.6));
}

function updateZombieChaseProximityVolume(){
  const z = rsState.zombie;
  if (!z || z.phase !== 'chase') return;
  const player = $('zombieEffectsPlayer');
  if (!player || !player.src) return;
  const proximity = computeZombieChaseProximity();
  player.volume = ZOMBIE_CREEPY_VOL_MIN + proximity * (ZOMBIE_CREEPY_VOL_MAX - ZOMBIE_CREEPY_VOL_MIN);
  updateZombieVignette(proximity);
}

function updateZombieVignette(proximity){
  const el = $('zrVignette');
  if (!el) return;
  el.style.opacity = Math.min(0.6, 0.1 + proximity*0.5);
  el.style.animationDuration = (1.6 - proximity*1.1) + 's';
}

function triggerZombieLastHeartbeat(){
  if (navigator.vibrate) navigator.vibrate([90, 60, 140]);
  const el = $('zrVignette');
  if (el){
    el.classList.add('zr-heartbeat-hit');
    setTimeout(() => el.classList.remove('zr-heartbeat-hit'), 500);
  }
  speakForRun(curLang()==='en' ? "They're right behind you!" : 'Ze zitten vlak achter je!');
}

function updateZombieRadar(){
  const z = rsState && rsState.zombie;
  if (!z) return;
  const zBlip = $('zrRadarZombieBlip');
  const showBlip = z.phase === 'chase' || z.phase === 'alarm' || z.phase === 'startcue';
  if (showBlip){
    zBlip.classList.remove('hidden');
    if (z.phase === 'chase'){
      const proximity = computeZombieChaseProximity();
      zBlip.style.top = (50 - (1-proximity)*35) + '%';
    } else {
      zBlip.style.top = '15%';
    }
  } else {
    zBlip.classList.add('hidden');
  }
  const vignette = $('zrVignette');
  if (vignette && z.phase !== 'chase'){ vignette.style.opacity = 0; }
  const bonusLine = $('zrBonusLine');
  if ((z.totalBonusEarned||0) > 0){
    bonusLine.classList.remove('hidden');
    $('zrBonusVal').textContent = z.totalBonusEarned.toFixed(1);
  }
}

function duckZombieMusic(down){
  fadeAudioVolume($('zombieMusicPlayer'), down ? ZOMBIE_MUSIC_DUCK_VOL : ZOMBIE_MUSIC_BASE_VOL, 800);
}

async function switchZombieMusic(pace){
  const z = rsState.zombie;
  if (z && z.currentMusicPace === pace) return;
  if (z) z.currentMusicPace = pace;
  const file = await zombieRandomFile(pace === 'high' ? 'musicHigh' : 'musicLow');
  const player = $('zombieMusicPlayer');
  if (!file) return; // geen muziekbestanden in die map — sessie loopt gewoon door zonder achtergrondmuziek
  if (!player.src){
    player.src = file; player.volume = 0; player.play().catch(() => {});
    fadeAudioVolume(player, ZOMBIE_MUSIC_BASE_VOL, 1500);
    return;
  }
  fadeAudioVolume(player, 0, 700);
  setTimeout(() => {
    player.src = file; player.currentTime = 0;
    player.play().catch(() => {});
    fadeAudioVolume(player, ZOMBIE_MUSIC_BASE_VOL, 900);
  }, 750);
}

function stopZombieBackgroundMusic(){
  const player = $('zombieMusicPlayer');
  fadeAudioVolume(player, 0, 1200);
  setTimeout(() => { player.pause(); player.currentTime = 0; }, 1300);
}

function scheduleZombieCreepyFx(){
  clearTimeout(zombieCreepyTimeoutId);
  const z = rsState && rsState.zombie;
  if (!z || z.finished || z.phase !== 'chase') return;
  const delayMs = (4 + Math.random()*6) * 1000;
  zombieCreepyTimeoutId = setTimeout(async () => {
    if (rsState && rsState.zombie && !rsState.zombie.finished && rsState.zombie.phase === 'chase') await playZombieCreepyFx();
    scheduleZombieCreepyFx();
  }, delayMs);
}

async function playZombieCreepyFx(){
  const file = await zombieRandomFile('creepy');
  if (!file) return;
  const player = $('zombieEffectsPlayer');
  playAudioRandomOffset(player, file, 4 + Math.random()*6);
  player.volume = ZOMBIE_CREEPY_VOL_MIN + computeZombieChaseProximity() * (ZOMBIE_CREEPY_VOL_MAX - ZOMBIE_CREEPY_VOL_MIN);
}

async function playZombieOutcomeAudio(kindKey){
  const file = await zombieRandomFile(kindKey);
  if (!file) return;
  const player = $('zombieEffectsPlayer');
  player.src = file; player.volume = 1; player.play().catch(() => {});
}

async function playZombieStoryPart(){
  const z = rsState.zombie;
  z.phase = 'story';
  const poolSize = await zombieStoryPoolSize(z.storyline);
  if (!poolSize || z.storyPartIndex > poolSize){
    // Verhaallijn is op (of geen bestanden gevonden) — de sessie (en muziek) blijft gewoon actief.
    updateZombieBanner();
    return;
  }
  const player = $('runMusicPlayer');
  player.src = zombieStoryFilePath(z.storyline, z.storyPartIndex);
  z.storyPartIndex++;
  player.volume = 0.9;
  rsCurrentAudioPool = null;
  player.play().catch(() => {});
  await switchZombieMusic('low');
  duckZombieMusic(false);
  updateZombieBanner();
}

function handleZombieTrackEnded(){
  const z = rsState.zombie;
  if (!z || z.finished) return;
  if (z.phase === 'intro'){
    playZombieStoryPart();
  } else if (z.phase === 'story'){
    startZombieInterlude('alarm');
  } else if (z.phase === 'alarm'){
    playZombieStartCue();
  } else if (z.phase === 'startcue'){
    beginZombieChase();
  } else if (z.phase === 'stopcue'){
    startZombieInterlude('story');
  }
}

function startZombieInterlude(nextPhase){
  const z = rsState.zombie;
  clearTimeout(z.interludeTimeoutId);
  const durationSec = Math.round(randRange(z.interludeMin || 0, z.interludeMax || 0));
  if (!durationSec){ finishZombieInterlude(nextPhase); return; } // uitgeschakeld: meteen doorgaan
  z.phase = 'interlude';
  z.interludeNext = nextPhase;
  z.interludeEndAt = Date.now() + durationSec*1000;
  $('runMusicPlayer').pause(); // geen verhaal/alarm/cue-geluid tijdens het rustige stuk, enkel de achtergrondmuziek
  updateZombieBanner();
  z.interludeTimeoutId = setTimeout(() => finishZombieInterlude(nextPhase), durationSec*1000);
}

async function finishZombieInterlude(nextPhase){
  const z = rsState.zombie;
  if (!z || z.finished) return;
  if (nextPhase === 'alarm'){
    z.phase = 'alarm';
    const file = await zombieRandomFile('alarm');
    if (file){ const player = $('runMusicPlayer'); player.src = file; player.volume = 1; player.play().catch(() => {}); }
    else { playZombieStartCue(); return; } // geen alarmbestand gevonden — meteen door naar de startcue
    duckZombieMusic(true); // muziek lichtjes zachter zodra het alarm start
    updateZombieBanner();
  } else {
    advanceZombieStory();
  }
}

async function playZombieStartCue(){
  const z = rsState.zombie;
  z.phase = 'startcue';
  await switchZombieMusic('high');
  const file = await zombieRandomFile('startRun');
  if (file){ const player = $('runMusicPlayer'); player.src = file; player.volume = 1; player.play().catch(() => {}); }
  else { beginZombieChase(); return; } // geen startRun-bestand — meteen de achtervolging in
  updateZombieBanner();
}

function beginZombieChase(){
  const z = rsState.zombie;
  z.phase = 'chase';
  z.chaseDurationSec = Math.round(randRange(z.chaseMin, z.chaseMax));
  z.chaseEndAt = Date.now() + z.chaseDurationSec*1000;
  z.belowThresholdStreak = 0;
  z.chaseMinMarginKmh = Infinity; // kleinste snelheidsmarge deze achtervolging — voor de "op het nippertje"-bonus
  z.lastHeartbeatFired = false; // "laatste hartslag"-effect: 1x per opbouwende streak, zie tickZombieState
  scheduleZombieCreepyFx();
  updateZombieBanner();
}

async function endZombieChaseSafely(){
  const z = rsState.zombie;
  clearTimeout(zombieCreepyTimeoutId);
  await switchZombieMusic('low');
  z.phase = 'stopcue';
  const file = await zombieRandomFile('stopRun');
  if (file){ const player = $('runMusicPlayer'); player.src = file; player.volume = 1; player.play().catch(() => {}); }
  else { startZombieInterlude('story'); return; }
  updateZombieBanner();
}

function tickZombieState(){
  const z = rsState.zombie;
  if (!z || z.finished) return;
  updateZombieCurrentSpeed(); // zombiesnelheid kan intussen zijn opgedreven, ook buiten een achtervolging
  tickZombieSprintReward(); // beloningssysteem: sprint-detectie tijdens verhaal én achtervolging
  // "Doel op tijd": zelfde soort melding als het bestaande "Doel op afstand" (targetKm) — stopt niets
  // automatisch, laat je gewoon weten dat je doel bereikt is, net als bij een gewone doelrun.
  if (z.targetMinutes && !z.targetTimeReached){
    const elapsedMin = (Date.now() - rsState.startedAt - (rsState.pausedMs||0)) / 60000;
    if (elapsedMin >= z.targetMinutes){
      z.targetTimeReached = true;
      speakForRun(curLang()==='en'
        ? `Time goal of ${z.targetMinutes} minutes reached. Keep going or stop whenever you like.`
        : `Tijdsdoel van ${z.targetMinutes} minuten bereikt. Loop verder of stop wanneer je wil.`);
    }
  }
  if (z.phase === 'interlude'){ updateZombieBanner(); return; } // aftellen gebeurt via setTimeout, hier enkel de banner verversen
  if (z.phase !== 'chase') return;
  updateZombieChaseProximityVolume(); // enge-geluiden-laag wordt luider naarmate de zombies dichterbij komen
  const kmh = (rsState.currentSpeedKmh != null) ? rsState.currentSpeedKmh : 0;
  if (kmh < z.currentThresholdKmh) z.belowThresholdStreak++; else z.belowThresholdStreak = 0;
  z.chaseMinMarginKmh = Math.min(z.chaseMinMarginKmh, kmh - z.currentThresholdKmh); // voor "op het nippertje"
  // "Laatste hartslag": één keer per opbouwende streak, net vóór de effectieve vangst (streak 4) — een
  // laatste dramatische waarschuwing dat je op het punt staat gepakt te worden.
  if (z.belowThresholdStreak === 3 && !z.lastHeartbeatFired){
    z.lastHeartbeatFired = true;
    triggerZombieLastHeartbeat();
  } else if (z.belowThresholdStreak < 3){
    z.lastHeartbeatFired = false;
  }
  const caughtNow = z.belowThresholdStreak >= 4; // 4 opeenvolgende seconden te traag = ingehaald
  const timeUp = Date.now() >= z.chaseEndAt;
  if (caughtNow){
    resolveZombieChase(false);
  } else if (timeUp){
    resolveZombieChase(true);
  } else {
    updateZombieBanner();
  }
}

function resolveZombieChase(escaped){
  const z = rsState.zombie;
  if (escaped){
    z.score += 10; z.escapedCount++;
    speakForRun(curLang()==='en' ? 'You escaped!' : 'Ontsnapt!');
    z.bestMarginKmh = Math.min(z.bestMarginKmh, z.chaseMinMarginKmh);
    awardZombieNipperBonus(z.chaseMinMarginKmh);
    endZombieChaseSafely();
    updateZombieBanner();
    return;
  }
  z.caughtCount++;
  z.lives--;
  triggerZombieFlash('bite');
  showZombieBitePopup();
  if (z.lives <= 0){
    handleZombieDeath();
    return;
  }
  if (z.consequence === 'points'){
    z.score -= 10;
    speakForRun(curLang()==='en' ? 'Caught! Keep going.' : 'Ingehaald! Loop door.');
    endZombieChaseSafely();
  } else { // 'extend'
    z.score -= 5;
    speakForRun(curLang()==='en' ? "Caught! They're still after you!" : 'Ingehaald! Ze zitten nog achter je aan!');
    z.chaseDurationSec = Math.round(randRange(z.chaseMin, z.chaseMax));
    z.chaseEndAt = Date.now() + z.chaseDurationSec*1000; // extra kans, zelfde drempel — de jacht gaat gewoon door
    z.belowThresholdStreak = 0;
    z.chaseMinMarginKmh = Infinity; // nieuwe kans, dus ook een verse meting voor "op het nippertje"
  }
  updateZombieBanner();
}

function handleZombieDeath(){
  const z = rsState.zombie;
  z.finished = true; z.died = true;
  clearTimeout(z.interludeTimeoutId); clearTimeout(zombieCreepyTimeoutId);
  updateZombieBanner();
  playZombieOutcomeAudio('looser');
  speakForRun(curLang()==='en' ? 'They got you...' : 'Ze hebben je te pakken...');
  const name = (appSettings.userName && appSettings.userName.trim()) || (curLang()==='en' ? 'Runner' : 'Loper');
  $('zrTombstoneName').textContent = name;
  $('zrTombstoneDate').textContent = new Date().toLocaleDateString(curLang()==='en' ? 'en-GB' : 'nl-BE', { day:'numeric', month:'long', year:'numeric' });
  $('zrTombstoneEpitaph').textContent = curLang()==='en'
    ? `With sadness we say goodbye to ${name}... consumed by the horde.`
    : `Met droefheid nemen we afscheid van ${name}... verzwolgen door de horde.`;
  const km = (rsState.distanceM/1000).toFixed(2);
  const nipperLine = isFinite(z.bestMarginKmh) ? `<div><span>${curLang()==='en'?'Closest call':'Op het nippertje'}</span><b>${z.bestMarginKmh.toFixed(1)} ${zrKmhUnit()}</b></div>` : '';
  $('zrTombstoneStats').innerHTML = curLang()==='en'
    ? `<div><span>Distance</span><b>${km} km</b></div><div><span>Score</span><b>${z.score}</b></div><div><span>Bonus earned</span><b>${(z.totalBonusEarned||0).toFixed(1)}</b></div><div><span>Escaped</span><b>${z.escapedCount}×</b></div><div><span>Caught</span><b>${z.caughtCount}×</b></div>${nipperLine}<div><span>Storyline</span><b>#${z.storyline}</b></div>`
    : `<div><span>Afstand</span><b>${km} km</b></div><div><span>Score</span><b>${z.score}</b></div><div><span>Bonus verdiend</span><b>${(z.totalBonusEarned||0).toFixed(1)}</b></div><div><span>Ontsnapt</span><b>${z.escapedCount}×</b></div><div><span>Gepakt</span><b>${z.caughtCount}×</b></div>${nipperLine}<div><span>Verhaallijn</span><b>#${z.storyline}</b></div>`;
  openModal('zombieTombstoneModal');
}

function advanceZombieStory(){
  playZombieStoryPart();
}

function updateZombieBanner(){
  if (!rsState || !rsState.zombie) return;
  const z = rsState.zombie;
  const label = $('rsIntervalLabel');
  if (!label) return;
  const hearts = '❤️'.repeat(Math.max(0, z.lives)) + '🖤'.repeat(Math.max(0, z.livesStart - z.lives));
  if (z.finished){
    label.textContent = curLang()==='en' ? `💀 Caught · Score ${z.score}` : `💀 Ingehaald · Score ${z.score}`;
  } else if (z.phase === 'chase'){
    const secLeft = Math.max(0, Math.ceil((z.chaseEndAt - Date.now())/1000));
    label.textContent = curLang()==='en' ? `🧟 RUN! ${secLeft}s · min. ${z.currentThresholdKmh} km/h · ${hearts}` : `🧟 RENNEN! ${secLeft}s · min. ${z.currentThresholdKmh} km/u · ${hearts}`;
    label.className = 'type-run';
  } else if (z.phase === 'alarm'){
    label.textContent = curLang()==='en' ? '🚨 Zombies incoming...' : '🚨 Zombies komen eraan...';
  } else if (z.phase === 'startcue'){
    label.textContent = curLang()==='en' ? '🏃 Run for your life!' : '🏃 Ren voor je leven!';
  } else if (z.phase === 'stopcue'){
    label.textContent = curLang()==='en' ? '😮\u200d💨 Safe... for now' : '😮\u200d💨 Veilig... voorlopig';
  } else if (z.phase === 'intro'){
    label.textContent = curLang()==='en' ? '🧟 Zombie Run starting...' : '🧟 Zombie Run start...';
  } else if (z.phase === 'interlude'){
    const secLeft = Math.max(0, Math.ceil((z.interludeEndAt - Date.now())/1000));
    label.textContent = curLang()==='en' ? `🎧 Running on music · ${secLeft}s` : `🎧 Rustig lopen op muziek · ${secLeft}s`;
  } else {
    label.textContent = curLang()==='en' ? `📖 Story · Score ${z.score} · ${hearts}` : `📖 Verhaal · Score ${z.score} · ${hearts}`;
  }
  updateZombieRadar();
}

function zombieMedalForLives(livesLeft, livesStart){
  if (livesLeft >= livesStart) return { icon:'🥇', label: curLang()==='en' ? 'Gold medal' : 'Gouden medaille' };
  if (livesLeft === livesStart - 1) return { icon:'🥈', label: curLang()==='en' ? 'Silver medal' : 'Zilveren medaille' };
  if (livesLeft === livesStart - 2) return { icon:'🥉', label: curLang()==='en' ? 'Bronze medal' : 'Bronzen medaille' };
  return null;
}

async function applyZombieDifficultyPreset(diff){
  zombieSelectedDifficulty = diff;
  document.querySelectorAll('.zr-diff-btn').forEach(btn => {
    const active = btn.dataset.diff === diff;
    btn.style.borderColor = active ? 'var(--amber)' : 'rgba(246,244,238,0.15)';
    btn.style.background = active ? 'rgba(226,161,60,0.15)' : 'rgba(255,255,255,0.04)';
  });
  const p = ZOMBIE_DIFFICULTY_PRESETS[diff];
  $('zombieLivesInput').value = p.lives; $('zombieLivesVal').textContent = p.lives;
  $('zombieChaseMinInput').value = p.chaseMin; $('zombieChaseMaxInput').value = p.chaseMax; renderZombieChaseSlider();
  $('zombieInterludeMinInput').value = p.interludeMin; $('zombieInterludeMaxInput').value = p.interludeMax; renderZombieInterludeSlider();
  const avgSpeed = await estimateZombieBaseSpeedKmh();
  const speed = Math.round(avgSpeed * p.speedFactor * 10) / 10;
  $('zombieBaseSpeedInput').value = speed; $('zombieBaseSpeedVal').textContent = speed.toFixed(1) + ' ' + zrKmhUnit();
}

async function openZombieSetupModal(){
  openModal('zombieSetupModal');
  $('zombieCycleStatus').textContent = curLang()==='en' ? 'Checking files…' : 'Bestanden zoeken…';
  $('zombieCycleStatus').textContent = await zombieStorylineStatusText();
  // Basissnelheid vooraf invullen met je eigen historische gemiddelde — blijft een vrij aanpasbare slider.
  const avgSpeed = await estimateZombieBaseSpeedKmh();
  $('zombieBaseSpeedInput').value = avgSpeed;
  $('zombieBaseSpeedVal').textContent = avgSpeed.toFixed(1) + ' ' + zrKmhUnit();
  $('zombieBaseSpeedNote').textContent = curLang()==='en'
    ? `Based on your average pace from past runs (${avgSpeed.toFixed(1)} km/h) — feel free to adjust.`
    : `Gebaseerd op jouw gemiddelde tempo uit vorige runs (${avgSpeed.toFixed(1)} km/u) — pas gerust aan.`;
  // Overige eenheid-labels ook meteen verversen (anders blijven ze op hun HTML-standaardwaarde staan
  // tot de gebruiker de betreffende slider zelf een keer beweegt).
  $('zombieRampVal').textContent = '+' + parseFloat($('zombieRampInput').value).toFixed(1) + ' ' + zrKmhUnit();
  renderZombieChaseSlider();
  renderZombieInterludeSlider();
  await applyZombieDifficultyPreset('normal');
}

