# Test Scripts Documentation

This document provides a comprehensive overview of all available test scripts and testing strategies for the Senado Generator project.

## Available Test Scripts

### NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `npm test` | Run all Jest tests |
| `test:watch` | `npm run test:watch` | Run Jest tests in watch mode |
| `test:coverage` | `npm run test:coverage` | Run tests with coverage report |
| `test:coverage:watch` | `npm run test:coverage:watch` | Run coverage tests in watch mode |
| `test:unit` | `npm run test:unit` | Run only unit tests (*.test.ts) |
| `test:integration` | `npm run test:integration` | Run only integration tests (*.integration.test.ts) |
| `test:verbose` | `npm run test:verbose` | Run tests with verbose output |
| `test:silent` | `npm run test:silent` | Run tests with minimal output |
| `test:changed` | `npm run test:changed` | Run tests only for changed files |
| `test:ci` | `npm run test:ci` | Run tests in CI mode with coverage |
| `test:simple` | `npm run test:simple` | Run framework-free simple tests |
| `test:concordancy` | `npm run test:concordancy` | Run concordancy demonstration |
| `test:all` | `npm run test:all` | Run all test suites sequentially |
| `precommit` | `npm run precommit` | Run pre-commit checks |

### Custom Test Runners

#### Main Test Runner
```bash
node test-runner.js [mode]
```

Available modes:
- `all` - Run all test suites
- `quick` - Run quick tests (unit + simple)
- `unit` - Run Jest unit tests only
- `integration` - Run Jest integration tests only
- `coverage` - Run tests with coverage
- `simple` - Run simple framework-free tests
- `concordancy` - Run concordancy demonstration
- `ci` - Run CI-ready tests
- `watch` - Run tests in watch mode
- `help` - Show help information

#### Pre-commit Checks
```bash
node pre-commit.js
```

Runs:
1. TypeScript compilation check
2. Unit tests
3. Simple tests
4. Coverage validation

## Test Files Overview

### Jest Test Files

#### `tests/laws.test.ts`
**Purpose:** Unit tests for the Laws class with mocked dependencies
**Features:**
- Dependency injection testing
- Method isolation with mocks
- Deterministic testing
- Error handling validation

**Key Tests:**
- Constructor with default data
- Constructor with injected data
- `generateNewLaw()` functionality
- `parse()` method with different placeholders
- Concordancy helper methods
- Error handling for unknown placeholders

#### `tests/laws.integration.test.ts`
**Purpose:** Integration tests for the Laws class with real data
**Features:**
- Performance testing
- Randomness validation
- Content quality checks
- Large-scale generation testing

**Key Tests:**
- Performance benchmarks (1000 laws in <5 seconds)
- Randomness verification
- Content validation (no unfilled placeholders)
- Placeholder processing for all types
- Memory usage testing

#### `tests/list.test.ts`
**Purpose:** Unit tests for the List utility class
**Features:**
- Random selection testing
- Array manipulation validation
- Edge case handling

**Key Tests:**
- Random element selection
- Empty array handling
- Single element arrays
- Large array performance

### Framework-Free Test Files

#### `test-simple.ts`
**Purpose:** Simple, framework-free dependency injection demonstration
**Features:**
- No external dependencies
- Basic assertion logic
- Dependency injection validation

**Tests:**
- Default data usage
- Custom data injection
- Basic functionality verification

#### `test-concordancy.ts`
**Purpose:** Grammatical concordancy demonstration
**Features:**
- Live concordancy examples
- Interactive output
- Real-world usage scenarios

**Demonstrations:**
- Subject concordancy (singular/plural)
- Action concordancy (infinitive/conjugated)
- Object and establishment articles
- Complex placeholder resolution

## Coverage Targets

### Current Coverage (Laws class)
- **Statements:** 96.59%
- **Branches:** 89.07%
- **Functions:** 90%
- **Lines:** 96.55%

### Target Thresholds
- **Minimum:** 90% for critical classes
- **Goal:** 95%+ for core functionality
- **Laws class:** Maintain >95% coverage

## Testing Strategies

### 1. Unit Testing (Jest)
- **Scope:** Individual methods and functions
- **Approach:** Isolated testing with mocks
- **Benefits:** Fast execution, deterministic results
- **Use Cases:** Logic validation, error handling

### 2. Integration Testing (Jest)
- **Scope:** Full system behavior
- **Approach:** Real data, actual workflows
- **Benefits:** Realistic scenarios, performance insights
- **Use Cases:** End-to-end validation, performance testing

### 3. Framework-Free Testing
- **Scope:** Core functionality validation
- **Approach:** Simple assertions, no dependencies
- **Benefits:** Minimal overhead, easy debugging
- **Use Cases:** Quick validation, CI/CD pipelines

### 4. Demonstration Testing
- **Scope:** Feature showcasing
- **Approach:** Interactive examples
- **Benefits:** Documentation, validation
- **Use Cases:** Feature verification, examples

## CI/CD Integration

### GitHub Actions Workflow
File: `.github/workflows/ci.yml`

**Jobs:**
1. **Test Job:** Multi-node version testing
2. **Code Quality:** Coverage and concordancy validation
3. **Validate Laws:** Functional validation

**Node.js Versions Tested:** 16.x, 18.x, 20.x

### Pre-commit Hooks
Run automatically before commits to ensure code quality:
```bash
npm run precommit
```

## Performance Benchmarks

### Laws Generation Performance
- **Target:** 1000 laws in <5 seconds
- **Current:** ✅ Achieved
- **Memory:** Stable usage, no leaks detected

### Test Execution Performance
- **Unit Tests:** <2 seconds
- **Integration Tests:** <5 seconds
- **All Tests:** <10 seconds

## Debugging Test Issues

### Common Issues and Solutions

#### 1. TypeScript Compilation Errors
```bash
npx tsc --noEmit
```
Check for type errors before running tests.

#### 2. Jest Configuration Issues
Verify `jest.config.json` settings:
```json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/tests"],
  "testMatch": ["**/*.test.ts", "**/*.integration.test.ts"]
}
```

#### 3. Coverage Thresholds
Adjust in `jest.config.json` if needed:
```json
{
  "coverageThreshold": {
    "global": {
      "statements": 80,
      "branches": 80,
      "functions": 80,
      "lines": 80
    }
  }
}
```

#### 4. Test Timeouts
For long-running tests:
```javascript
jest.setTimeout(10000); // 10 seconds
```

## Best Practices

### 1. Test Organization
- Unit tests in `tests/*.test.ts`
- Integration tests in `tests/*.integration.test.ts`
- Utilities and demos in root directory

### 2. Test Naming
- Descriptive test names
- Group related tests in `describe` blocks
- Use `it` for individual test cases

### 3. Mocking Strategy
- Mock external dependencies
- Use dependency injection for testability
- Keep mocks simple and focused

### 4. Coverage Goals
- Aim for >90% coverage on core classes
- Focus on critical paths
- Don't chase 100% coverage at expense of quality

### 5. Performance Testing
- Include performance benchmarks
- Test with realistic data volumes
- Monitor memory usage

## Continuous Improvement

### Regular Tasks
1. **Weekly:** Review test coverage reports
2. **Monthly:** Update performance benchmarks
3. **Release:** Full test suite validation
4. **New Features:** Add corresponding tests

### Future Enhancements
- [ ] Add property-based testing
- [ ] Implement mutation testing
- [ ] Add visual regression tests
- [ ] Performance regression detection
- [ ] Automated test generation

## Troubleshooting

### Getting Help
1. Check this documentation
2. Review test output carefully
3. Use verbose mode: `npm run test:verbose`
4. Check individual test files
5. Validate TypeScript compilation

### Common Commands for Debugging
```bash
# Run specific test file
npm test -- tests/laws.test.ts

# Run tests with specific pattern
npm test -- --testNamePattern="should generate"

# Run tests with coverage for specific file
npm test -- --coverage --collectCoverageFrom="src/core/laws.ts"

# Debug with verbose output
npm run test:verbose

# Check TypeScript issues
npx tsc --noEmit
```

## Conclusion

This comprehensive testing setup ensures:
- ✅ High code quality
- ✅ Reliable functionality
- ✅ Performance standards
- ✅ Easy debugging
- ✅ CI/CD integration
- ✅ Documentation and examples

The testing infrastructure supports both development and production needs, providing confidence in code changes and facilitating maintainable, robust software.
