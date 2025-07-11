#!/usr/bin/env node

/**
 * Test runner script - shows all available testing options
 */

console.log('🧪 Senado Generator Test Suite')
console.log('='.repeat(50))
console.log()
console.log('Available test commands:')
console.log()
console.log('📋 Unit & Integration Tests:')
console.log('  npm test                  - Run full Jest test suite')
console.log('  npm run test:watch        - Run tests in watch mode')
console.log('  npm run test:coverage     - Run tests with coverage report')
console.log()
console.log('🔍 Demo & Examples:')
console.log('  npm run test:simple       - Simple dependency injection examples')
console.log('  npm run test:concordancy  - Concordancy demonstration')
console.log()
console.log('📊 Current Coverage: Laws class 96.59% statement coverage')
console.log()
console.log('💡 For development, use: npm run test:watch')
console.log('💡 For CI/CD, use: npm test && npm run test:coverage')
console.log()

if (process.argv.includes('--run-all')) {
    console.log('🚀 Running all tests...')
    console.log()
    
    const { spawn } = require('child_process')
    
    const runCommand = (command, args) => {
        return new Promise((resolve, reject) => {
            console.log(`➤ Running: ${command} ${args.join(' ')}`)
            const process = spawn(command, args, { stdio: 'inherit', shell: true })
            
            process.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ ${command} completed successfully\n`)
                    resolve()
                } else {
                    reject(new Error(`${command} failed with code ${code}`))
                }
            })
        })
    }
    
    async function runAllTests() {
        try {
            await runCommand('npm', ['test'])
            await runCommand('npm', ['run', 'test:coverage'])
            await runCommand('npm', ['run', 'test:simple'])
            
            console.log('🎉 All tests completed successfully!')
        } catch (error) {
            console.error('❌ Test suite failed:', error.message)
            process.exit(1)
        }
    }
    
    runAllTests()
} else {
    console.log('Add --run-all flag to execute all test suites')
}
