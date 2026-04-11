# Design System: Cyber-Athletic Protocol



## 1. Overview & Creative North Star

**Creative North Star: "The Kinetic Engine"**



This design system is engineered to feel like a high-performance machine. It moves away from the static, "admin-panel" aesthetic of traditional gym management software and toward a "tactical HUD" experience. The goal is to evoke the intensity of a high-end training facility through high-contrast tonal shifts and a sophisticated industrial finish.



To break the "template" look, we leverage **Intentional Asymmetry**. Dashboards should not be perfectly symmetrical; use weighted layouts where the primary "Voltage Green" data point anchors one side, balanced by expansive, dark negative space. We utilize overlapping elements—such as "floating" glass cards that partially obscure background textures—to create a sense of depth and architectural layering.



---



## 2. Colors & Surface Philosophy



### The Tonal Palette

Our palette is rooted in the depth of `surface` (#0e0e0e) to allow our "Voltage Green" (`primary` #d0ff3c) to vibrate with digital energy.



*   **Primary (`primary` #d0ff3c):** The "Voltage Green." Use this for high-priority actions, active states, and performance peaks.

*   **Secondary (`secondary` #6bfe9c):** An "Electric Mint." Used for success states and secondary growth metrics.

*   **Surface Containers:** A hierarchy from `surface_container_lowest` (#000000) to `surface_container_highest` (#262626).



### The "No-Line" Rule

**Prohibit 1px solid borders for sectioning.** Conventional lines create visual "noise" that breaks the immersion. Instead:

*   Define boundaries through **Background Color Shifts**. A `surface_container_low` card sitting on a `surface` background provides all the definition needed.

*   Use vertical whitespace from our spacing scale to denote content groups.



### Surface Hierarchy & Nesting

Treat the UI as a series of physical layers.

*   **Base:** `surface` (The floor of the gym).

*   **Modules:** `surface_container_low` (The equipment).

*   **Interactive Elements:** `surface_container_high` (The touchpoints).

Always nest darker containers within lighter sections (or vice-versa) to create "natural" depth without a single stroke of a pen tool.



### The "Glass & Gradient" Rule

To achieve "Cyber-Athletic" polish:

*   **Glassmorphism:** For floating modals or "quick-view" overlays, use `surface_variant` at 60% opacity with a `24px` backdrop-blur.

*   **Kinetic Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#d0ff3c) to `primary_container` (#c0f108) at a 135-degree angle. This adds a "weighted" feel that flat hex codes lack.



---



## 3. Typography: Precision & Power



Our typography strategy balances the "Cyber" (Space Grotesk) with the "Athletic" (Inter).



*   **Display & Headlines (Space Grotesk):** This is our "Brand Voice." Its geometric, wide apertures feel tech-forward and industrial. Use `display-lg` for hero metrics (e.g., "Total Revenue") to make them feel like a scoreboard.

*   **Body & Labels (Inter):** This is our "Utility Voice." In data-heavy gym schedules or member rosters, Inter provides the necessary neutrality and legibility.



**The Hierarchy Rule:** Headlines should always be uppercase or "Headline Case" to maintain a professional, authoritative tone. Labels (`label-md`) should use tracking (letter-spacing) of +5% to +10% to mimic technical blueprints.



---



## 4. Elevation & Depth



### The Layering Principle

Forget shadows; think in **Tonal Stacking**.

*   To "lift" an element, move up the surface container scale.

*   Example: A member’s check-in card (`surface_container_high`) sitting on the main dashboard (`surface_container_lowest`).



### Ambient Shadows

When an element must "float" (like a dropdown or toast):

*   Use a shadow with a blur of `40px` and an opacity of `8%`.

*   **Color Tinting:** The shadow must be tinted with `primary` (#d0ff3c) at extremely low saturation to simulate the green glow of the UI reflecting off the background.



### The "Ghost Border" Fallback

If a border is required for extreme accessibility:

*   **Token:** `outline_variant` at 15% opacity.

*   **Style:** It must feel like a "whisper" of a line, not a hard enclosure.



---



## 5. Components



### Buttons

*   **Primary:** Solid `primary` background with `on_primary` text. No border. High-contrast.

*   **Secondary:** `surface_container_highest` background with a `primary` "Ghost Border."

*   **Tertiary:** Ghost button (no background) using `primary` text.



### Cards & Lists (The "Anti-Divider" Rule)

*   **No Dividers:** Forbid the use of `1px` lines between list items.

*   **The Technique:** Use a `12px` vertical gap between items. Use a subtle hover state transition to `surface_container_lowest` to highlight the active row.



### Performance Inputs

*   **Input Fields:** Use `surface_container_highest` as the fill. On focus, the bottom edge gains a `2px` "Voltage Green" stripe.

*   **Status Indicators:** Use the `error` (#ff7351) and `secondary` (#6bfe9c) tokens in high-saturation "Glow" states (using a 4px outer blur) to mimic hardware LEDs.



### Custom Component: The "Biometric Pulse"

A custom data visualization component for member activity. It uses a `secondary` to `tertiary` gradient line chart, layered over a `surface_container_low` background with a subtle "Glass" overlay for the tooltip.



---



## 6. Do’s and Don’ts



### Do:

*   **Do** use extreme contrast. If it’s not `primary` green or `surface` charcoal, it should be a deliberate, neutral step in between.

*   **Do** allow elements to breathe. Large margins emphasize the "high-end" nature of the suite.

*   **Do** use "Voltage Green" sparingly. It is a laser, not a paint bucket.



### Don't:

*   **Don't** use standard "Grey." Use our `surface` tiers which are slightly warm/charcoal to avoid a "washed out" look.

*   **Don't** use rounded corners larger than `xl` (0.75rem). We want an industrial, precision-cut look, not "bubbly" consumer tech.

*   **Don't** use default 1px dividers. If the UI feels cluttered, increase the whitespace, don't add more lines.

----

# Design System Specification: The Clinical Athlete



## 1. Overview & Creative North Star

The "Pure Kinetic" philosophy drives this design system, positioning the gym management suite not just as a tool, but as a high-performance instrument. Our Creative North Star is **"The Clinical Athlete."**



We move away from the cluttered, dark-mode "gritty gym" aesthetic toward a world that feels airy, sterile, and elite—reminiscent of a professional sports science laboratory. By prioritizing vast white space, intentional asymmetry, and tonal depth over structural lines, we create an environment that reduces cognitive load for managers while maintaining a high-energy "kinetic" pulse.



The "Pure Kinetic" look is achieved by breaking the rigid, boxed-in nature of standard SaaS. We use overlapping layers and subtle glassmorphism to imply movement and transparency, ensuring the UI feels as fast and responsive as the athletes it tracks.



---



## 2. Colors & Surface Philosophy

The palette is rooted in pure whites and cool grays, punctuated by a high-octane athletic blue.



### The "No-Line" Rule

To achieve a premium, editorial feel, **1px solid borders are strictly prohibited** for sectioning or containment. Boundaries must be defined through:

1.  **Background Color Shifts:** Use the hierarchy of `surface` tokens.

2.  **Tonal Transitions:** Defining a space by placing a `surface-container-lowest` (#ffffff) element against a `surface` (#f5f6f7) background.



### Surface Hierarchy & Nesting

Treat the UI as a physical stack of semi-transparent materials. Depth is created through nesting rather than lines:

- **Base Level:** `surface` (#f5f6f7)

- **Primary Content Area:** `surface-container-low` (#eff1f2)

- **High-Priority Cards:** `surface-container-lowest` (#ffffff) for maximum "pop" and clarity.

- **Interactive Overlays:** `surface-bright` (#f5f6f7) with a backdrop blur.



### Glass & Gradient Accents

- **Glassmorphism:** For floating navigation or modal headers, use `surface-container-lowest` with 80% opacity and a 20px backdrop-blur.

- **Signature Textures:** Use a subtle linear gradient for primary CTAs, transitioning from `primary` (#0052d0) to `primary_container` (#799dff) at a 135-degree angle. This adds a "kinetic" soul to the button that flat color cannot replicate.



---



## 3. Typography: The Kinetic Scale

We utilize a dual-typeface system to balance technical precision with athletic energy. Tracking should be tightened by -0.01em to -0.02em for headlines to create a "locked-in" professional look.



*   **Display & Headlines (Inter):** Used for data peaks and section titles. Inter’s neutral, technical character provides the "Clinical" feel.

    *   *Display-LG (3.5rem):* Reserved for hero metrics (e.g., total gym revenue).

    *   *Headline-SM (1.5rem):* Standard section header.

*   **Body & Titles (Public Sans):** Used for all reading and functional UI labels. Public Sans offers slightly more "openness" which helps legibility in high-density data tables.

    *   *Title-MD (1.125rem):* Used for card titles and sub-headers.

    *   *Body-MD (0.875rem):* The workhorse for all primary content.



---



## 4. Elevation & Depth

Depth is the primary differentiator between "template" design and "custom" experiences.



- **The Layering Principle:** Use the elevation scale to stack surfaces. An "Elite" dashboard uses `surface-container-low` for the sidebar, `surface` for the main canvas, and `surface-container-lowest` for the individual data widgets.

- **Ambient Shadows:** Shadows are never black. Use a blur of 30px-40px with a 4% opacity of the `on-surface` color (#2c2f30). This creates a "lift" that feels like natural light in a bright room.

- **The Ghost Border:** If a boundary is required for accessibility (e.g., input fields), use `outline-variant` (#abadae) at 15% opacity. It should be felt, not seen.

- **Roundedness:** Apply the `md` (0.75rem / 12px) radius to all primary cards and the `sm` (0.25rem / 8px) radius to smaller components like chips or inputs.



---



## 5. Components



### Buttons

*   **Primary:** Uses the Primary-to-Primary-Container gradient. 12px rounded corners. White text (`on-primary`).

*   **Secondary:** `surface-container-high` background with `primary` text. No border.

*   **Tertiary:** Ghost style. No background; `primary` text with an underline appearing only on hover.



### Cards & Lists

*   **Cards:** Forbid divider lines. Use `vertical white space` (24px-32px) to separate grouped content. Apply `surface-container-lowest` with an ambient shadow for "Hero" cards.

*   **Lists:** Separate list items with a subtle color shift on hover (`surface-container-low`) rather than a line.



### Input Fields

*   **The Clinical Input:** Background: `surface-container-highest` (#dadddf) at 40% opacity. No border. On focus, transition to a 1px `primary` ghost border (20% opacity) and a `surface-container-lowest` background.



### Athletic Chips

*   Use `secondary_container` for inactive states and `tertiary_container` (#ff956b) for high-alert "Kinetic" states (e.g., a member's membership about to expire).



---



## 6. Do's and Don'ts



### Do:

*   **DO** use whitespace as a structural element. If an interface feels "crowded," increase the padding rather than adding a divider.

*   **DO** use "surface-tint" overlays for modals to keep the clinical, light-washed feel.

*   **DO** use tight tracking on Inter headlines to convey a sense of high-performance urgency.



### Don't:

*   **DON'T** use 100% black text. Always use `on-surface` (#2c2f30) for better optical comfort against pure white.

*   **DON'T** use standard "drop shadows." If the shadow is noticeable, it’s too heavy. It should be an "ambient glow."

*   **DON'T** use traditional 1px borders. If you feel the need for a line, try a 4px wide vertical "accent bar" using the `primary` color on the left side of the element instead.



---



## 7. Signature UI Patterns (Gym Context)

*   **The Pulse Metric:** A large `Display-LG` number with a subtle `tertiary` (Citrus) glow behind it to indicate a "Live" gym floor count.

*   **The Glass Sidebar:** A left-hand navigation using `surface-container-low` with a subtle backdrop blur, making the gym's brand photography (behind the UI) feel part of the experience.
