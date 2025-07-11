# Testing Guide for Senado Generator

This project includes comprehensive testing setup for the Laws class and utilities.

## Test Scripts

### `npm test`
Runs the full Jest test suite with all unit and integration tests.

### `npm run test:watch`
Runs Jest in watch mode - automatically re-runs tests when files change. Great for development.

### `npm run test:coverage`
Runs tests and generates a detailed coverage report showing which lines of code are tested.

### `npm run test:simple`
Runs simple dependency injection examples without Jest - good for quick verification.

### `npm run test:concordancy`
Runs the enhanced concordancy demonstration showing both default and injected data usage.

## Test Structure

### Unit Tests (`tests/laws.test.ts`)
- **Mock-based testing**: Uses Jest mocks for deterministic results
- **Dependency injection testing**: Verifies custom data injection works correctly
- **Concordancy testing**: Tests grammatical agreement rules
- **Edge cases**: Tests error conditions and boundary cases

### Integration Tests (`tests/laws.integration.test.ts`)
- **Real randomness**: Tests with actual random data generation
- **Performance testing**: Verifies law generation speed
- **Content validation**: Checks for grammatical consistency
- **Structure validation**: Ensures proper law format

### Utility Tests (`tests/list.test.ts`)
- **List utility testing**: Tests the custom List class functionality
- **Random selection**: Tests the random() method behavior
- **Array operations**: Tests sum, average, join operations

## Test Coverage

Current coverage for Laws class: **96.59%** statement coverage

Key areas covered:
- ✅ Constructor with dependency injection
- ✅ Law generation with all placeholder types
- ✅ Grammatical concordancy methods
- ✅ Number generation
- ✅ Placeholder parsing
- ✅ Error handling

## Example Test Usage

### Testing with Specific Data
```typescript
const testData: LawsData = {
    baseText: ['Test law {predicate}'],
    predicates: ['requires {subject:plural} to {action:infinitive,person}'],
    subjects: [{ singular: 'developer', plural: 'developers', gender: 'm' }]
}

const laws = new Laws(testData)
const result = laws.generateNewLaw()
// Predictable output: "Test law requires developers to..."
```

### Testing Concordancy
```typescript
const laws = new Laws({
    subjects: [{ singular: 'pessoa', plural: 'pessoas', gender: 'f' }],
    baseText: ['{subject:singular} vs {subject:plural}']
})
expect(laws.generateNewLaw()).toBe('pessoa vs pessoas')
```

## Running Tests in Different Environments

### Development
```bash
npm run test:watch
```

### CI/CD
```bash
npm test
npm run test:coverage
```

### Quick Verification
```bash
npm run test:simple
```

## Mock Strategy

Tests use mocking for:
- **List.random()**: Returns predictable values for deterministic tests
- **Math.random()**: Fixed at 0.5 for consistent number generation
- **console.log()**: Suppressed during tests to keep output clean

This ensures tests are:
- ✅ Deterministic and repeatable
- ✅ Fast execution
- ✅ Independent of external factors
- ✅ Clear pass/fail criteria

## Adding New Tests

1. Create test files in `tests/` directory
2. Use `.test.ts` or `.spec.ts` extension
3. Follow existing patterns for mocking and assertions
4. Run `npm run test:coverage` to ensure good coverage

## Files
- `tests/laws.test.ts` - Main Laws class unit tests
- `tests/laws.integration.test.ts` - Integration and performance tests  
- `tests/list.test.ts` - List utility tests
- `jest.config.json` - Jest configuration
- `test-simple.ts` - Framework-free examples
- `test-concordancy.ts` - Enhanced demonstration
