#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(title) {
  console.log('\n' + colorize('='.repeat(60), 'cyan'));
  console.log(colorize(`  ${title}`, 'cyan'));
  console.log(colorize('='.repeat(60), 'cyan') + '\n');
}

function printSection(title) {
  console.log('\n' + colorize(`🔸 ${title}`, 'yellow'));
  console.log(colorize('-'.repeat(40), 'dim'));
}

async function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function runTest(scriptName, description) {
  try {
    printSection(`${description} (npm run ${scriptName})`);
    await runCommand('npm', ['run', scriptName]);
    console.log(colorize(`✅ ${description} completed successfully\n`, 'green'));
    return true;
  } catch (error) {
    console.log(colorize(`❌ ${description} failed: ${error.message}\n`, 'red'));
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  printHeader('SENADO GENERATOR - TEST SUITE RUNNER');
  
  console.log(colorize('Available test commands:', 'bright'));
  console.log('  node test-runner.js all           - Run all test suites');
  console.log('  node test-runner.js quick          - Run quick tests (unit + simple)');
  console.log('  node test-runner.js unit           - Run Jest unit tests only');
  console.log('  node test-runner.js integration    - Run Jest integration tests only');
  console.log('  node test-runner.js coverage       - Run tests with coverage');
  console.log('  node test-runner.js simple         - Run simple framework-free tests');
  console.log('  node test-runner.js concordancy    - Run concordancy demonstration');
  console.log('  node test-runner.js ci             - Run CI-ready tests');
  console.log('  node test-runner.js watch          - Run tests in watch mode');
  console.log('  node test-runner.js help           - Show this help\n');

  if (args.length === 0 || args[0] === 'help') {
    return;
  }

  const mode = args[0];
  let results = [];

  switch (mode) {
    case 'all':
      printHeader('RUNNING ALL TEST SUITES');
      results.push(await runTest('test:simple', 'Simple Framework-Free Tests'));
      results.push(await runTest('test:concordancy', 'Concordancy Demonstration'));
      results.push(await runTest('test:unit', 'Jest Unit Tests'));
      results.push(await runTest('test:integration', 'Jest Integration Tests'));
      results.push(await runTest('test:coverage', 'Coverage Report'));
      break;

    case 'quick':
      printHeader('RUNNING QUICK TEST SUITE');
      results.push(await runTest('test:simple', 'Simple Framework-Free Tests'));
      results.push(await runTest('test:unit', 'Jest Unit Tests'));
      break;

    case 'unit':
      printHeader('RUNNING UNIT TESTS');
      results.push(await runTest('test:unit', 'Jest Unit Tests'));
      break;

    case 'integration':
      printHeader('RUNNING INTEGRATION TESTS');
      results.push(await runTest('test:integration', 'Jest Integration Tests'));
      break;

    case 'coverage':
      printHeader('RUNNING COVERAGE TESTS');
      results.push(await runTest('test:coverage', 'Coverage Report'));
      break;

    case 'simple':
      printHeader('RUNNING SIMPLE TESTS');
      results.push(await runTest('test:simple', 'Simple Framework-Free Tests'));
      break;

    case 'concordancy':
      printHeader('RUNNING CONCORDANCY DEMO');
      results.push(await runTest('test:concordancy', 'Concordancy Demonstration'));
      break;

    case 'ci':
      printHeader('RUNNING CI TESTS');
      results.push(await runTest('test:ci', 'CI-Ready Tests'));
      break;

    case 'watch':
      printHeader('RUNNING TESTS IN WATCH MODE');
      await runTest('test:watch', 'Jest Watch Mode');
      return;

    default:
      console.log(colorize(`❌ Unknown mode: ${mode}`, 'red'));
      console.log(colorize('Run "node test-runner.js help" for available options', 'yellow'));
      return;
  }

  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  printHeader('TEST SUMMARY');
  
  if (passed === total) {
    console.log(colorize(`🎉 All ${total} test suite(s) passed!`, 'green'));
  } else {
    console.log(colorize(`⚠️  ${passed}/${total} test suite(s) passed`, 'yellow'));
  }
  
  console.log('\n' + colorize('Test runner completed.', 'dim'));
  
  // Exit with error code if any tests failed
  if (passed < total) {
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(colorize('Unhandled Rejection at:', 'red'), promise, colorize('reason:', 'red'), reason);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error(colorize('Fatal error:', 'red'), error);
  process.exit(1);
});
