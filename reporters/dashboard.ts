import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
  TestStep as PwTestStep,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface TestStep {
  title: string;
  category: string;
  duration: number;
  error?: string;
  steps?: TestStep[];
}

interface EnrichedTestResult {
  testId: string;
  title: string;
  titlePath: string[];
  location: { file: string; line: number; column: number };
  status: string;
  duration: number;
  error?: string;
  stackTrace?: string;
  retry: number;
  attachments: { name: string; contentType: string; path?: string }[];
  steps: TestStep[];
  tags: string[];
  stdout: string[];
  stderr: string[];
}

interface RunData {
  runId: string;
  runNumber: number;
  branch: string;
  commitSha: string;
  commitMessage: string;
  conclusion: string;
  createdAt: string;
  duration: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: EnrichedTestResult[];
}

class DashboardReporter implements Reporter {
  private results: EnrichedTestResult[] = [];
  private runInfo: Partial<RunData> = {};

  onBegin(config: FullConfig, suite: Suite): void {
    this.results = [];
    const timestamp = new Date().toISOString();
    this.runInfo = {
      createdAt: timestamp,
      totalTests: suite.allTests().length,
    };
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const error = result.errors[0];

    const enrichedResult: EnrichedTestResult = {
      testId: test.id,
      title: test.title,
      titlePath: test.titlePath(),
      location: {
        file: test.location.file,
        line: test.location.line,
        column: test.location.column,
      },
      status: result.status,
      duration: result.duration,
      error: error?.message,
      stackTrace: error?.stack,
      retry: result.retry,
      attachments: result.attachments.map((a) => ({
        name: a.name,
        contentType: a.contentType,
        path: a.path,
      })),
      steps: this.flattenSteps(result.steps),
      tags: test.tags,
      stdout: result.stdout.map((s) => s.toString()),
      stderr: result.stderr.map((s) => s.toString()),
    };

    this.results.push(enrichedResult);
  }

  onEnd(result: FullResult): void {
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed').length;
    const skipped = this.results.filter(
      (r) => r.status === 'skipped' || r.status === 'timedOut'
    ).length;

    const runData: RunData = {
      runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
      runNumber: parseInt(process.env.GITHUB_RUN_NUMBER || '0', 10),
      branch: process.env.GITHUB_REF_NAME || 'local',
      commitSha: process.env.GITHUB_SHA || '',
      commitMessage:
        process.env.GITHUB_COMMIT_MESSAGE || 'Local run',
      conclusion: result.status || 'unknown',
      createdAt: this.runInfo.createdAt || new Date().toISOString(),
      duration: result.duration,
      totalTests: this.results.length,
      passed,
      failed,
      skipped,
      tests: this.results,
    };

    const outputDir = process.env.DASHBOARD_OUTPUT_DIR || '.';
    const outputPath = path.join(outputDir, 'run-result.json');

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(runData, null, 2));

    console.log(
      `Dashboard reporter: Generated ${outputPath} (${passed} passed, ${failed} failed, ${skipped} skipped)`
    );
  }

  private flattenSteps(steps: PwTestStep[]): TestStep[] {
    return steps.map((s) => ({
      title: s.title,
      category: s.category,
      duration: s.duration,
      error: s.error?.message,
      steps: s.steps?.length ? this.flattenSteps(s.steps) : undefined,
    }));
  }
}

export default DashboardReporter;
export { DashboardReporter };
export type { RunData, EnrichedTestResult, TestStep };