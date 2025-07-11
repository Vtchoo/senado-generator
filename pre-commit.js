#!/usr/bin/env node

/**
 * Pre-commit test script for Senado Generator
 * Runs essential tests before allowing commits
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

async function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(colorize(`Running: ${command} ${args.join(' ')}`, 'dim'));
    
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd()
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject({ stdout, stderr, code, error: `Command failed with exit code ${code}` });
      }
    });

    child.on('error', (error) => {
      reject({ stdout, stderr, error: error.message });
    });
  });
}

async function checkTypeScript() {
  console.log(colorize('\n🔍 Checking TypeScript compilation...', 'blue'));
  try {
    await runCommand('npx', ['tsc', '--noEmit']);
    console.log(colorize('✅ TypeScript compilation check passed', 'green'));
    return true;
  } catch (error) {
    console.log(colorize('❌ TypeScript compilation failed:', 'red'));
    console.log(error.stderr || error.stdout);
    return false;
  }
}

async function runUnitTests() {
  console.log(colorize('\n🧪 Running unit tests...', 'blue'));
  try {
    const result = await runCommand('npm', ['run', 'test:unit']);
    console.log(colorize('✅ Unit tests passed', 'green'));
    return true;
  } catch (error) {
    console.log(colorize('❌ Unit tests failed:', 'red'));
    console.log(error.stderr || error.stdout);
    return false;
  }
}

async function runSimpleTests() {
  console.log(colorize('\n🎯 Running simple framework-free tests...', 'blue'));
  try {
    await runCommand('npm', ['run', 'test:simple']);
    console.log(colorize('✅ Simple tests passed', 'green'));
    return true;
  } catch (error) {
    console.log(colorize('❌ Simple tests failed:', 'red'));
    console.log(error.stderr || error.stdout);
    return false;
  }
}

async function checkCoverage() {
  console.log(colorize('\n📊 Checking test coverage...', 'blue'));
  try {
    const result = await runCommand('npm', ['run', 'test:coverage', '--', '--silent']);
    
    // Extract coverage information from stdout
    const output = result.stdout;
    const coverageMatch = output.match(/laws\.ts\s+\|\s+([\d.]+)/);
    
    if (coverageMatch) {
      const coverage = parseFloat(coverageMatch[1]);
      if (coverage >= 90) {
        console.log(colorize(`✅ Coverage check passed (Laws: ${coverage}%)`, 'green'));
        return true;
      } else {
        console.log(colorize(`⚠️  Coverage below 90% (Laws: ${coverage}%)`, 'yellow'));
        return true; // Still pass, but warn
      }
    } else {
      console.log(colorize('✅ Coverage check completed', 'green'));
      return true;
    }
  } catch (error) {
    console.log(colorize('❌ Coverage check failed:', 'red'));
    console.log(error.stderr || error.stdout);
    return false;
  }
}

async function main() {
  console.log(colorize('🚀 Pre-commit checks for Senado Generator', 'cyan'));
  console.log(colorize('=' .repeat(50), 'cyan'));

  const checks = [
    { name: 'TypeScript Compilation', fn: checkTypeScript },
    { name: 'Unit Tests', fn: runUnitTests },
    { name: 'Simple Tests', fn: runSimpleTests },
    { name: 'Coverage Check', fn: checkCoverage }
  ];

  let passed = 0;
  let total = checks.length;

  for (const check of checks) {
    const success = await check.fn();
    if (success) {
      passed++;
    }
  }

  console.log(colorize('\n' + '='.repeat(50), 'cyan'));
  
  if (passed === total) {
    console.log(colorize(`🎉 All ${total} pre-commit checks passed!`, 'green'));
    console.log(colorize('✅ Ready to commit', 'green'));
    process.exit(0);
  } else {
    console.log(colorize(`❌ ${total - passed} of ${total} checks failed`, 'red'));
    console.log(colorize('🚫 Please fix the issues before committing', 'red'));
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(colorize('Unhandled Rejection:', 'red'), reason);
  process.exit(1);
});

main().catch(error => {
  console.error(colorize('Fatal error:', 'red'), error);
  process.exit(1);
});
