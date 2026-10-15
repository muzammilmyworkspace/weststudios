# ENTER THE WESTSIDE — experience specification

## Asset audit
Ten original uploads are available: two Westside logos, eight red/black cinematic environment renders. All originals are copied unchanged into assets/originals. Compressed derivatives are used as in-world artwork. No portraits or actual client project screenshots are available. The local sales deck confirms founders, an 8-year agency-experience claim and portfolio brand names. Project metrics other than the experience claim remain explicit placeholders.

## Environment
Buildless, dependency-free WebGL geometry, not a video or CSS-only simulated corridor. Black concrete shells, pillars, stepped ceiling ribs, reflective-look floor shading, emissive red inlays, translucent light volumes, curved red filament installations, and fog. Distinct rooms linked by short transitional thresholds. Text and controls are semantic HTML panels projected using the same camera matrix as the 3D world.

## Master camera timeline
| Progress | Space | Camera behavior | Interaction |
| --- | --- | --- | --- |
| 0–10% | W threshold | W fragments assemble; click entry; camera passes between opening halves | Sound choice, bypass intro |
| 10–25% | Narrow arrival corridor | Walk forward; turn right; dwell facing 8m-wide hero installation | Work and project CTAs; changing hero word |
| 25–40% | Open service lab | Move through doorway; turn left and dwell | Seven physical service selectors; forward/illuminated selected object; changing demonstration |
| 40–58% | Wide gallery | Look right, left, right while advancing past three framed works | Case-study dialogs keep scene behind them; pointer parallax |
| 58–70% | Tall numbers chamber | Wide upward views to opposing walls | Architectural text; confirmed experience counts to 8; unknown metrics labeled pending |
| 70–82% | Intimate studio | Slow down and turn left toward editorial story installation | Philosophy and studio imagery |
| 82–92% | Boardroom | Curve around the table and chairs, then face founder installations | Founder selectors expose supplied names/roles; no fabricated portraits or biographies |
| 92–100% | End portal | Approach door and dwell | Contact form; prepare email/download brief locally; successful configured endpoint may send |

## Interaction and accessibility
Native scroll drives a damped progress value. Position and look-at targets use smooth keyframe interpolation; no free roaming. Minimal chapter menu provides direct travel. Skip intro, next/previous controls, Home/End and a reading-view switch prevent trapping. Dialogs pause movement and restore focus. Only the active semantic panel is interactive. Reduced motion snaps between readable chapter views and disables bob, ambient movement and flashes. Default red cursor expands with VIEW/OPEN/ENTER labels.

## Hands
Low-poly, articulated silhouette arms/palms/fingers rendered in camera space, appearing during the portal crossing and subtly at the lower edge while moving. No weapons, HUD or game controls.

## Responsive behavior
Desktop: full geometry, capped resolution, all gallery installations. Mobile: lower pixel ratio, fewer filaments, no hands; the same guided camera with screen-aligned active HTML panels for reliable reading and touch. Unsupported WebGL: fixed-image chapter mode, all interactions/navigation intact. Reading mode available on any device.

## Audio
Entry is user initiated. Choose with/without sound. A synthesized quiet ambience is optional and original; a licensed/local soundtrack can be configured later. Spotify remains a user-initiated embed/link and cannot be ripped or force-played. Sound control stops local audio; Spotify playback is handled within its own player.

## Performance and validation
Batch static geometry by material, cap pixel ratio, no continuous shadow maps, compressed local textures, bounded draw calls, suspend rendering while hidden. Test math/path endpoints and finite camera matrices, chapter navigation, dialogs, services, team, contact, resize, touch layout, reduced motion and WebGL failure. Browser verification requires an approved local preview server.
