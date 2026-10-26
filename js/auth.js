export const DEMO_USER = "User123";
const DEMO_PASS = "User456";
const KEY = "lastZoneAuth";
export function isLoggedIn(){ return localStorage.getItem(KEY) === DEMO_USER; }
export function login(username,password){
  if(username === DEMO_USER && password === DEMO_PASS){ localStorage.setItem(KEY, DEMO_USER); return true; }
  return false;
}
export function logout(){ localStorage.removeItem(KEY); }
