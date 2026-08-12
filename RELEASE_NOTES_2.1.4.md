# Release Notes — 2.1.4

## Changes

- fix: Guard chapter-number parsing against missing novel/chapter names —
  the Updates tab (and History, Downloads, reader tracker) crashed with
  `TypeError: Cannot read property 'toLowerCase' of undefined` when a
  legacy/dirty DB row had a null/undefined name. Unparseable rows now
  degrade to chapter number -1 instead of crashing the screen.
- feat(reader): Pull down at the top of any chapter to re-fetch it (works
  on blank and normal chapters alike); empty responses are no longer cached,
  so a refresh actually re-fetches instead of replaying the empty message.
- feat(reader): Add a refresh button to the reader's bottom control bar,
  and a "Refresh chapter" link on the "Chapter couldn't be loaded" screen.

## Notes

- Local fork build (master, b766bce4 + local commits).
