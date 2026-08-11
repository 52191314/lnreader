# Release Notes — 2.1.3

## Changes

- Sync to upstream master (includes #1628 "Add Repository Enable And Disable
  Controls" and prior app fixes).
- fix: Select All Chapters Across Lazy-Loaded Batches (#1960)
- fix: Draw Content Behind Android Navigation Bar (#1260)
- fix: Pass Plugin `imageRequestInit` Headers to Novel Detail Cover (#1977)
  — novel-detail cover now sends the plugin's `imageRequestInit` headers, so
  CDN-protected covers (e.g. RanobeLib's cover.cdnlibs.org, which 403s
  without a Referer) load on the detail screen.
- fix: Stop TTS During Incoming and Outgoing Phone Calls (#1976)
- feat: Create Dedicated Custom Code Settings Page V2 (#1902)

## Notes

- Local fork build from master synced to upstream HEAD (9e3ef926).
