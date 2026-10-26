import {ITEMS,WEAPONS} from "./weapons.js";
export function setupLobby({getGold,setGold,toast,settings}){
  const panel=document.getElementById("pagePanel");let page="lobby";let emote="wave";
  function render(){
    document.querySelectorAll(".nav-menu button").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
    if(page==="lobby"){panel.innerHTML="<h3>MISSION BRIEF</h3><p>Turun di area aman, cari senjata, dan awasi lingkaran zona.</p><p>15 area eksplorasi · Loot tersebar · Bot AI</p>";}
    if(page==="vault"){panel.innerHTML='<h3>VAULT / INVENTORY</h3><p>Senjata utama</p><select id="vaultWeapon">'+Object.keys(WEAPONS).map(n=>`<option>${n}</option>`).join("")+'</select><p>Armor: Vest Level 1 · Helmet Level 1</p><p>Skin: Default Survivor</p>';document.getElementById("vaultWeapon").onchange=e=>{localStorage.setItem("lzWeapon",e.target.value);toast("Senjata dipilih: "+e.target.value);};}
    if(page==="store"){panel.innerHTML='<h3>STORE</h3><p>Belanja menggunakan Gold in-game.</p>'+ITEMS.map((it,i)=>`<button data-buy="${i}">${it.name} — 🟡 ${it.price}<small style="display:block;color:#c4d0d5;margin-top:4px">${it.desc}</small></button>`).join("");panel.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{const it=ITEMS[+b.dataset.buy];if(getGold()<it.price){toast("Gold tidak cukup!");return;}setGold(getGold()-it.price);toast(it.name+" dibeli!");});}
    if(page==="emotes"){panel.innerHTML='<h3>EMOTE WHEEL</h3><p>Pilih gerakan karakter.</p>'+["Dab","Laugh","Dance","Wave"].map(n=>`<button data-emote="${n}">✦ ${n}</button>`).join("");panel.querySelectorAll("[data-emote]").forEach(b=>b.onclick=()=>{emote=b.dataset.emote;toast("Emote: "+emote+"!");});}
    if(page==="settings"){panel.innerHTML=`<h3>SETTINGS</h3><label>Sensitivitas kamera: <b id="sensValue">${settings.sensitivity}</b></label><input id="sensitivity" type="range" min=".5" max="3" step=".1" value="${settings.sensitivity}"><label>Grafik</label><select id="quality"><option>low</option><option>medium</option><option>high</option></select><label><input id="sfx" type="checkbox" ${settings.sfx?"checked":""}> Sound effects (demo)</label><p>Pengaturan disimpan di sesi ini.</p>`;document.getElementById("sensitivity").oninput=e=>{settings.sensitivity=+e.target.value;document.getElementById("sensValue").textContent=settings.sensitivity;};document.getElementById("sfx").onchange=e=>settings.sfx=e.target.checked;document.getElementById("quality").value=settings.quality;document.getElementById("quality").onchange=e=>{settings.quality=e.target.value;toast("Grafik diterapkan setelah refresh.");};}
  }
  document.querySelectorAll(".nav-menu button").forEach(b=>b.addEventListener("click",()=>{page=b.dataset.page;render();}));
  render();return {render};
}
