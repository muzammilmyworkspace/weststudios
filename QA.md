# Validation — 14–15 October 2026

## Passed
- All JavaScript files parse successfully.
- 10,001 camera-path samples: finite matrices, nonzero view direction, continuous position, clamped start/end values.
- Projection of hero, service lab, gallery, about, team and contact anchors onto the viewport center.
- Camera route curves around the boardroom table footprint instead of crossing it.
- Real WebGL compilation and rendering in the local browser; console checks returned no warnings or errors during tested journeys.
- Fresh entrance, click-to-enter sound choice, W crossing, initial arrival at progress 0.115, replay and skip.
- Scroll forward changed the camera from corridor z = -22 to z = -32.63; reverse scrolling returned toward the arrival installation.
- All seven service selectors changed active state, demonstration title and description.
- Case dialogs opened for Bold & Stitch, Sable Studio and Scott Medical Equipment. Story tabs and close/return were tested.
- All ten installations reachable through next/previous controls: hero, services, three works, two statistics walls, about, team and contact.
- Menu travel tested to Home, Services and Team; the remaining chapters were reached through the guided route and CTAs.
- Founder selection revealed supplied names/roles, including Amees Ali.
- Local form preparation with fictional test data: no external message sent. Form hides after preparation, welcome state appears, downloadable brief works, return restores the world.
- Sound On/Off toggled original ambience; optional Spotify embed uses the supplied track, and Sound Off removes it.
- Layouts inspected at 1440×900, 1280×720 and 390×844. Mobile navigation and service selection worked; content remains internally scrollable with persistent chapter controls.
- Reduced-motion branch tested through the supported `?motion=reduce` URL: stable reading layout and chapter navigation.
- WebGL-unavailable branch tested through `?renderer=off`: all content/navigation, founder selection and audio controls remain operational.
- Asset references checked; all ten original uploads match the previous preserved source copies byte-for-byte.

## Observed performance
In the tested desktop browser, the post-entrance scene reported 42 draw calls, approximately 9,500 triangles and a mean frame interval of 16.67 ms (approximately 60 fps). The W assembly adds batched portal geometry during the entrance. No texture upload errors were recorded. Eight compressed scene images total 403,010 bytes; preserved originals are not loaded as scene textures. Pixel ratio is capped at 1.5 on desktop and 1 on mobile. Real physical mobile devices and additional GPU/browser combinations were not benchmarked.

## Intentional preview boundaries
- Client gallery images, specific scopes and outcomes are pending. The render artwork is labeled as Westside brand imagery.
- Founder portraits and approved personal biographies are not available; their supplied names/roles are included.
- Figures other than the experience claim reported in the sales deck remain labeled placeholders.
- A real form endpoint and licensed soundtrack are optional configuration tasks. The shipped contact form prepares a draft/brief locally; it does not report an email as sent.
- Floor reflections, fog, light volumes and hands are stylized lightweight geometry/shaders. There are no shadow maps, ray-traced reflections or photoreal hand models.
- Direct local-file opening can restrict WebGL image uploads; the complete texture path was tested through the local HTTP preview.
