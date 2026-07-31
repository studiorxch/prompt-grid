# Prompt Grid Handoff Package

**Current plugin version:** 0.1.1

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

## Spec 1.1 Export Behavior

Prompt Grid keeps Suno's **Style** and **Prompt** fields separate:

- **Prompt Grid: Copy Style for Suno** copies styles as plain comma-separated text, without brackets or a `Styles:` prefix.
- **Prompt Grid: Copy current note for Suno** copies only the structured bracketed prompt body. Style, BPM, and key metadata are excluded.
- **Prompt Grid: Export current note for Suno** writes that same structured bracketed prompt body to the configured Exports folder.

New imports use the **Prepend [Instrumental] on prompt export** setting, which defaults on. Canonical notes store the choice as `instrumental: true` or `instrumental: false`; this per-note value overrides the setting. Existing canonical notes without the field use the current setting and remain readable.

Spec 1.1 does not add the Visual Composer, a custom view, drag-and-drop, or card UI.
