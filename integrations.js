// Eén gedeelde Spotify Client ID voor iedereen die de app gebruikt — veilig om hardcoded/publiek te
// hebben, want Spotify's PKCE-inlogmethode gebruikt geen geheime sleutel (in tegenstelling tot Strava
// hieronder, die wél een Client Secret vereist en daarom per gebruiker apart blijft).
// VERVANG DIT: maak een gratis Developer-app op developer.spotify.com/dashboard, zet als Redirect URI
// exact het adres van deze pagina, en plak hier de Client ID (geen secret nodig).
const SPOTIFY_CLIENT_ID = '0411db485a4345548d2d0d7c8f1d1bdf';

function parseHeartRateValue(dataView){
  const flags = dataView.getUint8(0);
  const is16bit = (flags & 0x1) === 1;
  return is16bit ? dataView.getUint16(1, true) : dataView.getUint8(1);
}
async function connectHeartRateMonitor(){
  if (!navigator.bluetooth){
    toast(curLang()==='en' ? 'Bluetooth is not available in this browser (works on Chrome/Android).' : 'Bluetooth is niet beschikbaar in deze browser (werkt op Chrome/Android).', 3500);
    return false;
  }
  try{
    hrDevice = await navigator.bluetooth.requestDevice({ filters:[{ services:['heart_rate'] }] });
    hrDevice.addEventListener('gattserverdisconnected', () => { currentBPM = null; updateHrBadges(); });
    const server = await hrDevice.gatt.connect();
    const service = await server.getPrimaryService('heart_rate');
    hrCharacteristic = await service.getCharacteristic('heart_rate_measurement');
    await hrCharacteristic.startNotifications();
    hrCharacteristic.addEventListener('characteristicvaluechanged', (e) => {
      currentBPM = parseHeartRateValue(e.target.value);
      hrSamples.push(currentBPM);
      if (currentBPM > hrMaxThisSession) hrMaxThisSession = currentBPM;
      const now = Date.now();
      if (hrLastSampleTime && appSettings.bodyAge){
        const dt = (now - hrLastSampleTime) / 1000;
        const z = hrZoneForBpm(currentBPM, appSettings.bodyAge);
        if (z && dt > 0 && dt < 30) hrZoneSeconds[z.zone] = (hrZoneSeconds[z.zone] || 0) + dt; // dt-cap tegen rare sprongen bij een korte verbindingshapering
      }
      hrLastSampleTime = now;
      updateHrBadges();
    });
    toast(curLang()==='en' ? `Connected: ${hrDevice.name || 'heart rate monitor'}` : `Verbonden: ${hrDevice.name || 'hartslagband'}`, 2500);
    updateHrBadges();
    return true;
  }catch(e){
    if (e.name !== 'NotFoundError') toast(curLang()==='en' ? 'Could not connect to heart rate monitor.' : 'Kon niet verbinden met de hartslagband.', 3000);
    return false;
  }
}
function disconnectHeartRateMonitor(){
  if (hrDevice && hrDevice.gatt.connected) hrDevice.gatt.disconnect();
  hrDevice = null; hrCharacteristic = null; currentBPM = null;
  updateHrBadges();
}
function avgHrSamples(){ return hrSamples.length ? Math.round(hrSamples.reduce((s,v) => s+v, 0) / hrSamples.length) : null; }
// Kiest per historie-item de beste beschikbare calorie-schatting: hartslag-gebaseerd (nauwkeuriger) als
// er tijdens die sessie een hartslag gemeten werd, anders de gewicht+tijd-vuistregel als terugval.
function caloriesForEntry(r, durationMin, mode){
  if (r.avgBpm){ const hr = estimateCaloriesFromHR(r.avgBpm, durationMin); if (hr != null) return hr; }
  return estimateCalories(r.km, durationMin, mode);
}
// Werkt alle zichtbare hartslag-badges bij (fiets/wandel-dashboard én het loopscherm) — welke van de twee
// er ook net zichtbaar is, deze functie raakt beide id's aan (een niet-bestaand element wordt overgeslagen).
function hexToRgba(hex, alpha){
  const n = parseInt(hex.replace('#',''), 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${alpha})`;
}
function updateHrBadges(){
  const en = curLang() === 'en';
  const label = currentBPM ? `❤️ ${currentBPM}` : (hrDevice ? (en ? '❤️ …' : '❤️ …') : (en ? '❤️ connect' : '❤️ verbind'));
  ['dashHrValue','rsHrValue'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = label; });
  const zone = currentBPM ? hrZoneForBpm(currentBPM, appSettings.bodyAge) : null;
  ['rsHrLine','dashHrTile'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (zone){ el.style.borderColor = zone.color; el.style.background = hexToRgba(zone.color, 0.15); }
    let zoneLabelEl = el.querySelector('.hr-zone-label');
    if (zone){
      if (!zoneLabelEl){ zoneLabelEl = document.createElement('small'); zoneLabelEl.className = 'hr-zone-label'; zoneLabelEl.style.cssText = 'display:block; font-weight:800; margin-top:1px;'; el.appendChild(zoneLabelEl); }
      zoneLabelEl.textContent = `Z${zone.zone} · ${zone.label}`;
      zoneLabelEl.style.color = zone.color;
    } else if (zoneLabelEl){ zoneLabelEl.remove(); }
  });
}

// ---------- Spotify (Authorization Code + PKCE, volledig client-side — geen backend/geheime sleutel nodig) ----------
const SPOTIFY_TOKENS_KEY = 'spotify_tokens_v1';
const SPOTIFY_VERIFIER_KEY = 'spotify_pkce_verifier'; // kortstondig, enkel nodig tussen de redirect heen en terug
function spotifyRedirectUri(){ return location.origin + location.pathname; } // moet exact als Redirect URI in het Spotify-dashboard staan
function randomPkceString(len){
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[b % 62]).join('');
}
async function sha256Base64Url(str){
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function connectSpotify(){
  const clientId = SPOTIFY_CLIENT_ID;
  if (!clientId || clientId === 'VUL_HIER_JOUW_SPOTIFY_CLIENT_ID_IN'){ toast(curLang()==='en' ? 'App owner still needs to fill in a Spotify Client ID.' : 'App-eigenaar moet nog een Spotify Client ID invullen.', 3500); return; }
  const verifier = randomPkceString(64);
  localStorage.setItem(SPOTIFY_VERIFIER_KEY, verifier);
  const challenge = await sha256Base64Url(verifier);
  const params = new URLSearchParams({
    client_id: clientId, response_type:'code', redirect_uri: spotifyRedirectUri(),
    code_challenge_method:'S256', code_challenge: challenge,
    scope:'user-read-currently-playing user-read-playback-state user-modify-playback-state'
  });
  location.href = 'https://accounts.spotify.com/authorize?' + params.toString();
}
// Wordt bij elke pagina-load aangeroepen: als de URL net terugkomt van Spotify (?code=...), de code
// meteen inwisselen voor een token en de rommelige query-string weer van de adresbalk vegen.
async function handleSpotifyCallbackIfPresent(){
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  if (!code) return;
  const verifier = localStorage.getItem(SPOTIFY_VERIFIER_KEY);
  history.replaceState({}, '', location.pathname); // ?code=... weg uit de zichtbare URL, ongeacht of het lukt
  if (!verifier) return;
  try{
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type:'authorization_code', code, redirect_uri: spotifyRedirectUri(),
        client_id: SPOTIFY_CLIENT_ID, code_verifier: verifier
      })
    });
    if (!res.ok) throw new Error('token-exchange-failed');
    const data = await res.json();
    localStorage.setItem(SPOTIFY_TOKENS_KEY, JSON.stringify({
      access_token:data.access_token, refresh_token:data.refresh_token, expires_at: Date.now() + (data.expires_in*1000)
    }));
    toast(curLang()==='en' ? '🎧 Spotify connected!' : '🎧 Spotify verbonden!', 2500);
  }catch(e){ toast(curLang()==='en' ? 'Spotify connection failed.' : 'Verbinden met Spotify mislukt.', 3000); }
}
async function getSpotifyAccessToken(){
  let raw = localStorage.getItem(SPOTIFY_TOKENS_KEY);
  if (!raw) return null;
  let tok;
  try{ tok = JSON.parse(raw); }catch(e){ return null; }
  if (Date.now() < tok.expires_at - 30000) return tok.access_token; // nog minstens 30s geldig
  // Token ververst automatisch, zonder dat je opnieuw moet inloggen — dat is precies waarvoor refresh_token dient.
  try{
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type:'refresh_token', refresh_token:tok.refresh_token, client_id:SPOTIFY_CLIENT_ID })
    });
    if (!res.ok) throw new Error('refresh-failed');
    const data = await res.json();
    tok = { access_token:data.access_token, refresh_token: data.refresh_token || tok.refresh_token, expires_at: Date.now() + (data.expires_in*1000) };
    localStorage.setItem(SPOTIFY_TOKENS_KEY, JSON.stringify(tok));
    return tok.access_token;
  }catch(e){ localStorage.removeItem(SPOTIFY_TOKENS_KEY); return null; }
}
function isSpotifyConnected(){ return !!localStorage.getItem(SPOTIFY_TOKENS_KEY); }
async function fetchSpotifyNowPlaying(){
  const token = await getSpotifyAccessToken();
  if (!token) return null;
  try{
    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers:{ Authorization:'Bearer ' + token } });
    if (res.status === 204) return { playing:false }; // niets aan het spelen
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.item) return { playing:false };
    return {
      playing: data.is_playing, name: data.item.name,
      artists: data.item.artists.map(a => a.name).join(', '),
      albumArt: data.item.album.images[2] ? data.item.album.images[2].url : (data.item.album.images[0] ? data.item.album.images[0].url : null),
      progressMs: data.progress_ms, durationMs: data.item.duration_ms
    };
  }catch(e){ return null; }
}
async function spotifyPlayerAction(action){ // 'play' | 'pause' | 'next' | 'previous'
  const token = await getSpotifyAccessToken();
  if (!token) return;
  const method = (action === 'next' || action === 'previous') ? 'POST' : 'PUT';
  try{ await fetch(`https://api.spotify.com/v1/me/player/${action}`, { method, headers:{ Authorization:'Bearer ' + token } }); }catch(e){}
}

// ---------- Strava (standaard OAuth2 authorization-code-flow — géén PKCE-alternatief bij Strava, dus de
// client secret staat noodgedwongen mee in de broncode van deze pagina; zie de instellingen-uitleg). ----------
const STRAVA_TOKENS_KEY = 'strava_tokens_v1';
function stravaRedirectUri(){ return location.origin + location.pathname; }
function connectStrava(){
  const clientId = (appSettings.stravaClientId || '').trim();
  if (!clientId){ toast(curLang()==='en' ? 'Fill in your Strava Client ID first (Settings).' : 'Vul eerst je Strava Client ID in (Instellingen).', 3000); return; }
  const params = new URLSearchParams({
    client_id: clientId, response_type:'code', redirect_uri: stravaRedirectUri(),
    approval_prompt:'auto', scope:'activity:write,activity:read_all'
  });
  location.href = 'https://www.strava.com/oauth/authorize?' + params.toString();
}
async function handleStravaCallbackIfPresent(){
  const url = new URL(location.href);
  const code = url.searchParams.get('code');
  const scope = url.searchParams.get('scope');
  if (!code || !scope || !scope.includes('activity')) return; // dit was een Spotify-callback, niet Strava (of niets)
  history.replaceState({}, '', location.pathname);
  try{
    const res = await fetch('https://www.strava.com/oauth/token', {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:(appSettings.stravaClientId || '').trim(), client_secret:(appSettings.stravaClientSecret || '').trim(),
        code, grant_type:'authorization_code'
      })
    });
    if (!res.ok) throw new Error('token-exchange-failed');
    const data = await res.json();
    localStorage.setItem(STRAVA_TOKENS_KEY, JSON.stringify({
      access_token:data.access_token, refresh_token:data.refresh_token, expires_at: data.expires_at * 1000
    }));
    toast(curLang()==='en' ? '🟠 Strava connected!' : '🟠 Strava verbonden!', 2500);
  }catch(e){ toast(curLang()==='en' ? 'Strava connection failed.' : 'Verbinden met Strava mislukt.', 3000); }
}
function isStravaConnected(){ return !!localStorage.getItem(STRAVA_TOKENS_KEY); }
async function getStravaAccessToken(){
  let raw = localStorage.getItem(STRAVA_TOKENS_KEY);
  if (!raw) return null;
  let tok;
  try{ tok = JSON.parse(raw); }catch(e){ return null; }
  if (Date.now() < tok.expires_at - 60000) return tok.access_token;
  try{
    const res = await fetch('https://www.strava.com/oauth/token', {
      method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:(appSettings.stravaClientId || '').trim(), client_secret:(appSettings.stravaClientSecret || '').trim(),
        refresh_token:tok.refresh_token, grant_type:'refresh_token'
      })
    });
    if (!res.ok) throw new Error('refresh-failed');
    const data = await res.json();
    tok = { access_token:data.access_token, refresh_token:data.refresh_token, expires_at: data.expires_at * 1000 };
    localStorage.setItem(STRAVA_TOKENS_KEY, JSON.stringify(tok));
    return tok.access_token;
  }catch(e){ localStorage.removeItem(STRAVA_TOKENS_KEY); return null; }
}
// Bouwt een GPX met echte tijdstempels (nodig voor Strava om tempo/snelheid te berekenen) uit een
// kruimelspoor {lat,lon,t,ele?} — gedeeld tussen een fietsrit (navBreadcrumbs) en een loopsessie (rsState.breadcrumbs).
function buildGpxFromBreadcrumbs(breadcrumbs, name){
  const trkpts = breadcrumbs.map(b => `      <trkpt lat="${b.lat}" lon="${b.lon}"><time>${new Date(b.t).toISOString()}</time>${b.ele != null ? `<ele>${Math.round(b.ele)}</ele>` : ''}</trkpt>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Knooppunten-app" xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>${name}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}
// sportType: Strava's eigen waarden, bv. 'Run', 'Ride', 'Hike', 'Walk'.
async function uploadActivityToStrava(breadcrumbs, name, sportType){
  const token = await getStravaAccessToken();
  if (!token){ toast(curLang()==='en' ? 'Not connected to Strava yet (Settings).' : 'Nog niet verbonden met Strava (Instellingen).', 3000); return false; }
  if (!breadcrumbs || breadcrumbs.length < 2){ toast(curLang()==='en' ? 'Not enough GPS data to upload.' : 'Te weinig GPS-data om te uploaden.', 3000); return false; }
  try{
    const gpx = buildGpxFromBreadcrumbs(breadcrumbs, name);
    const form = new FormData();
    form.append('file', new Blob([gpx], { type:'application/gpx+xml' }), 'activity.gpx');
    form.append('data_type', 'gpx');
    form.append('name', name);
    form.append('sport_type', sportType);
    const res = await fetch('https://www.strava.com/api/v3/uploads', { method:'POST', headers:{ Authorization:'Bearer ' + token }, body: form });
    if (!res.ok) throw new Error('upload-failed');
    toast(curLang()==='en' ? '🟠 Uploaded to Strava!' : '🟠 Geüpload naar Strava!', 3000);
    return true;
  }catch(e){
    toast(curLang()==='en' ? 'Strava upload failed.' : 'Upload naar Strava mislukt.', 3000);
    return false;
  }
}
let spotifyPollId = null;
async function refreshSpotifyModal(){
  if (!isSpotifyConnected()){
    $('spotifyNotConnected').classList.remove('hidden');
    $('spotifyPlayingView').classList.add('hidden');
    $('spotifyNothingPlaying').classList.add('hidden');
    return;
  }
  $('spotifyNotConnected').classList.add('hidden');
  const now = await fetchSpotifyNowPlaying();
  if (!now || !now.playing && !now.name){
    $('spotifyPlayingView').classList.add('hidden');
    $('spotifyNothingPlaying').classList.remove('hidden');
    return;
  }
  $('spotifyNothingPlaying').classList.add('hidden');
  $('spotifyPlayingView').classList.remove('hidden');
  $('spotifyTrackName').textContent = now.name;
  $('spotifyArtistName').textContent = now.artists;
  if (now.albumArt) $('spotifyAlbumArt').src = now.albumArt;
  $('spotifyPlayPauseBtn').textContent = now.playing ? '⏸' : '▶️';
}
function openSpotifyModal(){
  openModal('spotifyModal');
  refreshSpotifyModal();
  clearInterval(spotifyPollId);
  spotifyPollId = setInterval(refreshSpotifyModal, 5000); // elke 5s bijwerken zolang de popup open staat
}
$('spotifyTileBtn').addEventListener('click', openSpotifyModal);
document.querySelector('#spotifyModal .simple-modal-close').addEventListener('click', () => clearInterval(spotifyPollId));
$('spotifyModalConnectBtn').addEventListener('click', connectSpotify);
$('spotifyPlayPauseBtn').addEventListener('click', async () => {
  const playing = $('spotifyPlayPauseBtn').textContent === '⏸';
  await spotifyPlayerAction(playing ? 'pause' : 'play');
  setTimeout(refreshSpotifyModal, 500);
});
