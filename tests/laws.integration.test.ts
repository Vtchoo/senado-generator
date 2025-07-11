/**
 * Integration tests for the Laws class
 * Tests the class behavior with real randomness and full functionality
 */

import Laws from '../src/core/laws'

describe('Laws Integration Tests', () => {
    let laws: Laws

    beforeEach(() => {
        laws = new Laws()
        // Mock console.log to keep test output clean
        jest.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.restoreAllMocks()
    })

    describe('Law generation with real data', () => {
        test('should generate multiple different laws', () => {
            const results = new Set()
            
            // Generate 10 laws and check they're all different
            for (let i = 0; i < 10; i++) {
                const law = laws.generateNewLaw()
                results.add(law)
            }

            // Should have generated some variety (at least 7 different laws out of 10)
            expect(results.size).toBeGreaterThanOrEqual(7)
        })

        test('should generate valid law structures', () => {
            for (let i = 0; i < 5; i++) {
                const law = laws.generateNewLaw()
                
                // Should contain basic law structure
                expect(law).toMatch(/(Projeto de lei|Senado vota|AGORA É LEI)/)
                
                // Should have reasonable length
                expect(law.length).toBeGreaterThan(20)
                expect(law.length).toBeLessThan(500)
                
                // Should not contain unprocessed placeholders
                expect(law).not.toMatch(/\{[^}]+\}/)
            }
        })

        test('should handle complex nested placeholders', () => {
            // Test laws that contain nested placeholders like {subject} within other placeholders
            const results: string[] = []
            
            for (let i = 0; i < 20; i++) {
                const law = laws.generateNewLaw()
                results.push(law)
            }

            // Should not have any remaining unprocessed placeholders
            results.forEach(law => {
                expect(law).not.toMatch(/\{[^}]+\}/)
            })

            // Should have some variety in content
            const uniqueWords = new Set()
            results.forEach(law => {
                law.split(' ').forEach(word => uniqueWords.add(word))
            })
            
            expect(uniqueWords.size).toBeGreaterThan(50) // Should have good vocabulary variety
        })
    })

    describe('Performance tests', () => {
        test('should generate laws quickly', () => {
            const startTime = Date.now()
            
            for (let i = 0; i < 100; i++) {
                laws.generateNewLaw()
            }
            
            const endTime = Date.now()
            const duration = endTime - startTime
            
            // Should generate 100 laws in less than 1 second
            expect(duration).toBeLessThan(1000)
        })
    })

    describe('Content validation', () => {
        test('should generate grammatically consistent Portuguese', () => {
            const generatedLaws: string[] = []
            
            for (let i = 0; i < 20; i++) {
                generatedLaws.push(laws.generateNewLaw())
            }

            generatedLaws.forEach(law => {
                // Basic Portuguese grammar checks
                // Should not have obvious concordancy errors like "pessoa que infectaram"
                expect(law).not.toMatch(/pessoa que .*aram/)
                expect(law).not.toMatch(/pessoas que .*ou/)
                
                // Should not have double spaces
                expect(law).not.toMatch(/  /)
                
                // Should start with capital letter
                expect(law).toMatch(/^[A-Z]/)
            })
        })
    })
})
