# Design system — Forge / Graphite Signal

## Color tokens
### Dark (default)
| Token | HEX | Use |
|---|---|---|
| `bg.canvas` | `#0B0D0C` | App background |
| `bg.sidebar` | `#101310` | Navigation surface |
| `bg.surface` | `#151916` | Main panels |
| `bg.elevated` | `#1B211C` | Menus, popovers |
| `bg.input` | `#111512` | Composer/input |
| `text.primary` | `#F1F4ED` | Primary copy |
| `text.secondary` | `#A7B0A4` | Supporting copy |
| `text.muted` | `#778174` | Metadata |
| `border.default` | `#293129` | Standard separators |
| `border.strong` | `#3A4739` | Emphasis/focus boundary |
| `accent.primary` | `#C7F36B` | Primary action, selected state |
| `accent.hover` | `#D7FF8C` | Hover |
| `accent.ink` | `#17210D` | Text on lime |
| `state.success` | `#78C99A` | Success |
| `state.warning` | `#E6B86A` | Warning |
| `state.error` | `#EF8178` | Error |
| `state.info` | `#8EB8D8` | Informational |
| `agent.planner` | `#C7F36B` | Planner identity |
| `agent.researcher` | `#8EB8D8` | Research |
| `agent.coder` | `#C49BE8` | Coding |
| `agent.reviewer` | `#E6B86A` | Review |

### Light
| Token | HEX | Use |
|---|---|---|
| `bg.canvas` | `#F4F5EF` | App background |
| `bg.sidebar` | `#ECEFE7` | Navigation |
| `bg.surface` | `#FFFFFF` | Panels |
| `bg.elevated` | `#FFFFFF` | Menus |
| `bg.input` | `#FAFBF7` | Composer |
| `text.primary` | `#1A2119` | Primary copy |
| `text.secondary` | `#53604F` | Supporting copy |
| `text.muted` | `#758171` | Metadata |
| `border.default` | `#DCE2D7` | Standard separators |
| `border.strong` | `#B7C2B0` | Emphasis |
| `accent.primary` | `#557D1F` | Primary action |
| `accent.hover` | `#46691A` | Hover |
| `accent.ink` | `#FFFFFF` | Text on accent |
| `state.success` | `#277C4B` | Success |
| `state.warning` | `#95610D` | Warning |
| `state.error` | `#B43E37` | Error |
| `state.info` | `#356B96` | Information |

Agent colors are labels, not state colors; always pair with text/icon so meaning is not color-only.

## Typography
- UI/display: **Inter** (fallback `ui-sans-serif, system-ui`). Use one family; avoid gratuitous font mixing.
- Code/metadata: **IBM Plex Mono** (fallback `ui-monospace, SFMono-Regular`).
- Display hero: 52/56 px, weight 600, letter spacing -0.045em; desktop only. Mobile 38/42.
- Page title: 28/34 px, 600, -0.03em.
- Section title: 18/26 px, 600.
- Body: 14/22 px, 400.
- Small: 12/18 px, 400.
- Label: 11/14 px, 600, +0.04em; uppercase only for compact metadata.
- Code: 12.5/20 px, 400.

## Spacing scale
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 px. Default component gap 8 or 12; section gap 32; major section gap 64.

## Geometry and layout
- Desktop shell: 56 px rail + 248 px sidebar + flexible canvas + 420 px optional inspector.
- Header: 56 px.
- Composer max width: 860 px; body max width: 900 px.
- Landing content max width: 1200 px; 24 px page gutters.
- Standard radius: 8 px controls, 12 px panels, 16 px hero demonstration. Avoid 24+ px repeated cards.
- Borders: 1 px solid; shadows only for overlays (`0 16px 48px rgba(0,0,0,.28)`).
- Breakpoints: 640, 768, 1024, 1280, 1440 px.

## Component contracts
- Primary button: 36 px height, 8 px radius, lime fill, dark ink, semibold; hover + brightness, active translateY(1px), disabled opacity .45.
- Secondary: transparent/low-contrast surface, border; hover surface raise.
- Destructive: red text + subtle red hover surface; confirmation for destructive bulk action.
- Inputs: 40 px min height, 8 px radius, border; focus 2 px accent outline with 2 px offset.
- Composer: multiline 96–180 px max text region, tool row, selected mode selector; send button 36 px square.
- Badges: 20 px height, semantic color + text; do not use as decorative tags.
- Modal: max 480 px, 16 px padding, labelled title, Escape close, focus trap.
- Drawer: 400 px desktop; full-screen on mobile.
- Toast: bottom-right desktop / top mobile; announce via aria-live.
- Skeleton: neutral shimmer only when reduced motion allows; otherwise static blocks.
- Empty state: concise statement + one primary action + optional example prompt.

## Iconography
Use Lucide outline icons, 16–18 px standard, 1.75 px stroke. No emoji as core UI iconography. Icon-only buttons require accessible names and tooltips.

## Elevation
Canvas = 0, panel = 1 (border only), popover = 2, modal = 3. Avoid stacking shadows on nested surfaces.
