export function createPlayer(world){
  return {x:0,z:0,y:0,yaw:0,pitch:0,velocityY:0,hp:200,maxHp:200,ep:0,kills:0,damage:0,alive:true,onPlane:false,freefall:false,parachute:false,grounded:true,weapon:"M4A1",ammo:30,reserve:120,medkits:2,gloo:2,armor:0};
}
export function movePlayer(state,world,input,dt,settings={}){
  if(!state.alive)return;
  const speed=input.sprint?18:10;let forward=(input.forward?1:0)-(input.backward?1:0),side=(input.right?1:0)-(input.left?1:0);
  const len=Math.hypot(forward,side)||1;forward/=len;side/=len;
  state.x+=(-Math.sin(state.yaw)*forward+Math.cos(state.yaw)*side)*speed*dt;
  state.z+=(-Math.cos(state.yaw)*forward-Math.sin(state.yaw)*side)*speed*dt;
  state.x=Math.max(-205,Math.min(205,state.x));state.z=Math.max(-205,Math.min(205,state.z));
  if(input.jump&&state.grounded){state.velocityY=9;state.grounded=false;}
  if(!state.grounded){state.velocityY-=22*dt;state.y+=state.velocityY*dt;if(state.y<=0){state.y=0;state.velocityY=0;state.grounded=true;}}
  world.playerGroup.position.set(state.x,state.y,state.z);world.playerGroup.rotation.y=state.yaw;
  world.camera.position.set(state.x+Math.sin(state.yaw)*8, state.y+5.2, state.z+Math.cos(state.yaw)*8);
  world.camera.lookAt(state.x,state.y+1.6,state.z);
}
export function placeGloo(state,world){
  const wall=new world.THREE.Mesh(new world.THREE.BoxGeometry(7,4,1),new world.THREE.MeshStandardMaterial({color:0x8de7f5,transparent:true,opacity:.8}));
  wall.position.set(state.x-Math.sin(state.yaw)*5,2,state.z-Math.cos(state.yaw)*5);wall.rotation.y=state.yaw;world.scene.add(wall);setTimeout(()=>world.scene.remove(wall),20000);
}
