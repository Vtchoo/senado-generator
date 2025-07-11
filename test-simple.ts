/**
 * Simple test examples for the Laws class without external test frameworks
 * Shows how dependency injection enables deterministic testing
 */

import Laws, { LawsData, NounWithGender, Action } from './src/core/laws'

console.log('🧪 Running simple tests for Laws class with dependency injection...')
console.log('='.repeat(70))

// Test 1: Specific subject injection
console.log('Test 1: Testing with specific subjects')
const testSubjects: NounWithGender[] = [
    { singular: 'desenvolvedor', plural: 'desenvolvedores', gender: 'm' }
]

const testData1: LawsData = {
    baseText: ['Lei específica {predicate}'],
    predicates: ['beneficia {subject:plural}'],
    subjects: testSubjects
}

const laws1 = new Laws(testData1)
const result1 = laws1.generateNewLaw()
console.log(`Result: ${result1}`)
console.log(`✅ Contains "desenvolvedores": ${result1.includes('desenvolvedores')}`)
console.log()

// Test 2: Testing action conjugation
console.log('Test 2: Testing action conjugation')
const testActions: Action[] = [
    { infinitive: 'programar em TypeScript', thirdPerson: 'programe em TypeScript', plural: 'programem em TypeScript' }
]

const testData2: LawsData = {
    baseText: ['Regra {predicate}'],
    predicates: ['obriga {subject:plural} a {action:infinitive,person}'],
    subjects: [{ singular: 'programador', plural: 'programadores', gender: 'm' }],
    personActions: testActions
}

const laws2 = new Laws(testData2)
const result2 = laws2.generateNewLaw()
console.log(`Result: ${result2}`)
console.log(`✅ Contains "programar em TypeScript": ${result2.includes('programar em TypeScript')}`)
console.log(`✅ Contains "programadores": ${result2.includes('programadores')}`)
console.log()

// Test 3: Testing fallback to defaults
console.log('Test 3: Testing partial injection with defaults fallback')
const partialData: LawsData = {
    baseText: ['Projeto personalizado {predicate}']
    // Other arrays will use defaults
}

const laws3 = new Laws(partialData)
const result3 = laws3.generateNewLaw()
console.log(`Result: ${result3}`)
console.log(`✅ Starts with "Projeto personalizado": ${result3.startsWith('Projeto personalizado')}`)
console.log(`✅ Has reasonable length: ${result3.length > 20}`)
console.log()

// Test 4: Testing with minimal data for predictable output
console.log('Test 4: Testing with minimal controlled data')
const minimalData: LawsData = {
    baseText: ['Teste {predicate}'],
    predicates: ['simples'],
    subjects: [{ singular: 'pessoa', plural: 'pessoas', gender: 'f' }]
}

const laws4 = new Laws(minimalData)
const result4 = laws4.generateNewLaw()
console.log(`Result: ${result4}`)
console.log(`✅ Expected "Teste simples": ${result4 === 'Teste simples'}`)
console.log()

// Test 5: Testing concordancy
console.log('Test 5: Testing grammatical concordancy')
const concordancyData: LawsData = {
    baseText: ['Concordância: {subject:singular} vs {subject:plural}'],
    predicates: ['teste'],
    subjects: [{ singular: 'cidadão', plural: 'cidadãos', gender: 'm' }]
}

const laws5 = new Laws(concordancyData)
const result5 = laws5.generateNewLaw()
console.log(`Result: ${result5}`)
console.log(`✅ Shows both forms correctly: ${result5.includes('cidadão') && result5.includes('cidadãos')}`)

console.log()
console.log('='.repeat(70))
console.log('✨ All simple tests completed!')
console.log('📋 Summary: The Laws class now supports dependency injection for:')
console.log('   • Deterministic testing with specific data')
console.log('   • Fallback to defaults when data is not provided')
console.log('   • Proper grammatical concordancy testing')
console.log('   • Isolated testing of specific features')
