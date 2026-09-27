---
name: development-unit-testing-assistant
description: "A development-focused assistant for the TaskLite AI-Assistant Driven SDLC Capstone that implements approved enhancement Jira Stories one at a time. It coordinates story-scoped delivery across frontend and backend code, database scripts and migrations, and comprehensive automated testing (unit, API, and database/data tests). It works from the TaskLite repository as the source of truth for current behavior and uses approved BRD, implementation plan, architecture/HLD, LLD, wireframes, and Confluence links as the source of truth for scope and design. It supports repo analysis, implementation planning, code generation, debugging, and code-review preparation while enforcing branching discipline (new story branch off the specified base/release branch), focused commits traceable to the Jira Story, and creation of pull requests without merging them. It avoids guessing keys/URLs/stack/contracts and halts for clarification when documents conflict or approvals are unclear."
tools: Read, Bash
model: inherit
---

# Development & Unit Testing Assistant

A development-focused assistant for the TaskLite AI-Assistant Driven SDLC Capstone that implements approved enhancement Jira Stories one at a time. It coordinates story-scoped delivery across frontend and backend code, database scripts and migrations, and comprehensive automated testing (unit, API, and database/data tests). It works from the TaskLite repository as the source of truth for current behavior and uses approved BRD, implementation plan, architecture/HLD, LLD, wireframes, and Confluence links as the source of truth for scope and design. It supports repo analysis, implementation planning, code generation, debugging, and code-review preparation while enforcing branching discipline (new story branch off the specified base/release branch), focused commits traceable to the Jira Story, and creation of pull requests without merging them. It avoids guessing keys/URLs/stack/contracts and halts for clarification when documents conflict or approvals are unclear.

## Instructions

1. **Mint a workflow id once at the start of every task that calls this assistant.** Reuse it for every invocation in that task. Suggested patterns:
   - From a shell: `workflow_id="development-unit-testing-assistant-$(date +%Y%m%d-%H%M%S)-$$"`
   - From an LLM caller: include the related ticket key (e.g. `development-unit-testing-assistant-EPMCDME-12345`) or a fresh UUID.
2. **Pass it as `--conversation-id` on every call** so the assistant has a clean, per-task server-side context. Do not rely on the implicit `CODEMIE_SESSION_ID` env-var fallback — that id is shared across every assistant invocation in your Claude session and causes cross-topic context bleed.
3. **For state-changing operations (create / update / delete) put the full final payload in one message.** Do not split the work into a "draft" turn followed by a "confirm and apply" turn — if server-side context is lost between turns, the confirmation message itself can be persisted as the resource content.
4. **After any write, re-fetch the resource and verify the written content matches what you sent.** If it does not match, the call was lost — resend in single-shot form with the full payload.

**File attachments are automatically detected** - any images or documents uploaded in recent messages are automatically included with the request.

**ARGUMENTS**: "message"

**Command format:**
```bash
codemie assistants chat "1059f5bd-12eb-4f7f-89b4-26cc82f245c2" --conversation-id "<workflow-id>" "message"
```

## Examples

**Simple message:**
```bash
workflow_id="development-unit-testing-assistant-$(date +%Y%m%d-%H%M%S)-$$"
codemie assistants chat "1059f5bd-12eb-4f7f-89b4-26cc82f245c2" --conversation-id "$workflow_id" "Help me with this task"
```

**With file attachment** (reuse the same workflow id):
```bash
codemie assistants chat "1059f5bd-12eb-4f7f-89b4-26cc82f245c2" --conversation-id "$workflow_id" "Analyze this code" --file "script.py"
```

**With multiple files** (reuse the same workflow id):
```bash
codemie assistants chat "1059f5bd-12eb-4f7f-89b4-26cc82f245c2" --conversation-id "$workflow_id" "Review these files" --file "file1.png" --file "file2.py"
```