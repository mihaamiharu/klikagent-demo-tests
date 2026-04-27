const fs = require('fs');
const path = require('path');

const DASHBOARD_DATA_PATH = path.join(__dirname, '..', 'docs', 'dashboard-data.json');
const RUN_RESULT_PATH = process.env.RUN_RESULT_PATH || path.join(__dirname, '..', 'run-result.json');
const MAX_RUNS = 100;

function loadDashboardData() {
  try {
    if (fs.existsSync(DASHBOARD_DATA_PATH)) {
      const data = fs.readFileSync(DASHBOARD_DATA_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not load existing dashboard data:', error.message);
  }
  return { lastUpdated: null, runs: [] };
}

function loadRunResult() {
  try {
    if (fs.existsSync(RUN_RESULT_PATH)) {
      const data = fs.readFileSync(RUN_RESULT_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Could not load run result:', error.message);
  }
  return null;
}

function saveDashboardData(data) {
  fs.writeFileSync(DASHBOARD_DATA_PATH, JSON.stringify(data, null, 2));
  console.log(`Updated dashboard data with ${data.runs.length} runs`);
}

function updateDashboard() {
  const dashboard = loadDashboardData();
  const runResult = loadRunResult();

  if (!runResult) {
    console.log('No run result found, skipping dashboard update');
    return;
  }

  const existingIndex = dashboard.runs.findIndex(r => r.runId === runResult.runId);
  if (existingIndex >= 0) {
    dashboard.runs[existingIndex] = runResult;
    console.log(`Updated existing run ${runResult.runId}`);
  } else {
    dashboard.runs.unshift(runResult);
    console.log(`Added new run ${runResult.runId}`);
  }

  dashboard.runs = dashboard.runs.slice(0, MAX_RUNS);
  dashboard.lastUpdated = new Date().toISOString();

  dashboard.runs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  saveDashboardData(dashboard);
}

updateDashboard();