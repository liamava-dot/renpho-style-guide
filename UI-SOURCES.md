# UI sources and dependency policy

This page remains native HTML/CSS/JavaScript. It does not mount shadcn React components or require a React/Tailwind build.

## Styling
Native styles are adapted from the official shadcn/ui Nova component source:
https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/styles/style-nova.css

Applied conventions: 32px controls, 16px icons, compact spacing, 8px control radii, 12px card radii, semantic CSS variables, and visible focus rings.

Project-specific choices retained: 14px body text, 13px table content, 16px/600 section headings, #4F46E5 primary, #F0F2F5 page background, readable table grid lines, and green/red editorial tags.

## Icons
All 36 interface icons are official Lucide inline SVGs in index.html.
Source revision: 7faf87628a1ad6175975bc595344337ce14a7db4
https://github.com/lucide-icons/lucide/tree/7faf87628a1ad6175975bc595344337ce14a7db4/icons

Icons used: book-open-text, package, shopping-bag, shield-check, files, layout-grid, panel-left, search, chevron-down.
Stroke: 2; canvas: 24x24; display size: 16px.

## Dependencies
No runtime libraries were added. Do not add Motion, react-resizable-panels, dnd-kit, or Zustand until a concrete feature requires them.
Use existing CSS transitions for focus and hover colors; respect reduced motion.
Keep licenses in THIRD-PARTY-NOTICES.md. Update index.html first and regenerate raw pages; do not edit generated pages manually.

