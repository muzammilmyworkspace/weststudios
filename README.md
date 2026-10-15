# ENTER THE WESTSIDE — interactive 3D website

## Preview
No package installation or build is required. From this folder run:

```sh
python3 -m http.server 8877 --bind 127.0.0.1
```

Open http://127.0.0.1:8877 in a modern browser. On Windows, use `py -m http.server 8877 --bind 127.0.0.1` if the command is `py`.

Opening `index.html` directly also runs the local JavaScript and geometry, but browsers may restrict uploading local images into WebGL textures. Use the local server for the complete visual experience. A static web host can serve this folder unchanged.

## Experience
The website is a fixed WebGL stage, with native scroll controlling a predetermined camera path. There are no vertically stacked website sections. The visitor passes through an assembling W portal into changing architectural rooms. HTML installations are projected into the scene with the same camera matrix, so text, buttons and forms remain semantic and accessible.

The environment includes real 3D walls, floors, ceiling ribs, gallery frames, lab pedestals, a boardroom table, chairs, curved red filament installations, split portal doors and camera-space silhouette hands. Lighting, fog, light-volume planes and glossy floor highlights are lightweight stylized shaders, not ray-traced reflections or volumetric path tracing. No background video or external JavaScript dependency is used.

## Controls
- Scroll or swipe to move forward/backward on the guided route.
- Enter: choose with or without original ambient sound.
- Menu: travel to Home, Services, Work, About, Team or Contact.
- Previous/next: visit every installation, including all three gallery works and both statistics walls.
- Reading View: center the active content for easier reading, retaining the world behind it.
- Escape: skip the entrance or close a dialog. Home/End: first/last chapter when outside a form/dialog.
- Services: select one of seven installations to change the demonstration and illuminate the physical object.
- Gallery: open an in-place story dialog. Closing restores the journey.
- Founders: select Shahmir Hashmat or Amees Ali to reveal the supplied name and role.
- Contact: prepare a local email draft and downloadable brief; the physical door opens after preparation. No email is sent automatically.

Mobile keeps a simpler 3D environment with fewer filaments, capped resolution, no hands, and centered scrollable chapter text. Reduced-motion mode skips camera bob, animated shader motion and flash, using stable chapter views. If WebGL is unavailable, a fixed-image reading experience preserves all navigation and interactions. Low-power/testing URLs: `?motion=reduce` and `?renderer=off`.

## Editing
- `DESIGN.md`: architecture, camera route, chapters and responsive strategy.
- `index.html` / `style.css`: semantic content and visual UI.
- `math.js`: matrix helpers and master camera keyframes.
- `world.js`: WebGL renderer, materials, geometry and texture placement.
- `app.js`: scroll interpolation, projected HTML, dialogs, sound, form and navigation.
- `config.js`: licensed audio, contact endpoint/email and confirmed statistics.
- `logo-mask.js`: fragment coordinates sampled from the original W mark.
- `assets/textures`: compressed derivatives used in the scene.
- `assets/originals`: all ten available uploads, preserved unchanged.

To expand the team, add a founder installation to the HTML and the corresponding handler/content in `app.js`. Keep real portraits and approved biographies separate from concept renders.

## Music
With sound creates a quiet original synthesized ambient tone after the user's click. Set `audioUrl` in `config.js` to a local/hosted soundtrack you have permission to use to replace it. Navigation Sound On/Off controls the local soundtrack. The musical-note control offers a Spotify player and the supplied track link; Spotify requires its own Play action. Sound Off also removes the embedded Spotify player. No Spotify audio has been downloaded or reproduced.

## Before launch
- Add real client imagery, approved project scopes and measured outcomes. Current gallery visuals are Westside brand artwork and explicitly labeled placeholders.
- Add founder portraits and approved biographies. Supplied founder names and roles are included.
- Confirm the contact destination. The user-requested address is `hello@thewestsidestudios.com`; the local sales deck lists `info@thewestsidestudios.com`. `config.js` is the source for the contact form destination; update the displayed link in HTML as well if changing it.
- Configure `contactEndpoint` for real form submission. It must accept JSON fields `name`, `email`, `service`, `message`, and return a successful HTTP status only on successful delivery. Until configured, the form only prepares a draft and brief locally.
- Only the 8-year agency-experience claim is populated, supported by the supplied sales deck. Other statistics remain marked placeholders until confirmed.

## Asset availability
The referenced conversation described 11 uploads, but exposed 10 attachment files. Those ten are included. An asset manifest records hashes of all preserved originals. No synced project source material was modified.

## Verification
Run `node verify.cjs` for exhaustive camera-path and projected-installation math tests. See `QA.md` for browser validation, responsive checks and remaining limitations.
