export const WEAPONS = {
  AK47:{type:"AR",damage:34,rate:160,range:110,recoil:0.7,ammo:30,reserve:120},
  M4A1:{type:"AR",damage:28,rate:110,range:120,recoil:0.45,ammo:30,reserve:120},
  Groza:{type:"AR",damage:36,rate:125,range:125,recoil:0.55,ammo:30,reserve:120},
  SCAR:{type:"AR",damage:29,rate:120,range:115,recoil:0.4,ammo:30,reserve:120},
  MP40:{type:"SMG",damage:20,rate:75,range:55,recoil:0.65,ammo:20,reserve:120},
  UMP:{type:"SMG",damage:24,rate:100,range:70,recoil:0.4,ammo:30,reserve:120},
  Vector:{type:"SMG",damage:18,rate:60,range:45,recoil:0.7,ammo:25,reserve:150},
  AWM:{type:"Sniper",damage:90,rate:850,range:240,recoil:0.9,ammo:5,reserve:25},
  Kar98k:{type:"Sniper",damage:75,rate:700,range:200,recoil:0.75,ammo:5,reserve:25},
  M1887:{type:"Shotgun",damage:12,rate:500,range:25,recoil:0.9,ammo:2,reserve:24},
  SPAS12:{type:"Shotgun",damage:10,rate:400,range:30,recoil:0.8,ammo:6,reserve:30},
  "Desert Eagle":{type:"Pistol",damage:48,rate:300,range:60,recoil:0.7,ammo:7,reserve:42},
  USP:{type:"Pistol",damage:24,rate:220,range:55,recoil:0.25,ammo:12,reserve:72},
  Pan:{type:"Melee",damage:55,rate:500,range:4,recoil:0,ammo:1,reserve:0},
  Katana:{type:"Melee",damage:60,rate:450,range:5,recoil:0,ammo:1,reserve:0}
};
export const ITEMS = [
  {name:"Medkit",kind:"heal",price:100,desc:"Memulihkan HP"},
  {name:"Vest Level 2",kind:"armor",price:250,desc:"Mengurangi damage"},
  {name:"Helmet Level 2",kind:"helmet",price:200,desc:"Perlindungan kepala"},
  {name:"Backpack Level 2",kind:"bag",price:180,desc:"Kapasitas loot tambahan"},
  {name:"Gloo Wall",kind:"gloo",price:120,desc:"Tembok pelindung sementara"},
  {name:"AK47 Skin",kind:"skin",price:400,desc:"Skin kosmetik senjata"}
];
