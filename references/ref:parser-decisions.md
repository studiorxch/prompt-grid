# Parser Decisions

These decisions are authoritative for the fixture set.

1. `Styles:` is metadata and never an instruction.
2. `122 BPM • G Minor` extracts BPM and key.
3. Bracketed lines before the first section belong to Preamble.
4. Duplicate section labels are allowed and must remain duplicated.
5. Lowercase instructions remain instructions.
6. Lowercase section labels are allowed when context strongly supports them.
7. A terminal `///` marker is ignored.
8. Plain text outside brackets is preserved as an instruction.
9. An unclosed bracket is preserved as plain instruction text without the leading bracket.
10. Markdown `##` headings are definite sections.
11. Markdown list items under a section are instructions.
12. When classification is uncertain, preserve as an instruction.
