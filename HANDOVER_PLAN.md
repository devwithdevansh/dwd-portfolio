# Handover Implementation Plan: The 3D Industry Matrix

## Current State
The `IndustryMatrix.js` component has been successfully built to support a 2-column layout. Currently, the "Hospitals" row is using a placeholder React Three Fiber 3D model (`Hospital3D.js`) to demonstrate the physics of the "Pop Out" hover effect (the object scales up and expands out of its boundaries on hover).

The client has decided to proceed with **Option 1**: Using high-end AI-generated 3D art (Soft Clay Style) with transparent backgrounds, rather than basic coded 3D shapes or overlapping geometric photos.

## Tasks for the Next Developer

### 1. Generate the Visual Assets (Soft Clay 3D Style)
The AI image generation API hit its quota limit and was unable to generate the assets. You need to generate 9 premium 3D illustrations (one for each industry).
- **Style Requirement:** "Soft Clay" aesthetic (smooth, matte, minimalist, clean, premium lighting).
- **Subject Requirement:** The image must show the *entire* subject (e.g., a full hospital building, a full luxury car, a full factory) to ensure it is instantly recognizable.
- **Format:** Transparent PNGs (no background) so they can float freely in the brutalist dark layout.
- **Save Location:** `public/assets/industries/`

### 2. Update the Industry Data
Update `src/data/IndustryData.js` to map the `image` field of every industry to the new transparent PNG assets you just generated.

### 3. Refactor IndustryMatrix.js (The Pop-Out Physics)
Rip out the `<Canvas>` and `<Hospital3D />` logic that is currently hardcoded for the `hospitals` row. 
Replace it with a unified `framer-motion` image block for all industries that replicates the "Pop Out" physics we prototyped:

```jsx
{/* The Transparent Floating 3D Vector */}
<div className="relative w-32 h-32 md:w-64 md:h-64 flex items-center justify-center overflow-visible hidden sm:flex z-10 transition-transform duration-700 pointer-events-none group-hover:scale-[1.5] group-hover:-translate-x-8">
  <motion.img 
    src={ind.image} 
    alt={ind.name}
    className="w-full h-full object-contain filter drop-shadow-2xl"
    initial={{ y: 0 }}
    animate={{ y: [ -10, 10, -10 ] }} // Constant floating sine-wave animation
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    whileHover={{ scale: 1.1, rotate: -2 }} // Pop out rotation
  />
</div>
```

### 4. Verification
Ensure the interaction feels incredibly fluid. The images should constantly float up and down when idle, and violently scale up and pop out of their bounds when the user hovers over the industry text. The transparent background is critical for the WOW factor.
