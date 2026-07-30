# Recommended Vault Structure

```text
StudioRich Vault/
└── MUSIC/
    └── PROMPTS/
        ├── Inbox/
        ├── Working/
        ├── Ready/
        ├── Sections/
        ├── Exports/
        └── Archive/
```

## Folder Roles

- **Inbox:** Newly imported prompts awaiting review.
- **Working:** Active prompt development.
- **Ready:** Validated source notes ready for use.
- **Sections:** Reusable section templates.
- **Exports:** Generated Suno-ready Markdown.
- **Archive:** Retired or superseded prompts.

## Plugin Behavior

The plugin may create missing folders automatically after showing the configured paths in settings. It must not rename or delete existing vault folders automatically.
