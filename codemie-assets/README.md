# CodeMie Assets (local export)

Exported from CodeMie project `rahul_sharma7@epam.com` on 2026-09-28 via `codemie sdk`.

For each asset there is:
- a **`.json`** — the full definition returned by `codemie sdk <assistants|workflows> get <id> --json` (use this to re-import/restore);
- a **`.md`** — a human-readable view (description, model, toolkits, conversation starters, full system prompt).
- workflows additionally have a **`.yaml`** with the raw `yaml_config` (node/assistant routing).

## Assistants

| Name | Model | ID | Files |
|---|---|---|---|
| BA Enhancement Analysis and BRD Creation Assistant | gpt-5-2-2025-12-11 | `6344a458-b858-4773-9a9d-032d83331ab1` | `ba-enhancement-analysis-and-brd-creation-assistant.json`, `ba-enhancement-analysis-and-brd-creation-assistant.md` |
| BA Planning & Backlog Assistant | gpt-5-2-2025-12-11 | `8e409825-e493-43a7-baf4-2545e72db7aa` | `ba-planning-backlog-assistant.json`, `ba-planning-backlog-assistant.md` |
| Development & Unit Testing Assistant | gpt-5-2-2025-12-11 | `1059f5bd-12eb-4f7f-89b4-26cc82f245c2` | `development-unit-testing-assistant.json`, `development-unit-testing-assistant.md` |
| EPAM BA User Story Generator | gpt-5-2-2025-12-11 | `577eb23b-553d-445d-baf3-86d3e791c6c1` | `epam-ba-user-story-generator.json`, `epam-ba-user-story-generator.md` |
| Implementation Planning Assistant | gpt-5-2-2025-12-11 | `e61c2c7e-66c2-44cc-ae9b-c5062061b1bf` | `implementation-planning-assistant.json`, `implementation-planning-assistant.md` |
| PR Review Assistant | gpt-5-2-2025-12-11 | `24284972-ec67-43ba-82e4-cccae97c2276` | `pr-review-assistant.json`, `pr-review-assistant.md` |
| PR Review Fix Agent | gpt-5-2-2025-12-11 | `dec54961-77ed-402b-a3de-7270d5adabc6` | `pr-review-fix-agent.json`, `pr-review-fix-agent.md` |
| QA Automation Orchestrator | gpt-5-2-2025-12-11 | `b97e0baf-e2da-468c-9c0b-8d4598c86c40` | `qa-automation-orchestrator.json`, `qa-automation-orchestrator.md` |
| Solution Design Assistant | gpt-5-2-2025-12-11 | `30dc7132-f8a3-469d-8e58-72b0ccf47e04` | `solution-design-assistant.json`, `solution-design-assistant.md` |
| Tasklite Local Deployment Assistant | gpt-5-2-2025-12-11 | `6eb67358-d5bf-4f33-beaf-d669cd520579` | `tasklite-local-deployment-assistant.json`, `tasklite-local-deployment-assistant.md` |

## Workflows

| Name | ID | Files |
|---|---|---|
| Business Analyst Workflow | `d7a12b2a-ba4e-40eb-8e46-865463ac5170` | `business-analyst-workflow.json`, `business-analyst-workflow.md`, `business-analyst-workflow.yaml` |
| TaskLite_AI_SDLC_Orchestrator | `09d750ce-ca56-48c9-8457-5f7ef6ae9b89` | `tasklite-ai-sdlc-orchestrator.json`, `tasklite-ai-sdlc-orchestrator.md`, `tasklite-ai-sdlc-orchestrator.yaml` |

### Orchestrator inline nodes → `workflows/tasklite-ai-sdlc-orchestrator.nodes/`

The `TaskLite_AI_SDLC_Orchestrator` workflow defines its 10 stage assistants **inline** in the
workflow config — they are not separately registered assistants. Each node's system prompt is
extracted to its own `.json` + `.md` under `tasklite-ai-sdlc-orchestrator.nodes/`:

| Node (state) | Inline id | File |
|---|---|---|
| Enhancement_Router | `assistant_10` | `enhancement-router.{json,md}` |
| BA_Enhancement_Analysis_and_BRD_Creation_Assistant | `assistant_1` | `ba-enhancement-analysis-and-brd-creation-assistant.{json,md}` |
| BA_Planning_and_Backlog_Assistant | `assistant_2` | `ba-planning-and-backlog-assistant.{json,md}` |
| Implementation_Planning_Assistant | `assistant_3` | `implementation-planning-assistant.{json,md}` |
| Solution_Design_Assistant | `assistant_4` | `solution-design-assistant.{json,md}` |
| Development_and_Unit_Testing_Assistant | `assistant_5` | `development-and-unit-testing-assistant.{json,md}` |
| PR_Review_Assistant_copy | `assistant_6` | `pr-review-assistant-copy.{json,md}` |
| Tasklite_Local_Deployment_Assistant | `assistant_7` | `tasklite-local-deployment-assistant.{json,md}` |
| QA_Automation_Orchestrator | `assistant_8` | `qa-automation-orchestrator.{json,md}` |
| PR_Review_Fix_Assistance_copy | `assistant_9` | `pr-review-fix-assistance-copy.{json,md}` |

Note: `Enhancement_Router` exists **only** inside this workflow — there is no standalone registered
assistant for it, so it does not appear in the Assistants table above.

## Re-import / restore

```sh
# Recreate an assistant from its exported definition
codemie sdk assistants create --json codemie-assets/assistants/<file>.json
# Update an existing one
codemie sdk assistants update <id> --json codemie-assets/assistants/<file>.json

# Workflows (config comes from the .yaml)
codemie sdk workflows create --json codemie-assets/workflows/<file>.json --config codemie-assets/workflows/<file>.yaml
```
