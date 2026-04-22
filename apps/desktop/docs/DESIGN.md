# Design System Specification: The Serene Geometric Archive

## 1. Overview & Creative North Star: "The Digital Sanctuary"
This design system is built to transform a mental health interface into a meditative experience. Our Creative North Star is **The Digital Sanctuary**—a philosophy that rejects the "noisy" density of modern SaaS in favor of editorial breathing room, sacred geometry, and soft tonal shifts.

We move beyond the "template" look by utilizing **Intentional Asymmetry**. Instead of perfectly centered grids, we use the 8px foundation to create weighted layouts where content feels anchored but not trapped. By blending the mathematical precision of Islamic art with high-end editorial typography, we create an environment that feels both professional and deeply personal.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
Our palette is rooted in the earth and the infinite. We use color not just for branding, but for emotional regulation.

### Core Palette
- **Primary (Deep Teal):** `#00595c` | Stability and depth.
- **Secondary (Sand Gold):** `#735c00` | Warmth and wisdom.
- **Tertiary (Sage Green):** `#3a572f` | Growth and restoration.
- **Surface (Off-White):** `#faf9f5` | The base "canvas."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Boundaries must be defined solely through background color shifts. Use `surface-container-low` for large content blocks and `surface-container-highest` for high-importance interaction areas. 

### Glass & Gradient Soul
To avoid a flat, "out-of-the-box" feel, use **Signature Textures**:
- **Hero Gradients:** Transition from `primary` (#00595c) to `primary_container` (#0d7377) at a 135-degree angle to provide visual "soul."
- **Frosted Elements:** Use `surface_container_lowest` with a 12px Backdrop Blur (20% opacity) for floating navigation bars or modal headers.

---

## 3. Typography: The Golden Pairing
The typography is the voice of the system. We use a Golden Ratio scale to ensure every heading feels mathematically harmonious with the body text.

| Level | Token | Font Family | Size | Character |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope / Noto Sans | 3.5rem | Authoritative, calm |
| **Headline** | `headline-md` | Manrope / Noto Sans | 1.75rem | Clear, welcoming |
| **Title** | `title-lg` | Inter / Noto Sans | 1.375rem | Structural, confident |
| **Body** | `body-lg` | Inter / Noto Sans | 1.0rem | High legibility |
| **Label** | `label-md` | Inter / Noto Sans | 0.75rem | Functional |

**Bi-Directional Harmony:** When switching between LTR (English) and RTL (Arabic), the `line-height` for Arabic must be increased by 20% compared to Latin to accommodate the script's ascending and descending flourishes.

---

## 4. Elevation & Depth: Tonal Layering
We do not "drop shadows" on every card. We "lift surfaces" through light.

- **The Layering Principle:** Place a `surface_container_lowest` card (Pure White) on a `surface_container_low` background. The difference in hex value creates a soft, natural lift.
- **Ambient Shadows:** For floating action buttons or critical crisis cards, use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(27, 28, 26, 0.06);`. The shadow color must be a tint of the `on_surface` color, never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at 15% opacity. Never use 100% opaque lines.

---

## 5. Components: Intentional Primitives

### Buttons (The "Weight" System)
- **Primary:** `primary` background with `on_primary` text. 12px (`md`) radius.
- **Secondary:** No background. `primary` text with a `surface_variant` hover state.
- **Crisis CTA:** `error` background (#ba1a1a). Reserved strictly for emergency help features.

### Cards & Lists (The "Breath" System)
- **Rule:** Forbid divider lines. Use 24px (3x 8px) of vertical white space to separate list items.
- **Interaction:** Cards should utilize the `md` (12px) roundedness scale. On hover, a card should shift from `surface` to `surface_bright` rather than growing in size.

### Geometric Pattern Overlays
Incorporate subtle Islamic geometric patterns (8-point stars/Girih) as low-opacity masks (3%–5%) inside `primary_container` sections. This adds a layer of cultural "texture" that feels high-end and bespoke.

### Specialized Components
- **The Mood Tracker (Radial):** A non-linear input using concentric circles to represent emotional states.
- **Reflection Spaces:** Large, open text areas with `body-lg` typography and zero borders, utilizing a `surface_container_highest` background to signify a "safe space" for typing.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** If you think a section needs more content, it probably needs more padding.
- **Use Mirror-Logic for RTL:** Icons that indicate direction (arrows, progress bars) must flip. Icons that are symmetrical or represent objects (clock, heart) stay static.
- **Layer for Importance:** Use the `surface-container` tiers to guide the eye toward the most important action on the screen.

### Don't:
- **Don't use 1px Dividers:** They create visual "friction" and "stutter" in a calming experience.
- **Don't use Pure Black:** Always use `on_surface` (#1b1c1a) for text to reduce eye strain.
- **Don't crowd the Corners:** Maintain a minimum of 24px screen margin at all times to ensure the UI feels "ungoverned" and spacious.