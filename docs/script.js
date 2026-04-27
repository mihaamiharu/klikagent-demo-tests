const OWNER = 'mihaamiharu';
const REPO = 'klikagent-demo-tests';
const DATA_URL = 'dashboard-data.json';

let allRuns = [];
let filteredRuns = [];
let currentRun = null;

async function fetchDashboardData() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('Dashboard data not found');
    return await response.json();
  } catch (error) {
    console.warn('Could not load dashboard data:', error.message);
    return { runs: [] };
  }
}

async function fetchGitHubRuns(limit = 50) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs?per_page=${limit}`
    );
    if (!response.ok) throw new Error('GitHub API error');
    const data = await response.json();
    return data.workflow_runs;
  } catch (error) {
    console.warn('Could not fetch GitHub runs:', error.message);
    return [];
  }
}

async function fetchRunArtifacts(runId) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs/${runId}/artifacts`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.artifacts || [];
  } catch {
    return [];
  }
}

async function fetchArtifactContent(artifactName) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/actions/artifacts`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const artifact = data.artifacts?.find(a => a.name === artifactName);
    if (!artifact) return null;

    const zipResponse = await fetch(artifact.archive_download_url);
    if (!zipResponse.ok) return null;

    const zip = await zipResponse.arrayBuffer();

    if (typeof JSZip === 'undefined') {
      console.warn('JSZip not loaded');
      return null;
    }

    const jszip = new JSZip();
    await jszip.loadAsync(zip);

    const runResultFile = jszip.file('run-result.json');
    if (runResultFile) {
      return JSON.parse(await runResultFile.async('string'));
    }

    const jsonFile = jszip.file(/\.json$/)[0];
    if (jsonFile) {
      return JSON.parse(await jsonFile.async('string'));
    }

    return null;
  } catch (error) {
    console.warn('Could not fetch artifact content:', error.message);
    return null;
  }
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(ms) {
  if (!ms) return '-';
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function renderSummary(data) {
  const totalRuns = data.runs?.length || 0;
  const passedRuns = data.runs?.filter(r => r.conclusion === 'success' || r.status === 'passed').length || 0;
  const failedRuns = data.runs?.filter(r => r.conclusion === 'failure' || r.status === 'failed').length || 0;
  const totalTests = data.runs?.reduce((sum, r) => sum + (r.totalTests || 0), 0) || 0;
  const passedTests = data.runs?.reduce((sum, r) => sum + (r.passed || 0), 0) || 0;
  const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  document.getElementById('totalRuns').textContent = totalRuns;
  document.getElementById('passedRuns').textContent = passedRuns;
  document.getElementById('failedRuns').textContent = failedRuns;
  document.getElementById('totalTests').textContent = totalTests;
  document.getElementById('passRate').textContent = `${passRate}%`;
}

function renderBranchFilter(runs) {
  const branchFilter = document.getElementById('branchFilter');
  const branches = [...new Set(runs.map(r => r.branch).filter(Boolean))];

  branchFilter.innerHTML = '<option value="">All Branches</option>';
  branches.forEach(branch => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchFilter.appendChild(option);
  });
}

function renderRunList(runs) {
  const container = document.getElementById('runList');

  if (runs.length === 0) {
    container.innerHTML = '<div class="no-data">No test runs found</div>';
    return;
  }

  container.innerHTML = runs.map(run => {
    const statusClass = run.conclusion === 'success' || run.status === 'passed' ? 'passed' :
                        run.conclusion === 'failure' || run.status === 'failed' ? 'failed' : '';
    const statusText = run.conclusion === 'success' || run.status === 'passed' ? 'Passed' :
                       run.conclusion === 'failure' || run.status === 'failed' ? 'Failed' : run.conclusion;

    return `
      <div class="run-card" data-run-id="${run.runId}">
        <div class="run-card-header">
          <div>
            <span class="run-title">Run #${run.runNumber || run.runId}</span>
            ${run.branch ? `<span class="run-branch">${run.branch}</span>` : ''}
          </div>
          <span class="run-status ${statusClass}">${statusText}</span>
        </div>
        <div class="run-meta">
          <span>${run.createdAt ? formatDate(run.createdAt) : '-'}</span>
          <span>${formatDuration(run.duration)}</span>
          ${run.commitMessage ? `<span class="commit-message" title="${run.commitMessage}">${run.commitMessage}</span>` : ''}
        </div>
        <div class="run-stats">
          <span class="run-stat passed">✓ ${run.passed || 0} passed</span>
          <span class="run-stat failed">✗ ${run.failed || 0} failed</span>
          <span class="run-stat skipped">○ ${run.skipped || 0} skipped</span>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.run-card').forEach(card => {
    card.addEventListener('click', () => {
      const runId = card.dataset.runId;
      const run = runs.find(r => r.runId == runId);
      if (run) showRunDetail(run);
    });
  });
}

function showRunDetail(run) {
  currentRun = run;
  document.getElementById('runList').classList.add('hidden');
  document.getElementById('runDetail').classList.remove('hidden');

  const header = document.getElementById('runHeader');
  const statusClass = run.conclusion === 'success' || run.status === 'passed' ? 'passed' :
                      run.conclusion === 'failure' || run.status === 'failed' ? 'failed' : '';
  const statusText = run.conclusion === 'success' || run.status === 'passed' ? 'Passed' :
                     run.conclusion === 'failure' || run.status === 'failed' ? 'Failed' : run.conclusion;

  header.innerHTML = `
    <h2>Run #${run.runNumber || run.runId}</h2>
    <div class="run-meta" style="margin: 1rem 0;">
      <span class="run-status ${statusClass}">${statusText}</span>
      <span>${run.branch || '-'}</span>
      <span>${run.createdAt ? formatDate(run.createdAt) : '-'}</span>
      <span>Duration: ${formatDuration(run.duration)}</span>
    </div>
    <div class="run-stats">
      <span class="run-stat passed">✓ ${run.passed || 0} passed</span>
      <span class="run-stat failed">✗ ${run.failed || 0} failed</span>
      <span class="run-stat skipped">○ ${run.skipped || 0} skipped</span>
    </div>
  `;

  const testList = document.getElementById('testList');

  if (!run.tests || run.tests.length === 0) {
    testList.innerHTML = '<div class="no-data">No test details available</div>';
    return;
  }

  testList.innerHTML = run.tests.map(test => {
    const testStatus = test.status === 'passed' ? 'passed' :
                       test.status === 'failed' ? 'failed' : 'skipped';

    return `
      <div class="test-item" data-test-id="${test.testId}">
        <div class="test-header">
          <span class="test-title">
            <span class="test-status ${testStatus}">${test.status}</span>
            ${test.titlePath?.slice(2).join(' > ') || test.title}
          </span>
          <span>${formatDuration(test.duration)}</span>
        </div>
        <div class="test-body">
          ${test.tags?.length ? `<div class="tags">${test.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
          <div class="test-info">
            <div class="test-info-item">
              <div class="test-info-label">Location</div>
              <div>${test.location?.file}:${test.location?.line}</div>
            </div>
            <div class="test-info-item">
              <div class="test-info-label">Retries</div>
              <div>${test.retry || 0}</div>
            </div>
          </div>
          ${test.error ? `
            <div class="error-box">
              <div class="test-info-label">Error</div>
              <div class="error-message">${escapeHtml(test.error)}</div>
              ${test.stackTrace ? `<div class="stack-trace">${escapeHtml(test.stackTrace)}</div>` : ''}
            </div>
          ` : ''}
          ${test.steps?.length ? `
            <div class="steps-list">
              <div class="test-info-label">Steps</div>
              ${renderSteps(test.steps)}
            </div>
          ` : ''}
          ${test.stdout?.length ? `
            <div class="error-box" style="background: #f7f7f7; border-color: #ddd;">
              <div class="test-info-label">Console Output</div>
              <pre class="error-message" style="color: #333;">${escapeHtml(test.stdout.join('\n'))}</pre>
            </div>
          ` : ''}
          ${test.attachments?.length ? `
            <div class="attachments">
              <div class="test-info-label">Attachments</div>
              ${test.attachments.map(a => `<span class="attachment-item">${a.name} (${a.contentType})</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  testList.querySelectorAll('.test-header').forEach(header => {
    header.addEventListener('click', () => {
      header.parentElement.classList.toggle('expanded');
    });
  });
}

function renderSteps(steps, depth = 0) {
  return steps.map(step => {
    const hasError = step.error;
    return `
      <div class="step-item ${hasError ? 'error' : ''}" style="margin-left: ${depth * 1}rem;">
        <div class="step-title">${escapeHtml(step.title)}</div>
        <div class="step-duration">${step.category} • ${formatDuration(step.duration)}</div>
        ${hasError ? `<div class="error-message" style="font-size: 0.8rem; margin-top: 0.25rem;">${escapeHtml(step.error)}</div>` : ''}
        ${step.steps?.length ? renderSteps(step.steps, depth + 1) : ''}
      </div>
    `;
  }).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function applyFilters() {
  const branch = document.getElementById('branchFilter').value;
  const status = document.getElementById('statusFilter').value;

  filteredRuns = allRuns.filter(run => {
    if (branch && run.branch !== branch) return false;
    if (status) {
      if (status === 'passed' && run.conclusion !== 'success' && run.status !== 'passed') return false;
      if (status === 'failed' && run.conclusion !== 'failure' && run.status !== 'failed') return false;
      if (status === 'skipped' && run.status === 'skipped') return false;
    }
    return true;
  });

  renderRunList(filteredRuns);
}

async function init() {
  const data = await fetchDashboardData();
  allRuns = data.runs || [];
  filteredRuns = [...allRuns];

  renderSummary(data);
  renderBranchFilter(allRuns);
  renderRunList(filteredRuns);

  document.getElementById('branchFilter').addEventListener('change', applyFilters);
  document.getElementById('statusFilter').addEventListener('change', applyFilters);

  document.getElementById('backBtn').addEventListener('click', () => {
    document.getElementById('runDetail').classList.add('hidden');
    document.getElementById('runList').classList.remove('hidden');
    currentRun = null;
  });

  document.getElementById('refreshBtn').addEventListener('click', async () => {
    const refreshedData = await fetchDashboardData();
    allRuns = refreshedData.runs || [];
    filteredRuns = [...allRuns];
    renderSummary(refreshedData);
    renderBranchFilter(allRuns);
    applyFilters();
  });

  document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('testModal').classList.add('hidden');
  });

  document.getElementById('testModal').addEventListener('click', (e) => {
    if (e.target.id === 'testModal') {
      document.getElementById('testModal').classList.add('hidden');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}