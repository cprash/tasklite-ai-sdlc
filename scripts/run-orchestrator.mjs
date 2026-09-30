// Starts a run of the TaskLite_AI_SDLC_Orchestrator workflow and prints its status.
// Usage: node scripts/run-orchestrator.mjs "<enhancement request>"
import { pathToFileURL } from 'node:url';

const WORKFLOW_ID = '09d750ce-ca56-48c9-8457-5f7ef6ae9b89';
const CLI_DIST = 'C:/Users/RahulSharma7/AppData/Local/CodeMie/npm-prefix/node_modules/@codemieai/code/dist';

const request = process.argv.slice(2).join(' ').trim();
if (!request) {
  console.error('Usage: node scripts/run-orchestrator.mjs "<enhancement request>"');
  process.exit(1);
}

const { getCodemieClient } = await import(pathToFileURL(`${CLI_DIST}/utils/sdk-client.js`).href);
const client = await getCodemieClient();

const executions = client.workflows.executions(WORKFLOW_ID);
const started = await executions.create(request);
console.log('Started:', JSON.stringify(started, null, 2));

const id = started?.execution_id ?? started?.id;
if (id) {
  const exec = await executions.get(id);
  console.log(`Execution ${id}: ${exec.overall_status}`);
  console.log('Continue (approvals, clarifying questions) in the CodeMie UI under this workflow\'s executions.');
}
