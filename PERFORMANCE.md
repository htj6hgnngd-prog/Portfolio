# Production performance

Current production contains only the active portfolio implementation. Legacy demo bundles and placeholder sections are removed.

- Railway starts the web server immediately and exposes `/health`.
- Versioned CSS, JS and SVG assets are Brotli/Gzip compressed and cached immutably.
- Direct AI and Denisov Photo are direct production sections, not legacy lazy demos.
- The photo gallery code loads directly; gallery images remain browser-lazy and are served as generated WebP with JPEG fallback.
- Denisov Photo desktop capture is generated as WebP after startup: about 342 KB instead of the 2.6 MB PNG source.
- The reportage set is generated as WebP after startup: about 1.6 MB instead of the 4.3 MB JPEG source.
- AI and cartoon video use Range streaming instead of full-file warmup.
- Event promo video caching runs in the background after the initial page is already available.
- Remote media metadata is warmed without downloading heavy video payloads.
