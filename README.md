# Prompt Grid Handoff Package

This package defines a two-stage Obsidian plugin build for composing and exporting StudioRich music prompts.

## Build Order

1. `specs/0730_PROMPTGRID_Foundation_v0.1.0.md`
2. Verify every fixture.
3. `specs/0730_PROMPTGRID_Visual-Composer_v0.1.0.md`

Do not begin the visual composer until the parser, canonical Markdown round trip, and Suno serializer pass.

## Package Contents

```text
PROMPTGRID-HANDOFF/
├── README.md
├── specs/
├── fixtures/
│   ├── raw/
│   ├── expected-canonical/
│   └── expected-suno/
├── references/
└── ui/
```

## Fixture Policy

- Fixtures 01 and 02 are based directly on supplied StudioRich prompts.
- Fixtures 03–05 are synthetic edge cases designed to test duplicate labels, ambiguous labels, malformed brackets, mixed Markdown, and plain text preservation.
- Expected outputs are authoritative for the included fixtures.
- Implementations must not discard meaningful source lines.

## First Assignment

Build Spec 1 only. Run automated tests against all fixture pairs. The implementation is incomplete until each raw fixture produces its matching canonical and Suno output.
