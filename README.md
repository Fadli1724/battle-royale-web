# Last Zone — Battle Royale by Fadli

Browser-based 3D battle royale prototype for GitHub Pages. HTML/CSS/Vanilla JavaScript + Three.js CDN; no Node.js or build step.

## Demo login
- Username: `User123`
- Password: `User456`

## Run locally
Open `index.html` in a browser that supports ES modules and internet access. Some browsers restrict modules from `file://`; GitHub Pages is the easiest option.

## Publish to GitHub Pages
1. Create a GitHub repository, for example `last-zone-battle-royale`.
2. Upload `index.html`, `style.css`, `README.md`, and the entire `js/` folder while preserving paths.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for the Pages URL to appear. Open it in Chrome; rotate a phone to landscape.

## Prototype limitations
This is a client-side prototype, not a full commercial game. Bots, combat, loot, and zone are simplified simulations. It does not implement real online multiplayer, authoritative server anti-cheat, original Free Fire assets, production-grade character animation, full parachute/plane exit controls, or all weapon-specific behaviors. LocalStorage login is only a demo and must not be used for real accounts or secrets.
