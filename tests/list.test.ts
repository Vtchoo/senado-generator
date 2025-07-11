/**
 * Unit tests for the List utility class
 */

import { List } from '../src/utils/List'

describe('List utility class', () => {
    
    describe('Basic functionality', () => {
        test('should create empty list', () => {
            const list = new List<number>()
            expect(list.length).toBe(0)
        })

        test('should create list from array', () => {
            const list = new List([1, 2, 3])
            expect(list.length).toBe(3)
            expect(list.get(0)).toBe(1)
            expect(list.get(1)).toBe(2)
            expect(list.get(2)).toBe(3)
        })

        test('should add items', () => {
            const list = new List<string>()
            list.add('test')
            expect(list.length).toBe(1)
            expect(list.get(0)).toBe('test')
        })
    })

    describe('Random selection', () => {
        test('should return random item from list', () => {
            const list = new List(['a', 'b', 'c', 'd', 'e'])
            const selected = list.random()
            
            expect(['a', 'b', 'c', 'd', 'e']).toContain(selected)
        })

        test('should return random item consistently with mocked Math.random', () => {
            // Mock Math.random to return 0.5
            const mockMath = Object.create(global.Math)
            mockMath.random = () => 0.5
            global.Math = mockMath

            const list = new List(['first', 'second', 'third', 'fourth'])
            const selected = list.random()
            
            // With Math.random() = 0.5 and 4 items: Math.floor(0.5 * 4) = 2
            expect(selected).toBe('third') // Index 2
            
            // Restore original Math
            global.Math = Object.create(global.Math)
        })

        test('should handle single item list', () => {
            const list = new List(['only'])
            expect(list.random()).toBe('only')
        })
    })

    describe('Array operations', () => {
        test('should sum numbers', () => {
            const list = new List([1, 2, 3, 4, 5])
            expect(list.sum()).toBe(15)
        })

        test('should sum with function', () => {
            const list = new List([{value: 1}, {value: 2}, {value: 3}])
            expect(list.sum(item => item.value)).toBe(6)
        })

        test('should calculate average', () => {
            const list = new List([{score: 10}, {score: 20}, {score: 30}])
            expect(list.avg(item => item.score)).toBe(20)
        })

        test('should join with function', () => {
            const list = new List([{name: 'Alice'}, {name: 'Bob'}, {name: 'Charlie'}])
            expect(list.join(item => item.name, ', ')).toBe('Alice, Bob, Charlie')
        })
    })

    describe('Error handling', () => {
        test('should throw error when summing non-numbers without function', () => {
            const list = new List(['a', 'b', 'c'])
            expect(() => list.sum()).toThrow('No comparison function provided and List items are not numbers.')
        })
    })
})
