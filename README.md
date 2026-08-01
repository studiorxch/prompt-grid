# Prompt Grid Handoff Package

**Current plugin version:** 0.2.7

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

## Visual Composer

Open a canonical Prompt Grid note and run **Prompt Grid: Open Visual Composer**. The native Obsidian view places a compact document header above a horizontally scrolling grid; metadata editing is available from the board menu without a persistent form. Preamble appears as the first column when it contains cards, and each prompt section appears as a separate column.

- Add, rename, move, drag, or delete sections.
- Add, edit, enable/disable, move, drag between sections, or delete prompt cards.
- Copy the separate Suno Style and structured Prompt outputs from the toolbar.
- Every confirmed change is immediately serialized to the open canonical Markdown note; no secondary database is created.
- Changing the active note or modifying its Markdown externally refreshes the composer.

### Compact interaction model

Sections and cards use a dense Kanban-style layout. Drag sections from non-interactive header space and drag cards from their body. Section rename/movement/deletion lives in a keyboard-accessible `…` menu; card Enable/Disable and Delete actions use the native context menu, while card movement is drag-only. Double-click card text, or focus it and press Enter, to open multiline editing; use Ctrl/Cmd+Enter to commit or Escape to cancel.

In version 0.2.2, cards are draggable from their body and show exact insertion positions while moving; text selection, editing, and overflow menus do not start drags. Empty Preamble is hidden until **Add preamble** is selected from the board menu. Columns can be collapsed individually or through **Collapse all**/**Expand all**, with collapse state stored only in the Obsidian workspace. Card editing stays in the card text region, commits on blur or Ctrl/Cmd+Enter, and cancels with Escape.

Version 0.2.3 removes the persistent metadata form: title, Style, BPM, key, and Instrumental are edited from the board `…` menu, while the compact header shows only the document title, character count, copy actions, section action, and menu. Card, section, and board menus now use one accessible body-level floating menu that closes on Escape or outside interaction, replaces any previously open menu, and flips above its trigger when needed so board and column overflow cannot clip it.

Version 0.2.5 presents sections as open text stacks without panel outlines or card counts. Cards contain only prompt text; drag the card body to reorder or move it, double-click to edit, and use the native context menu for the uncommon Enable/Disable and Delete actions. Section rare actions remain in a low-contrast menu that appears on header hover or keyboard focus. Each expanded column ends with a centered, borderless `+` insertion control.

Version 0.2.6 restores plain inline title and Style editing in the compact header: click either value or focus it and press Enter, then blur or use Ctrl/Cmd+Enter to commit and Escape to cancel. Section/card/Preamble text entry and destructive confirmations use native Obsidian modals instead of unsupported browser dialogs. Section headers are draggable without visible grab dots, and collapse uses a minimal keyboard-accessible chevron.

Version 0.2.7 makes cards quiet text blocks until hover, focus, editing, selection, or dragging; gives section labels a restrained structural tone; presents Preamble as a wider, shaded, independently collapsible drawer; and prevents true YAML front-matter delimiters from appearing as editable cards while preserving canonical Markdown round trips.
