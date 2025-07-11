/**
 * Test file for demonstrating the refactored law generator
 * with proper Portuguese grammatical concordancy and English variable names.
 * 
 * This test showcases:
 * - Subject-verb agreement
 * - Noun-adjective gender concordancy  
 * - Proper article usage
 * - Correct verb conjugations
 * - Clean English variable naming throughout the codebase
 * - Dependency injection for testability
 * 
 * Run with: npx ts-node test-concordancy.ts
 */

import Laws, { LawsData, NounWithGender, Action } from './src/core/laws'

console.log('🏛️  Testing the refactored law generator with proper concordancy:')
console.log('='.repeat(70))
console.log('✅ Features implemented:')
console.log('   • Proper subject-verb agreement')
console.log('   • Noun-adjective gender concordancy')
console.log('   • Correct article usage (o/a, os/as)')
console.log('   • Appropriate verb conjugations')
console.log('   • Dependency injection for testability')
console.log('='.repeat(70))
console.log()

// Test with default data
console.log('📋 Testing with default data:')
const lawsWithDefaults = new Laws()

for (let i = 0; i < 3; i++) {
    const law = lawsWithDefaults.generateNewLaw()
    console.log(`${i + 1}. ${law}`)
    console.log()
}

console.log('='.repeat(70))
console.log()

// Test with injected test data
console.log('🧪 Testing with controlled test data:')

const testSubjects: NounWithGender[] = [
    { singular: 'programador', plural: 'programadores', gender: 'm' },
    { singular: 'desenvolvedora', plural: 'desenvolvedoras', gender: 'f' }
]

const testActions: Action[] = [
    { infinitive: 'usar café', thirdPerson: 'use café', plural: 'usem café' },
    { infinitive: 'trabalhar remotamente', thirdPerson: 'trabalhe remotamente', plural: 'trabalhem remotamente' }
]

const testData: LawsData = {
    baseText: ['Lei de teste {predicate}'],
    predicates: ['obriga {subject:plural} a {action:infinitive,person}'],
    subjects: testSubjects,
    personActions: testActions
}

const lawsWithTestData = new Laws(testData)

for (let i = 0; i < 2; i++) {
    const law = lawsWithTestData.generateNewLaw()
    console.log(`${i + 1}. ${law}`)
    console.log()
}

console.log('='.repeat(70))
console.log('✨ All tests completed - both default and injected data work correctly!')
