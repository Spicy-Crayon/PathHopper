const TAILWIND_CARD_BG = `[class*="bg-slate-900"]{ background-color:#131b2e !important; }`;


function buildGarminSetupHtml(mode){
  const isFiets = mode === 'fiets';
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KnooppuntenRoute</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
  body { font-family: 'Inter', sans-serif; }
</style>
<style>${TAILWIND_CARD_BG}</style>
</head>
<body class="bg-slate-950 min-h-screen text-slate-100 overflow-x-hidden">
  <div class="w-full min-h-screen p-5 flex flex-col">
    <div class="flex justify-between items-center mb-5">
      <div class="flex items-center gap-3">
        <button id="backBtn" class="w-9 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2a13c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <div>
          <span class="text-[10px] text-slate-400 block uppercase tracking-widest font-black">${isFiets ? 'Knooppuntenroute' : 'Wandelknooppunten'}</span>
          <h1 class="text-lg font-black tracking-tight text-white flex items-center gap-1.5 mt-0.5">
            <span>${isFiets ? '🚴' : '🥾'}</span> ${isFiets ? 'Waar ga je vandaag voor?' : 'Waar wandel jij naartoe?'}
          </h1>
        </div>
      </div>
      ${GARMIN_MENU_BTN_HTML('full')}
    </div>

    ${isFiets ? `
    <div class="mb-6">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">1. Kies je fietstype</span>
      <div class="grid grid-cols-3 gap-2" id="bikeTypeGrid">
        <button data-type="road" class="bt-tile bg-slate-900/60 border-2 border-slate-800 rounded-2xl p-3 text-center transition"><span class="text-2xl block mb-1">🚴</span><span class="text-xs font-bold text-white block">Racefiets</span></button>
        <button data-type="regular" class="bt-tile bg-slate-900/60 border-2 border-slate-800 rounded-2xl p-3 text-center transition"><span class="text-2xl block mb-1">🚲</span><span class="text-xs font-bold text-white block">Stadsfiets</span></button>
        <button data-type="mountain" class="bt-tile bg-slate-900/60 border-2 border-slate-800 rounded-2xl p-3 text-center transition"><span class="text-2xl block mb-1">🚵</span><span class="text-xs font-bold text-white block">Mountainbike</span></button>
      </div>
    </div>
    <div class="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-3.5 mb-6 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <div>
        <div class="text-xs font-bold text-emerald-400">ACTIEF LIVE</div>
        <div class="text-[11px] text-slate-400">Live routelijn & meteen herberekenen onderweg.</div>
      </div>
    </div>` : ''}

    <div class="grid grid-cols-2 gap-3 mb-6">
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
        <div class="flex justify-between items-start"><span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">${isFiets ? 'Het weer nu' : 'Weer & Comfort'}</span><span id="weerIcon" class="text-lg">–</span></div>
        <div class="mt-2">
          <div id="weerTemp" class="text-xl font-black text-white tracking-tight">--°C</div>
          <div id="weerSub" class="text-[10px] text-slate-500 mt-1">Locatie ophalen…</div>
        </div>
      </div>
      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
        <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Deze week</span>
        <div class="mt-2">
          <div id="weekKm" class="text-xl font-black text-amber-400 tracking-tight">-- km</div>
          <div class="text-[9px] text-slate-500 mt-1">Uit je eigen ritgeschiedenis</div>
        </div>
      </div>
    </div>

    ${isFiets ? `
    <div class="space-y-3 mb-6">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Route & Tools</span>
      <button id="loopGenBtn" class="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center">🎲</div>
          <div><div class="font-bold text-xs text-slate-200">Rondrit-generator</div><div class="text-[10px] text-slate-400">Genereer 3 routevoorstellen rond een punt</div></div>
        </div>
        <span class="text-slate-500">→</span>
      </button>
      <button id="gpxImportBtn" class="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center">📂</div>
          <div><div class="font-bold text-xs text-slate-200">Importeer GPX-bestand</div><div class="text-[10px] text-slate-400">Laad routes van Komoot, Garmin of Strava</div></div>
        </div>
        <span class="text-slate-500">→</span>
      </button>
    </div>` : `
    <div class="space-y-3 mb-6">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block">Route &amp; Tools</span>
      <button id="wandelLoopGenBtn" class="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center">🎲</div>
          <div><div class="font-bold text-xs text-slate-200">Wandel-Lus Generator</div><div class="text-[10px] text-slate-400">Genereer 3 wandellussen rond een punt</div></div>
        </div>
        <span class="text-slate-500">→</span>
      </button>
      <button id="wandelNodeListBtn" class="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center">🔢</div>
          <div><div class="font-bold text-xs text-slate-200">Knooppunten-invoer</div><div class="text-[10px] text-slate-400">Typ een reeks nummers, app bouwt de route</div></div>
        </div>
        <span class="text-slate-500">→</span>
      </button>
      <button id="wandelGpxImportBtn" class="w-full bg-slate-900/70 border border-slate-800 rounded-2xl p-3 flex justify-between items-center text-left">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center">📂</div>
          <div><div class="font-bold text-xs text-slate-200">Importeer GPX-bestand</div><div class="text-[10px] text-slate-400">Laad een wandelroute van een site of app</div></div>
        </div>
        <span class="text-slate-500">→</span>
      </button>
    </div>
    <div class="mb-6">
      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Wandel-extra's</span>
      <div class="grid grid-cols-2 gap-3">
        <button id="restPointsTile" class="bg-slate-900/60 border border-sky-500/40 rounded-2xl p-2.5 text-center"><span class="text-xl block mb-0.5">☕</span><span class="text-xs font-bold text-sky-400 block">Rustpunten</span><span class="text-[9px] text-slate-500 block">Echte OSM-data</span></button>
        <button id="natureSpotterTile" class="bg-slate-900/60 border border-teal-500/40 rounded-2xl p-2.5 text-center"><span class="text-xl block mb-0.5">🦉</span><span class="text-xs font-bold text-teal-400 block">Natuurspotter</span><span class="text-[9px] text-slate-500 block">Echte iNaturalist-data</span></button>
        <label for="floraScannerInput" class="bg-slate-900/60 border border-emerald-500/40 rounded-2xl p-2.5 text-center cursor-pointer block relative">
          <span class="text-xl block mb-0.5">📸</span><span class="text-xs font-bold text-emerald-400 block">Flora Scanner</span><span id="floraScannerSub" class="text-[9px] text-slate-500 block">Echte herkenning</span>
          <input type="file" id="floraScannerInput" accept="image/*" capture="environment" class="hidden" style="display:none;">
        </label>
        <button class="stub-tile bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 text-center"><span class="text-xl block mb-0.5">🎧</span><span class="text-xs font-bold text-white block">Audio Gids</span><span class="text-[9px] text-slate-500 block">Binnenkort</span></button>
        <label for="animalScannerInput" class="col-span-2 bg-slate-900/60 border border-rose-500/40 rounded-2xl p-3 text-center cursor-pointer flex items-center justify-center gap-3 relative">
          <span class="text-2xl">🐾</span>
          <span class="text-left">
            <span class="text-xs font-bold text-rose-400 block">Dieren Scanner</span>
            <span id="animalScannerSub" class="text-[9px] text-slate-500 block">100% lokaal — TensorFlow.js, geen limiet</span>
          </span>
          <input type="file" id="animalScannerInput" accept="image/*" capture="environment" class="hidden" style="display:none;">
        </label>
      </div>
      <div id="restPointsResultGarmin" style="display:none; margin-top:10px; background:rgba(255,255,255,0.06); border:2px solid #38bdf8; border-radius:16px; padding:10px 14px; max-height:220px; overflow-y:auto;"></div>
      <div id="natureSpotterResultGarmin" style="display:none; margin-top:10px; background:rgba(255,255,255,0.06); border:2px solid #2dd4bf; border-radius:16px; padding:10px 14px; max-height:220px; overflow-y:auto;"></div>
      <div id="floraScannerResult" style="display:none; margin-top:10px; background:rgba(255,255,255,0.06); border:2px solid #f59e0b; border-radius:16px; padding:12px 14px;"></div>
      <div id="animalScannerResultGarmin" style="display:none; margin-top:10px; background:rgba(255,255,255,0.06); border:2px solid #fb7185; border-radius:16px; padding:12px 14px;"></div>
    </div>`}

    <div class="mt-auto pt-3">
      <button id="continueBtn" class="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black py-3.5 rounded-2xl text-center shadow-xl tracking-wider text-xs uppercase">
        🗺️ Open kaart & plan route
      </button>
    </div>
  </div>

  <script>
    let selectedType = ${isFiets ? "'road'" : "null"};
    const backBtn = document.getElementById('backBtn');
    backBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'back' }, '*'));
${GARMIN_MENU_BTN_JS}

    document.querySelectorAll('.bt-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        selectedType = tile.dataset.type;
        document.querySelectorAll('.bt-tile').forEach(t => { t.classList.remove('border-amber-500'); t.classList.add('border-slate-800'); });
        tile.classList.remove('border-slate-800'); tile.classList.add('border-amber-500');
        parent.postMessage({ source:'garminSetup', action:'biketype', type:selectedType }, '*');
      });
    });
    document.querySelectorAll('.stub-tile').forEach(tile => {
      tile.addEventListener('click', () => alert('Deze functie is nog in opbouw.'));
    });
    const floraScannerInput = document.getElementById('floraScannerInput');
    if (floraScannerInput){
      floraScannerInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        parent.postMessage({ source:'garminSetup', action:'identifyplant', file }, '*');
      });
    }
    const animalScannerInput = document.getElementById('animalScannerInput');
    if (animalScannerInput){
      animalScannerInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const resultEl = document.getElementById('animalScannerResultGarmin');
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<div class="text-xs text-slate-300">Herkenningsmodel laden…</div>';
        parent.postMessage({ source:'garminSetup', action:'identifyanimal', file }, '*');
      });
    }
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.source !== 'garminAnimalResult') return;
      const resultEl = document.getElementById('animalScannerResultGarmin');
      if (!resultEl) return;
      resultEl.style.display = 'block';
      if (d.status === 'error'){
        resultEl.innerHTML = '<div class="text-xs text-slate-300">' + d.message + '</div>';
      } else if (d.status === 'ok'){
        const displayName = d.dutchName || d.sciName || d.mobileLabel;
        const alts = (d.alternatives || []).filter(a => a.dutchName || a.sciName);
        const altsHtml = alts.length ? '<div class="mt-2 pt-2 border-t border-slate-700/60"><div class="text-[9px] text-slate-500 mb-1">Klopt dit niet? Andere gokken:</div><div class="flex flex-wrap gap-1.5">' +
          alts.map((a,i) => '<button class="animalAltBtnG text-[10px] font-bold border border-rose-500/40 bg-rose-500/10 text-rose-300 rounded-lg px-2 py-1" data-idx="' + i + '">' + (a.dutchName || a.sciName) + ' (' + a.pct + '%)</button>').join('') +
          '</div></div>' : '';
        resultEl.innerHTML =
          '<div class="flex items-center gap-2 mb-1"><span class="text-xl">🐾</span><div>' +
          '<div class="text-sm font-bold text-white">' + displayName + '</div>' +
          (d.sciName ? '<div class="text-[11px] text-slate-400 italic">' + d.sciName + (d.family ? ' · ' + d.family : '') + '</div>' : '<div class="text-[10px] text-slate-500">(gok van het model)</div>') +
          (d.sourceNote ? '<div class="text-[10px] text-slate-500 mt-0.5">' + d.sourceNote + '</div>' : '') +
          '</div></div>' +
          '<div class="flex items-center justify-between">' +
          '<span class="text-[11px] font-bold text-rose-400">' + d.pct + '% zekerheid</span>' +
          '<button id="animalScannerWikiBtnG" class="text-[11px] font-bold text-rose-400 underline">📖 Meer info</button></div>' +
          altsHtml;
        const wikiBtn = document.getElementById('animalScannerWikiBtnG');
        if (wikiBtn) wikiBtn.addEventListener('click', () => {
          parent.postMessage({ source:'garminSetup', action:'openwiki', sciName:d.sciName || d.mobileLabel, commonName:d.dutchName || d.mobileLabel }, '*');
        });
        resultEl.querySelectorAll('.animalAltBtnG').forEach(btn => {
          btn.addEventListener('click', () => {
            const a = alts[Number(btn.dataset.idx)];
            parent.postMessage({ source:'garminSetup', action:'openwiki', sciName:a.sciName || a.mobileLabel, commonName:a.dutchName || a.mobileLabel }, '*');
          });
        });
      }
    });
    const restPointsTile = document.getElementById('restPointsTile');
    if (restPointsTile){
      restPointsTile.addEventListener('click', () => {
        const resultEl = document.getElementById('restPointsResultGarmin');
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<div class="text-xs text-slate-300 py-1">Bezig met zoeken…</div>';
        parent.postMessage({ source:'garminSetup', action:'findrestpoints' }, '*');
      });
    }
    const natureSpotterTile = document.getElementById('natureSpotterTile');
    if (natureSpotterTile){
      natureSpotterTile.addEventListener('click', () => {
        const resultEl = document.getElementById('natureSpotterResultGarmin');
        resultEl.style.display = 'block';
        resultEl.innerHTML = '<div class="text-xs text-slate-300 py-1">Bezig met zoeken…</div>';
        parent.postMessage({ source:'garminSetup', action:'findobservations' }, '*');
      });
    }
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (d && d.source === 'garminObservationsResult'){
        const resultEl = document.getElementById('natureSpotterResultGarmin');
        if (!resultEl) return;
        resultEl.style.display = 'block';
        if (d.status === 'error'){
          resultEl.innerHTML = '<div class="text-xs text-slate-300 py-1">' + d.message + '</div>';
        } else if (d.status === 'ok'){
          resultEl.innerHTML = d.items.map((o,i) =>
            '<div class="obs-row-g flex items-center gap-2 py-1.5 border-b border-slate-800/60 cursor-pointer" data-idx="' + i + '">' +
            (o.photoUrl
              ? '<img src="' + o.photoUrl + '" class="w-8 h-8 rounded-lg object-cover flex-shrink-0" loading="lazy">'
              : '<span class="text-base w-8 text-center flex-shrink-0">' + o.emoji + '</span>') +
            '<div class="flex-1 min-w-0"><div class="text-xs font-bold text-white truncate">' + o.emoji + ' ' + o.commonName + '</div>' +
            '<div class="text-[10px] text-slate-500 italic truncate">' + o.sciName + '</div></div>' +
            '<span class="text-sm text-amber-400 flex-shrink-0">📖</span></div>'
          ).join('') + '<div class="text-[9px] text-slate-600 mt-2 text-center">Data: iNaturalist.org (CC BY-NC)</div>';
          resultEl.querySelectorAll('.obs-row-g').forEach(row => {
            const item = d.items[Number(row.dataset.idx)];
            row.addEventListener('click', () => {
              parent.postMessage({ source:'garminSetup', action:'openwiki', sciName:item.sciName, commonName:item.commonName }, '*');
            });
          });
        }
      }
    });
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (d && d.source === 'garminRestPointsResult'){
        const resultEl = document.getElementById('restPointsResultGarmin');
        if (!resultEl) return;
        resultEl.style.display = 'block';
        if (d.status === 'error'){
          resultEl.innerHTML = '<div class="text-xs text-slate-300 py-1">' + d.message + '</div>';
        } else if (d.status === 'ok'){
          resultEl.innerHTML = d.points.map((p,i) =>
            '<div class="rest-row-g flex items-center gap-2 py-1.5 border-b border-slate-800/60 cursor-pointer" data-idx="' + i + '">' +
            '<span class="text-base">' + p.emoji + '</span>' +
            '<div class="flex-1 min-w-0"><div class="text-xs font-bold text-white truncate">' + p.name + '</div>' +
            '<div class="text-[10px] text-slate-500">' + p.typeLabel + '</div></div>' +
            '<div class="text-[11px] font-bold text-sky-400 flex-shrink-0 text-right">' + p.distanceM + ' m<br><span class="font-normal underline">bekijk</span></div></div>'
          ).join('');
          resultEl.querySelectorAll('.rest-row-g').forEach(row => {
            const point = d.points[Number(row.dataset.idx)];
            row.addEventListener('click', () => {
              parent.postMessage({ source:'garminSetup', action:'showrestpoint', point }, '*');
            });
          });
        }
      }
    });
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.source !== 'garminPlantResult') return;
      const resultEl = document.getElementById('floraScannerResult');
      if (!resultEl) return;
      resultEl.style.display = 'block';
      if (d.status === 'loading'){
        resultEl.innerHTML = '<div class="text-xs text-slate-300">Bezig met herkennen…</div>';
      } else if (d.status === 'error'){
        resultEl.innerHTML = '<div class="text-xs text-slate-300">' + d.message + '</div>';
      } else if (d.status === 'ok'){
        const alts = (d.alternatives || []).filter(a => a.commonName || a.sciName);
        const altsHtml = alts.length ? '<div class="mt-2 pt-2 border-t border-slate-700/60"><div class="text-[9px] text-slate-500 mb-1">Klopt dit niet? Andere gokken:</div><div class="flex flex-wrap gap-1.5">' +
          alts.map((a,i) => '<button class="plantAltBtnG text-[10px] font-bold border border-amber-500/40 bg-amber-500/10 text-amber-300 rounded-lg px-2 py-1" data-idx="' + i + '">' + (a.commonName || a.sciName) + ' (' + a.pct + '%)</button>').join('') +
          '</div></div>' : '';
        resultEl.innerHTML =
          '<div class="flex items-center gap-2 mb-1"><span class="text-xl">🌿</span><div>' +
          '<div class="text-sm font-bold text-white">' + (d.commonName || d.sciName) + '</div>' +
          (d.sciName ? '<div class="text-[11px] text-slate-400 italic">' + d.sciName + '</div>' : '') +
          (d.fallbackNote ? '<div class="text-[10px] text-slate-500 mt-0.5">' + d.fallbackNote + '</div>' : '') +
          '</div></div>' +
          '<div class="flex items-center justify-between">' +
          '<span class="text-[11px] font-bold text-amber-400">' + d.pct + '% ' + d.matchLabel + '</span>' +
          '<button id="floraScannerWikiBtn" class="text-[11px] font-bold text-amber-400 underline">📖 Meer info</button></div>' +
          altsHtml;
        const wikiBtn = document.getElementById('floraScannerWikiBtn');
        if (wikiBtn) wikiBtn.addEventListener('click', () => {
          parent.postMessage({ source:'garminSetup', action:'openwiki', sciName:d.sciName || d.commonName, commonName:d.commonName }, '*');
        });
        resultEl.querySelectorAll('.plantAltBtnG').forEach(btn => {
          btn.addEventListener('click', () => {
            const a = alts[Number(btn.dataset.idx)];
            parent.postMessage({ source:'garminSetup', action:'openwiki', sciName:a.sciName || a.commonName, commonName:a.commonName }, '*');
          });
        });
      }
    });

    const loopGenBtn = document.getElementById('loopGenBtn');
    if (loopGenBtn) loopGenBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'loopgen' }, '*'));
    const gpxImportBtn = document.getElementById('gpxImportBtn');
    if (gpxImportBtn) gpxImportBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'gpximport' }, '*'));
    const wandelLoopGenBtn = document.getElementById('wandelLoopGenBtn');
    if (wandelLoopGenBtn) wandelLoopGenBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'loopgen' }, '*'));
    const wandelNodeListBtn = document.getElementById('wandelNodeListBtn');
    if (wandelNodeListBtn) wandelNodeListBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'nodelist' }, '*'));
    const wandelGpxImportBtn = document.getElementById('wandelGpxImportBtn');
    if (wandelGpxImportBtn) wandelGpxImportBtn.addEventListener('click', () => parent.postMessage({ source:'garminSetup', action:'gpximport' }, '*'));

    document.getElementById('continueBtn').addEventListener('click', () => {
      if (selectedType) parent.postMessage({ source:'garminSetup', action:'biketype', type:selectedType }, '*');
      parent.postMessage({ source:'garminSetup', action:'continue' }, '*');
    });

    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.source !== 'garminSetupData') return;
      if (d.weerError){
        document.getElementById('weerSub').textContent = d.weerError;
      } else if (d.temp != null){
        document.getElementById('weerTemp').textContent = d.temp + '°C';
        document.getElementById('weerIcon').textContent = d.icon || '';
        document.getElementById('weerSub').textContent = d.conditionText || '';
      }
      if (d.weekKm != null){
        document.getElementById('weekKm').textContent = d.weekKm + ' km';
      }
    });
  <\/script>
</body>
</html>`;
}

function solarElevationDeg(latDeg, hourLocal, dayOfYear){
  // Standaard sterrenkundige formule (declinatie + uurhoek) — negeert de "tijdsvereffening" (enkele
  // minuten effect), prima nauwkeurig genoeg voor een visuele dagcurve, geen verzonnen/geschatte cijfers.
  const decl = 23.44 * Math.sin(Math.PI/180 * (360/365) * (284 + dayOfYear));
  const hourAngle = 15 * (hourLocal - 12);
  const latRad = latDeg * Math.PI/180, declRad = decl * Math.PI/180, haRad = hourAngle * Math.PI/180;
  const sinElev = Math.sin(latRad)*Math.sin(declRad) + Math.cos(latRad)*Math.cos(declRad)*Math.cos(haRad);
  return Math.asin(Math.max(-1, Math.min(1, sinElev))) * 180/Math.PI;
}

async function fetchGarminWeerData(forceLocation){
  const frame = $('garminWeerFrame');
  const post = (payload) => { if (frame && frame.contentWindow) frame.contentWindow.postMessage(Object.assign({ source:'garminWeerData' }, payload), '*'); };
  if (!navigator.geolocation){
    post({ error: curLang()==='en' ? 'No GPS available' : 'Geen GPS beschikbaar' });
    return;
  }
  getBestKnownPosition().then(async (pos) => {
    if (!pos){ post({ error: curLang()==='en' ? 'Location unavailable' : 'Locatie niet beschikbaar' }); return; }
    try{
      weatherLocationOverride = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      const data = await loadWeatherAndSun();
      if (!data){ post({ error: curLang()==='en' ? 'Weather unavailable' : 'Weer niet beschikbaar' }); return; }
      const placeName = await fetchPlaceName(weatherLocationOverride.lat, weatherLocationOverride.lng);
      const cardinals = cardinalsForLang();
      const windDirLabel = data.windDir != null ? cardinals[Math.round(data.windDir / 22.5) % 16] : '–';
      const now = new Date();
      const dayOfYear = Math.floor((now - new Date(now.getFullYear(),0,0)) / 86400000);
      const sunCurve = [];
      for (let h = 0; h <= 24; h += 0.5) sunCurve.push({ h, elev: solarElevationDeg(weatherLocationOverride.lat, h, dayOfYear) });
      post({
        temp:data.temp, tempMax:data.tempMax, tempMin:data.tempMin, feelsLike:data.feelsLike,
        humidity:data.humidity, windSpeed:data.windSpeed, windDir:data.windDir, windDirLabel,
        uvIndex:data.uvIndex, pressure:data.pressure, pressureTrend:data.pressureTrend,
        aqi:data.aqi, pollen:data.pollen,
        conditionText: weatherConditionText()[data.code] || '–',
        icon: WEATHER_ICONS[data.code] || '🌡️',
        weatherSourceNote: data.weatherSourceNote || '',
        rainSourceNote: data.rainSourceNote || '',
        sunriseText:data.sunriseText, sunsetText:data.sunsetText, sunriseMin:data.sunriseMin, sunsetMin:data.sunsetMin,
        sunCurve, nowHour: now.getHours() + now.getMinutes()/60,
        lat: weatherLocationOverride.lat, lng: weatherLocationOverride.lng,
        hourly: (data.hourly||[]).map(h => ({ hourLabel: h.hour === now.getHours() ? (curLang()==='en'?'Now':'Nu') : (String(h.hour).padStart(2,'0') + (curLang()==='en'?'h':'u')), temp:h.temp, icon: WEATHER_ICONS[h.code] || '🌡️' })),
        daily: (data.daily||[]).map(d => ({ dayLabel: d.date.toDateString()===now.toDateString() ? (curLang()==='en'?'Today':'Vandaag') : d.date.toLocaleDateString(curLang()==='en'?'en-GB':'nl-BE', { weekday:'short' }), max:d.max, min:d.min, icon: WEATHER_ICONS[d.code] || '🌡️' })),
        placeName: placeName || (curLang()==='en' ? 'Unknown location' : 'Locatie onbekend'),
        // Neerslag-tijdlijn (radar + model) — zelfde grafiek als de Standaard-weerpagina, hier als kant-en-klare
        // SVG-string meegestuurd zodat de iframe 'm gewoon kan tonen zonder de berekening te moeten overdoen.
        precipTimelineSvg: buildPrecipTimelineSvgString(data.precipTimeline, 0, data.radarTimelineEndsAt),
        precipLegendRadar: curLang()==='en' ? 'radar (certain)' : 'radar (zeker)',
        precipLegendModel: curLang()==='en' ? 'model (further ahead)' : 'model (verder vooruit)',
        updatedLabel: (curLang()==='en' ? 'Updated ' : 'Bijgewerkt ') + now.toLocaleTimeString(curLang()==='en'?'en-GB':'nl-BE', { hour:'2-digit', minute:'2-digit' })
      });
    } catch(e){
      post({ error: curLang()==='en' ? 'Weather unavailable' : 'Weer niet beschikbaar' });
    }
  });
}

function buildGarminKompasHtml(){
  // Gemini's Compas.html, ongewijzigd qua opbouw/animatie/stijl. Enige aanpassingen:
  // (1) "‹ terug" stuurt een postMessage naar de echte app i.p.v. history.back(),
  // (2) sensor-start: op Android start dit automatisch (geen permissie nodig), op iOS blijft de
  //     tik-knop nodig omdat Apple DeviceOrientationEvent.requestPermission() enkel na een
  //     gebruikersactie toestaat — dat is een platformbeperking, geen keuze.
  return `<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kompas - Fietsapp</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>
        * {
            user-select: none;
        }

        @keyframes floatingCompass {
            0% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-2px) rotate(0.6deg); }
            50% { transform: translateY(1.5px) rotate(-0.5deg); }
            75% { transform: translateY(-1px) rotate(-0.3deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }

        .water-float {
            animation: floatingCompass 4.5s ease-in-out infinite;
        }

        .compass-dial {
            width: 220px;
            height: 220px;
            border-radius: 50%;
            position: absolute;
            transition: transform 0.05s linear;
        }

        .deg-marker {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            text-align: center;
        }

        .deg-marker span {
            position: absolute;
            top: 22px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            font-weight: 500;
            color: #8fa0ad;
        }

        .deg-marker::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 1.5px;
            height: 14px;
            background-color: #64748b;
        }

        .sub-marker {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .sub-marker::before {
            content: '';
            position: absolute;
            top: 4px;
            left: 50%;
            transform: translateX(-50%);
            width: 1px;
            height: 8px;
            background-color: #475569;
        }

        .indicator-dot {
            position: absolute;
            width: 12px;
            height: 12px;
            background: radial-gradient(circle, #ffaa33 0%, #ff5500 70%, #cc3300 100%);
            border-radius: 50%;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 0 10px rgba(255, 119, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.4);
            z-index: 4;
        }

        .inner-core {
            width: 120px;
            height: 120px;
            background:
                radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.12) 0%, transparent 60%),
                linear-gradient(135deg, #1b2633 0%, #0e1621 100%);
            border-radius: 50%;
            box-shadow:
                0 10px 25px rgba(0,0,0,0.8),
                inset 0 2px 4px rgba(255,255,255,0.15),
                inset 0 -4px 8px rgba(0,0,0,0.9),
                inset 0 0 0 5px rgba(255, 255, 255, 0.12);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10;
        }
    </style>
<style>${TAILWIND_CARD_BG}</style>
</head>
<body class="bg-[#050914] text-slate-100 min-h-screen font-sans">

  <div class="w-full min-h-screen p-5 flex flex-col h-screen overflow-hidden">

    <div class="flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <button id="backBtn" class="w-9 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2a13c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <div>
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Navigatie</span>
          <h1 class="text-lg font-bold text-white leading-none">Kompas</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${GARMIN_MENU_BTN_HTML('mini')}
        <div class="w-9 h-9 bg-[#17242d] rounded-xl flex items-center justify-center text-amber-400 border border-slate-700/50">
          🧭
        </div>
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center relative cursor-grab active:cursor-grabbing pt-2 min-h-0" id="compassContainer">
      <div class="water-float w-[min(78vw,270px)] h-[min(78vw,270px)] bg-gradient-to-br from-[#0a1324] via-[#0d182e] to-[#080d1a] rounded-full shadow-[0_20px_45px_rgba(0,0,0,0.7)] border border-slate-800/80 flex items-center justify-center relative overflow-hidden">

        <div class="absolute top-2 text-red-500 font-bold text-sm z-20">N</div>
        <div class="absolute bottom-2 text-slate-500 font-semibold text-sm z-20">S</div>
        <div class="absolute right-2.5 text-slate-500 font-semibold text-sm z-20">E</div>
        <div class="absolute left-2.5 text-slate-500 font-semibold text-sm z-20">W</div>

        <div class="compass-dial" id="compassDial">
          <div class="indicator-dot"></div>
        </div>

        <div class="inner-core">
          <div class="text-2xl font-extrabold text-white tracking-tight flex items-start" id="degreeText">
            –<span class="text-xs font-bold ml-0.5">°</span>
          </div>
          <div class="text-xs font-semibold text-slate-400 tracking-widest mt-0.5" id="dirText">–</div>
        </div>

      </div>
    </div>

    <div class="bg-[#17242d] rounded-2xl p-3 border border-slate-800/80 text-center text-xs text-slate-400 flex flex-col gap-2 flex-shrink-0 mb-2">
      <span id="statusText">Bezig met starten…</span>
      <button id="sensorBtn" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-xl transition-all shadow-md" style="display:none;">
        Activeer Kompas Sensoren
      </button>
    </div>

  </div>

  <script>
    const dial = document.getElementById('compassDial');
    const container = document.getElementById('compassContainer');
    const degreeText = document.getElementById('degreeText');
    const dirText = document.getElementById('dirText');
    const statusText = document.getElementById('statusText');
    const sensorBtn = document.getElementById('sensorBtn');
    const backBtn = document.getElementById('backBtn');

    let currentAngle = 0;
    let useHardwareSensor = false;

    backBtn.addEventListener('click', () => parent.postMessage({ source:'garminKompas', action:'back' }, '*'));
${GARMIN_MENU_BTN_JS}

    for (let i = 0; i < 360; i += 10) {
        if (i % 30 === 0) {
            const marker = document.createElement('div');
            marker.className = 'deg-marker';
            marker.style.transform = \`rotate(\${i}deg)\`;
            marker.innerHTML = \`<span>\${i === 0 ? '0' : i}.</span>\`;
            dial.appendChild(marker);
        } else {
            const subMarker = document.createElement('div');
            subMarker.className = 'sub-marker';
            subMarker.style.transform = \`rotate(\${i}deg)\`;
            dial.appendChild(subMarker);
        }
    }

    function updateCompass(angle) {
        let normalized = Math.round(angle) % 360;
        if (normalized < 0) normalized += 360;

        dial.style.transform = \`rotate(\${-normalized}deg)\`;
        degreeText.innerHTML = \`\${normalized}<span class="text-xs font-bold ml-0.5">°</span>\`;
        dirText.textContent = getCardinalDirection(normalized);
    }

    function getCardinalDirection(deg) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
        return directions[Math.round(deg / 45)];
    }

    // --- HARDWARE KOMPAS ACTIVATIE ---
    // Android/Chrome: geen permissie-stap nodig -> start meteen vanzelf zodra dit scherm opent.
    // iOS/Safari: DeviceOrientationEvent.requestPermission() bestaat enkel daar en werkt enkel
    // na een echte tik van de gebruiker -> knop blijft daar nodig, kan niet automatisch.
    const isIOSPermissionFlow = (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function');

    function requestSensorAccess() {
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            statusText.textContent = "Fout: Sensoren vereisen een beveiligde HTTPS-verbinding!";
            statusText.classList.add('text-rose-400');
            return;
        }
        if (isIOSPermissionFlow) {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        startListening();
                    } else {
                        statusText.textContent = "Toegang tot sensoren geweigerd.";
                    }
                })
                .catch(err => {
                    statusText.textContent = "Fout bij aanvragen permissie: " + err;
                });
        } else {
            startListening();
        }
    }
    sensorBtn.addEventListener('click', requestSensorAccess);

    function startListening() {
        window.addEventListener('deviceorientation', handleOrientation, true);
        statusText.textContent = "Kompas zoekt naar magnetisch noorden…";
        sensorBtn.style.display = 'none';
    }

    function handleOrientation(event) {
        let heading = null;

        if (event.webkitCompassHeading !== undefined) {
            heading = event.webkitCompassHeading;
        }
        else if (event.absolute && event.alpha !== null) {
            heading = 360 - event.alpha;
        }
        else if (event.alpha !== null) {
            heading = 360 - event.alpha;
        }

        if (heading !== null) {
            useHardwareSensor = true;
            currentAngle = heading;
            updateCompass(currentAngle);
            statusText.textContent = "Live GPS/Hardware Kompas Actief";
            statusText.classList.remove('text-rose-400');
            statusText.classList.add('text-emerald-400');
        } else {
            statusText.textContent = "Geen kompasdata beschikbaar op dit apparaat.";
        }
    }

    if (!window.DeviceOrientationEvent) {
        statusText.textContent = "Je browser ondersteunt geen bewegingssensoren.";
        sensorBtn.style.display = 'none';
    } else if (isIOSPermissionFlow) {
        statusText.textContent = "Tik op de knop om het kompas te starten";
        sensorBtn.style.display = 'inline-block';
    } else {
        // Android: geen knop nodig, meteen starten.
        startListening();
    }

    // --- PC / MUIS / TOUCH FALLBACK (enkel als hardwaresensor niet actief is) ---
    let isDragging = false;
    let startAngle = 0;

    function getAngle(e) {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    }

    container.addEventListener('mousedown', (e) => {
        if (useHardwareSensor) return;
        isDragging = true;
        startAngle = getAngle(e) - currentAngle;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging || useHardwareSensor) return;
        currentAngle = getAngle(e) - startAngle;
        updateCompass(currentAngle);
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('touchstart', (e) => {
        if (useHardwareSensor) return;
        isDragging = true;
        startAngle = getAngle(e) - currentAngle;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || useHardwareSensor) return;
        currentAngle = getAngle(e) - startAngle;
        updateCompass(currentAngle);
    });

    window.addEventListener('touchend', () => { isDragging = false; });

    updateCompass(currentAngle);
  <\/script>
</body>
</html>`;
}

function buildGarminWeerHtml(){
  // Gemini's weer.html-lay-out. Radar en zonnestand-grafiek gebruiken nu echte databronnen
  // (RainViewer publieke API, resp. een standaard sterrenkundige berekening) i.p.v. de eerdere
  // "nog niet gekoppeld"-melding.
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uitgebreid Weerbericht - Meteo</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>
  <style>
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.6); border-radius: 8px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 8px; }
    .range-bar-container { position: relative; height: 8px; width: 100%; margin: 4px 0; }
    .range-bar { height: 100%; border-radius: 4px; width: 100%; }
    .range-indicator {
      position: absolute; top: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px;
      background-color: #ffffff; border: 2px solid #000000; border-radius: 50%;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4); transition: left 0.3s ease;
    }
    .uv-gradient { background: linear-gradient(to right, #4CAF50, #FFEB3B, #FF9800, #F44336, #9C27B0); }
    .pressure-gradient { background: linear-gradient(to right, #2196F3, #80DEEA, #FFC107, #FF5722); }
    .aqi-gradient { background: linear-gradient(to right, #4CAF50, #8BC34A, #FFEB3B, #FF9800, #E91E63); }
    @keyframes floatGentle { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
    .animate-bear-body { animation: floatGentle 4s ease-in-out infinite; }
    @keyframes softRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-soft-spin { animation: softRotate 30s linear infinite; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
<style>${TAILWIND_CARD_BG}</style>
</head>
<body class="bg-[#050914] text-slate-100 min-h-screen font-sans">

  <div class="w-full min-h-screen p-5 flex flex-col h-screen overflow-hidden space-y-3">

    <div class="flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-3">
        <button id="backBtn" class="w-9 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2a13c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <div>
          <span class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Meteo</span>
          <h1 class="text-lg font-bold text-white leading-none">Weer Dashboard</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${GARMIN_MENU_BTN_HTML('mini')}
        <button id="refreshBtn" title="Weer vernieuwen met je huidige locatie" class="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-300 border border-slate-700/50 transition-all flex items-center gap-1">
          <span>🔄</span> Vernieuwen
        </button>
      </div>
    </div>

    <div class="bg-gradient-to-br from-[#0a1324] via-[#0d182e] to-[#080d1a] rounded-2xl p-4 border border-slate-800/80 relative overflow-hidden flex items-center justify-between min-h-[105px]">
      <div>
        <div class="text-3xl font-extrabold text-white tracking-tight" id="main-temp-display">--°C</div>
        <div class="text-xs font-medium text-slate-300 mt-0.5" id="main-weather-desc">Data laden...</div>
        <div class="text-[10px] font-semibold text-sky-400 mt-1" id="main-temp-range">▲ --° max • ▼ --° min</div>
        <div class="text-[9px] text-slate-500 mt-1" id="main-weather-source"></div>
      </div>
      <div class="flex flex-col items-center justify-center min-w-[70px]">
        <div id="main-weather-icon-container" class="w-14 h-14 flex items-center justify-center text-5xl">🌡️</div>
        <span id="location-name-display" class="text-[9px] font-extrabold tracking-widest text-slate-300 uppercase mt-1">LADEN...</span>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-1 bg-[#050914] p-1 rounded-2xl border border-slate-800/80 text-[11px] text-center font-medium">
      <button id="tab-radar" class="tab-btn py-2 rounded-xl text-slate-400 hover:text-white transition-all">Radar</button>
      <button id="tab-trend" class="tab-btn py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md transition-all">Trend</button>
      <button id="tab-details" class="tab-btn py-2 rounded-xl text-slate-400 hover:text-white transition-all">Details</button>
      <button id="tab-pollen" class="tab-btn py-2 rounded-xl text-slate-400 hover:text-white transition-all">Pollen</button>
      <button id="tab-advies" class="tab-btn py-2 rounded-xl text-slate-400 hover:text-white transition-all">Advies</button>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto custom-scroll pr-1">

      <div id="content-radar" class="tab-content hidden space-y-3">
        <div id="garminRadarMapWrap" style="position:relative; width:100%; height:260px; border-radius:16px; overflow:hidden; border:1px solid #1e293b;">
          <div id="garminRadarMap" style="width:100%; height:100%; background:#0b1426;"></div>
          <div id="radarTimeLabel" class="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg" style="position:absolute; z-index:500;">Laden…</div>
        </div>
        <p class="text-[10px] text-slate-500 text-center">Neerslagradar via RainViewer — publieke, gratis databron, geen account nodig.</p>
        <div class="bg-[#0b1426] rounded-xl p-3 border border-slate-800/80">
          <svg id="precipTimelineSvgTw" viewBox="0 0 320 90" style="width:100%; height:80px; display:block;"></svg>
          <div class="flex items-center justify-center gap-4 mt-1.5">
            <span class="flex items-center gap-1.5 text-[10px] text-slate-400"><span style="width:8px; height:8px; border-radius:50%; background:#2f9e5c; display:inline-block;"></span><span id="precipLegendRadarTw">radar (zeker)</span></span>
            <span class="flex items-center gap-1.5 text-[10px] text-slate-400"><span style="width:8px; height:8px; border-radius:50%; background:#3b6fd6; display:inline-block;"></span><span id="precipLegendModelTw">model (verder vooruit)</span></span>
          </div>
        </div>
        <div class="bg-[#0b1426] rounded-xl p-3 border border-slate-800/80 text-center">
          <span class="text-[10px] font-bold text-amber-400 block mb-1">🔍 Bronnen vergeleken</span>
          <p id="rainSourceNote" class="text-[11px] text-slate-300">–</p>
        </div>
      </div>

      <div id="content-trend" class="tab-content space-y-4">
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="font-bold tracking-wider text-slate-300 uppercase text-[10px]">Verwachting per uur</span>
            <span class="text-[10px] text-slate-500">Veeg voor meer →</span>
          </div>
          <div id="hourly-forecast-container" class="flex gap-2 overflow-x-auto no-scrollbar pb-1"></div>
        </div>
        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-2">
          <h3 class="text-xs font-bold text-slate-300 flex items-center gap-1.5"><span>☀️</span> Zonnestand vandaag</h3>
          <svg id="sunCurveSvg" viewBox="0 0 300 90" style="width:100%; height:90px;"></svg>
          <div class="flex justify-between text-[10px] text-slate-500">
            <span id="sunCurveRiseLabel">🌅 –:–</span>
            <span id="sunCurveNowLabel" class="text-amber-400 font-bold">–</span>
            <span id="sunCurveSetLabel">🌇 –:–</span>
          </div>
        </div>
        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <h3 class="text-xs font-bold text-slate-300 flex items-center gap-1.5"><span>📅</span> Verwachting voor de komende dagen</h3>
          <div id="daily-forecast-container" class="grid grid-cols-5 gap-1.5 text-center"></div>
        </div>
        <div class="bg-[#0d1e2b] rounded-2xl p-4 border border-teal-900/40 relative overflow-hidden space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div class="space-y-1.5 flex-1">
              <span id="bear-tag" class="px-3 py-1 bg-teal-800/50 text-teal-300 text-[10px] font-bold rounded-full border border-teal-600/40 inline-block">Laden...</span>
              <h2 id="bear-title" class="text-lg font-bold text-white leading-tight">Weerbericht geladen</h2>
              <p id="bear-desc" class="text-xs text-slate-300 leading-relaxed">Even geduld, we halen het actuele weerbericht op.</p>
            </div>
            <div class="relative w-32 h-36 flex flex-col items-center justify-end flex-shrink-0">
              <div id="weather-effect-svg" class="w-14 h-14 mb-1 flex items-center justify-center z-10 text-4xl"></div>
              <div class="w-24 h-24 relative flex items-center justify-center">
                <svg class="w-24 h-24 animate-bear-body relative z-0" viewBox="0 0 100 100">
                  <circle cx="30" cy="35" r="10" fill="#a0683a" /><circle cx="30" cy="35" r="6" fill="#d99b66" />
                  <circle cx="70" cy="35" r="10" fill="#a0683a" /><circle cx="70" cy="35" r="6" fill="#d99b66" />
                  <circle cx="50" cy="50" r="26" fill="#b87843" />
                  <ellipse cx="50" cy="56" rx="12" ry="9" fill="#e6b382" />
                  <ellipse cx="50" cy="52" rx="4" ry="3" fill="#331a00" />
                  <circle cx="41" cy="46" r="2.5" fill="#221100" /><circle cx="59" cy="46" r="2.5" fill="#221100" />
                  <circle cx="36" cy="51" r="3" fill="#f43f5e" opacity="0.4" /><circle cx="64" cy="51" r="3" fill="#f43f5e" opacity="0.4" />
                  <path d="M 32 68 Q 50 78 68 68 Q 72 78 50 82 Q 28 78 32 68 Z" fill="#ff6b00" />
                  <ellipse cx="50" cy="85" rx="22" ry="15" fill="#a0683a" /><ellipse cx="50" cy="86" rx="14" ry="10" fill="#d99b66" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="content-details" class="tab-content hidden space-y-3">
        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-3">
          <h3 class="font-bold text-white text-sm">Stand van de zon</h3>
          <div class="w-full flex justify-between px-4 text-sm font-semibold text-slate-200">
            <span>🌅 <span id="label-sunrise-time">--:--</span></span>
            <span>🌇 <span id="label-sunset-time">--:--</span></span>
          </div>
          <div class="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
            <div class="flex justify-between items-center"><span class="text-slate-400">Lengte van de dag</span><span class="font-bold text-white" id="val-day-length">--u --m</span></div>
            <div class="flex justify-between items-center"><span class="text-slate-400">Resterende daglicht</span><span class="font-bold text-amber-400" id="val-remaining-light">--u --m</span></div>
          </div>
        </div>

        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-2">
          <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">UV-INDEX</span>
          <div class="range-bar-container"><div class="range-bar uv-gradient"></div><div class="range-indicator" id="uv-indicator" style="left: 0%;"></div></div>
          <div class="text-3xl font-extrabold text-white leading-none mt-2" id="uv-value">--</div>
          <div class="text-xs font-medium text-slate-400" id="uv-status">Laden...</div>
        </div>

        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-2">
          <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">LUCHTDRUK</span>
          <div class="range-bar-container"><div class="range-bar pressure-gradient"></div><div class="range-indicator" id="pressure-indicator" style="left: 0%;"></div></div>
          <div class="text-3xl font-extrabold text-white leading-none mt-2"><span id="pressure-value">--</span><span class="text-base font-semibold text-slate-300 ml-1">hPa</span></div>
          <div class="text-xs font-medium text-slate-400" id="pressure-status">Laden...</div>
        </div>

        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-2">
          <span class="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">LUCHTKWALITEIT</span>
          <div class="range-bar-container"><div class="range-bar aqi-gradient"></div><div class="range-indicator" id="aqi-indicator" style="left: 0%;"></div></div>
          <div class="text-3xl font-extrabold text-white leading-none mt-2" id="aqi-value">--</div>
          <div class="text-xs font-medium text-slate-400" id="aqi-status">Laden...</div>
        </div>

        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-3">
          <h3 class="font-bold text-white text-sm">Gedetailleerde Parameters</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-[#050914] p-3 rounded-xl border border-slate-800"><span class="text-[10px] text-slate-400">Luchtvochtigheid</span><p class="text-base font-bold text-white mt-0.5" id="humidity-value">--%</p></div>
            <div class="bg-[#050914] p-3 rounded-xl border border-slate-800"><span class="text-[10px] text-slate-400">Windkracht</span><p class="text-base font-bold text-white mt-0.5" id="wind-value">-- km/u</p></div>
          </div>
          <div class="bg-[#050914] p-3 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-400 block">Windrichting</span>
              <p class="text-lg font-bold text-white mt-0.5" id="wind-dir-text">--</p>
              <span class="text-[10px] text-amber-400 font-mono" id="wind-dir-deg">--°</span>
            </div>
            <div class="relative w-16 h-16 flex items-center justify-center">
              <svg class="w-16 h-16" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="#334155" stroke-width="2" fill="none" />
                <text x="50" y="16" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">N</text>
                <text x="86" y="54" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">O</text>
                <text x="50" y="92" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">Z</text>
                <text x="14" y="54" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle">W</text>
                <g id="wind-compass-needle" transform="translate(50, 50) rotate(0)">
                  <polygon points="0,-28 6,10 0,4 -6,10" fill="#f59e0b" /><circle cx="0" cy="0" r="3" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div id="content-pollen" class="tab-content hidden space-y-3">
        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-3">
          <h3 class="font-bold text-white text-sm">Pollenbericht</h3>
          <div id="pollen-rows" class="space-y-3"></div>
          <p id="pollen-empty" class="text-xs text-slate-500 hidden">Geen pollendata beschikbaar voor deze locatie (dit model dekt enkel Europa).</p>
        </div>
      </div>

      <div id="content-advies" class="tab-content hidden space-y-3">
        <div class="grid grid-cols-2 gap-2">
          <div class="bg-[#0b1426] p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🚴‍♂️</span><h3 class="font-semibold text-white text-xs">Buitenactiviteiten</h3>
            <p id="advice-outdoor" class="text-xs text-emerald-400 mt-1 font-medium">Laden...</p>
          </div>
          <div class="bg-[#0b1426] p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🔭</span><h3 class="font-semibold text-white text-xs">Sterrenkijken</h3>
            <p id="advice-stargazing" class="text-xs text-amber-400 mt-1 font-medium">Laden...</p>
          </div>
          <div class="bg-[#0b1426] p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🥶</span><h3 class="font-semibold text-white text-xs">Koude</h3>
            <p id="advice-cold" class="text-xs text-blue-400 mt-1 font-medium">Laden...</p>
          </div>
          <div class="bg-[#0b1426] p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🦟</span><h3 class="font-semibold text-white text-xs">Muggenactiviteit</h3>
            <p id="advice-mosquito" class="text-xs text-rose-400 mt-1 font-medium">Laden...</p>
          </div>
        </div>
        <div class="bg-[#0b1426] rounded-2xl p-4 border border-slate-800/80 space-y-2 mt-3">
          <h3 class="text-xs font-bold text-white flex items-center gap-1.5"><span>ℹ️</span> Uitgebreid Advies & Toelichting</h3>
          <p id="detailed-advice-text" class="text-xs text-slate-300 leading-relaxed">Actuele adviezen worden berekend op basis van de weersomstandigheden...</p>
        </div>
      </div>

    </div>
  </div>

  <script>
    const backBtn = document.getElementById('backBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    backBtn.addEventListener('click', () => parent.postMessage({ source:'garminWeer', action:'back' }, '*'));
${GARMIN_MENU_BTN_JS}
    refreshBtn.addEventListener('click', () => parent.postMessage({ source:'garminWeer', action:'refresh' }, '*'));

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.id.replace('tab-', '');
        document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('bg-amber-500','text-slate-950','font-bold','shadow-md'); b.classList.add('text-slate-400'); });
        btn.classList.add('bg-amber-500','text-slate-950','font-bold','shadow-md'); btn.classList.remove('text-slate-400');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById('content-' + tab).classList.remove('hidden');
        if (tab === 'radar' && garminRadarMap) setTimeout(() => garminRadarMap.invalidateSize(), 50);
      });
    });

    function clampPct(v, min, max){ return Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100)); }
    function fmtMin(mins){
      if (mins == null) return '--u --m';
      const h = Math.floor(mins/60), m = Math.round(mins%60);
      return h + 'u ' + m + 'm';
    }

    // ---------- Radar: echte publieke RainViewer-tegels, korte animatie door de laatste beelden ----------
    let garminRadarMap = null;
    let garminRadarLayers = [];
    let garminRadarFrames = [];
    let garminRadarIdx = 0;
    let garminRadarTimer = null;
    function initGarminRadarMap(lat, lng){
      if (garminRadarMap) return; // eenmalig initialiseren; nieuwe locatie-fetches passen gewoon de bestaande kaart aan
      garminRadarMap = L.map('garminRadarMap', { zoomControl:false, attributionControl:false }).setView([lat, lng], 7);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', { subdomains:'abcd' }).addTo(garminRadarMap);
      L.circleMarker([lat, lng], { radius:6, color:'#fff', weight:2, fillColor:'#3b82f6', fillOpacity:1 }).addTo(garminRadarMap);
      fetch('https://api.rainviewer.com/public/weather-maps.json')
        .then(r => r.json())
        .then(rv => {
          const past = rv?.radar?.past || [];
          const nowcast = rv?.radar?.nowcast || [];
          const frames = [...past, ...nowcast];
          if (!frames.length){ document.getElementById('radarTimeLabel').textContent = 'Geen recente radardata'; return; }
          garminRadarFrames = frames;
          garminRadarLayers = frames.map(f =>
            L.tileLayer(\`https://tilecache.rainviewer.com\${f.path}/256/{z}/{x}/{y}/4/1_1.png\`, { opacity:0 }).addTo(garminRadarMap)
          );
          garminRadarIdx = past.length > 0 ? past.length - 1 : 0;
          showGarminRadarFrame(garminRadarIdx);
          garminRadarTimer = setInterval(() => {
            garminRadarIdx = (garminRadarIdx + 1) % garminRadarLayers.length;
            showGarminRadarFrame(garminRadarIdx);
          }, 700);
        })
        .catch(() => { document.getElementById('radarTimeLabel').textContent = 'Radar niet beschikbaar'; });
      setTimeout(() => garminRadarMap.invalidateSize(), 200);
    }
    function showGarminRadarFrame(i){
      garminRadarLayers.forEach((layer, idx) => layer.setOpacity(idx === i ? 0.65 : 0));
      const f = garminRadarFrames[i];
      if (!f) return;
      const isForecast = i >= (garminRadarFrames.length - (garminRadarFrames.filter((x,j)=>j>=i && x).length));
      const d2 = new Date(f.time * 1000);
      const timeStr = String(d2.getHours()).padStart(2,'0') + ':' + String(d2.getMinutes()).padStart(2,'0');
      document.getElementById('radarTimeLabel').textContent = timeStr;
    }

    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.source !== 'garminWeerData') return;
      if (d.error){
        document.getElementById('location-name-display').textContent = d.error;
        document.getElementById('main-weather-desc').textContent = d.error;
        return;
      }

      // Hero
      document.getElementById('main-temp-display').textContent = (d.temp ?? '--') + '°C';
      document.getElementById('main-weather-desc').textContent = d.conditionText || '--';
      document.getElementById('main-temp-range').innerHTML = '▲ ' + (d.tempMax ?? '--') + '° max • ▼ ' + (d.tempMin ?? '--') + '° min';
      document.getElementById('main-weather-source').textContent = d.weatherSourceNote || '';
      const rainNoteEl = document.getElementById('rainSourceNote');
      if (rainNoteEl) rainNoteEl.textContent = d.rainSourceNote || '–';
      const precipSvgEl = document.getElementById('precipTimelineSvgTw');
      if (precipSvgEl && d.precipTimelineSvg) precipSvgEl.innerHTML = d.precipTimelineSvg;
      const legendRadarEl = document.getElementById('precipLegendRadarTw');
      if (legendRadarEl && d.precipLegendRadar) legendRadarEl.textContent = d.precipLegendRadar;
      const legendModelEl = document.getElementById('precipLegendModelTw');
      if (legendModelEl && d.precipLegendModel) legendModelEl.textContent = d.precipLegendModel;
      document.getElementById('main-weather-icon-container').textContent = d.icon || '🌡️';
      document.getElementById('location-name-display').textContent = (d.placeName || '').toUpperCase();

      // Uurverwachting
      const hc = document.getElementById('hourly-forecast-container');
      hc.innerHTML = (d.hourly||[]).map(h => \`
        <div class="flex flex-col items-center gap-1 bg-[#0b1426] rounded-xl px-3 py-2 border border-slate-800/80 min-w-[52px]">
          <span class="text-[10px] text-slate-400 font-semibold">\${h.hourLabel}</span>
          <span class="text-lg">\${h.icon}</span>
          <span class="text-xs font-bold text-white">\${h.temp}°</span>
        </div>\`).join('');

      // Dagverwachting
      const dc = document.getElementById('daily-forecast-container');
      dc.innerHTML = (d.daily||[]).slice(0,5).map(day => \`
        <div class="bg-[#050914] rounded-xl p-1.5 border border-slate-800/60">
          <div class="text-[9px] text-slate-400 font-semibold">\${day.dayLabel}</div>
          <div class="text-base my-0.5">\${day.icon}</div>
          <div class="text-[10px] font-bold text-white">\${day.max}°</div>
          <div class="text-[9px] text-slate-500">\${day.min}°</div>
        </div>\`).join('');

      // Weerbericht-kaart
      document.getElementById('bear-tag').textContent = d.conditionText || '--';
      document.getElementById('bear-title').textContent = d.conditionText ? (d.conditionText + '!') : '--';
      document.getElementById('bear-desc').textContent = (d.temp ?? '--') + '°C, gevoelstemperatuur ' + (d.feelsLike ?? '--') + '°C. ' +
        (d.windSpeed != null ? ('Wind uit het ' + (d.windDirLabel||'') + ' aan ' + d.windSpeed + ' km/u.') : '');
      document.getElementById('weather-effect-svg').textContent = d.icon || '';

      // Details: zon
      document.getElementById('label-sunrise-time').textContent = d.sunriseText || '--:--';
      document.getElementById('label-sunset-time').textContent = d.sunsetText || '--:--';
      if (d.sunriseMin != null && d.sunsetMin != null){
        document.getElementById('val-day-length').textContent = fmtMin(d.sunsetMin - d.sunriseMin);
        const now = new Date(); const nowMin = now.getHours()*60 + now.getMinutes();
        document.getElementById('val-remaining-light').textContent = fmtMin(Math.max(0, d.sunsetMin - nowMin));
      }

      // Zonnestand-grafiek: echte berekening (declinatie + uurhoek), meegestuurd vanuit de hoofdpagina
      if (d.sunCurve && d.sunCurve.length){
        const svg = document.getElementById('sunCurveSvg');
        const W = 300, H = 90, pad = 6;
        const elevs = d.sunCurve.map(p => p.elev);
        const maxE = Math.max(...elevs, 5), minE = Math.min(...elevs, -5);
        const range = maxE - minE || 1;
        const xFor = h => pad + (h/24) * (W - pad*2);
        const yFor = e => H - pad - ((e - minE)/range) * (H - pad*2);
        const pathD = d.sunCurve.map((p,i) => (i===0?'M':'L') + xFor(p.h).toFixed(1) + ',' + yFor(p.elev).toFixed(1)).join(' ');
        const horizonY = yFor(0).toFixed(1);
        const nowX = xFor(d.nowHour).toFixed(1);
        // Interpoleer de zonhoogte op "nu" voor de positie van het bolletje op de curve zelf
        let nowElev = 0;
        for (let i=0; i<d.sunCurve.length-1; i++){
          if (d.nowHour >= d.sunCurve[i].h && d.nowHour <= d.sunCurve[i+1].h){
            const t = (d.nowHour - d.sunCurve[i].h) / (d.sunCurve[i+1].h - d.sunCurve[i].h);
            nowElev = d.sunCurve[i].elev + t * (d.sunCurve[i+1].elev - d.sunCurve[i].elev);
            break;
          }
        }
        const nowY = yFor(nowElev).toFixed(1);
        svg.innerHTML = \`
          <line x1="\${pad}" y1="\${horizonY}" x2="\${W-pad}" y2="\${horizonY}" stroke="#334155" stroke-width="1" stroke-dasharray="3,3"/>
          <path d="\${pathD} L \${xFor(24)},\${horizonY} L \${xFor(0)},\${horizonY} Z" fill="url(#sunGrad)" opacity="0.25"/>
          <path d="\${pathD}" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="\${nowX}" cy="\${nowY}" r="5" fill="#fbbf24" stroke="#0b1426" stroke-width="2"/>
          <defs><linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/></linearGradient></defs>
        \`;
        document.getElementById('sunCurveRiseLabel').textContent = '🌅 ' + (d.sunriseText || '–:–');
        document.getElementById('sunCurveSetLabel').textContent = '🌇 ' + (d.sunsetText || '–:–');
        document.getElementById('sunCurveNowLabel').textContent = 'Nu: ' + Math.round(nowElev) + '° boven horizon';
      }

      // Radar: echte RainViewer-tegels, zelfde publieke bron als de Standaard-kaart
      if (d.lat != null && d.lng != null) initGarminRadarMap(d.lat, d.lng);

      // UV
      if (d.uvIndex != null){
        document.getElementById('uv-value').textContent = d.uvIndex;
        document.getElementById('uv-indicator').style.left = clampPct(d.uvIndex, 0, 11) + '%';
        document.getElementById('uv-status').textContent = d.uvIndex < 3 ? 'Laag' : d.uvIndex < 6 ? 'Matig' : d.uvIndex < 8 ? 'Hoog' : d.uvIndex < 11 ? 'Zeer hoog' : 'Extreem';
      }
      // Luchtdruk
      if (d.pressure != null){
        document.getElementById('pressure-value').textContent = d.pressure;
        document.getElementById('pressure-indicator').style.left = clampPct(d.pressure, 970, 1050) + '%';
        const arrow = d.pressureTrend === 'rising' ? '↗️ Stijgend' : d.pressureTrend === 'falling' ? '↘️ Dalend' : '➡️ Stabiel';
        document.getElementById('pressure-status').textContent = arrow;
      }
      // Luchtkwaliteit
      if (d.aqi != null){
        document.getElementById('aqi-value').textContent = d.aqi;
        document.getElementById('aqi-indicator').style.left = clampPct(d.aqi, 0, 100) + '%';
        document.getElementById('aqi-status').textContent = d.aqi < 20 ? 'Goed' : d.aqi < 40 ? 'Redelijk' : d.aqi < 60 ? 'Matig' : d.aqi < 80 ? 'Slecht' : 'Zeer slecht';
      }
      // Extra parameters
      if (d.humidity != null) document.getElementById('humidity-value').textContent = d.humidity + '%';
      if (d.windSpeed != null) document.getElementById('wind-value').textContent = d.windSpeed + ' km/u';
      if (d.windDirLabel){
        document.getElementById('wind-dir-text').textContent = d.windDirLabel;
        document.getElementById('wind-dir-deg').textContent = Math.round(d.windDir) + '°';
        document.getElementById('wind-compass-needle').setAttribute('transform', 'translate(50, 50) rotate(' + d.windDir + ')');
      }

      // Pollen
      const pollenRows = document.getElementById('pollen-rows');
      const pollenEmpty = document.getElementById('pollen-empty');
      if (d.pollen){
        const rows = [
          { label:'Bomen (berk)', v:d.pollen.birch, color:'amber' },
          { label:'Gras', v:d.pollen.grass, color:'emerald' },
          { label:'Kruiden (bijvoet/ambrosia)', v:Math.max(d.pollen.mugwort||0, d.pollen.ragweed||0), color:'emerald' }
        ];
        pollenRows.innerHTML = rows.map(r => {
          const pct = Math.min(100, ((r.v||0)/50)*100);
          const level = (r.v||0) < 10 ? 'Laag' : (r.v||0) < 30 ? 'Matig' : 'Hoog';
          return \`<div>
            <div class="flex justify-between text-[11px] mb-1"><span>\${r.label}</span><span class="text-\${r.color}-400">\${level} (\${r.v ?? 0})</span></div>
            <div class="w-full bg-slate-800 h-1.5 rounded-full"><div class="bg-\${r.color}-500 h-1.5 rounded-full" style="width: \${pct}%"></div></div>
          </div>\`;
        }).join('');
        pollenRows.classList.remove('hidden'); pollenEmpty.classList.add('hidden');
      } else {
        pollenRows.innerHTML = ''; pollenEmpty.classList.remove('hidden');
      }

      // Advies (eenvoudige vuistregels, geen medisch advies)
      if (d.temp != null){
        document.getElementById('advice-outdoor').textContent = (d.windSpeed <= 25 && (d.aqi==null || d.aqi < 60)) ? 'Prima weer om op pad te gaan' : 'Let op wind/luchtkwaliteit';
        document.getElementById('advice-cold').textContent = d.temp < 5 ? 'Kleed je warm aan' : d.temp < 12 ? 'Fris, jasje aanraden' : 'Geen probleem';
        document.getElementById('advice-stargazing').textContent = (d.uvIndex != null && d.icon === '☀️') ? 'Heldere hemel verwacht' : 'Wisselend zicht op de sterren';
        document.getElementById('advice-mosquito').textContent = (d.temp >= 18 && d.humidity >= 60) ? 'Verhoogde kans op muggen' : 'Beperkte muggenactiviteit';
        document.getElementById('detailed-advice-text').textContent =
          'Bij ' + d.temp + '°C en ' + (d.conditionText||'').toLowerCase() + ', wind uit het ' + (d.windDirLabel||'') + ' aan ' + (d.windSpeed??'--') + ' km/u' +
          (d.uvIndex != null ? ', UV-index ' + d.uvIndex : '') + (d.aqi != null ? ', luchtkwaliteit ' + d.aqi : '') + '.';
      }
    });
  <\/script>
</body>
</html>`;
}

function buildGarminHubHtml(){
  // Dit is Gemini's keuzescherm.html, ongewijzigd qua opbouw/stijl — enkel: (1) een derde grote tegel
  // "Hardlopen" toegevoegd, (2) de <a href> vervangen door postMessage-oproepen naar de echte app.
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>KnooppuntenRoute - Keuze</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
  body { font-family: 'Inter', sans-serif; }
  .glass-ribbon {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-left: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    transform: rotate(-15deg) scale(1.4);
  }
</style>
<style>${TAILWIND_CARD_BG}</style>
</head>
<body class="bg-slate-950 min-h-screen flex items-center justify-center p-0 overflow-x-hidden">
  <div class="w-full bg-slate-950 text-slate-100 min-h-screen p-6 flex flex-col justify-between overflow-hidden relative">
    <div class="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 pointer-events-none z-0" style="background-image:url('images/achtergrond-home.jpg');"></div>
    <div class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div class="glass-ribbon absolute top-[-20%] left-[-10%] w-[120%] h-[140%]"></div>
    </div>
    <div class="absolute top-10 right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="absolute bottom-20 left-10 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="absolute right-6 z-20" style="top:calc(1.5rem + env(safe-area-inset-top,0px));">${GARMIN_MENU_BTN_HTML('mini')}</div>

    <div class="relative z-10 w-full flex-1 flex flex-col justify-between">
      <div class="text-center pt-8">
        <h1 class="text-3xl font-black tracking-tight text-white">KnooppuntenRoute</h1>
        <p class="text-xs text-slate-400 mt-2 font-medium">Kies je activiteit en bekijk de omgevingsstatus</p>
      </div>

      <div class="my-auto space-y-4 py-8">
        <button data-action="fiets" class="hub-tile block w-full text-left bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 rounded-3xl p-6 transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden shadow-lg shadow-black/40">
          <div class="absolute -right-4 -bottom-4 text-slate-800/20 text-8xl font-black group-hover:scale-110 transition duration-300">🚴</div>
          <div class="flex items-center space-x-5">
            <div class="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">🚴</div>
            <div class="text-left">
              <h2 class="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition">Ik ga Fietsen</h2>
              <p class="text-xs text-slate-400 mt-0.5 leading-tight">Knooppunten, navigatie, GPX en offline kaarten</p>
            </div>
          </div>
        </button>

        <button data-action="wandel" class="hub-tile block w-full text-left bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 rounded-3xl p-6 transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden shadow-lg shadow-black/40">
          <div class="absolute -right-4 -bottom-4 text-slate-800/20 text-8xl font-black group-hover:scale-110 transition duration-300">🥾</div>
          <div class="flex items-center space-x-5">
            <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-bold rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20">🥾</div>
            <div class="text-left">
              <h2 class="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition">Ik ga Wandelen</h2>
              <p class="text-xs text-slate-400 mt-0.5 leading-tight">Wandelnetwerken, rustige paden en natuurroutes</p>
            </div>
          </div>
        </button>

        <button data-action="hardloop" class="hub-tile block w-full text-left bg-slate-900/60 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/40 rounded-3xl p-6 transition-all duration-300 transform active:scale-[0.98] group relative overflow-hidden shadow-lg shadow-black/40">
          <div class="absolute -right-4 -bottom-4 text-slate-800/20 text-8xl font-black group-hover:scale-110 transition duration-300">🏃</div>
          <div class="flex items-center space-x-5">
            <div class="w-14 h-14 bg-gradient-to-br from-rose-400 to-red-500 text-slate-950 font-bold rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-red-500/20">🏃</div>
            <div class="text-left">
              <h2 class="text-xl font-black tracking-tight text-white group-hover:text-rose-400 transition">Ik ga Hardlopen</h2>
              <p class="text-xs text-slate-400 mt-0.5 leading-tight">AI-coach, opbouwschema's en audio-begeleiding</p>
            </div>
          </div>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-4 pb-4">
        <button data-action="kompas" class="bg-slate-900/50 backdrop-blur-md border border-slate-800/60 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition transform active:scale-95 group text-left">
          <div class="flex justify-between items-start w-full">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Kompas &amp; Sensoren</span>
            <span class="text-slate-500 group-hover:text-white transition">🧭</span>
          </div>
          <div class="mt-4">
            <div id="hubKompasValue" class="text-lg font-black text-white group-hover:text-amber-400 transition flex items-center gap-1.5">Tik voor live kompas</div>
            <span id="hubKompasSub" class="text-[10px] text-slate-500 mt-0.5 block">Sensor start pas na tikken</span>
          </div>
        </button>

        <button data-action="weer" class="bg-slate-900/50 backdrop-blur-md border border-slate-800/60 hover:border-slate-700 p-4 rounded-2xl flex flex-col justify-between transition transform active:scale-95 group text-left">
          <div class="flex justify-between items-start w-full">
            <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Het Weer</span>
            <span class="text-slate-500 group-hover:text-white transition">☀️</span>
          </div>
          <div class="mt-4">
            <div id="hubWeatherValue" class="text-lg font-black text-white group-hover:text-sky-400 transition">–</div>
            <span id="hubWeatherSub" class="text-[10px] text-slate-500 mt-0.5 block">Locatie ophalen…</span>
          </div>
        </button>
      </div>
    </div>
  </div>
  <script>
    document.querySelectorAll('.hub-tile, [data-action]').forEach(el => {
      el.addEventListener('click', () => {
        parent.postMessage({ source: 'garminHub', action: el.dataset.action }, '*');
      });
    });
${GARMIN_MENU_BTN_JS}
    window.addEventListener('message', (ev) => {
      const data = ev.data;
      if (!data || data.source !== 'garminHubWeather') return;
      const valEl = document.getElementById('hubWeatherValue');
      const subEl = document.getElementById('hubWeatherSub');
      if (data.error){
        subEl.textContent = data.error;
        return;
      }
      valEl.innerHTML = data.temp + '°C <span class="text-xs font-normal text-slate-400">' + data.windLabel + '</span>';
      subEl.textContent = data.updatedLabel;
    });
    window.addEventListener('message', (ev) => {
      const data = ev.data;
      if (!data || data.source !== 'garminHubHeading') return;
      const valEl = document.getElementById('hubKompasValue');
      const subEl = document.getElementById('hubKompasSub');
      if (!valEl) return;
      valEl.textContent = data.heading + '° ' + data.dirLabel;
      subEl.textContent = 'Live';
    });
  <\/script>
  <div style="position:fixed; right:12px; bottom:calc(6px + env(safe-area-inset-bottom,0px)); font-size:9.5px; color:rgba(255,255,255,0.25); pointer-events:none; z-index:50;">${APP_VERSION_TEXT}</div>
</body>
</html>`;
}

function buildGarminRunCoachHtml(){
  // Native herbouwd, nu 1-op-1 gestructureerd naar Gemini's RunCoach_Pro.html: 4 tegels bij Volleerde
  // Loper (Vrije Run / 5K / 10K Target / HIIT Sprint — alle 4 écht functioneel), de week-kaarten als
  // horizontale swiper i.p.v. lijst, Eigen Schema Builder in dezelfde volgorde/velden, en het
  // "Sessie"-tabblad terug in de onderste navigatie.
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RunCoach Pro</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  body{ font-family:'Inter',sans-serif; }
  .rc-panel{ display:none; }
  .rc-panel.active{ display:block; }
  .rc-navbtn.active{ color:#fbbf24 !important; }
  .card-swiper{ display:flex; flex-direction:column; gap:0.6rem; padding-bottom:0.5rem; padding-top:0.25rem; }
  .card-swiper::-webkit-scrollbar{ display:none; }
  .card-item{ flex:0 0 auto; width:100%; max-width:none; }
  .week-jump-card{ cursor:pointer; transition:transform 0.12s ease; }
  .week-jump-card:active{ transform:scale(0.97); }
  .gold-gradient{ background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
  .rcPainZoneDot{
    position:absolute; width:20px; height:20px; margin:-10px 0 0 -10px; border-radius:50%; cursor:pointer;
    background:rgba(251,191,36,0.35); border:1.5px solid rgba(251,191,36,0.7); transition:background .15s, transform .15s;
  }
  .rcPainZoneDot:hover, .rcPainZoneDot.selected{ background:rgba(251,191,36,0.9); transform:scale(1.15); }
  .rcPainSevBtn{ flex:1; border:1.5px solid #1e293b; background:rgba(255,255,255,0.04); color:#cbd5e1; border-radius:10px; padding:7px 0; font-size:11px; font-weight:700; }
  .rcPainSevBtn.selected{ background:rgba(251,191,36,0.25); border-color:#fbbf24; color:#fbbf24; }
</style>
<style>${TAILWIND_CARD_BG}</style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div class="w-full min-h-screen p-5 pb-24 flex flex-col">

    <div class="flex justify-between items-start mb-5">
      <div class="flex items-center gap-3">
        <button id="rcBackBtn" class="w-9 h-8 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2a13c" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg></button>
        <div>
          <span class="text-[10px] text-amber-500 font-black uppercase tracking-widest">AI GPS Audio Coach Pro</span>
          <h1 class="text-lg font-black text-white flex items-center gap-1.5 mt-0.5">🏃 RunCoach Pro</h1>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button id="rcSettingsHeaderBtn" class="w-8 h-8 rounded-full bg-black/60 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0"><span style="display:grid; grid-template-columns:repeat(3,4px); grid-template-rows:repeat(3,4px); gap:2.5px;"><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span><span style="width:4px;height:4px;border-radius:50%;background:#e2a13c;"></span></span></button>
        <button id="rcAudioHeaderBtn" class="w-8 h-8 rounded-full bg-black/60 border border-amber-500/40 text-amber-400 flex items-center justify-center text-base flex-shrink-0">🎵</button>
        <button id="rcSpotifyBtn" class="w-8 h-8 rounded-full bg-black/60 border flex items-center justify-center text-base flex-shrink-0" style="border-color:rgba(29,185,84,0.4); color:#1DB954;">🎧</button>
      </div>
    </div>

    <!-- ===== HOME-paneel ===== -->
    <div id="rcHomePanel" class="rc-panel active">

      <div class="grid grid-cols-3 gap-1.5 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5 mb-4">
        <button id="rcTabAI" class="py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-[10px]">🤖 AI Coach</button>
        <button id="rcTabEvy" class="py-2.5 rounded-xl text-slate-400 font-bold text-[10px]">🎧 EVY</button>
        <button id="rcTabAdvanced" class="py-2.5 rounded-xl text-slate-400 font-bold text-[10px]">⚡ Vrij/Doel</button>
      </div>

      <!-- ---- AI Coach ---- -->
      <div id="rcLearnBlock">
        <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-3 mb-3">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">🤖 AI Coach — kies je doel-afstand</span>
          <div class="grid grid-cols-3 gap-1.5">
            <button id="rcPlan5k" data-plan="builtin_5k" class="rc-plan-btn border-2 border-slate-800 bg-slate-900/50 opacity-70 rounded-xl py-2 text-center">
              <div class="text-[11px] font-black text-white">5 KM</div>
            </button>
            <button id="rcPlan7_5k" data-plan="builtin_7_5k" class="rc-plan-btn border-2 border-slate-800 bg-slate-900/50 opacity-70 rounded-xl py-2 text-center">
              <div class="text-[11px] font-black text-white">7,5 KM</div>
            </button>
            <button id="rcPlan10k" data-plan="builtin_10k" class="rc-plan-btn border-2 border-slate-800 bg-slate-900/50 opacity-70 rounded-xl py-2 text-center">
              <div class="text-[11px] font-black text-white">10 KM</div>
            </button>
          </div>
        </div>
        <div class="bg-gradient-to-br from-rose-600 to-red-900 rounded-2xl p-5 mb-3 shadow-xl">
          <span id="rcPlanBadge" class="text-[10px] font-black uppercase tracking-widest bg-black/20 text-white/90 px-2.5 py-1 rounded-full inline-block mb-2">5K Start to Run</span>
          <h2 id="rcWeekTitle" class="text-lg font-black text-white leading-tight">Week – · Dag –</h2>
          <p id="rcWeekDesc" class="text-sm text-white/85 mt-1">–</p>
          <p id="rcProgressLine" class="text-[11px] text-white/60 mt-2">–</p>
        </div>
        <button id="rcPlansBtn" class="w-full flex justify-between items-center bg-slate-900/60 border border-slate-800 rounded-2xl p-3 mb-3.5 text-xs">
          <span class="text-slate-300">📚 Schema wisselen of zelf opbouwen</span><span class="text-slate-500">›</span>
        </button>

        <button id="rcStartBtn" class="w-full gold-gradient text-slate-950 font-black py-3.5 rounded-2xl text-center shadow-xl tracking-wider text-xs uppercase mb-3.5">
          🚀 Start Training
        </button>

        <details class="bg-slate-900/60 rounded-2xl border border-slate-800 text-xs overflow-hidden mb-3.5">
          <summary class="p-3 font-bold text-amber-400 cursor-pointer flex justify-between items-center select-none">
            <span class="flex items-center gap-2">📅 Weekschema</span>
            <span class="text-slate-500 text-[10px]">▼ Openen</span>
          </summary>
          <div class="p-3 pt-1 border-t border-slate-800/60 bg-slate-950/40">
            <div id="rcWeeksSwiper" class="card-swiper"></div>
          </div>
        </details>
      </div>

      <!-- ---- EVY Podcast (eigen tab, los van AI Coach) ---- -->
      <div id="rcEvyBlock" class="hidden">
        <div class="bg-gradient-to-br from-purple-700 to-indigo-950 rounded-2xl p-5 mb-3.5 shadow-xl text-center">
          <span class="text-[10px] font-black uppercase tracking-widest bg-black/20 text-white/90 px-2.5 py-1 rounded-full inline-block mb-2">EVY Podcast</span>
          <h2 class="text-base font-black text-white leading-tight">Jouw 10-weken audioprogramma</h2>
          <p class="text-[11px] text-white/70 mt-1">Tik je afstand aan om meteen je volgende sessie te starten — de app onthoudt zelf bij welke week/sessie je zit.</p>
        </div>
        <button id="rcEvyStart5" class="w-full border-2 border-amber-500/40 bg-gradient-to-br from-emerald-800/60 to-slate-900 rounded-3xl p-6 text-center mb-3">
          <div class="text-3xl mb-1.5">🏁</div>
          <div class="text-xl font-black text-white">5 KM</div>
          <div class="text-[11px] text-emerald-300 mt-1">Ideaal om mee te starten</div>
          <div id="rcEvyProg5" class="text-xs text-amber-400 font-bold mt-2.5">Week – · Sessie –</div>
          <div id="rcEvyDone5" class="rcEvyMarkDone text-[10px] text-slate-400 underline mt-2" data-dist="5">✅ Volgende sessie</div>
        </button>
        <button id="rcEvyStart10" class="w-full border-2 border-amber-500/40 bg-gradient-to-br from-rose-900/60 to-slate-900 rounded-3xl p-6 text-center mb-2">
          <div class="text-3xl mb-1.5">🔥</div>
          <div class="text-xl font-black text-white">10 KM</div>
          <div class="text-[11px] text-rose-300 mt-1">Voor als je verder wil bouwen</div>
          <div id="rcEvyProg10" class="text-xs text-amber-400 font-bold mt-2.5">Week – · Sessie –</div>
          <div id="rcEvyDone10" class="rcEvyMarkDone text-[10px] text-slate-400 underline mt-2" data-dist="10">✅ Volgende sessie</div>
        </button>
        <div class="flex justify-center gap-5 mb-3.5">
          <button id="rcEvyReset5" class="text-[10px] text-slate-500 underline">🔄 5K herstarten</button>
          <button id="rcEvyReset10" class="text-[10px] text-slate-500 underline">🔄 10K herstarten</button>
        </div>
      </div>

      <!-- ---- Volleerde Loper ---- -->
      <div id="rcAdvancedBlock" class="hidden">
        <div class="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 text-center mb-3.5">
          <span class="text-[10px] text-amber-400 font-black uppercase tracking-widest block mb-0.5">Volleerde Lopers</span>
          <h2 class="text-base font-black text-white">Vrije & Doelgerichte Runs</h2>
        </div>

        <div class="flex flex-col gap-2.5 mb-3.5">
          <button data-runtype="free" class="rc-runtype bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl text-left w-full flex items-center gap-3.5">
            <span class="text-2xl flex-shrink-0">⏱️</span>
            <span><h3 class="text-xs font-bold text-white">Vrije Run</h3><p class="text-[9px] text-slate-400 mt-0.5">Geen limiet. Gewoon lekker lopen!</p></span>
          </button>
          <button data-runtype="target5" class="rc-runtype bg-slate-900/60 border border-amber-500/20 p-3.5 rounded-2xl text-left w-full flex items-center gap-3.5">
            <span class="text-2xl flex-shrink-0">🏁</span>
            <span><h3 class="text-xs font-bold text-white">5 KM Target Run</h3><p class="text-[9px] text-slate-400 mt-0.5">Target run op tijd en km-splits.</p></span>
          </button>
          <button data-runtype="target10" class="rc-runtype bg-slate-900/60 border border-amber-500/20 p-3.5 rounded-2xl text-left w-full flex items-center gap-3.5">
            <span class="text-2xl flex-shrink-0">🔥</span>
            <span><h3 class="text-xs font-bold text-white">10 KM Target Run</h3><p class="text-[9px] text-slate-400 mt-0.5">Gevorderde duurloop op tempo.</p></span>
          </button>
          <button data-runtype="hiit" class="rc-runtype bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl text-left w-full flex items-center gap-3.5">
            <span class="text-xl flex-shrink-0 flex items-center gap-0.5"><span>🏃💨</span><span class="text-xs opacity-60">⇄</span><span>😮‍💨</span></span>
            <span><h3 class="text-xs font-bold text-white">HIIT Sprint Run</h3><p class="text-[9px] text-slate-400 mt-0.5">30s Sprint / 30s Herstel</p></span>
          </button>
        </div>
        <button id="rcZombieBtnTw" class="w-full bg-gradient-to-br from-red-950 to-black border border-red-500/40 p-3.5 rounded-2xl text-left mb-3.5">
          <span class="text-2xl block mb-1">🧟</span>
          <h3 class="text-xs font-bold text-rose-300">Zombie Run</h3>
          <p class="text-[9px] text-slate-400 mt-0.5">Verhaal + achtervolgingen — loop sneller dan de zombies of verlies een leven.</p>
        </button>
      </div>

      <details id="rcBuilderDetails" class="bg-slate-900/60 rounded-2xl border border-slate-800 text-xs overflow-hidden mb-3.5">
        <summary class="p-3 font-bold text-amber-400 cursor-pointer flex justify-between items-center select-none">
          <span class="flex items-center gap-2">🛠️ Eigen Schema Builder</span>
          <span class="text-slate-500 text-[10px]">▼ Openen</span>
        </summary>
        <div class="p-3.5 border-t border-slate-800/60 space-y-2.5 bg-slate-950/40">
          <input type="text" id="rcBuildName" placeholder="Naam (bijv. Mijn Intervallen)" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[9px] text-slate-400 font-bold block mb-1">Hardlopen (sec):</label>
              <input type="number" id="rcBuildRun" value="120" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
            </div>
            <div>
              <label class="text-[9px] text-slate-400 font-bold block mb-1">Wandelen (sec):</label>
              <input type="number" id="rcBuildWalk" value="60" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
            </div>
          </div>
          <div>
            <label class="text-[9px] text-slate-400 font-bold block mb-1">Aantal Herhalingen:</label>
            <input type="number" id="rcBuildReps" value="6" class="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white">
          </div>
          <button id="rcBuilderUseBtn" class="w-full gold-gradient text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase">Start Mijn Eigen Schema 🚀</button>
        </div>
      </details>

      <div id="rcVoiceCard" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-3.5">
        <span class="text-xs font-bold text-white block mb-2">🔊 Stem voor audio-coach</span>
        <button id="rcVoiceBtn" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 flex justify-between items-center">
          <span id="rcVoiceBtnLabel" class="truncate text-left">Standaardstem van je toestel</span><span class="text-slate-500 flex-shrink-0 ml-2">▾</span>
        </button>
        <div id="rcVoiceList" class="hidden mt-1.5 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-52 overflow-y-auto"></div>
        <p class="text-[10px] text-slate-500 mt-2">Echte stemmen van je eigen toestel — geen verzonnen coach-personas.</p>
      </div>

      <div id="rcMusicCard" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-3.5">
        <span class="text-xs font-bold text-white block mb-2">🎵 Muziek — speelt tijdens de loop-intervallen</span>
        <label for="rcMusicInput" class="w-full bg-slate-800 text-slate-100 font-bold py-2.5 rounded-xl text-[11px] uppercase text-center block cursor-pointer">
          📂 Kies MP3-bestanden
          <input type="file" id="rcMusicInput" accept="audio/*" multiple class="hidden" style="display:none;">
        </label>
        <p id="rcMusicCount" class="text-[10px] text-slate-500 mt-2 text-center">Geen eigen muziek geladen.</p>
      </div>

    </div>

    <!-- ===== SESSIE-paneel ===== -->
    <div id="rcSessiePanel" class="rc-panel">
      <div id="rcSessieInactive" class="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-center">
        <span class="text-3xl block mb-2">⏱️</span>
        <p class="text-sm font-bold text-white mb-1">Geen actieve sessie</p>
        <p class="text-[11px] text-slate-500">Start een training via Home — je kan daarna gerust naar andere tabbladen, de sessie blijft gewoon lopen.</p>
      </div>
      <div id="rcSessieActive" class="hidden bg-gradient-to-br from-rose-600 to-red-900 rounded-2xl p-6 text-center shadow-xl">
        <span class="text-3xl block mb-2">🏃</span>
        <p class="text-sm font-black text-white mb-1">Je sessie loopt nog!</p>
        <p class="text-[11px] text-white/70 mb-4">Timer en GPS-tracking bleven gewoon actief op de achtergrond.</p>
        <button id="rcResumeSessionBtn" class="w-full gold-gradient text-slate-950 font-black py-3 rounded-xl text-xs uppercase">▶️ Terug naar live scherm</button>
      </div>
    </div>

    <!-- ===== STATS-paneel ===== -->
    <div id="rcStatsPanel" class="rc-panel">
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
          <div id="rcStatSessions" class="text-2xl font-black text-amber-400">0</div>
          <div class="text-[9px] text-slate-500 uppercase tracking-wide mt-1">Sessies</div>
        </div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
          <div id="rcStatKm" class="text-2xl font-black text-amber-400">0.0</div>
          <div class="text-[9px] text-slate-500 uppercase tracking-wide mt-1">Totaal km</div>
        </div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
          <div id="rcStatTime" class="text-2xl font-black text-amber-400">0u</div>
          <div class="text-[9px] text-slate-500 uppercase tracking-wide mt-1">Totale tijd</div>
        </div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3 text-center">
          <div id="rcStatCalories" class="text-2xl font-black text-amber-400">–</div>
          <div class="text-[9px] text-slate-500 uppercase tracking-wide mt-1">Kcal (geschat)</div>
        </div>
      </div>
      <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 mb-4">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Gelopen afstand (laatste runs)</span>
        <div id="rcDistanceChart" class="flex items-end gap-1" style="height:60px;"></div>
      </div>
      <div class="mb-2">
        <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-2">🏅 Achievements &amp; Medailles</span>
        <div id="rcMedalGrid" class="grid grid-cols-5 gap-1.5 mb-4"></div>
      </div>
      <div id="rcHistoryList" class="bg-slate-900/40 border border-slate-800 rounded-2xl p-3"></div>
    </div>

    <!-- ===== SCHEMA-paneel ===== -->
    <div id="rcSchemaPanel" class="rc-panel">
      <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-4">
        <span id="rcSchemaPanelTitle" class="text-xs font-bold text-amber-400 block mb-2">10-weken opbouwschema</span>
        <div id="rcSchemaSwiper" class="card-swiper"></div>
      </div>
    </div>

    <!-- ===== PIJN/TIPS-paneel ===== -->
    <div id="rcPijnPanel" class="rc-panel space-y-2">

      <!-- ---- Menu: 3 lange knoppen ---- -->
      <div id="rcPijnMenu" class="space-y-2.5">
        <button class="rcPijnNavBtn w-full flex items-center gap-3 bg-slate-900/60 border border-rose-500/30 rounded-2xl p-4 text-left" data-target="rcPijnSubBlessures">
          <span class="text-2xl">🩹</span>
          <span class="flex-1"><span class="block text-sm font-black text-white">Pijn — blessures &amp; symptomen</span><span class="block text-[11px] text-slate-400">Waar doet het pijn, en wat kan het zijn?</span></span>
          <span class="text-slate-500">›</span>
        </button>
        <button class="rcPijnNavBtn w-full flex items-center gap-3 bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 text-left" data-target="rcPijnSubTips">
          <span class="text-2xl">💡</span>
          <span class="flex-1"><span class="block text-sm font-black text-white">Tips — blessures voorkomen</span><span class="block text-[11px] text-slate-400">Opbouw, herstel, RICE-methode en meer</span></span>
          <span class="text-slate-500">›</span>
        </button>
        <button class="rcPijnNavBtn w-full flex items-center gap-3 bg-slate-900/60 border border-teal-500/30 rounded-2xl p-4 text-left" data-target="rcPijnSubStretch">
          <span class="text-2xl">🧘</span>
          <span class="flex-1"><span class="block text-sm font-black text-white">Stretching — instructievideo's</span><span class="block text-[11px] text-slate-400">Voor en na het lopen</span></span>
          <span class="text-slate-500">›</span>
        </button>
        <button class="rcPijnNavBtn w-full flex items-center gap-3 bg-slate-900/60 border border-purple-500/30 rounded-2xl p-4 text-left" data-target="rcPijnSubCheck">
          <span class="text-2xl">🧍</span>
          <span class="flex-1"><span class="block text-sm font-black text-white">Pijn-check</span><span class="block text-[11px] text-slate-400">Tik aan waar je iets voelt</span></span>
          <span class="text-slate-500">›</span>
        </button>
      </div>

      <!-- ---- Sub: Pijn/blessures ---- -->
      <div id="rcPijnSubBlessures" class="hidden space-y-2">
        <button class="rcPijnBackBtn text-[11px] font-bold text-slate-400 mb-1">‹ Terug</button>
        <p class="text-[10px] text-slate-500 leading-relaxed mb-2">Algemene, veelvoorkomende oorzaken en symptomen bij lopers — geen diagnose. Bij twijfel of aanhoudende klachten: raadpleeg een arts of kinesist.</p>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦵 Scheenbeenvliesontsteking (shin splints)</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> te snel opgebouwde belasting, harde ondergrond.<br><b>Symptomen:</b> zeurende pijn langs de scheenbeenrand.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦶 Plantaire fasciitis</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> ontsteking van de voetzoolpees door overbelasting.<br><b>Symptomen:</b> stekende pijn onder de hiel, vaak ergst bij de eerste stappen 's ochtends.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦿 Achillespees-tendinitis</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> chronische overbelasting van de achillespees.<br><b>Symptomen:</b> pijn en stijfheid achteraan de enkel/kuit.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦵 Kuitspier-verrekking</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> de kuitspier scheurt (deels) los, vaak richting de achillespees.<br><b>Symptomen:</b> plotse, scherpe pijn — soms hoorbare "knap".</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦵 Hamstring-verrekking</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> onvoldoende of geen opwarming.<br><b>Symptomen:</b> plotse, scherpe pijn achteraan de dij.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦵 Liesblessure</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> overrekking van de binnenste dijspieren.<br><b>Symptomen:</b> pijn in de lies, vergelijkbaar met een liesbreuk-gevoel.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦴 ITB-syndroom (band aan buitenkant dij)</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> wrijving van de bindweefselband over de knie/heup.<br><b>Symptomen:</b> pijn aan de buitenkant van heup of knie.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🦵 Lopersknie (patellofemorale pijn)</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> niet altijd eenduidig — vaak overbelasting rond de knieschijf.<br><b>Symptomen:</b> pijn rond/onder de knieschijf.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🍑 Piriformis-syndroom</div><div class="text-[11px] text-slate-400 leading-relaxed"><b>Oorzaak:</b> verkramping van de piriformis-spier in de bil.<br><b>Symptomen:</b> uitstralende pijn langs de achterkant van het been.</div></div>
        <div class="bg-slate-900/60 border border-rose-500/40 rounded-2xl p-3.5"><div class="text-xs font-bold text-rose-400 mb-1">🚨 Wanneer naar een arts?</div><div class="text-[11px] text-slate-400 leading-relaxed">Bij hevige pijn, zwelling, gevoelloosheid, als je niet meer kan steunen op het been, of bij een abnormaal/instabiel gewricht.</div></div>
      </div>

      <!-- ---- Sub: Tips ---- -->
      <div id="rcPijnSubTips" class="hidden space-y-2">
        <button class="rcPijnBackBtn text-[11px] font-bold text-slate-400 mb-1">‹ Terug</button>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-amber-400 mb-1">🦵 Scheenbeenpijn</div><div class="text-[11px] text-slate-400 leading-relaxed">Bouw langzaam op — max. 10% meer tijd/afstand per week. Loop op zachtere ondergrond en zorg voor goede schoenen.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-amber-400 mb-1">🦶 Blaren</div><div class="text-[11px] text-slate-400 leading-relaxed">Draag hardloopsokken zonder naden, en loop schoenen eerst wat in vóór een langere sessie.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-amber-400 mb-1">💧 Zijsteken</div><div class="text-[11px] text-slate-400 leading-relaxed">Adem dieper en regelmatiger, vertraag even, en eet niet vlak vóór het lopen.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><div class="text-xs font-bold text-amber-400 mb-1">🩹 Aanhoudende pijn</div><div class="text-[11px] text-slate-400 leading-relaxed">Pijn die na rust niet wegtrekt, of erger wordt tijdens het lopen: bouw een rustdag in en raadpleeg bij twijfel een arts of kinesist.</div></div>
        <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5">
          <div class="text-xs font-bold text-amber-400 mb-1.5">📋 10 manieren om blessures te vermijden</div>
          <div class="text-[11px] text-slate-400 leading-relaxed space-y-0.5">
            <div>1. Warm op met een korte wandeling vóór het stretchen</div>
            <div>2. Stretch voor én na het lopen, vooral de hamstrings</div>
            <div>3. Rond je run af met een korte wandeling</div>
            <div>4. Loop niet elke dag</div>
            <div>5. Loop op een vlakke ondergrond</div>
            <div>6. Verkort je pasfrequentie/steplengte bij vermoeidheid</div>
            <div>7. Doe krachtoefeningen op je rustdagen</div>
            <div>8. Draag de juiste schoenen voor jouw voet</div>
            <div>9. Zorg voor voldoende voeding/voedingsstoffen</div>
            <div>10. Blijf voldoende gehydrateerd</div>
          </div>
        </div>
        <div class="bg-slate-900/60 border border-teal-500/30 rounded-2xl p-3.5">
          <div class="text-xs font-bold text-teal-400 mb-1.5">✅ Klaar om terug te lopen na een blessure?</div>
          <div class="text-[11px] text-slate-400 leading-relaxed space-y-0.5">
            <div>1. Kan je 30 minuten stevig doorwandelen?</div>
            <div>2. Kan je 30 seconden op 1 been balanceren?</div>
            <div>3. Lukken 15-20 gecontroleerde 1-beens-kniebuigingen?</div>
            <div>4. Lukken 20-30 kuitheffingen op 1 been?</div>
            <div>5. Kan je pijnvrij springen/hinkelen?</div>
          </div>
          <div class="text-[10px] text-slate-500 mt-1.5">Alle 5 gehaald zonder pijn? Dan is voorzichtig herstarten meestal veilig.</div>
        </div>
        <div class="bg-slate-900/60 border border-sky-500/30 rounded-2xl p-3.5">
          <div class="text-xs font-bold text-sky-400 mb-1.5">🧊 RICE — een lichte blessure zelf verzorgen</div>
          <div class="text-[11px] text-slate-400 leading-relaxed">
            <b>Rest:</b> bouw dagelijkse belasting af.<br>
            <b>Ice:</b> koel 20 min., minstens 4x per dag.<br>
            <b>Compression:</b> elastisch verband om zwelling te beperken.<br>
            <b>Elevation:</b> leg het lichaamsdeel hoger dan je hart.
          </div>
        </div>
      </div>

      <!-- ---- Sub: Stretching-video's ---- -->
      <div id="rcPijnSubStretch" class="hidden space-y-2">
        <button class="rcPijnBackBtn text-[11px] font-bold text-slate-400 mb-1">‹ Terug</button>
        <p class="text-[10px] text-slate-500 leading-relaxed mb-2">Opent op YouTube in een nieuw tabblad.</p>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mt-1">Vóór het lopen</span>
        <a href="https://www.youtube.com/watch?v=5cKxUUVeVVI" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">5 Minute Warm Up Before Running — dynamische stretches</span></a>
        <a href="https://www.youtube.com/watch?v=8dIHS_UVfQ4" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">The Best Dynamic Warm Up for Runners</span></a>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mt-2">Na het lopen</span>
        <a href="https://www.youtube.com/watch?v=MCf2QDOsy0E" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">8 Min Post-Run Stretching — cool down</span></a>
        <a href="https://www.youtube.com/watch?v=FbmLx-PahO4" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">10 Min. Post-Run Stretch — rustige cooldown</span></a>
        <a href="https://www.youtube.com/watch?v=dVwzwkSOuhs" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">Do These Stretches After Every Run</span></a>
        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mt-2">Gericht op kuit/achillespees</span>
        <a href="https://www.youtube.com/watch?v=zGLD19PC_Jg" target="_blank" rel="noopener" class="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5"><span class="text-xl">▶️</span><span class="flex-1 text-[12px] font-bold text-white">Calf Stretch for Runners — wandstretch</span></a>
      </div>

      <!-- ---- Sub: Pijn-check (lichaamsdiagram) ---- -->
      <div id="rcPijnSubCheck" class="hidden space-y-2">
        <button class="rcPijnBackBtn text-[11px] font-bold text-slate-400 mb-1">‹ Terug</button>
        <p class="text-[10px] text-slate-500 leading-relaxed mb-2">Tik een lichaamszone aan om te registreren waar je iets voelt — puur voor je eigen overzicht, geen diagnose.</p>
        <div class="flex gap-1.5 mb-2">
          <button id="rcPainViewFrontBtn" class="rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-amber-500/50 bg-amber-500/20 text-amber-400">↑ Voorkant</button>
          <button id="rcPainViewBackBtn" class="rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-slate-700 bg-slate-900/60 text-slate-400">↓ Achterkant</button>
        </div>
        <div class="flex gap-3.5 items-start">
          <div id="rcPainBodyWrap" style="position:relative; width:130px; flex-shrink:0; border-radius:12px; overflow:hidden;">
            <img id="rcPainBodyImg" src="images/pain-body-front-tw.png" style="width:100%; display:block;" alt="Lichaamsdiagram">
          </div>
          <div id="rcPainZonePicker" class="flex-1"></div>
        </div>
        <div id="rcPainLogList" class="mt-3"></div>
      </div>

    </div>

  </div>

  <div class="fixed bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md flex justify-around py-2.5">
    <button class="rc-navbtn active flex flex-col items-center gap-0.5 text-amber-400" data-panel="rcHomePanel"><span class="text-base">🏠</span><span class="text-[9px] font-bold">Home</span></button>
    <button class="rc-navbtn flex flex-col items-center gap-0.5 text-slate-500" data-panel="rcSessiePanel"><span class="text-base">⏱️</span><span class="text-[9px] font-bold">Sessie</span></button>
    <button class="rc-navbtn flex flex-col items-center gap-0.5 text-slate-500" data-panel="rcStatsPanel"><span class="text-base">📊</span><span class="text-[9px] font-bold">Stats</span></button>
    <button class="rc-navbtn flex flex-col items-center gap-0.5 text-slate-500" data-panel="rcSchemaPanel"><span class="text-base">📋</span><span class="text-[9px] font-bold">Schema</span></button>
    <button class="rc-navbtn flex flex-col items-center gap-0.5 text-slate-500" data-panel="rcPijnPanel"><span class="text-base">🩹</span><span class="text-[9px] font-bold">Pijn/Tips</span></button>
  </div>

  <script>
${GARMIN_MENU_BTN_JS}
    document.getElementById('rcBackBtn').addEventListener('click', () => parent.postMessage({ source:'garminRunCoach', action:'back' }, '*'));
    document.getElementById('rcSettingsHeaderBtn').addEventListener('click', () => parent.postMessage({ source:'garminRunCoach', action:'opensettings' }, '*'));
    document.getElementById('rcAudioHeaderBtn').addEventListener('click', () => {
      document.querySelectorAll('.rc-navbtn').forEach(b => { b.classList.remove('active'); b.style.color = ''; });
      document.querySelector('.rc-navbtn[data-panel="rcHomePanel"]').classList.add('active');
      document.querySelectorAll('.rc-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('rcHomePanel').classList.add('active');
      const musicCard = document.getElementById('rcMusicCard');
      if (musicCard){
        musicCard.scrollIntoView({ behavior:'smooth', block:'center' });
        musicCard.style.transition = 'box-shadow .3s';
        musicCard.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.6)';
        setTimeout(() => { musicCard.style.boxShadow = 'none'; }, 1400);
      }
    });
    document.getElementById('rcSpotifyBtn').addEventListener('click', () => {
      parent.postMessage({ source:'garminSetup', action:'openspotify' }, '*');
    });
    document.getElementById('rcZombieBtnTw').addEventListener('click', () => {
      parent.postMessage({ source:'garminSetup', action:'openzombiesetup' }, '*');
    });

    // ---- Lokale tabwissel AI Coach / EVY / Volleerde Loper ----
    const rcTabBtns = { ai: document.getElementById('rcTabAI'), evy: document.getElementById('rcTabEvy'), adv: document.getElementById('rcTabAdvanced') };
    const rcTabBlocks = { ai: document.getElementById('rcLearnBlock'), evy: document.getElementById('rcEvyBlock'), adv: document.getElementById('rcAdvancedBlock') };
    function rcSwitchLocalTab(key){
      Object.keys(rcTabBtns).forEach(k => {
        rcTabBtns[k].className = 'py-2.5 rounded-xl font-bold text-[10px] ' + (k===key ? 'bg-amber-500 text-slate-950' : 'text-slate-400');
        rcTabBlocks[k].classList.toggle('hidden', k!==key);
      });
      // Schema-builder, stemkeuze en eigen-muziek zijn enkel relevant voor AI Coach/Volleerde Loper —
      // bij EVY praat de podcast zelf, dus die 3 kaarten nemen daar enkel onnodig ruimte in.
      const showShared = key !== 'evy';
      ['rcBuilderDetails','rcVoiceCard','rcMusicCard'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !showShared);
      });
    }
    rcTabBtns.ai.addEventListener('click', () => rcSwitchLocalTab('ai'));
    rcTabBtns.evy.addEventListener('click', () => rcSwitchLocalTab('evy'));
    rcTabBtns.adv.addEventListener('click', () => rcSwitchLocalTab('adv'));

    // ---- AI Coach: kies één van de 3 ingebouwde doel-afstanden (5/7,5/10 km) ----
    document.querySelectorAll('.rc-plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        parent.postMessage({ source:'garminRunCoach', action:'setplan', planId: btn.dataset.plan }, '*');
      });
    });

    // ---- 4 tegels bij Volleerde Loper: elk start echt, met eigen instelling ----
    document.querySelectorAll('.rc-runtype').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.runtype;
        if (type === 'free') parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'free' }, '*');
        else if (type === 'target5') parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'target', targetKm:5 }, '*');
        else if (type === 'target10') parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'target', targetKm:10 }, '*');
        else if (type === 'hiit') parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'custom', reps:10, runSec:30, walkSec:30 }, '*');
      });
    });

    document.getElementById('rcStartBtn').addEventListener('click', () => {
      parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'learn' }, '*');
    });
    document.getElementById('rcBuilderUseBtn').addEventListener('click', () => {
      const reps = Math.max(1, parseInt(document.getElementById('rcBuildReps').value) || 1);
      const runSec = Math.max(10, parseInt(document.getElementById('rcBuildRun').value) || 60);
      const walkSec = Math.max(10, parseInt(document.getElementById('rcBuildWalk').value) || 60);
      parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'custom', reps, runSec, walkSec }, '*');
    });
    document.getElementById('rcPlansBtn').addEventListener('click', () => {
      parent.postMessage({ source:'garminRunCoach', action:'openplans' }, '*');
    });

    document.getElementById('rcVoiceBtn').addEventListener('click', () => {
      document.getElementById('rcVoiceList').classList.toggle('hidden');
    });
    document.getElementById('rcMusicInput').addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      document.getElementById('rcMusicCount').textContent = files.length
        ? files.length + ' nummers geladen.'
        : 'Geen eigen muziek geladen.';
      parent.postMessage({ source:'garminRunCoach', action:'setmusic', files }, '*');
    });

    // ---- EVY Podcast: vaste bestanden op de server (audio/evy5k/Start to Run - Aflevering NN.mp3, audio/evy10k/...) — app onthoudt zelf de voortgang ----
    document.getElementById('rcResumeSessionBtn').addEventListener('click', () => {
      parent.postMessage({ source:'garminRunCoach', action:'resumesession' }, '*');
    });
    // ---- Pijn/Tips: menu <-> 3 subpagina's ----
    document.querySelectorAll('.rcPijnNavBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('rcPijnMenu').classList.add('hidden');
        document.getElementById(btn.dataset.target).classList.remove('hidden');
      });
    });
    document.querySelectorAll('.rcPijnBackBtn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#rcPijnPanel > div').forEach(d => d.classList.add('hidden'));
        document.getElementById('rcPijnMenu').classList.remove('hidden');
      });
    });
    // ---- Pijn-check: lichaamsdiagram met tik-zones (zelfde 17 zones/coördinaten als de Standaard-pagina,
    // opslag loopt via de parent zodat het één gedeelde geschiedenis blijft ongeacht de gebruikte stijl) ----
    const RC_PAIN_ZONES = [
      { id:'nek', label:'Nek', front:{px:50,py:11}, back:{px:50,py:10} },
      { id:'schouder', label:'Schouder', front:{px:24,py:18}, back:{px:25,py:20} },
      { id:'bovenrug', label:'Bovenrug', back:{px:66,py:22} },
      { id:'onderrug', label:'Onderrug', back:{px:50,py:38} },
      { id:'lies', label:'Lies', front:{px:50,py:41} },
      { id:'heup', label:'Heup', front:{px:38,py:43} },
      { id:'bil', label:'Bil/piriformis', back:{px:38,py:48} },
      { id:'dijbeen', label:'Dijbeen (voorkant)', front:{px:40,py:57} },
      { id:'hamstring', label:'Hamstring (achterkant dij)', back:{px:38,py:62} },
      { id:'itb', label:'ITB (buitenkant dij/knie)', front:{px:62,py:60} },
      { id:'knie', label:'Knie (lopersknie)', front:{px:41,py:70}, back:{px:40,py:73} },
      { id:'scheenbeen', label:'Scheenbeen', front:{px:42,py:80} },
      { id:'kuit', label:'Kuit', back:{px:42,py:82} },
      { id:'achillespees', label:'Achillespees', back:{px:42,py:92} },
      { id:'enkel', label:'Enkel', front:{px:42,py:91} },
      { id:'voetzool', label:'Voetzool/hiel', front:{px:58,py:96} },
      { id:'voet', label:'Voet', front:{px:42,py:96} }
    ];
    let rcPainView = 'front';
    let rcPainSelectedZone = null;
    let rcPainSelectedSeverity = 'matig';
    function rcRenderPainDots(){
      const wrap = document.getElementById('rcPainBodyWrap');
      wrap.querySelectorAll('.rcPainZoneDot').forEach(el => el.remove());
      RC_PAIN_ZONES.forEach(z => {
        const c = z[rcPainView];
        if (!c) return;
        const dot = document.createElement('div');
        dot.className = 'rcPainZoneDot';
        dot.dataset.zone = z.id;
        dot.style.left = c.px + '%'; dot.style.top = c.py + '%';
        dot.addEventListener('click', () => rcSelectPainZone(z.id));
        wrap.appendChild(dot);
      });
    }
    function rcSelectPainZone(zoneId){
      rcPainSelectedZone = zoneId;
      document.querySelectorAll('.rcPainZoneDot').forEach(el => el.classList.toggle('selected', el.dataset.zone === zoneId));
      const zone = RC_PAIN_ZONES.find(z => z.id === zoneId);
      const sevs = [{id:'licht',label:'Licht'},{id:'matig',label:'Matig'},{id:'erg',label:'Erg'}];
      let sevBtnsHtml = '';
      sevs.forEach(s => { sevBtnsHtml += '<button class="rcPainSevBtn ' + (s.id===rcPainSelectedSeverity?'selected':'') + '" data-sev="' + s.id + '">' + s.label + '</button>'; });
      document.getElementById('rcPainZonePicker').innerHTML =
        '<div class="text-[13px] font-black text-white mb-2">' + zone.label + '</div>' +
        '<div class="flex gap-1.5 mb-2.5">' + sevBtnsHtml + '</div>' +
        '<button id="rcPainSaveBtn" class="w-full rounded-xl py-2.5 text-[12px] font-black" style="background:#fbbf24; color:#1e293b;">Registreren</button>';
      document.querySelectorAll('.rcPainSevBtn').forEach(b => b.addEventListener('click', () => {
        rcPainSelectedSeverity = b.dataset.sev;
        document.querySelectorAll('.rcPainSevBtn').forEach(x => x.classList.toggle('selected', x.dataset.sev===rcPainSelectedSeverity));
      }));
      document.getElementById('rcPainSaveBtn').addEventListener('click', () => {
        parent.postMessage({ source:'garminRunCoach', action:'painlog', zoneId, zoneLabel:zone.label, severity:rcPainSelectedSeverity }, '*');
        rcPainSelectedZone = null;
        document.querySelectorAll('.rcPainZoneDot').forEach(el => el.classList.remove('selected'));
        document.getElementById('rcPainZonePicker').innerHTML = '<div class="text-[11px] text-slate-500">Tik een zone aan om te registreren.</div>';
      });
    }
    document.getElementById('rcPainViewFrontBtn').addEventListener('click', () => {
      rcPainView = 'front';
      document.getElementById('rcPainBodyImg').src = 'images/pain-body-front-tw.png';
      document.getElementById('rcPainViewFrontBtn').className = 'rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-amber-500/50 bg-amber-500/20 text-amber-400';
      document.getElementById('rcPainViewBackBtn').className = 'rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-slate-700 bg-slate-900/60 text-slate-400';
      rcRenderPainDots();
    });
    document.getElementById('rcPainViewBackBtn').addEventListener('click', () => {
      rcPainView = 'back';
      document.getElementById('rcPainBodyImg').src = 'images/pain-body-back-tw.png';
      document.getElementById('rcPainViewBackBtn').className = 'rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-amber-500/50 bg-amber-500/20 text-amber-400';
      document.getElementById('rcPainViewFrontBtn').className = 'rcPainViewBtn flex-1 rounded-xl py-2 text-[11px] font-bold border border-slate-700 bg-slate-900/60 text-slate-400';
      rcRenderPainDots();
    });
    document.getElementById('rcPainZonePicker').innerHTML = '<div class="text-[11px] text-slate-500">Tik een zone aan om te registreren.</div>';
    rcRenderPainDots();
    parent.postMessage({ source:'garminRunCoach', action:'getpainlog' }, '*'); // vraag de huidige (gedeelde) geschiedenis op bij het openen
    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d || d.source !== 'garminPainLog') return;
      const sevIcon = { licht:'🟡', matig:'🟠', erg:'🔴' };
      const list = document.getElementById('rcPainLogList');
      if (!d.log.length){ list.innerHTML = ''; return; }
      let rowsHtml = '<div class="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Recente registraties</div>';
      d.log.slice(0,10).forEach(r => {
        const dateStr = new Date(r.date).toLocaleDateString('nl-BE',{day:'2-digit',month:'short'});
        rowsHtml += '<div class="flex justify-between text-[11px] text-slate-300 py-1.5 border-b border-slate-800"><span>' + (sevIcon[r.severity]||'') + ' ' + r.zoneLabel + '</span><span class="text-slate-500">' + dateStr + '</span></div>';
      });
      list.innerHTML = rowsHtml;
    });
    document.getElementById('rcEvyStart5').addEventListener('click', () => {
      parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'evy', evyDist:5 }, '*');
    });
    document.getElementById('rcEvyStart10').addEventListener('click', () => {
      parent.postMessage({ source:'garminRunCoach', action:'starttraining', mode:'evy', evyDist:10 }, '*');
    });
    document.getElementById('rcEvyReset5').addEventListener('click', () => {
      if (confirm('De 5K-reeks terugzetten naar Week 1 · Sessie 1?')) parent.postMessage({ source:'garminRunCoach', action:'resetevy', evyDist:5 }, '*');
    });
    document.getElementById('rcEvyReset10').addEventListener('click', () => {
      if (confirm('De 10K-reeks terugzetten naar Week 1 · Sessie 1?')) parent.postMessage({ source:'garminRunCoach', action:'resetevy', evyDist:10 }, '*');
    });
    document.querySelectorAll('.rcEvyMarkDone').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation(); // anders start het klikken hier ook meteen een nieuwe sessie (zit binnen dezelfde knop)
        const dist = Number(el.dataset.dist);
        if (confirm('Deze sessie (' + dist + ' km) markeren als al gedaan en doorschuiven naar de volgende?')){
          parent.postMessage({ source:'garminRunCoach', action:'advanceevy', evyDist:dist }, '*');
        }
      });
    });

    // ---- Eigen Schema Builder accordeon (vast open/dicht, geen extra state nodig — <details> regelt dit zelf) ----

    // ---- Onderste navigatie: alle 5 panelen native binnen deze iframe ----
    document.querySelectorAll('.rc-navbtn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rc-navbtn').forEach(b => { b.classList.remove('active'); b.style.color = ''; });
        btn.classList.add('active');
        document.querySelectorAll('.rc-panel').forEach(p => p.classList.remove('active'));
        document.getElementById(btn.dataset.panel).classList.add('active');
        if (btn.dataset.panel === 'rcStatsPanel') parent.postMessage({ source:'garminRunCoach', action:'getstats' }, '*');
      });
    });

    window.addEventListener('message', (ev) => {
      const d = ev.data;
      if (!d) return;
      if (d.source === 'garminRunCoachData'){
        document.getElementById('rcPlanBadge').textContent = d.planName || '5K Start to Run';
        document.getElementById('rcWeekTitle').textContent = 'Week ' + d.week + ' · Dag ' + d.day;
        const wk = d.program.find(w => w.week === d.week);
        document.getElementById('rcWeekDesc').textContent = wk ? wk.desc : '–';
        document.getElementById('rcProgressLine').textContent = d.sessionsDone + ' sessies afgerond tot nu toe';

        const weekIcons = ['👟','⚡','🏃','🔥','🎽','🏆','🎯','🥇','🚀'];
        const cardsHtml = d.program.map((w, i) => \`
          <div class="card-item week-jump-card bg-white text-slate-900 rounded-3xl p-4 shadow-xl border \${w.week === d.week ? 'border-amber-400' : 'border-amber-100'} flex flex-col justify-between" data-week="\${w.week}">
            <div>
              <div class="flex justify-between items-center mb-1"><span class="text-2xl">\${weekIcons[i] || '🏃'}</span><span class="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">Week \${w.week}</span></div>
              <h3 class="text-sm font-black text-slate-900">\${w.title}</h3>
              <p class="text-[10px] text-amber-600 font-bold mt-1">\${w.desc}</p>
              \${w.week === d.week ? '<p class="text-[9px] text-amber-500 font-bold mt-2">📍 Je zit hier nu</p>' : '<p class="text-[9px] text-slate-400 font-bold mt-2">Tik om hierheen te springen</p>'}
            </div>
          </div>\`).join('');
        document.getElementById('rcWeeksSwiper').innerHTML = cardsHtml;
        document.getElementById('rcSchemaSwiper').innerHTML = cardsHtml;
        document.querySelectorAll('.week-jump-card').forEach(card => {
          card.addEventListener('click', () => {
            const wk = parseInt(card.dataset.week);
            if (wk === d.week) return; // al actief, niets te doen
            if (confirm('Wil je je voortgang verzetten naar Week ' + wk + ' · Dag 1? Je huidige plek (Week ' + d.week + ') gaat dan verloren.')){
              parent.postMessage({ source:'garminRunCoach', action:'setweek', week: wk }, '*');
            }
          });
        });
        document.getElementById('rcSchemaPanelTitle').textContent = (d.planName || 'Opbouwschema') + ' — ' + (d.program ? d.program.length : '10') + ' weken';

        if (d.evy5k) document.getElementById('rcEvyProg5').textContent = 'Week ' + d.evy5k.week + ' · Sessie ' + d.evy5k.session + '/3';
        document.getElementById('rcSessieInactive').classList.toggle('hidden', !!d.sessionActive);
        document.getElementById('rcSessieActive').classList.toggle('hidden', !d.sessionActive);
        if (d.evy10k) document.getElementById('rcEvyProg10').textContent = 'Week ' + d.evy10k.week + ' · Sessie ' + d.evy10k.session + '/3';

        document.querySelectorAll('.rc-plan-btn').forEach(btn => {
          const active = btn.dataset.plan === d.activePlanId;
          btn.className = 'rc-plan-btn border-2 rounded-xl py-2 text-center ' + (active ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50 opacity-70');
        });

        const voiceOptions = [{ uri:'', label:'Standaardstem van je toestel' }].concat(
          d.voices.map(v => ({ uri:v.uri, label:v.name + ' (' + v.lang + ')' }))
        );
        const voiceList = document.getElementById('rcVoiceList');
        const voiceBtnLabel = document.getElementById('rcVoiceBtnLabel');
        const selected = voiceOptions.find(o => o.uri === d.savedVoiceUri) || voiceOptions[0];
        voiceBtnLabel.textContent = selected.label;
        voiceList.innerHTML = voiceOptions.map(o => \`
          <button data-uri="\${o.uri}" class="rc-voice-row w-full text-left px-3 py-2.5 text-xs \${o.uri===selected.uri ? 'bg-amber-500/15 text-amber-400' : 'text-slate-300'} hover:bg-slate-800/60 border-b border-slate-800/60 last:border-0">\${o.label}</button>\`).join('');
        voiceList.querySelectorAll('.rc-voice-row').forEach(row => {
          row.addEventListener('click', () => {
            voiceBtnLabel.textContent = row.textContent;
            voiceList.querySelectorAll('.rc-voice-row').forEach(r => r.className = r.className.replace('bg-amber-500/15 text-amber-400', 'text-slate-300'));
            row.className = row.className.replace('text-slate-300', 'bg-amber-500/15 text-amber-400');
            voiceList.classList.add('hidden');
            parent.postMessage({ source:'garminRunCoach', action:'setvoice', uri:row.dataset.uri }, '*');
          });
        });
      }
      if (d.source === 'garminRunCoachStats'){
        document.getElementById('rcStatSessions').textContent = d.sessions;
        document.getElementById('rcStatKm').textContent = d.km;
        document.getElementById('rcStatTime').textContent = d.time;
        document.getElementById('rcStatCalories').textContent = d.calories;
        const maxBar = Math.max(1, ...(d.chart||[]));
        document.getElementById('rcDistanceChart').innerHTML = (d.chart||[]).length ? d.chart.map(km => \`
          <div style="flex:1; display:flex; align-items:flex-end; height:100%;">
            <div style="width:100%; max-width:18px; margin:0 auto; border-radius:4px 4px 0 0; background:#f59e0b; min-height:2px; height:\${Math.max(4,(km/maxBar)*100)}%;" title="\${km.toFixed(2)} km"></div>
          </div>\`).join('') : '<div class="text-slate-500 text-[11px] m-auto">Nog geen runs om te tonen.</div>';
        document.getElementById('rcMedalGrid').innerHTML = (d.medals||[]).map(m => \`
          <div class="flex flex-col items-center gap-1 rounded-xl p-2 \${m.unlocked ? 'bg-amber-500/10' : 'bg-slate-900/60'}" data-km="\${m.km}">
            <span style="font-size:22px; \${m.unlocked ? '' : 'filter:grayscale(1) opacity(0.35);'}" class="\${m.unlocked ? 'rc-medal-clickable' : ''}">\${m.icon}</span>
            <span style="font-size:8px; font-weight:800; color:\${m.unlocked ? '#f59e0b' : '#64748b'};">\${m.label}</span>
          </div>\`).join('');
        document.querySelectorAll('.rc-medal-clickable').forEach(el => {
          el.style.cursor = 'pointer';
          el.addEventListener('click', () => parent.postMessage({ source:'garminRunCoach', action:'confetti' }, '*'));
        });
        document.getElementById('rcHistoryList').innerHTML = d.history.length ? d.history.map((r, i) => \`
          <div class="border-b border-slate-800/60 last:border-0">
            <div class="rh-row-head-tw flex justify-between items-center py-2 text-xs cursor-pointer" data-i="\${i}">
              <span class="text-slate-200">\${r.dateLabel} — \${r.km} km\${r.mood === 'happy' ? ' 😄' : r.mood === 'sad' ? ' 😔' : ''}\${r.painCount ? ' 🩹' + (r.painCount > 1 ? ' ('+r.painCount+'x)' : '') : ''}\${r.zombie ? ' 🧟' + (r.zombie.score>=0?'+':'') + r.zombie.score : ''}</span>
              <span class="text-slate-500">\${r.duration}\${r.completed ? ' ✅' : ''} <span class="opacity-50">▾</span></span>
            </div>
            <div class="rh-row-detail-tw hidden pb-3 text-[11px] text-slate-400">
              <div class="grid grid-cols-2 gap-x-3 gap-y-1 mb-1.5">
                <span>📅 \${r.dateLabel} · \${r.timeLabel}</span>
                <span>🏃 \${r.runType}</span>
                <span>🔥 \${r.calories != null ? r.calories + ' kcal' : '–'}</span>
                <span>🩹 \${r.painAreas.length ? r.painAreas.join(', ') : 'Geen'}</span>
              </div>
              <div>\${r.mood === 'happy' ? '😄 Goed gevoel' : r.mood === 'sad' ? '😔 Zwaar gevoel' : '– Niet ingevuld'}</div>
              \${r.zoneBarHtml}
            </div>
          </div>\`).join('') : '<div class="text-slate-500 text-xs text-center py-4">Nog geen trainingen afgerond.</div>';
        document.querySelectorAll('.rh-row-head-tw').forEach(row => {
          row.addEventListener('click', () => row.nextElementSibling.classList.toggle('hidden'));
        });
      }
    });
  <\/script>
</body>
</html>`;
}

window.addEventListener('message', (ev) => {
  const data = ev.data;
  if (!data || data.source !== 'garminHub') return;
  switch (data.action){
    case 'fiets':   openGarminSetupScreen('fiets'); break;
    case 'wandel':  openGarminSetupScreen('wandel'); break;
    case 'kompas':  openGarminKompasScreen(); break;
    case 'weer':    openGarminWeerScreen(); break;
    case 'hardloop': openGarminRunCoachScreen(); break;
  }
});

