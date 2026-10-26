export function setupControls(state,actions,world){
  const input={forward:false,backward:false,left:false,right:false,sprint:false,jump:false};
  const keys={KeyW:"forward",KeyS:"backward",KeyA:"left",KeyD:"right",ShiftLeft:"sprint"};
  const keydown=e=>{if(keys[e.code])input[keys[e.code]]=true;if(e.code==="Space")input.jump=true;if(e.code==="KeyR")actions.reload();if(e.code==="KeyF")actions.loot();if(e.code==="KeyE")actions.gloo();if(e.code==="Digit1")actions.weapon("M4A1");if(e.code==="Digit2")actions.weapon("AK47");if(e.code==="Digit3")actions.weapon("AWM");if(e.code==="Digit4")actions.weapon("Pan");if(e.code==="KeyC")actions.crouch();if(e.code==="KeyZ")actions.prone();};
  const keyup=e=>{if(keys[e.code])input[keys[e.code]]=false;if(e.code==="Space")input.jump=false;};
  addEventListener("keydown",keydown);addEventListener("keyup",keyup);
  let locked=false;const canvas=world.renderer.domElement;
  canvas.addEventListener("click",()=>{if(!matchMedia("(pointer:coarse)").matches)canvas.requestPointerLock?.();});
  const lockchange=()=>locked=document.pointerLockElement===canvas;
  document.addEventListener("pointerlockchange",lockchange);
  const mousemove=e=>{if(!locked)return;state.yaw-=e.movementX*.002;state.pitch=Math.max(-.5,Math.min(.5,state.pitch-e.movementY*.0015));};
  document.addEventListener("mousemove",mousemove);
  const mousedown=e=>{if(e.button===0)actions.fire();if(e.button===2)actions.scope();};canvas.addEventListener("mousedown",mousedown);
  const context=e=>e.preventDefault();canvas.addEventListener("contextmenu",context);
  const joy=document.getElementById("joystick"),stick=document.getElementById("stick");let joyId=null;
  const moveJoy=e=>{const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),x=Math.max(-25,Math.min(25,dx)),y=Math.max(-25,Math.min(25,dy));stick.style.transform=`translate(${x}px,${y}px)`;input.left=x<-8;input.right=x>8;input.forward=y<-8;input.backward=y>8;};
  const joydown=e=>{e.preventDefault();joyId=e.pointerId;joy.setPointerCapture(e.pointerId);moveJoy(e);};
  const joymove=e=>{if(e.pointerId===joyId)moveJoy(e);};
  const joyup=e=>{if(e.pointerId!==joyId)return;joyId=null;input.forward=input.backward=input.left=input.right=false;stick.style.transform="translate(0,0)";};
  joy.addEventListener("pointerdown",joydown);joy.addEventListener("pointermove",joymove);joy.addEventListener("pointerup",joyup);joy.addEventListener("pointercancel",joyup);
  // Drag on the right half of the game screen to rotate the camera on phones.
  let lookId=null,lastX=0,lastY=0;
  const lookdown=e=>{if(e.pointerType==="mouse"||e.clientX<innerWidth*.42||e.target.closest("button")||e.target.closest("#joystick"))return;lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;};
  const lookmove=e=>{if(e.pointerId!==lookId)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;state.yaw-=dx*.008;state.pitch=Math.max(-.5,Math.min(.5,state.pitch-dy*.004));};
  const lookup=e=>{if(e.pointerId===lookId)lookId=null;};
  document.addEventListener("pointerdown",lookdown);document.addEventListener("pointermove",lookmove);document.addEventListener("pointerup",lookup);document.addEventListener("pointercancel",lookup);
  const buttons=[...document.querySelectorAll("[data-action]")];const intervals=new Map();
  buttons.forEach(btn=>{const act=btn.dataset.action;const down=e=>{e.preventDefault();if(act==="sprint"){input.sprint=true;btn.classList.add("pressed");return;}if(act==="jump"){input.jump=true;return;}if(act==="fire"){actions.fire();const id=setInterval(()=>actions.fire(),130);intervals.set(btn,id);return;}if(act==="weaponNext"){const names=["M4A1","AK47","AWM","Pan"];actions.weapon(names[(names.indexOf(state.weapon)+1)%names.length]);return;}if(actions[act])actions[act]();};const up=e=>{if(act==="sprint"){input.sprint=false;btn.classList.remove("pressed");}if(act==="jump")input.jump=false;if(act==="fire"&&intervals.has(btn)){clearInterval(intervals.get(btn));intervals.delete(btn);}};btn.addEventListener("pointerdown",down);btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("pointerleave",up);});
  return {input,dispose(){removeEventListener("keydown",keydown);removeEventListener("keyup",keyup);document.removeEventListener("pointerlockchange",lockchange);document.removeEventListener("mousemove",mousemove);canvas.removeEventListener("mousedown",mousedown);canvas.removeEventListener("contextmenu",context);joy.removeEventListener("pointerdown",joydown);joy.removeEventListener("pointermove",joymove);joy.removeEventListener("pointerup",joyup);joy.removeEventListener("pointercancel",joyup);document.removeEventListener("pointerdown",lookdown);document.removeEventListener("pointermove",lookmove);document.removeEventListener("pointerup",lookup);document.removeEventListener("pointercancel",lookup);intervals.forEach(clearInterval);}};
}
