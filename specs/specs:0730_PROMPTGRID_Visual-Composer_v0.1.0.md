# Prompt Grid — Spec 2: Visual Grid Composer and Modular Prompt Workspace

**Document:** `0730_PROMPTGRID_Visual-Composer_v0.1.0.md`  
**Target:** Native Obsidian desktop plugin  
**Language:** TypeScript  
**Scope class:** Medium  
**Dependency:** Spec 1 — Parser, Import, and Suno Export Foundation  
**Source of truth:** Canonical Markdown and `PromptDocument`

---

## 1. Objective

Add a purpose-built visual composition workspace to the existing Prompt Grid Obsidian plugin.

The workspace must let the user compose music prompts as modular sections and interchangeable instruction lines while preserving canonical Markdown as the authoritative storage format.

This build must:

- Open a canonical prompt note as a horizontal grid.
- Represent sections as movable columns.
- Represent instructions as movable cards.
- Support inline editing, insertion, duplication, deletion, enabling, and reordering.
- Save all changes back into canonical Markdown.
- Reopen saved notes without changing order, IDs, metadata, or content.
- Reuse Spec 1 import, validation, canonical serialization, Suno copy, and Suno export logic.
- Provide a correction workflow for uncertain raw imports.
- Organize prompts and reusable content inside the vault.

This build must not replace Markdown with a proprietary database.

---

## 2. Prerequisite Contract

Do not begin Spec 2 until Spec 1 passes all acceptance criteria.

Spec 2 imports and uses:

```ts
parseRawPrompt(input: string): PromptDocument
parseCanonicalMarkdown(input: string): PromptDocument
serializeCanonicalMarkdown(document: PromptDocument): string
serializeSunoPrompt(document: PromptDocument): SunoExportResult
validatePrompt(document: PromptDocument): ValidationIssue[]
```

It must use the existing `PromptDocument`, `PromptSection`, `PromptLine`, and `PromptRepository` types. Do not create a competing model.

---

## 3. User Interface Entry Points

### Ribbon

Add one left-ribbon icon:

```text
Prompt Grid
```

Clicking it opens the Prompt Grid workspace for the active prompt note.

### Commands

```text
Prompt Grid: Open visual composer
Prompt Grid: Open current note in visual composer
Prompt Grid: Add section
Prompt Grid: Add instruction
Prompt Grid: Toggle selected instruction
Prompt Grid: Save visual composer
Prompt Grid: Copy visual composer for Suno
Prompt Grid: Validate visual composer
```

Existing Spec 1 commands remain functional.

### File explorer menu

On canonical prompt notes, add:

```text
Open in Prompt Grid
Copy for Suno
Export for Suno
Validate Prompt
```

---

## 4. Visual Layout

Use a custom Obsidian `ItemView`.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROMPT TITLE                         122 BPM · G Minor      2,684 / 3,000    │
│ Behavioral Minimal House · Neo-Soul Drift · Tape Jazz                      │
│ [Import] [Save] [Validate] [Copy for Suno] [Export] [•••]                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ PREAMBLE       EQUILIBRIUM       SYSTEM EVENT       DRIFT CHAMBER          │
│ ┌───────────┐  ┌──────────────┐  ┌──────────────┐   ┌────────────────┐     │
│ │ Behavior… │  │ Cold machine │  │ A wrong…     │   │ Machinery…    │     │
│ ├───────────┤  ├──────────────┤  ├──────────────┤   ├────────────────┤     │
│ │ Movement… │  │ Electrical…  │  │ Corrupted…   │   │ Drums retreat │     │
│ └───────────┘  └──────────────┘  └──────────────┘   └────────────────┘     │
│ [+ Line]       [+ Line]           [+ Line]            [+ Line]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Grid behavior

- Horizontal scrolling for many sections
- Fixed workspace toolbar
- Optional collapsed sections
- Preamble as a reserved first column
- Usable independent section heights
- Legibility in dark and light themes
- Obsidian CSS variables instead of hard-coded theme colors

---

## 5. Section Operations

Each section column supports:

- Inline rename
- Add instruction
- Drag reorder
- Duplicate
- Collapse/expand
- Delete with confirmation
- Move left/right
- Copy section content
- Export selected section as bracketed text

### Section deletion

For non-empty sections:

- Show the label and instruction count.
- Allow cancel.
- Do not silently move lines elsewhere.
- Preserve undo state.

### Preamble restrictions

The Preamble column:

- Cannot be deleted or renamed.
- May contain zero or more instructions.
- Accepts cards dragged from other sections.
- Does not export a section label.

---

## 6. Instruction Card Operations

Each card supports:

- Inline editing
- Reorder within section
- Move across sections
- Duplicate
- Delete
- Enable/disable
- Move to previous/next section
- Keyboard selection
- Multiline text where necessary

### Disabled instructions

- Remain visible with reduced emphasis.
- Remain in canonical Markdown with `enabled: false`.
- Do not appear in Suno export.
- Count separately in validation summaries.

### Text behavior

- Do not add punctuation automatically.
- Do not change capitalization automatically.
- Trim accidental outer whitespace on commit.
- Preserve internal spacing.
- Empty edits trigger deletion confirmation instead of storing empty cards.

---

## 7. Drag and Drop

Use one maintainable drag-and-drop implementation.

Required behavior:

- Reorder sections horizontally.
- Reorder lines vertically.
- Move lines across sections.
- Preserve IDs during movement.
- Save only after a successful drop.
- Restore previous state if persistence fails.
- Support mouse and trackpad.
- Provide keyboard alternatives for essential moves.

### Drop rules

- Sections cannot move before Preamble.
- Cards may move into Preamble or empty sections.
- Invalid drops do not mutate the model.
- Each drag operation creates one undo entry.

---

## 8. Editing and Persistence

### Working state

Maintain an in-memory `PromptDocument` draft.

### Dirty state

Show unsaved changes clearly.

### Save

1. Validate the draft.
2. Serialize canonical Markdown using Spec 1.
3. Write through `PromptRepository`.
4. Confirm success.
5. Clear dirty state.
6. Preserve focus and scroll position.

### External file changes

When the canonical note changes externally:

- Detect the modification.
- Do not overwrite silently.
- Offer reload external changes or keep current draft.
- Do not implement automatic merging in this phase.

### Autosave

May be offered as a setting, but defaults off until manual persistence is stable.

---

## 9. Undo and Redo

Support undo/redo for:

- Add, edit, duplicate, delete, enable, and move instruction
- Add, rename, duplicate, delete, and move section

Undo history:

- Is scoped per composer instance.
- Resets when opening another note.
- Excludes failed operations.
- Is capped at 100 actions.

---

## 10. Import Review

Upgrade Spec 1 raw import with a structure-review modal.

```text
┌──────────────────────────────────────────────────────────────┐
│ REVIEW IMPORT                                                │
├──────────────────────────────────────────────────────────────┤
│ Preamble                                                     │
│  Instruction  Behavior-driven composition.                  │
│  Instruction  Movement comes from changing behavior...      │
│                                                              │
│ Detected structure                                           │
│  Section      Equilibrium                                    │
│  Section      System Event                                   │
│  ?            Procedural Groove                              │
│  Instruction  No climax.                                    │
│                                                              │
│ [Section] [Instruction] [Preamble] [Move Up] [Move Down]     │
│                                           [Cancel] [Import]   │
└──────────────────────────────────────────────────────────────┘
```

Required behavior:

- Show every meaningful parsed line.
- Allow uncertain items to be reclassified.
- Allow reordering before import.
- Preserve original source until confirmation.
- Never drop an item during reclassification.
- Treat classifier confidence as guidance only.

---

## 11. Metadata Editor

Editable fields:

- Title
- Styles
- BPM
- Key

Requirements:

- Styles support comma-separated entry and removable chips.
- BPM accepts positive numeric values or blank.
- Key accepts free text or blank.
- Metadata edits update the same `PromptDocument`.
- Character count updates after content changes.
- Validation displays inline without blocking unrelated editing.

---

## 12. Reusable Section Library

Add only after core grid behavior passes.

```text
Prompts/
└── Sections/
    ├── Drift Chamber.md
    ├── Mechanical Intro.md
    └── Behavioral Return.md
```

Library behavior:

- Save selected section as a reusable note.
- Insert a reusable section into the current prompt.
- Generate new IDs for inserted copies.
- Preserve source text.
- Do not maintain live references.
- Editing an inserted section does not mutate the library source.

This is lower priority than reliable grid editing.

---

## 13. Prompt Organization

```text
Prompts/
├── Inbox/
├── Working/
├── Ready/
├── Sections/
├── Exports/
└── Archive/
```

Composer may expose:

- Move to Working
- Move to Ready
- Archive

Use Obsidian file operations. Do not build a separate proprietary file browser.

---

## 14. Validation Interface

```text
✓ Canonical structure
✓ 8 sections
✓ 64 enabled instructions
⚠ 2,984 / 3,000 characters
⚠ 3 disabled instructions
```

Clicking status opens details.

Reuse `validatePrompt()` rather than creating separate validation rules.

---

## 15. Copy and Export

Toolbar actions:

```text
Copy for Suno
Export .md
Preview Suno Output
```

Preview shows generated output, character count, metadata summary, warnings, and a copy button.

It must call Spec 1's `serializeSunoPrompt()` directly. No UI component implements its own export formatting.

---

## 16. Accessibility and Keyboard Support

- Tab reaches toolbar, sections, and cards.
- Enter edits the selected item.
- Escape cancels editing.
- Delete opens confirmation.
- Command/Ctrl+S saves.
- Command/Ctrl+Z undoes.
- Command/Ctrl+Shift+Z redoes.
- Keyboard commands move cards and sections.
- Visible focus styling uses Obsidian variables.

Avoid drag-only functionality.

---

## 17. Error Handling

Handle:

- Missing active note
- Noncanonical active note
- Parser failure
- Vault write failure
- External-change conflict
- Invalid drag destination
- Duplicate IDs
- Empty section label
- Empty instruction
- Export failure
- Clipboard permission failure

Errors preserve the current draft, explain the failure, avoid partial writes, and do not clear undo history unless reload succeeds.

---

## 18. Project Structure Additions

```text
src/
├── interface/
│   ├── PromptGridView.ts
│   ├── PromptGridToolbar.ts
│   ├── PromptSectionColumn.ts
│   ├── PromptLineCard.ts
│   ├── ImportReviewModal.ts
│   ├── SunoPreviewModal.ts
│   ├── MetadataEditor.ts
│   └── ConfirmDeleteModal.ts
├── logic/
│   ├── promptEditor.ts
│   ├── promptHistory.ts
│   └── importReviewModel.ts
└── data/
    └── sectionLibraryRepository.ts
```

Keep UI components small and single-purpose. Do not combine parsing, serialization, repository, drag state, and rendering into one class.

---

## 19. Required Tests

### Logic tests

- Add, edit, duplicate, delete, enable, and move instruction
- Add, rename, duplicate, delete, and move section
- Preamble restrictions
- ID preservation during moves
- New IDs during duplication
- Undo/redo for every mutation
- Failed persistence rollback
- External-change conflict detection

### Integration tests

- Open canonical note in composer
- Reorder sections
- Move instruction across sections
- Save and reload
- Confirm identical order and content
- Copy for Suno
- Confirm disabled lines are excluded

### Import review tests

- Reclassify section as instruction
- Reclassify instruction as section
- Move line into Preamble
- Confirm no line loss
- Cancel without creating a file

---

## 20. Acceptance Criteria

Spec 2 passes only when:

- Spec 1 remains fully functional.
- A canonical note opens as a visual grid.
- Preamble appears first.
- Sections render as columns.
- Instructions render as cards.
- Sections can be added, renamed, duplicated, moved, collapsed, and deleted.
- Instructions can be added, edited, duplicated, moved, disabled, and deleted.
- Mouse and keyboard movement work.
- Saving updates canonical Markdown.
- Reopening reproduces the same grid.
- Failed saves do not destroy the draft.
- Undo/redo covers supported mutations.
- Import review preserves all meaningful source lines.
- Suno preview, copy, and export reuse Spec 1 serializers.
- Character count and validation are visible.
- Dark and light Obsidian themes remain usable.
- Markdown remains the authoritative storage format.

---

## 21. Deferred Work

Do not include without separate approval:

- Live linked reusable sections
- Multi-prompt comparison
- AI rewriting or prompt generation
- Cloud sync beyond the vault
- Collaborative editing
- Mobile interaction design
- Batch export
- Search analytics
- Prompt performance scoring
- Suno API integration
- Automatic musical recommendations

---

## Implementation Guide

- **Where:** Extend the completed Spec 1 repository under `src/interface/`, `src/logic/`, and `src/data/sectionLibraryRepository.ts`; register the custom `ItemView` from `src/main.ts`.
- **What:** Run `npm test` and `npm run dev`; open canonical fixtures, perform every section/card operation, save, reload, and compare Markdown and Suno output.
- **Expect:** Prompt notes become a stable draggable workspace while canonical Markdown remains authoritative and all Spec 1 import/export behavior continues unchanged.
