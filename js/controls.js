export function setupControls(state,actions,world){
  const input={forward:false,backward:false,left:false,right:false,sprint:false,jump:false};
  const keys={KeyW:"forward",KeyS:"backward",KeyA:"left",KeyD:"right",ShiftLeft:"sprint"};
  addEventListener("keydown",e=>{if(keys[e.code])input[keys[e.code]]=true;if(e.code==="Space")input.jump=true;if(e.code==="KeyR")actions.reload();if(e.code==="KeyF")actions.loot();if(e.code==="KeyE")actions.gloo();if(e.code==="Digit1")actions.weapon("M4A1");if(e.code==="Digit2")actions.weapon("AK47");if(e.code==="Digit3")actions.weapon("AWM");if(e.code==="Digit4")actions.weapon("Pan");if(e.code==="KeyC")actions.crouch();if(e.code==="KeyZ")actions.prone();});
  addEventListener("keyup",e=>{if(keys[e.code])input[keys[e.code]]=false;if(e.code==="Space")input.jump=false;});
  let locked=false,lastX=0,lastY=0;
  world.renderer.domElement.addEventListener("click",()=>{if(!matchMedia("(pointer:coarse)").matches)world.renderer.domElement.requestPointerLock?.();});
  document.addEventListener("pointerlockchange",()=>locked=document.pointerLockElement===world.renderer.domElement);
  document.addEventListener("mousemove",e=>{if(!locked)return;state.yaw-=e.movementX*.002;state.pitch=Math.max(-.5,Math.min(.5,state.pitch-e.movementY*.0015));});
  world.renderer.domElement.addEventListener("mousedown",e=>{if(e.button===0)actions.fire();if(e.button===2)actions.scope();});
  world.renderer.domElement.addEventListener("contextmenu",e=>e.preventDefault());
  const joy=document.getElementById("joystick"),stick=document.getElementById("stick");let joyId=null;
  joy.addEventListener("pointerdown",e=>{joyId=e.pointerId;joy.setPointerCapture(e.pointerId);moveJoy(e);});
  joy.addEventListener("pointermove",e=>{if(e.pointerId===joyId)moveJoy(e);});
  joy.addEventListener("pointerup",e=>{joyId=null;input.forward=input.backward=input.left=input.right=false;stick.style.transform="translate(0,0)";});
  function moveJoy(e){const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),x=Math.max(-28,Math.min(28,dx)),y=Math.max(-28,Math.min(28,dy));stick.style.transform=`translate(${x}px,${y}px)`;input.left=x<-9;input.right=x>9;input.forward=y<-9;input.backward=y>9;}
  document.querySelectorAll("[data-action]").forEach(btn=>{const act=btn.dataset.action;const fn=()=>{if(act==="jump")input.jump=true;else if(actions[act])actions[act]();};btn.addEventListener("pointerdown",e=>{e.preventDefault();fn();});if(act==="jump")btn.addEventListener("pointerup",()=>input.jump=false);});
  return {input};
}
