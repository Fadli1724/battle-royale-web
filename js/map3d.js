import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
export const CITIES = [
  "Peak","Clock Tower","Factory","Bimasakti Strip","Pochinok","Mill","Shipyard","Katulistiwa","Mars Electric","Rim Nam Village","Sentosa","Graveyard","Cape Town","Plantation","Hangar"
];
export function createWorld(host, quality="medium"){
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8cc7d2); scene.fog = new THREE.Fog(0x8cc7d2,160,500);
  const camera = new THREE.PerspectiveCamera(70,innerWidth/innerHeight,.1,1000);
  const renderer = new THREE.WebGLRenderer({antialias:quality!=="low"}); renderer.setPixelRatio(Math.min(devicePixelRatio,quality==="high"?2:1.4)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=quality==="high"; host.replaceChildren(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xcdeaff,0x45553a,2));
  const sun=new THREE.DirectionalLight(0xfff0cf,2.2);sun.position.set(90,150,60);sun.castShadow=quality==="high";scene.add(sun);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(420,420,1,1),new THREE.MeshStandardMaterial({color:0x477b45,roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const grid=new THREE.GridHelper(420,42,0x5b9455,0x5b9455);grid.position.y=.04;scene.add(grid);
  const roadMat=new THREE.MeshStandardMaterial({color:0x484b4b});
  for(let i=0;i<5;i++){const road=new THREE.Mesh(new THREE.BoxGeometry(420,.08,4),roadMat);road.position.set(0,.05,-160+i*80);scene.add(road);const road2=new THREE.Mesh(new THREE.BoxGeometry(4,.08,420),roadMat);road2.position.set(-160+i*80,.06,0);scene.add(road2);}
  const buildings=[],trees=[],cityLabels=[];
  const buildingMat=[0xb6a58a,0x718c91,0x9b6d4f,0x8a9294,0xc1b8a4].map(c=>new THREE.MeshStandardMaterial({color:c}));
  const treeMat=new THREE.MeshStandardMaterial({color:0x245b36});
  CITIES.forEach((name,i)=>{
    const angle=i/CITIES.length*Math.PI*2, cx=Math.cos(angle)*135, cz=Math.sin(angle)*135;
    for(let j=0;j<7;j++){
      const x=cx+(Math.random()-.5)*28,z=cz+(Math.random()-.5)*28,w=5+Math.random()*7,h=4+Math.random()*9,d=5+Math.random()*7;
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),buildingMat[(i+j)%buildingMat.length]);b.position.set(x,h/2,z);b.castShadow=true;b.receiveShadow=true;scene.add(b);buildings.push(b);
      const roof=new THREE.Mesh(new THREE.BoxGeometry(w+.3,.35,d+.3),new THREE.MeshStandardMaterial({color:0x3b4545}));roof.position.set(x,h+.15,z);scene.add(roof);
    }
    const label=makeLabel(name);label.position.set(cx,14,cz);scene.add(label);cityLabels.push(label);
  });
  for(let i=0;i<260;i++){const x=(Math.random()-.5)*390,z=(Math.random()-.5)*390;if(Math.abs(x%80)<7||Math.abs(z%80)<7)continue;
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2,5),new THREE.MeshStandardMaterial({color:0x6c4a2d}));trunk.position.set(x,1,z);scene.add(trunk);
    const crown=new THREE.Mesh(new THREE.ConeGeometry(2.2,5,6),treeMat);crown.position.set(x,4,z);crown.castShadow=true;scene.add(crown);trees.push(trunk,crown);
  }
  const zoneMat=new THREE.MeshBasicMaterial({color:0x68d7ff,wireframe:true,transparent:true,opacity:.8});
  const zone=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,100,1,true),zoneMat);zone.position.y=.5;scene.add(zone);
  const plane=new THREE.Group();const fuselage=new THREE.Mesh(new THREE.BoxGeometry(12,1.3,2),new THREE.MeshStandardMaterial({color:0x303a44}));plane.add(fuselage);const wing=new THREE.Mesh(new THREE.BoxGeometry(3,0.3,18),new THREE.MeshStandardMaterial({color:0xd6d9d6}));plane.add(wing);plane.position.y=65;scene.add(plane);
  const playerGroup=new THREE.Group();
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.15,4,8),new THREE.MeshStandardMaterial({color:0x236b8d}));body.position.y=1.35;playerGroup.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.42,12,8),new THREE.MeshStandardMaterial({color:0xd7a67e}));head.position.y=2.45;playerGroup.add(head);
  const pack=new THREE.Mesh(new THREE.BoxGeometry(.65,.8,.3),new THREE.MeshStandardMaterial({color:0x293d32}));pack.position.set(0,1.45,-.52);playerGroup.add(pack);
  playerGroup.position.set(0,0,0);scene.add(playerGroup);
  const bots=[];
  const botMat=new THREE.MeshStandardMaterial({color:0xb64c35});
  function spawnBot(i){const g=new THREE.Group();const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,1.05,3,7),botMat);torso.position.y=1.25;g.add(torso);const h=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),new THREE.MeshStandardMaterial({color:0xc49b79}));h.position.y=2.3;g.add(h);g.position.set((Math.random()-.5)*340,0,(Math.random()-.5)*340);g.userData={id:i,hp:100,alive:true,dir:Math.random()*Math.PI*2,think:Math.random()*3,shoot:Math.random()*2,city:CITIES[i%CITIES.length]};scene.add(g);bots.push(g);return g;}
  function setBotCount(n){while(bots.length<n)spawnBot(bots.length+1);while(bots.length>n){scene.remove(bots.pop());}}
  const loot=[];
  const lootColors={Medkit:0x42e27e,Ammo:0xf5cf42,"Gloo Wall":0x72d8ff,"Vest Level 2":0x9f9f9f};
  for(let i=0;i<60;i++){const name=["Medkit","Ammo","Gloo Wall","Vest Level 2"][i%4];const m=new THREE.Mesh(new THREE.BoxGeometry(.8,.45,.8),new THREE.MeshStandardMaterial({color:lootColors[name]}));m.position.set((Math.random()-.5)*330,.35,(Math.random()-.5)*330);m.userData={name,available:true};scene.add(m);loot.push(m);}
  const airdrop=new THREE.Group();const crate=new THREE.Mesh(new THREE.BoxGeometry(2,1.5,2),new THREE.MeshStandardMaterial({color:0xb93226}));airdrop.add(crate);airdrop.position.set(70,70,-70);scene.add(airdrop);
  function makeLabel(text){const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;const c=canvas.getContext("2d");c.fillStyle="rgba(5,15,18,.75)";c.fillRect(0,0,512,96);c.fillStyle="#ffe27a";c.font="bold 38px Arial";c.textAlign="center";c.fillText(text.toUpperCase(),256,62);const tex=new THREE.CanvasTexture(canvas);const m=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));m.scale.set(22,4.2,1);return m;}
  function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);}
  addEventListener("resize",resize);
  function drawMap(canvas,full=false,player={x:0,z:0},zoneRadius=180,planeProgress=.5){
    const c=canvas.getContext("2d"),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.fillStyle="#315b3b";c.fillRect(0,0,w,h);
    const px=x=>(x+210)/420*w,py=z=>(z+210)/420*h;
    c.strokeStyle="#777d73";c.lineWidth=full?7:3;
    for(let k=-160;k<=160;k+=80){c.beginPath();c.moveTo(px(-210),py(k));c.lineTo(px(210),py(k));c.stroke();c.beginPath();c.moveTo(px(k),py(-210));c.lineTo(px(k),py(210));c.stroke();}
    c.strokeStyle="#77ddff";c.lineWidth=2;c.beginPath();c.arc(px(0),py(0),zoneRadius/420*w,0,Math.PI*2);c.stroke();
    c.strokeStyle="#ffe56b";c.lineWidth=2;c.beginPath();c.moveTo(px(-185),py(-170));c.lineTo(px(185),py(170));c.stroke();
    CITIES.forEach((n,i)=>{const a=i/CITIES.length*Math.PI*2,x=Math.cos(a)*135,z=Math.sin(a)*135;c.fillStyle="#f5f3d5";c.beginPath();c.arc(px(x),py(z),full?5:2.5,0,Math.PI*2);c.fill();if(full){c.fillStyle="#fff";c.font="11px Arial";c.fillText(n,px(x)+5,py(z)-4);}});
    c.fillStyle="#4be4ff";c.beginPath();c.arc(px(player.x),py(player.z),full?7:4,0,Math.PI*2);c.fill();
    bots.filter(b=>b.userData.alive).forEach(b=>{c.fillStyle="#ff634d";c.fillRect(px(b.position.x)-2,py(b.position.z)-2,4,4);});
  }
  return {THREE,scene,camera,renderer,playerGroup,bots,loot,zone,plane,airdrop,cityLabels,buildings,setBotCount,drawMap,resize};
}
