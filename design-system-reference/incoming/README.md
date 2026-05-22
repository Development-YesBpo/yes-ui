# Design Handoff — Incoming

This folder receives output from Claude Design sessions.

## How to use

1. Generate a component or variation using Claude Design with the
   `design-system-reference/` content as system context.

2. Drop the generated file(s) here:
   - HTML preview card → `incoming/components-{name}.html`
   - JSX prototype     → `incoming/{name}.jsx`

3. Review the file. Open it in a browser (HTML) or inspect the JSX.
   Ask: does it match YES BPO's visual language? Are states complete?

4. Approve: move the file to its permanent location:
   - HTML → `preview/components-{name}.html`
   - JSX  → `ui_kits/{product}/` (or create a new product subfolder)

5. Tell Claude Code: "translate design-system-reference/preview/components-{name}.html"

6. Claude Code runs translation passes, builds the component, runs tests,
   builds the story, and stops at the VISUAL GATE for your sign-off.

## Translation tolerance rules
- Colors: exact hex match required. No rounding.
- Heights/radii: ±2px tolerance → snap to nearest token.
- Spacing/padding: ±4px tolerance → snap to nearest token.
- Values outside tolerance: add a new --yes-* token to semantic.css first.

## Do not commit approved files back into incoming/
This folder is a transit area only.
