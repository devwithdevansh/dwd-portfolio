## TASK

I want you to redesign the current `/hero-lab` experience into a **scroll-driven spatial / camera-navigation experience**.

Do NOT treat this as a normal vertical landing page.

The intended experience is closer to:

* A large physical desk / engineering board / workspace
* Assets are physically positioned around a large 2D/2.5D canvas
* The user is effectively "walking" through this workspace
* Scrolling controls the camera position
* The background/workspace itself remains visually stable
* Individual assets remain fixed at their positions in the world
* As the user scrolls, the camera travels from one area of the workspace to another
* Every asset must eventually become clearly visitable and readable
* The movement should feel intentional, smooth and cinematic rather than like random parallax

The current screenshots show the right visual direction, but the spatial/navigation implementation needs to be substantially improved.

---

# 1. FIRST: INSPECT THE EXISTING PROJECT

Before changing anything:

1. Inspect the entire existing `/hero-lab` implementation.
2. Identify:

   * React components
   * CSS
   * asset-loading logic
   * image/background-removal logic
   * animation libraries already installed
   * scroll handling
   * routing
   * responsive behavior
3. Understand how the current assets are positioned.
4. Do NOT blindly rewrite the project.
5. Reuse the existing architecture where practical.
6. Preserve the current visual identity unless it conflicts with the new spatial navigation.

Before implementation, determine the cleanest architecture for the effect.

If GSAP/ScrollTrigger, Lenis, Framer Motion, or another animation system is already installed, evaluate whether it should be used instead of introducing unnecessary dependencies.

---

# 2. CORE EXPERIENCE

The website should feel like a **large infinite-ish physical workspace** rather than a stack of webpage sections.

Think of the viewport as a camera looking down onto a large board.

The board/world contains:

* Main title board
* Engineering blueprint
* UI/dashboard asset
* Physical infrastructure illustration
* Pencil
* Other notes/cards/assets
* Future assets that may be added later

These objects should have their own fixed coordinates in the world.

For example conceptually:

```text
                    ┌───────────────┐
                    │   DASHBOARD   │
                    │   UI ASSET    │
                    └───────────────┘


       ┌───────────────────────┐
       │ ENGINEERING BLUEPRINT │
       └───────────────────────┘


              ✏
            PENCIL


                    ┌─────────────────────────┐
                    │                         │
                    │       MAIN BOARD        │
                    │                         │
                    │ BUSINESS EXPERIENCE    │
                    │ ENGINEERS              │
                    │                         │
                    └─────────────────────────┘


       ┌────────────────────────────┐
       │ AUTOMATION FLOW            │
       └────────────────────────────┘


                           ┌─────────────────────┐
                           │ PHYSICAL            │
                           │ INFRASTRUCTURE      │
                           └─────────────────────┘
```

This is only conceptual.

Use the actual existing assets and arrange them into a much more intentional spatial composition.

---

# 3. THE BACKGROUND MUST BE STATIC

This is extremely important.

The current background/grid should act like the **physical surface of the workspace**.

It should NOT independently scroll like a normal webpage background.

The visual surface should remain consistent while the camera moves through the world.

Do NOT create the illusion by repeatedly moving the background image itself.

Instead:

```text
WORLD / CANVAS
    |
    |-- background/grid
    |
    |-- asset 1
    |-- asset 2
    |-- asset 3
    |-- asset 4
    |-- asset 5
    |
    └── camera position changes based on scroll
```

The camera moves.

The world contains the objects.

This distinction is critical.

---

# 4. SCROLL = CAMERA MOVEMENT

Scrolling should control a virtual camera.

Do NOT simply translate every asset independently based on arbitrary scroll values.

Create a world coordinate system.

For example:

```js
const world = {
  width: 5000,
  height: 4000
}
```

Each asset has a world position:

```js
{
  id: "engineering-blueprint",
  x: 1200,
  y: 700,
  rotation: -4,
  scale: 1
}
```

Then maintain a camera:

```js
camera = {
  x,
  y,
  zoom
}
```

Scroll progress determines the camera's movement through the world.

Conceptually:

```text
SCROLL
   ↓
SCROLL PROGRESS
   ↓
CAMERA PATH
   ↓
WORLD VIEW
   ↓
USER SEES DIFFERENT ASSETS
```

---

# 5. MAKE THE SCROLL PATH INTENTIONAL

Do not simply move from:

```text
top → bottom
```

Instead create a designed camera route through the workspace.

For example:

```text
START

        ↓

MAIN HERO BOARD
        ↓
        ↘
      BLUEPRINT
        ↓
        ↘
       PENCIL
        ↓
        ↓
 AUTOMATION FLOW
        ↓
        ↘
 PHYSICAL INFRASTRUCTURE
        ↓
        ↗
   DASHBOARD/UI
        ↓
       END
```

The exact path should be based on the actual assets available in the project.

The user should feel like they are **exploring a large workspace**.

---

# 6. EVERY ASSET MUST BE VISITABLE

This is one of the biggest problems in the current implementation.

Some assets currently appear partially outside the viewport or behind other objects.

That is NOT acceptable.

Every asset must have a dedicated moment in the camera path where:

* It is visible
* It is sufficiently large
* It is not clipped
* It is not hidden behind another asset
* The user can understand what it is
* Important text/details are readable
* There is enough surrounding whitespace

For each asset define a camera focus position.

Example:

```js
const cameraStops = [
  {
    id: "hero",
    target: { x: 2500, y: 1800 },
    zoom: 0.9
  },
  {
    id: "blueprint",
    target: { x: 1200, y: 800 },
    zoom: 1.15
  },
  {
    id: "pencil",
    target: { x: 900, y: 1100 },
    zoom: 1.4
  },
  {
    id: "automation",
    target: { x: 1400, y: 2700 },
    zoom: 1.1
  },
  {
    id: "infrastructure",
    target: { x: 3500, y: 2700 },
    zoom: 1.05
  },
  {
    id: "dashboard",
    target: { x: 3700, y: 700 },
    zoom: 1.1
  }
]
```

Do not use these coordinates literally.

Calculate appropriate coordinates based on the actual assets.

---

# 7. CAMERA TRANSITIONS

The camera should NOT instantly jump from one asset to another.

Movement should feel like physically moving through the workspace.

Use smooth interpolation.

Desired behavior:

```text
Scroll
 ↓
Camera begins moving
 ↓
Camera accelerates subtly
 ↓
Camera travels toward next area
 ↓
Camera slows down
 ↓
Asset becomes the visual focus
```

Use easing such as:

* smooth ease-in-out
* custom cinematic easing
* slight inertia

Avoid:

* linear robotic movement
* excessive bounce
* elastic effects
* exaggerated zooming
* spinning camera
* nausea-inducing movement

The experience should feel premium and calm.

---

# 8. CAMERA ZOOM

Use zoom selectively.

The camera can slightly zoom in when approaching an important asset and zoom back out while traveling.

Example:

```text
Travel
    ↓
Zoom 0.85

Approaching asset
    ↓
Zoom 1.05

Asset focus
    ↓
Zoom 1.15

Leaving
    ↓
Zoom 0.95
```

Do not make zoom aggressive.

The goal is to create the feeling of moving closer to something on a physical desk.

---

# 9. DEPTH / 2.5D EFFECT

The website should feel spatial without becoming a 3D game.

Use subtle:

* scale differences
* shadows
* rotation
* depth ordering
* slight perspective
* parallax between foreground/background objects

For example:

```text
Background grid
    ↓
World surface
    ↓
Paper cards
    ↓
Floating UI elements
    ↓
Small foreground objects
```

Objects can have different `z-index` / depth values.

But keep the aesthetic clean and editorial.

Do NOT turn this into an excessive 3D WebGL scene unless the existing project already uses WebGL.

A DOM/CSS-based 2.5D implementation is preferred if it provides the required quality.

---

# 10. ASSET POSITIONING SYSTEM

Do NOT hardcode random `top`, `left`, and transform values throughout different components.

Create a centralized spatial configuration.

For example:

```js
const spatialAssets = [
  {
    id: "hero-board",
    src: "...",
    position: { x: ..., y: ... },
    rotation: ...,
    scale: ...,
    depth: ...,
    focusZoom: ...
  },
  {
    id: "blueprint",
    src: "...",
    position: { x: ..., y: ... },
    rotation: ...,
    scale: ...,
    depth: ...
  }
]
```

This will make the environment easy to expand later.

I want to be able to add another asset without rewriting the animation system.

---

# 11. FIX THE CURRENT ASSET SPACING

The current screenshots show assets that are:

* too close to the viewport edge
* partially clipped
* overlapping in awkward ways
* not always visible
* sometimes too small to understand
* positioned without enough breathing room

Re-layout the entire world.

Each asset should have:

* minimum safe margin around it
* enough separation from neighboring assets
* a deliberate orientation
* enough space for the camera to approach it

Think like a real physical board.

Objects should feel intentionally placed rather than randomly scattered.

---

# 12. BACKGROUND REMOVAL MUST ACTUALLY WORK

The current background-removal implementation is not working correctly.

Do NOT simply use:

```css
mix-blend-mode
```

or:

```css
background: transparent;
```

and assume the white background of the image has disappeared.

If an image contains an actual white background baked into the pixels, CSS cannot truly remove those pixels.

The implementation needs to distinguish between:

```text
IMAGE CANVAS
    ↓
WHITE BACKGROUND
    ↓
ACTUAL OBJECT
```

and output/render:

```text
TRANSPARENT
    ↓
ACTUAL OBJECT
```

For assets that are intended to be isolated objects:

* remove the baked-in white background properly
* preserve the object's edges
* preserve shadows where appropriate
* avoid white halos
* avoid jagged edges
* avoid removing white parts that belong to the actual object

If the current assets are already supposed to be transparent PNGs/WebPs, inspect the actual files and verify their alpha channel before changing the implementation.

If background removal is being done dynamically in the browser, determine whether the current approach is reliable.

If not, prefer a proper preprocessing pipeline or correctly prepared transparent assets rather than an unreliable visual hack.

---

# 13. IMPORTANT: DO NOT REMOVE LEGITIMATE WHITE OBJECT DETAILS

Background removal must NOT destroy:

* white paper
* white UI elements
* white text
* white components
* highlights
* reflections that belong to the object

For example, if the asset is a white sheet of paper on a white background, naive "remove all white pixels" logic will destroy the actual paper.

Use edge/subject-aware removal rather than:

```js
if (r > 240 && g > 240 && b > 240) {
   alpha = 0
}
```

unless the asset is specifically guaranteed to contain only a colored object on white.

---

# 14. PAPER / CARD OBJECTS

The paper/card elements should feel physical.

Give them subtle:

* realistic shadow
* tiny rotation
* slight elevation
* clean edges
* minimal perspective

Avoid excessive shadows.

The visual style should remain close to the screenshots:

* off-white
* warm paper
* dark typography
* subtle orange accent
* very light grid
* editorial/engineering aesthetic

---

# 15. MAIN HERO BOARD

The large central:

**BUSINESS
EXPERIENCE
ENGINEERS**

board should remain the primary visual anchor.

At the beginning of the experience:

* it should be the first major object users see
* it should be centered properly
* it should have enough breathing room
* it should not be clipped
* it should feel physically placed on the workspace

Then scrolling should gradually move the camera away from it and reveal the surrounding assets.

Do not immediately throw the user into a random corner of the world.

---

# 16. SCROLL EXPERIENCE

The page itself should still have enough scrollable height to allow the interaction.

For example:

```text
Browser viewport
      ↓
Scroll container
      ↓
Long scroll progress
      ↓
Camera path
      ↓
Large world
```

The world itself can remain fixed in a viewport container while the scroll position drives the camera.

One possible architecture:

```jsx
<main className="experience">

  <div className="scroll-track">
    {/* creates scroll distance */}
  </div>

  <div className="viewport">
    <div className="world">
      <Background />
      <Assets />
    </div>
  </div>

</main>
```

The important part is that the `world` does not behave like ordinary document content.

The camera transforms the world based on scroll progress.

---

# 17. SCROLL TRACK LENGTH

The scroll track should be long enough to allow the user to comfortably explore every area.

Do NOT make the entire journey happen in 500px or 1000px.

The user should have time to perceive:

```text
asset
    ↓
travel
    ↓
next asset
    ↓
travel
    ↓
next asset
```

The exact scroll length should be dynamically determined by the number of camera stops / path length.

---

# 18. SCROLL INERTIA

If a smooth scrolling library is already available, use it.

Otherwise consider a lightweight implementation.

Desired behavior:

* mouse wheel feels smooth
* trackpad feels smooth
* high-resolution scrolling works
* touch scrolling works
* no scroll-jumping
* no frame-rate dependent animation
* no excessive lag

Use `requestAnimationFrame` where appropriate.

Avoid heavy work inside the raw `scroll` event.

---

# 19. MOBILE / RESPONSIVE

Do NOT simply shrink the desktop world onto a phone.

On mobile, recalculate the camera framing.

Every asset must still be visitable.

Possible behavior:

Desktop:

```text
large workspace
camera moves diagonally/horizontally/vertically
```

Mobile:

```text
narrower camera
more vertical travel
smaller camera jumps
appropriate zoom
```

The spatial concept should remain intact.

---

# 20. CAMERA BOUNDARIES

The camera must never reveal:

* empty unintended areas
* outside of the workspace
* broken background edges
* asset clipping
* blank regions that look like implementation mistakes

Implement world boundaries.

Conceptually:

```js
camera.x = clamp(camera.x, minX, maxX)
camera.y = clamp(camera.y, minY, maxY)
```

The camera should always remain inside the designed workspace.

---

# 21. ASSET FOCUS / VISIBILITY TESTING

After implementation, manually test the entire scroll journey from:

```text
0%
→
10%
→
20%
→
30%
→
40%
→
50%
→
60%
→
70%
→
80%
→
90%
→
100%
```

At each stage verify:

* What is visible?
* Is the composition intentional?
* Is the next asset discoverable?
* Is anything clipped?
* Is anything overlapping incorrectly?
* Is the camera path understandable?
* Does the user get enough time to perceive each asset?

Do not stop after making the animation technically work.

The actual composition is just as important as the code.

---

# 22. NO RANDOM PARALLAX

Do NOT apply generic parallax to every element just because this is a scrolling website.

Every movement should have a reason.

The fundamental model is:

```text
WORLD OBJECTS = STATIC

CAMERA = MOVING

SCROLL = CAMERA CONTROL
```

That is the key concept.

---

# 23. NAVIGATION / MENU

Keep the existing hamburger/menu button.

It should remain fixed to the viewport rather than being attached to the moving world.

Same applies to any persistent UI such as:

* menu
* contact button
* WhatsApp button
* navigation controls

These should remain screen-fixed.

The workspace assets should move underneath them as the camera travels.

---

# 24. WHATSAPP BUTTON

The WhatsApp floating button shown in the screenshot should remain:

```text
position: fixed
```

It should NOT travel through the workspace.

Make sure the spatial canvas does not overlap or interfere with its clickable area.

---

# 25. PERFORMANCE

This experience should remain smooth.

Pay attention to:

* image sizes
* image decoding
* unnecessary React re-renders
* scroll event frequency
* animation loops
* large DOM trees
* transform properties
* image loading

Prefer:

```css
transform: translate3d(...)
```

and GPU-friendly transforms.

Avoid animating:

```text
top
left
width
height
```

continuously when transform can be used.

Use `will-change` carefully rather than applying it everywhere.

---

# 26. ACCESSIBILITY

The experience should still behave like a website.

Ensure:

* buttons remain keyboard accessible
* menu is accessible
* images have appropriate alt text
* reduced-motion preference is respected

For users with:

```css
prefers-reduced-motion: reduce
```

provide a simpler version where the spatial movement is greatly reduced or disabled.

---

# 27. DEBUG MODE

While developing, create an easy way to inspect the spatial layout.

For example, a development-only mode could display:

```text
WORLD COORDINATES
CAMERA X
CAMERA Y
ZOOM
CURRENT SECTION
SCROLL PROGRESS
```

And optionally show asset boundaries.

This will make positioning the assets significantly easier.

Do not expose this in production.

---

# 28. DO NOT BREAK THE CURRENT DESIGN

Do not redesign the entire visual language.

Preserve:

* typography style
* cream/off-white background
* engineering blueprint aesthetic
* paper/card appearance
* orange accent
* dark typography
* subtle grid
* minimal editorial look
* hamburger menu
* WhatsApp floating button

The major change is the **spatial interaction model**, not the branding.

---

# 29. IMPLEMENTATION PHASES

Work in this order.

### PHASE 1 — AUDIT

Inspect the existing code and assets.

Determine:

* current scroll implementation
* current asset positioning
* current background-removal implementation
* available animation libraries
* image formats
* alpha channels
* responsive behavior

Do not modify code yet.

### PHASE 2 — WORLD SYSTEM

Create:

* viewport
* world/canvas
* world coordinate system
* camera state
* camera boundaries

### PHASE 3 — ASSET SYSTEM

Move assets into centralized spatial configuration.

Every asset should have:

```text
x
y
scale
rotation
depth
focus position
focus zoom
```

### PHASE 4 — CAMERA PATH

Create a deliberate path through all assets.

### PHASE 5 — SCROLL MAPPING

Map scroll progress to camera path.

### PHASE 6 — TRANSITIONS

Add:

* smooth interpolation
* subtle zoom
* controlled easing
* depth effects

### PHASE 7 — BACKGROUND / TRANSPARENCY FIX

Properly fix the asset background-removal issue.

Verify actual alpha transparency.

### PHASE 8 — COMPOSITION

Reposition every asset so that every one has a proper viewing area.

### PHASE 9 — RESPONSIVE

Adapt camera path and framing for tablet/mobile.

### PHASE 10 — PERFORMANCE + ACCESSIBILITY

Optimize and add reduced-motion behavior.

### PHASE 11 — FULL SCROLL QA

Test the complete journey from 0% to 100%.

---

# 30. SUCCESS CRITERIA

The implementation is successful only if all of these are true:

### Spatial behavior

* The website feels like a large workspace.
* Scrolling feels like moving through the workspace.
* The background/grid feels like a stable physical surface.
* The camera moves rather than each asset randomly animating.

### Asset visibility

* Every asset can be visited.
* Every asset gets a clear visual focus moment.
* No important asset is clipped.
* No asset is accidentally hidden behind another.
* No asset is permanently outside the viewport.

### Visual quality

* Objects feel physically placed.
* Shadows are subtle and realistic.
* Rotations feel intentional.
* Spacing feels designed.
* The overall composition matches the existing visual direction.

### Background removal

* Actual white backgrounds are removed where appropriate.
* Transparent edges are clean.
* No white halo.
* No destruction of legitimate white parts of objects.

### Interaction

* Scrolling is smooth.
* Camera movement has inertia.
* No jitter.
* No sudden jumps.
* No excessive zoom.
* No disorienting rotation.

### UI

* Hamburger stays fixed.
* WhatsApp stays fixed.
* Persistent UI does not move with the world.

### Responsive

* Desktop works.
* Tablet works.
* Mobile works.
* Every asset remains visitable on smaller screens.

---

# IMPORTANT FINAL INSTRUCTION

Do not treat this as "add some scroll animations."

This is a **spatial navigation system**.

The mental model should be:

```text
             USER
              │
              │ scrolls
              ↓
        SCROLL PROGRESS
              │
              ↓
        CAMERA PATH
              │
              ↓
       CAMERA POSITION
              │
              ↓
      LARGE WORLD / BOARD
              │
      ┌───────┼────────┐
      ↓       ↓        ↓
   ASSET    ASSET    ASSET
```

The assets themselves are mostly stationary in world space.

The **camera is what travels**.

Make the final experience feel like the user is physically moving across a large creative/engineering desk or board and discovering each artifact one by one.

Before writing the final code, inspect the current implementation and assets carefully. Then implement the system incrementally rather than replacing everything blindly.

After implementation, test the complete scroll journey and fix positioning until **every single asset is properly discoverable and visitable**.
