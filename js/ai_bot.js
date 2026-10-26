import {WEAPONS} from "./weapons.js";
export function updateBots(world,state,dt,zoneRadius,onKill){
  for(const b of world.bots){
    const d=b.userData;if(!d.alive)continue;
    d.think-=dt;d.shoot-=dt;
    const dx=state.x-b.position.x,dz=state.z-b.position.z,dist=Math.hypot(dx,dz);
    if(d.think<=0){d.think=1+Math.random()*2;d.dir=dist<65?Math.atan2(dx,dz):Math.random()*Math.PI*2;}
    if(dist<75){b.rotation.y=d.dir;b.position.x+=Math.sin(d.dir)*dt*(dist>18?3:0);b.position.z+=Math.cos(d.dir)*dt*(dist>18?3:0);}
    else {b.position.x+=Math.sin(d.dir)*dt*2;b.position.z+=Math.cos(d.dir)*dt*2;}
    const r=Math.hypot(b.position.x,b.position.z);if(r>zoneRadius){d.hp-=dt*3;if(d.hp<=0){d.alive=false;b.visible=false;}}
    if(dist<30&&d.shoot<=0){d.shoot=1.1+Math.random()*1.3;if(Math.random()<.24){state.hp-=Math.max(3,9-state.armor*.8);if(state.hp<=0){state.hp=0;state.alive=false;}}}
    // Bots occasionally eliminate one another, keeping the simulated match moving.
    if(Math.random()<dt*.012){d.alive=false;b.visible=false;onKill?.(d.id,"Bot");}
  }
}
export function aliveCount(world,state){return (state.alive?1:0)+world.bots.filter(b=>b.userData.alive).length;}
export function shootAt(world,state,onHit){
  if(state.ammo<=0)return false;state.ammo--;
  const weapon=WEAPONS[state.weapon]||WEAPONS.M4A1;
  let target=null,best=Infinity;
  for(const b of world.bots){if(!b.userData.alive)continue;const dx=b.position.x-state.x,dz=b.position.z-state.z,d=Math.hypot(dx,dz);if(d>weapon.range)continue;
    const angle=Math.atan2(dx,dz),diff=Math.abs(Math.atan2(Math.sin(angle-state.yaw),Math.cos(angle-state.yaw)));
    if(diff<.11&&d<best){best=d;target=b;}
  }
  if(target){const damage=weapon.damage*(Math.random()<.12?1.6:1);target.userData.hp-=damage;onHit?.(target,Math.round(damage));if(target.userData.hp<=0){target.userData.alive=false;target.visible=false;state.kills++;state.damage+=damage;} }
  return true;
}
