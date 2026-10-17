<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Avona Picks rules

- All prices in `lib/catalog.ts` are sample data until replaced with verified observations.
- Never store an Amazon price except as labeled sample data; real Amazon prices must come from the Product Advertising API at render time.
- Costco links are never affiliate links (no public program). Do not add affiliate URLs without program approval.
- Quebec targeting and fr-CA content are paused (Bill 96) pending legal review.
