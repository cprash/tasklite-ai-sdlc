# TaskLite – AI SDLC Pipeline and Skills – v1.0

**Status:** Draft  |  **Owner:** rahul_sharma7@epam.com  |  **Labels:** rahul_harma7, codemie_capstone
**Workflow:** `TaskLite_AI_SDLC_Orchestrator` (CodeMie workflow id `09d750ce-ca56-48c9-8457-5f7ef6ae9b89`)
**Source repo:** https://github.com/cprash/tasklite-ai-sdlc (see `codemie-assets/`)

## 1. Purpose

The TaskLite AI SDLC pipeline is a CodeMie workflow that chains ten AI assistants to take a TaskLite enhancement request from idea to merged code and automated tests: requirements (BRD in Confluence), backlog (Epic and Stories in Jira), implementation plan, solution design, development, code review, local deployment and QA automation. Every stage that changes a shared system (Confluence, Jira, GitHub) has a human-in-the-loop (HITL) approval gate; assistants must not publish, create, merge or transition anything without explicit approval in chat.

## 2. Pipeline flow

1. **Start** -> **Enhancement Router** asks one clarifying question and outputs `enhancement_type`.
2. `existing` -> jump straight to **Development and Unit Testing** (step 7). `new` (or ambiguous) -> continue with step 3.
3. **BA Enhancement Analysis and BRD Creation** -> approved BRD in Confluence.
4. **BA Planning and Backlog** -> implementation plan (chat) + one Jira Epic and Stories.
5. **Implementation Planning** -> "TaskLite – Enhancement Implementation Plan" in Confluence.
6. **Solution Design** -> Architecture/HLD, LLD and Wireframes in Confluence, linked to the Epic and Stories. Then continue to step 7.
7. **Development and Unit Testing** -> story branch, code, tests, README update, PR (not merged), Jira comment.
8. **PR Review** -> review comments, approve and merge on user instruction, Jira issue moved to Resolved. Output: `pr_approved`, `pr_merged`.
   - If `pr_approved and pr_merged` -> step 9. Otherwise -> **PR Review Fix** (resolves review threads on the same PR) -> back to PR Review.
9. **Tasklite Local Deployment** -> update `main`, start backend (3000) and frontend (5173), verify health.
10. **QA Automation Orchestrator** -> Jira Test issues, Playwright tests, local run, report to Jira, automation PR.
11. **PR Review (second pass)** -> same review/merge logic. If `pr_approved and pr_merged` -> **End**; otherwise -> **PR Review Fix (second pass)** -> back to PR Review.

## 3. Stages

| # | Node | Inline id | Model | Purpose and outputs | Tools |
|---|---|---|---|---|---|
| 1 | Enhancement_Router | assistant_10 | gpt-5-2 | Classifies request as existing/new; JSON-only output | none |
| 2 | BA_Enhancement_Analysis_and_BRD_Creation_Assistant | assistant_1 | gpt-5-2 | Reads existing BRDs, proposes enhancements, drafts "Task Lite - Release <n>" BRD, records approval in the page. 3 HITL checkpoints | Confluence, Jira |
| 3 | BA_Planning_and_Backlog_Assistant | assistant_2 | gpt-5-2 | Reads approved BRD; drafts plan, Epic and Stories (Given/When/Then AC, points, labels); creates them in Jira only after approval | web scrapper, Jira, Confluence |
| 4 | Implementation_Planning_Assistant | assistant_3 | gpt-5-2 | Validates BRD vs Epic/Stories; drafts plan with traceability matrix; publishes "TaskLite – Enhancement Implementation Plan – vX.Y" after approval | Jira, Confluence |
| 5 | Solution_Design_Assistant | assistant_4 | gpt-5-2 | Read-only repo analysis; Architecture/HLD, LLD, Wireframes (Mermaid); publishes to Confluence after approval and links to Epic and Stories | GitHub, repo search/read, Confluence, Jira |
| 6 | Development_and_Unit_Testing_Assistant | assistant_5 | claude-opus-4-8 | Implements one Story on a new branch; unit, API and data tests; README update; opens PR, never merges | GitHub branch/file/PR tools, repo read, Confluence, Jira |
| 7 | PR_Review_Assistant | assistant_6 | claude-opus-4-8 | Reviews PR, posts only user-approved comments; approves and merges only on explicit instruction; then Jira -> Resolved with PR link | GitHub, repo read, Jira, Confluence |
| 8 | PR_Review_Fix_Assistance | assistant_9 | claude-opus-4-8 | Fixes unresolved review threads on the existing PR branch; commits only after approval; never merges | GitHub branch/file/PR tools, repo read, code executor |
| 9 | Tasklite_Local_Deployment_Assistant | assistant_7 | gpt-5-2 | Windows runbook: pull `main`, start backend and frontend, health checks, troubleshooting | none |
| 10 | QA_Automation_Orchestrator | assistant_8 | claude-opus-4-8 | Jira Test issues linked to the Story; Playwright tests under `tests/`; runs against UI :5173 and API :3000/api; reports to Jira; raises automation PR | GitHub, Jira, code executor |

Stages 7 and 8 are reused as `PR_Review_Assistant_copy` and `PR_Review_Fix_Assistance_copy` after QA (same inline assistants, second loop).

## 4. Skills added to the workflow

CodeMie skills are attached to each inline assistant through `skill_ids` in the workflow `yaml_config`. They are public marketplace skills owned by other CodeMie projects. Router and Local Deployment have no skills.

| Node | Skill | Why it was chosen |
|---|---|---|
| BA Enhancement and BRD Creation | `confluence-page-review-and-creation-sg` | Consistent Confluence page review and creation; requires confirmed space/parent and approvals, matching the HITL rules |
| BA Planning and Backlog | `jira-ticket-writer` | Well-structured user stories and acceptance criteria for Jira |
| Implementation Planning | `development-work-planner` | Structured work plan with phases, risks and assumptions |
| Solution Design | `expert-solution-architect` | Architecture, C4 and decision-record guidance |
| Solution Design | `architecture-kit-mermaid-flavored` | Correct Mermaid syntax for the required diagrams |
| Development and Unit Testing | `karpathy-guidelines` | Think first, keep changes simple and surgical, goal-driven execution |
| Development and Unit Testing | `code-quality-checker` | Repeatable quality checklist before opening the PR |
| PR Review | `code-quality-checker` | Structured, prioritized review findings |
| QA Automation | `playwright-e2e-ts-tests` | Maintainable, non-flaky Playwright TypeScript tests |
| PR Review Fix | `karpathy-guidelines` | Minimal, surgical fixes limited to reviewer feedback |

Skill ids: confluence-page-review-and-creation-sg `ab244b58-e840-4a7b-be9f-b9aeb86bb5f9`; jira-ticket-writer `1b1c5a0c-9ef0-4f1d-a76c-1dfb0cd3ff31`; development-work-planner `6e42bcc2-0296-411b-94f8-8dcf431ea91b`; expert-solution-architect `f455baf6-caa3-4311-991e-a59907e5ba81`; architecture-kit-mermaid-flavored `23d6dd86-54ee-4128-a6ad-24d949a74a38`; karpathy-guidelines `60bb6d0a-3491-4af4-bfdf-5a33d69df7e5`; code-quality-checker `0da4ccb2-c523-4731-b03d-94ee99950326`; playwright-e2e-ts-tests `2e11b465-d31d-409a-b877-7cb073981f16`.

## 5. Governance and guardrails

- No Confluence page, Jira issue, PR comment, approval or merge is created without explicit user approval in chat.
- Baseline TaskLite features (create, view, complete/open, delete task) must be preserved.
- Only BRD-approved scope is planned or built; no invented requirements.
- Traceability: BRD -> Epic -> Stories -> plan -> design -> code -> tests.
- Artifacts are labelled `rahul_harma7` and `codemie_capstone`; Jira project is EPMCDMETST.
- The developer and fix assistants never merge; only the PR review assistant merges, and only after explicit approval.

## 6. Where the assets live

- `codemie-assets/workflows/` – workflow `.yaml` (config), `.json` (full definition), `.md` (readable view) and `*.nodes/` (one `.json` and `.md` per inline assistant).
- `codemie-assets/assistants/` – standalone assistant definitions (these do not have the skills attached).
- `.claude/agents/` – readable agent descriptions, including a "Workflow skills" line.
- Update the live workflow: `codemie sdk workflows update <id> --data '{"name":"TaskLite_AI_SDLC_Orchestrator"}' --config codemie-assets/workflows/tasklite-ai-sdlc-orchestrator.yaml`.

## 7. Notes and risks

- The attached skills are owned by other projects; if an owner edits or removes one, workflow behaviour can change or break.
- Some skills overlap with the assistants' own prompts (for example the planner's Gantt output and the Jira writer's AC style versus the mandated Given/When/Then); the assistant prompts take precedence.
- The Jira project is written as both `EPMCDMETST` and `EPM-CDME-TEST` in the backlog assistant prompt; the assistant is told to validate the real project key.
- Enhancement Router exists only inside this workflow; there is no standalone assistant for it.
