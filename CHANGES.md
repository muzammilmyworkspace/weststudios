# Polish pass: 15 October 2026

- **Soundtrack:** the supplied Ice Cube instrumental plays on "Enter with sound" (`assets/audio/westside-theme.mp3`, set in `config.js`). It needs a licence before public launch.
- **W portal rebuilt from the original logo:**
  - The 36-column cube grid became 108 columns (8,450 cubes) for the assembly animation.
  - An exact smooth W face (`WESTSIDE_W_FACE`) fades in when assembly completes, so the edges and the V-notch match the logo instead of looking like stair steps.
- **Crisp text:** removed `will-change: transform` from the projected panels. Chrome had been rasterising them at low resolution, which made the text blurry.
- **Readable statistics walls:** `numbers-a` and `numbers-b` (and partly `about`) now blend toward a screen-facing transform. The text is no longer badly skewed.
- **Hands removed:** the camera-space hands read as odd red shapes at the bottom of the screen.
- **Hero word cycle:** removed "WEBSITES.", which made the line read "We don't just build websites. We build websites."
- **Placeholder copy removed from public view:**
  - Gallery labels now give real descriptions.
  - Case-study dialogs have challenge, approach and outcome text for Bold & Stitch and Sable Studio. Scott Medical is marked "in preparation".
  - The numbers wall shows true studio facts (7 capabilities, 3 founding client brands, 2 founders, 1 system).
  - The founder line is a neutral statement.
- **Portrait screens:** a wider field of view (`WorldMath.fov`) keeps the W portal and the rooms on screen on phones.
- **Checks:** `node verify.cjs` passes. Desktop and mobile browser runs completed with no errors.
- **Originals:** pre-polish files are kept in `_backup-before-polish/`.
