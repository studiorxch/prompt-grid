# Prompt Grid — Spec 1: Parser, Import, and Suno Export Foundation

**Document:** `0730_PROMPTGRID_Foundation_v0.1.0.md`  
**Target:** Native Obsidian desktop plugin  
**Implementation candidate:** KIMI or another coding agent  
**Language:** TypeScript  
**Scope class:** Small-to-medium  
**Dependency:** None  
**Feeds into:** Spec 2 — Visual Grid Composer

---

## 1. Objective

Build the reliable data and transformation foundation for an Obsidian prompt-management plugin.

This build must:

- Import StudioRich music prompts from pasted text, the clipboard, the current Obsidian note, or an external `.md` file.
- Parse multiple prompt structures without dropping or rewriting source lines.
- Extract style, BPM, and musical key metadata when present.
- Separate preamble instructions, section labels, and section instructions.
- Save the parsed result as unambiguous canonical Markdown inside the active Obsidian vault.
- Reload canonical Markdown into the same internal prompt model.
- Copy or export a clean, bracketed Suno prompt.
- Validate round-trip integrity with automated tests.

This build does **not** include the visual Kanban/grid composer.

---

## 2. Scope Boundary

### Included

- Obsidian plugin scaffold
- Plugin manifest and build configuration
- Type-safe prompt data model
- Raw prompt parser
- Section-label classifier
- Canonical Markdown parser and serializer
- Suno serializer
- Prompt validator
- Clipboard import
- Current-note conversion
- External `.md` import
- Copy-for-Suno command
- Export-to-vault command
- Configurable vault folders
- Automated tests using the supplied prompt fixtures
- User notices and resilient error handling

### Excluded

- Custom Kanban view
- Draggable columns
- Draggable instruction cards
- Visual section editing
- Reusable section library
- Batch prompt management
- Prompt version browser
- Advanced import-review interface
- Cross-prompt drag and drop
- Mobile support

Do not implement excluded features opportunistically.

---

## 3. Required User Commands

Register these Obsidian commands:

```text
Prompt Grid: Import from clipboard
Prompt Grid: Import Markdown file
Prompt Grid: Convert current note
Prompt Grid: Copy current note for Suno
Prompt Grid: Export current note for Suno
Prompt Grid: Validate current note
```

### Import from clipboard

1. Read text from the system clipboard.
2. Parse the text.
3. Create a canonical Markdown note in the configured Inbox folder.
4. Preserve the original source until the new note is created successfully.
5. Open the generated note.

### Import Markdown file

1. Open a native desktop file chooser.
2. Accept `.md` and `.txt`.
3. Read the selected file.
4. Parse and save it as canonical Markdown.
5. Open the generated note.

### Convert current note

1. Read the active Markdown note.
2. Detect whether it is already canonical.
3. If canonical, validate it without rewriting it.
4. If raw, parse it and create a canonical copy.
5. Never destructively overwrite the original raw note.

### Copy current note for Suno

1. Parse the current canonical note.
2. Validate exportability.
3. Serialize it into Suno format.
4. Copy the result to the clipboard.
5. Show the final character count.

### Export current note for Suno

1. Parse the current canonical note.
2. Serialize it into Suno format.
3. Write a generated `.md` file to the configured Exports folder.
4. Do not overwrite an existing export silently.
5. Show the export path and character count.

---

## 4. Data Model

```ts
export interface PromptDocument {
  readonly id: string;
  title: string;
  styles: string[];
  bpm: number | null;
  key: string | null;
  preamble: PromptLine[];
  sections: PromptSection[];
  sourcePath: string | null;
  sourceText: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PromptSection {
  readonly id: string;
  label: string;
  lines: PromptLine[];
}

export interface PromptLine {
  readonly id: string;
  text: string;
  enabled: boolean;
}
```

### Data guarantees

- IDs remain stable across canonical Markdown save and reload.
- Blank instructions are never created.
- Source order is preserved.
- Duplicate lines remain duplicated.
- Text is not silently rewritten for grammar, punctuation, capitalization, or style.
- Disabled-line support exists in the model even though Spec 1 exposes no editing UI for it.

---

## 5. Supported Raw Prompt Forms

### Form A — Metadata, preamble, and titled sections

```text
Styles: Behavioral Minimal House, Neo-Soul Drift, Tape Jazz

122 BPM • G Minor

[Behavior-driven composition.]

[Movement comes from changing behavior, not increasing intensity.]

[No trance.]
[Dry, tactile, restrained.]

[Equilibrium]

[Cold machine-room ambience.]
[Electrical hum.]

[System Event]

[A wrong interaction interrupts the system.]
[Corrupted notification tones.]
```

### Form B — Section-led prompt with lowercase instructions

```text
[Intro]
[distant platform ambience]
[electrical transformer hum]
[single rubbery bass pulse]

[Movement A]
[fast chopped jungle breaks]
[elastic FM bass answers every drum phrase]

[Bridge]
[drums completely mute]
[subway ventilation]

[Outro]
[breaks dissolve]
[station ambience remains]
```

### Input normalization

- Normalize CRLF and CR line endings to LF.
- Ignore a terminal `///` marker.
- Preserve all meaningful text.
- Ignore whitespace-only lines as content.
- Preserve internal punctuation and capitalization.
- Recognize Markdown headings when raw input already uses them.
- Treat unsupported metadata as source content rather than deleting it.

---

## 6. Parsing Rules

The parser runs in stages.

### Stage A — Metadata extraction

Recognize:

```text
Styles: Style One, Style Two, Style Three
122 BPM • G Minor
122 BPM
G Minor
```

Rules:

- Style values are comma-separated.
- Trim outer whitespace from each style.
- Preserve style capitalization.
- BPM must be a finite positive number.
- Key remains a trimmed string.
- Metadata lines do not reappear as prompt instructions.

### Stage B — Bracket-token extraction

Recognize a bracketed item only when the entire trimmed line is enclosed by one outer `[` and `]`.

Do not split bracketed text internally.

### Stage C — Section classification

Use a scored classifier rather than a single rule.

Strong section signals:

- No terminal punctuation
- One to five words
- Title case
- Blank-line boundaries
- Followed by one or more instruction candidates
- Matches structural terms such as Intro, Outro, Bridge, Movement, Return, Departure, Equilibrium, Event, Chamber, or Reconfiguration

Strong instruction signals:

- Ends in `.`, `!`, `?`, `:`, or `;`
- Begins with lowercase text
- Begins with restriction or action language such as No, Remove, Leave, or Keep
- Contains production terms such as drums, bass, ambience, percussion, groove, reverb, hum, synth, rhythm, or harmony

### Safe fallback

When classification remains uncertain:

```text
Preserve the item as an instruction.
```

Do not discard it. Do not invent a section label.

### Preamble rule

Bracketed instructions before the first detected section belong to `preamble`.

---

## 7. Canonical Markdown Format

```md
---
prompt-grid: true
prompt-id: pg_000001
bpm: 122
key: G Minor
styles:
  - Behavioral Minimal House
  - Neo-Soul Drift
created-at: 2026-07-30T18:00:00-04:00
updated-at: 2026-07-30T18:00:00-04:00
---

# Prompt Title

## Preamble

- [pg_line_000001] Behavior-driven composition.
- [pg_line_000002] Movement comes from changing behavior, not increasing intensity.

## Equilibrium {#pg_section_000001}

- [pg_line_000003] Cold machine-room ambience.
- [pg_line_000004] Electrical hum.
```

### Canonical requirements

- `prompt-grid: true` identifies canonical notes.
- `prompt-id` is mandatory.
- Section and line IDs persist.
- `## Preamble` is reserved and does not export as a Suno section label.
- Every other level-two heading represents a prompt section.
- Canonical parser and serializer round-trip without semantic changes.
- YAML field order remains stable for clean diffs.
- Retained source text must not appear in Suno export.

---

## 8. Suno Export Format

```text
Styles: Behavioral Minimal House, Neo-Soul Drift

122 BPM • G Minor

[Behavior-driven composition.]

[Movement comes from changing behavior, not increasing intensity.]

[Equilibrium]

[Cold machine-room ambience.]
[Electrical hum.]
```

### Export rules

1. Emit `Styles:` only when styles exist.
2. Emit BPM and key on one line when both exist.
3. Emit only BPM or key when one is absent.
4. Emit preamble before the first section.
5. Wrap every exported item in one pair of brackets.
6. Emit section labels with blank lines around them.
7. Emit enabled lines only.
8. Preserve source order.
9. Do not add punctuation.
10. Exclude YAML, IDs, headings, list markers, comments, and `///`.
11. Normalize blank lines.
12. Do not silently truncate long prompts.
13. Return character count and warnings separately from output text.

---

## 9. Validation

```ts
export interface ValidationIssue {
  readonly code: string;
  readonly severity: "warning" | "error";
  readonly message: string;
  readonly sectionId?: string;
  readonly lineId?: string;
}
```

Required checks:

- Missing prompt ID
- Missing title
- Invalid BPM
- Empty section label
- Empty instruction
- Duplicate IDs
- No instructions
- Character count above configurable threshold
- Canonical parse failure
- Export failure
- Source line loss detected during tests

Warnings do not block editing. Errors may block export when output integrity is uncertain.

---

## 10. Vault Organization and Settings

```text
Prompts/
├── Inbox/
└── Exports/
```

Settings:

- Inbox folder
- Export folder
- Default title prefix
- Character warning threshold
- Preserve imported source text: on/off

All vault writes use Obsidian's Vault API.

---

## 11. Project Structure

```text
studiorich-prompt-grid/
├── manifest.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── esbuild.config.mjs
├── versions.json
├── styles.css
└── src/
    ├── main.ts
    ├── data/
    │   ├── promptTypes.ts
    │   └── promptRepository.ts
    ├── logic/
    │   ├── importParser.ts
    │   ├── metadataParser.ts
    │   ├── sectionClassifier.ts
    │   ├── canonicalMarkdownParser.ts
    │   ├── canonicalMarkdownSerializer.ts
    │   ├── sunoSerializer.ts
    │   └── promptValidator.ts
    ├── interface/
    │   ├── ImportFileModal.ts
    │   └── PromptGridSettingsTab.ts
    └── utilities/
        ├── identifiers.ts
        ├── fileNaming.ts
        └── textNormalization.ts
```

Tests:

```text
tests/
├── fixtures/
│   ├── behavioral-system.txt
│   └── movement-sections.txt
├── importParser.test.ts
├── canonicalRoundTrip.test.ts
└── sunoSerializer.test.ts
```

---

## 12. Required Tests

### Fixture preservation

For each supplied raw prompt:

- Every meaningful line maps to metadata, preamble, section label, or instruction.
- No meaningful line disappears.
- Order remains stable.

### Canonical round trip

```text
PromptDocument
→ canonical Markdown
→ PromptDocument
```

Preserve IDs, title, styles, BPM, key, preamble order, section order, instruction order, text, and enabled state.

### Error cases

Test empty clipboard, missing active note, malformed YAML, invalid BPM, unclosed bracket, duplicate section names, duplicate instruction text, filename collision, and vault write failure.

---

## 13. Acceptance Criteria

Spec 1 passes only when:

- Plugin builds without TypeScript errors.
- Plugin loads in Obsidian desktop.
- All six commands are registered.
- Both supplied prompt formats import successfully.
- Styles, BPM, and key are extracted when present.
- Preamble, sections, and instructions are separated.
- Ambiguous items are preserved as instructions.
- Canonical notes reload into the same model.
- Copy for Suno works.
- Export to the configured vault folder works.
- No canonical IDs appear in Suno output.
- Automated tests pass.
- No meaningful source lines are lost.
- No Kanban/grid UI is implemented.

---

## 14. Handoff to Spec 2

Expose reusable functions without UI coupling:

```ts
parseRawPrompt(input: string): PromptDocument
parseCanonicalMarkdown(input: string): PromptDocument
serializeCanonicalMarkdown(document: PromptDocument): string
serializeSunoPrompt(document: PromptDocument): SunoExportResult
validatePrompt(document: PromptDocument): ValidationIssue[]
```

Spec 2 consumes the same model and repository.

Do not embed parsing or serialization logic inside Obsidian views, modals, or command handlers.

---

## Implementation Guide

- **Where:** Install at `<VAULT>/.obsidian/plugins/studiorich-prompt-grid/`; place data logic under `src/data/`, transformation logic under `src/logic/`, and commands in `src/main.ts`.
- **What:** Run `npm install`, `npm test`, and `npm run dev`; enable the plugin in Obsidian and execute each command against both fixtures.
- **Expect:** Both raw formats become stable canonical Markdown notes and export into clean Suno prompts with no meaningful line loss and no visual grid implementation.
