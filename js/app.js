import {isLoggedIn,login,logout,DEMO_USER} from "./auth.js";
import {createWorld,CITIES} from "./map3d.js";
import {createPlayer,movePlayer,placeGloo} from "./player.js";
import {setupControls} from "./controls.js";
import {setupLobby} from "./lobby.js";
import {WEAPONS} from "./weapons.js";
import {updateBots,aliveCount,shootAt} from "./ai_bot.js";

const $=id=>document.getElementById(id);
const loginScreen=$("loginScreen"),deviceScreen=$("deviceScreen"),gameApp=$("gameApp");
let world,state,controls,mode="solo",phase="lobby",zoneRadius=185,matchTimer=0,planeTimer=0,fireCooldown=0,scopeOn=false,last=performance.now(),gold=1200;
const settings={sensitivity:1.2,sfx:true,quality:"medium"};
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800);}
function setGold(n){gold=n;$("gold").textContent=n;localStorage.setItem("lzGold",n);}
function showApp(){loginScreen.classList.add("hidden");gameApp.classList.add("hidden");deviceScreen.classList.remove("hidden");}
function chooseDevice(device){localStorage.setItem("lzDevice",device);document.body.classList.toggle("mobile-mode",device==="mobile");document.body.classList.toggle("computer-mode",device==="computer");deviceScreen.classList.add("hidden");gameApp.classList.remove("hidden");$("nickname").textContent=DEMO_USER;gold=+(localStorage.getItem("lzGold")||1200);$("gold").textContent=gold;initLobby();}
$("chooseMobile").onclick=()=>chooseDevice("mobile");
$("chooseComputer").onclick=()=>chooseDevice("computer");
$("loginForm").addEventListener("submit",e=>{e.preventDefault();if(login($("username").value,$("password").value)){ $("loginError").textContent="";showApp();}else $("loginError").textContent="Username atau password salah.";});
$("logoutBtn").onclick=()=>{logout();gameApp.classList.add("hidden");deviceScreen.classList.add("hidden");loginScreen.classList.remove("hidden");};
$("deviceChangeBtn").onclick=()=>{if(controls?.dispose)controls.dispose();gameApp.classList.add("hidden");deviceScreen.classList.remove("hidden");};
if(isLoggedIn())showApp();
function initLobby(){
  if(world){world.renderer.dispose();}
  world=createWorld($("sceneHost"),settings.quality);state=createPlayer(world);world.setBotCount(0);
  world.camera.position.set(0,5,9);world.camera.lookAt(0,1,0);
  setupLobby({getGold:()=>gold,setGold,toast,settings});
  $("lobbyPanel").classList.remove("hidden");$("matchHud").classList.add("hidden");$("loadingScreen").classList.add("hidden");$("matchMessage").classList.add("hidden");
  if(controls?.dispose)controls.dispose();
  animate();
}
function beginMatch(){
  if(phase!=="lobby")return;
  phase="loading";$("lobbyPanel").classList.add("hidden");$("loadingScreen").classList.remove("hidden");$("progressFill").style.width="0%";let p=0;
  const tips=["Cari perlengkapan di dekat bangunan.","Tetap berada di dalam safe zone.","Gunakan perlindungan ketika bertempur.","Dengarkan arah tembakan musuh."];
  const timer=setInterval(()=>{p=Math.min(100,p+5);$("progressFill").style.width=p+"%";$("progressText").textContent=p+"%";$("loadingTip").textContent="Tips: "+tips[Math.floor(Math.random()*tips.length)];if(p>=100){clearInterval(timer);startMatch();}},100);
}
function startMatch(){
  phase="waiting";$("loadingScreen").classList.add("hidden");$("matchHud").classList.remove("hidden");state=createPlayer(world);state.weapon=localStorage.getItem("lzWeapon")||"M4A1";state.ammo=WEAPONS[state.weapon]?.ammo||30;state.reserve=WEAPONS[state.weapon]?.reserve||120;state.hp=200;state.alive=true;
  world.setBotCount(mode==="practice"?10:49);zoneRadius=185;matchTimer=0;planeTimer=10;world.playerGroup.position.set(0,0,0);world.plane.position.set(-190,65,-170);toast("Waiting Island: pesawat berangkat dalam 10 detik!");
  controls=setupControls(state,actions,world);
}
const actions={
  fire(){if(phase!=="match"||fireCooldown>0)return;if(shootAt(world,state,(target,damage)=>{toast("HIT! -"+damage);addKillfeed("User123 hit Bot_"+String(target.userData.id).padStart(2,"0")+" for "+damage);if(!target.userData.alive){addKillfeed("User123 eliminated Bot_"+String(target.userData.id).padStart(2,"0"));}})){fireCooldown=(WEAPONS[state.weapon]?.rate||150)/1000;$("ammoText").textContent=state.ammo+" / "+state.reserve;}},
  scope(){scopeOn=!scopeOn;world.camera.fov=scopeOn?38:70;world.camera.updateProjectionMatrix();toast(scopeOn?"Scope aktif":"Scope nonaktif");},
  reload(){const w=WEAPONS[state.weapon];if(!w||state.reserve<=0)return;const n=Math.min(w.ammo-state.ammo,state.reserve);state.ammo+=n;state.reserve-=n;$("ammoText").textContent=state.ammo+" / "+state.reserve;toast("Reload selesai");},
  loot(){let nearest=null,dist=6;for(const l of world.loot){if(!l.userData.available)continue;const d=Math.hypot(l.position.x-state.x,l.position.z-state.z);if(d<dist){nearest=l;dist=d;}}if(nearest){nearest.userData.available=false;nearest.visible=false;if(nearest.userData.name==="Medkit")state.medkits++;else if(nearest.userData.name==="Gloo Wall")state.gloo++;else if(nearest.userData.name==="Vest Level 2")state.armor=2;else state.reserve+=30;toast("Loot: "+nearest.userData.name);}else toast("Tidak ada loot di dekatmu.");},
  gloo(){if(state.gloo<=0){toast("Gloo Wall habis");return;}state.gloo--;placeGloo(state,world);toast("Gloo Wall dipasang");},
  medkit(){if(state.medkits>0&&state.hp<200){state.medkits--;state.hp=Math.min(200,state.hp+70);toast("Medkit digunakan");}},
  weapon(name){if(WEAPONS[name]){state.weapon=name;state.ammo=WEAPONS[name].ammo;state.reserve=WEAPONS[name].reserve;$("weaponName").textContent=name;$("ammoText").textContent=state.ammo+" / "+state.reserve;}},
  crouch(){toast("Mode crouch (visual demo)");},prone(){toast("Mode prone (visual demo)");},jump(){}
};
$("startBtn").onclick=beginMatch;
$("modeBtn").onclick=()=>$("modeMenu").classList.toggle("hidden");
$("modeMenu").querySelectorAll("[data-mode]").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$("modeBtn").textContent=(mode==="solo"?"SOLO · 49 BOT":"LATIHAN · 10 BOT")+" ▾";$("modeMenu").classList.add("hidden");});
$("mapButton").onclick=()=>{$("mapModal").classList.remove("hidden");world.drawMap($("fullMap"),true,state,zoneRadius);};
$("closeMap").onclick=()=>$("mapModal").classList.add("hidden");
$("backLobby").onclick=()=>{phase="lobby";$("matchMessage").classList.add("hidden");initLobby();};
function addKillfeed(msg){const el=document.createElement("div");el.className="kill-line";el.textContent=msg;$("killfeed").prepend(el);while($("killfeed").children.length>4)$("killfeed").lastChild.remove();}
function finishMatch(win){phase="result";$("matchMessage").classList.remove("hidden");$("resultTitle").textContent=win?"BOOYAH!":"DEFEAT";$("resultEyebrow").textContent=win?"VICTORY ROYALE":"ELIMINATED";$("resultStats").textContent=`Kills: ${state.kills} · Damage: ${Math.round(state.damage)} · Hadiah: ${win?500:80} Gold / ${win?250:50} EXP`;setGold(gold+(win?500:80));}
function animate(now=performance.now()){
  requestAnimationFrame(animate);if(!world||!state)return;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(phase==="lobby"){world.playerGroup.rotation.y+=dt*.12;world.camera.position.lerp(new world.THREE.Vector3(0,5,9),.03);world.camera.lookAt(0,1.4,0);}
  if(phase==="waiting"||phase==="match"){
    matchTimer+=dt;if(fireCooldown>0)fireCooldown-=dt;
    if(phase==="waiting"){movePlayer(state,world,controls?.input||{},dt,settings);planeTimer-=dt;world.plane.position.x+=dt*16;world.plane.position.z+=dt*14;if(planeTimer<=0){phase="match";state.freefall=true;toast("Pesawat! Lompat dan mulai bertahan.");}}
    else {
      movePlayer(state,world,controls?.input||{},dt,settings);
      updateBots(world,state,dt,zoneRadius,(id)=>addKillfeed("Bot_"+id+" eliminated Bot"));
      if(Math.floor(matchTimer)%15===0&&matchTimer>0)zoneRadius=Math.max(35,zoneRadius-dt*.5);
      if(Math.hypot(state.x,state.z)>zoneRadius){state.hp-=dt*4;if(state.hp<=0){state.hp=0;state.alive=false;}}
      if(state.hp<=0||!state.alive){finishMatch(false);}
      if(aliveCount(world,state)<=1&&state.alive)finishMatch(true);
      if(Math.random()<dt*.001){world.airdrop.position.x=(Math.random()-.5)*180;world.airdrop.position.z=(Math.random()-.5)*180;world.airdrop.position.y=Math.max(0,world.airdrop.position.y-dt*3);if(world.airdrop.position.y===0)toast("Airdrop mendarat!");}
    }
    $("aliveCount").textContent=aliveCount(world,state);$("killCount").textContent=state.kills;$("hpBar").style.width=(state.hp/200*100)+"%";$("hpText").textContent=Math.round(state.hp);$("epBar").style.width=(state.ep/100*100)+"%";$("epText").textContent=Math.round(state.ep);$("weaponName").textContent=state.weapon;
    world.zone.scale.set(zoneRadius,1,zoneRadius);world.drawMap($("minimap"),false,state,zoneRadius);
  }
  world.renderer.render(world.scene,world.camera);
}
