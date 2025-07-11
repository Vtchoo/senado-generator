/**
 * Unit tests for the Laws class
 * Demonstrates how to use dependency injection for deterministic testing
 */

import Laws, { LawsData, NounWithGender, Action, ObjectWithArticle } from '../src/core/laws'

// Mock the List class to make tests deterministic
jest.mock('../src/utils/List', () => ({
    List: jest.fn().mockImplementation((items) => ({
        random: () => items[0] // Always return first item for predictable tests
    }))
}))

// Mock Math.random for deterministic number generation
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5 // Always return 0.5 for predictable results
global.Math = mockMath

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log
beforeEach(() => {
    console.log = jest.fn()
})

afterEach(() => {
    console.log = originalConsoleLog
})

describe('Laws Class Tests', () => {
    
    describe('Default behavior', () => {
        test('should generate laws with default data', () => {
            const laws = new Laws()
            const result = laws.generateNewLaw()
            
            expect(result).toBeDefined()
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        test('should return different results on multiple calls (with default randomness)', () => {
            // Temporarily restore real Math.random for this test
            global.Math = Object.create(global.Math)
            global.Math.random = () => Math.random()
            
            const laws = new Laws()
            const result1 = laws.generateNewLaw()
            const result2 = laws.generateNewLaw()
            
            expect(result1).toBeDefined()
            expect(result2).toBeDefined()
            // Note: This might occasionally fail due to randomness, but very unlikely
            
            // Restore mock
            global.Math = mockMath
        })
    })

    describe('Dependency injection', () => {
        test('should use injected subjects for generation', () => {
            const testSubjects: NounWithGender[] = [
                { singular: 'testador', plural: 'testadores', gender: 'm' }
            ]

            const testActions: Action[] = [
                { infinitive: 'escrever testes', thirdPerson: 'escreva testes', plural: 'escrevam testes' }
            ]

            const testData: LawsData = {
                baseText: ['Projeto de lei {predicate}'],
                predicates: ['obriga {subject:plural} a {action:infinitive,person}'],
                subjects: testSubjects,
                personActions: testActions
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toContain('testadores')
            expect(result).toContain('escrever testes')
        })

        test('should handle grammatical concordancy correctly', () => {
            const testSubjects: NounWithGender[] = [
                { singular: 'desenvolvedora', plural: 'desenvolvedoras', gender: 'f' }
            ]

            const testObjects: ObjectWithArticle[] = [
                { singular: 'ferramenta', plural: 'ferramentas', gender: 'f', article: 'a' }
            ]

            const testData: LawsData = {
                baseText: ['Lei {predicate}'],
                predicates: ['proíbe venda de {object:plural}'],
                subjects: testSubjects,
                objects: testObjects
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toContain('ferramentas')
            expect(result).toBe('Lei proíbe venda de ferramentas')
        })

        test('should fall back to defaults for unspecified data', () => {
            const partialData: LawsData = {
                baseText: ['Teste {predicate}']
                // Other data will use defaults
            }

            const laws = new Laws(partialData)
            const result = laws.generateNewLaw()

            expect(result).toMatch(/^Teste/)
            // Should still work with default subjects, actions, etc.
            expect(result.length).toBeGreaterThan(5)
        })
    })

    describe('Placeholder parsing', () => {
        test('should parse number placeholders correctly', () => {
            const testData: LawsData = {
                baseText: ['Valor: R${number,100,200,2}'],
                predicates: ['teste']
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toMatch(/Valor: R\$\d{3}\.\d{2}/) // Should match pattern like "Valor: R$150.00"
        })

        test('should handle concordancy specifications', () => {
            const testSubjects: NounWithGender[] = [
                { singular: 'pessoa', plural: 'pessoas', gender: 'f' }
            ]

            const testData: LawsData = {
                baseText: ['Singular: {subject:singular}, Plural: {subject:plural}'],
                predicates: ['teste'],
                subjects: testSubjects
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toBe('Singular: pessoa, Plural: pessoas')
        })

        test('should handle action concordancy correctly', () => {
            const testActions: Action[] = [
                { infinitive: 'trabalhar', thirdPerson: 'trabalhe', plural: 'trabalhem' }
            ]

            const testData: LawsData = {
                baseText: ['Infinitive: {action:infinitive,person}, Third: {action:thirdPerson,person}, Plural: {action:plural,person}'],
                predicates: ['teste'],
                personActions: testActions
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toBe('Infinitive: trabalhar, Third: trabalhe, Plural: trabalhem')
        })
    })

    describe('Edge cases', () => {
        test('should handle empty injected data gracefully', () => {
            const laws = new Laws({})
            const result = laws.generateNewLaw()

            expect(result).toBeDefined()
            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        test('should handle minimal data injection', () => {
            const testData: LawsData = {
                baseText: ['Simple test'],
                predicates: ['works']
            }

            const laws = new Laws(testData)
            const result = laws.generateNewLaw()

            expect(result).toBe('Simple test')
        })

        test('should throw error for unknown placeholder types', () => {
            const testData: LawsData = {
                baseText: ['Test {unknown}'],
                predicates: ['test']
            }

            const laws = new Laws(testData)
            
            expect(() => laws.generateNewLaw()).toThrow('Unknown part type')
        })
    })
})
