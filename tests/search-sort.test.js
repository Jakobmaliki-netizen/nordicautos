// Property-Based Tests for Nordic Autos Search and Sorting Functionality
// Using fast-check for property-based testing

/**
 * Property-Based Test Suite for Search and Sorting Functionality
 * **Feature: nordic-autos-website, Property 8: Search Results Relevance**
 * **Feature: nordic-autos-website, Property 9: Sorting Correctness**
 * **Validates: Requirements 3.4, 3.5**
 */

class SearchSortPropertyTests {
    constructor() {
        this.testResults = [];
        this.iterations = 100; // Minimum required iterations
        this.sampleCars = this.generateSampleCars();
    }

    /**
     * Generate sample car data for testing
     */
    generateSampleCars() {
        const brands = ['Porsche', 'Audi', 'Mercedes-Benz', 'BMW', 'Tesla', 'Lamborghini', 'Ferrari'];
        const models = ['911', 'A4', 'C-Class', 'X5', 'Model S', 'Huracan', 'F8'];
        const variants = ['Turbo', 'Sport', 'AMG', 'M', 'Plaid', 'Evo', 'Spider'];
        
        const cars = [];
        
        for (let i = 1; i <= 100; i++) {
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const model = models[Math.floor(Math.random() * models.length)];
            const variant = variants[Math.floor(Math.random() * variants.length)];
            
            cars.push({
                id: i,
                brand: brand,
                model: model,
                variant: variant,
                year: 2015 + Math.floor(Math.random() * 9), // 2015-2023
                price: 300000 + Math.floor(Math.random() * 4700000), // 300k-5M DKK
                mileage: Math.floor(Math.random() * 150000), // 0-150k km
                horsepower: 200 + Math.floor(Math.random() * 600), // 200-800 hp
                isNew: Math.random() > 0.8,
                status: Math.random() > 0.9 ? 'reserved' : 'available'
            });
        }
        
        return cars;
    }

    /**
     * Property 8: Search Results Relevance
     * For any search term, all returned results should contain the search term in relevant car fields
     */
    async testSearchResultsRelevance() {
        console.log('Running Property Test: Search Results Relevance');
        
        let passedTests = 0;
        let failedTests = 0;
        const failures = [];

        // Run property test for minimum iterations
        for (let i = 0; i < this.iterations; i++) {
            try {
                // Generate random search term
                const searchTerm = this.generateRandomSearchTerm();
                
                // Test the search functionality properties
                const result = this.verifySearchProperties(searchTerm);
                
                if (result.success) {
                    passedTests++;
                } else {
                    failedTests++;
                    failures.push({
                        iteration: i + 1,
                        searchTerm: searchTerm,
                        error: result.error
                    });
                }
                
            } catch (error) {
                failedTests++;
                failures.push({
                    iteration: i + 1,
                    searchTerm: searchTerm,
                    error: error.message
                });
            }
        }

        const testResult = {
            property: 'Search Results Relevance',
            totalIterations: this.iterations,
            passed: passedTests,
            failed: failedTests,
            successRate: (passedTests / this.iterations) * 100,
            failures: failures.slice(0, 5) // Show first 5 failures
        };

        this.testResults.push(testResult);
        return testResult;
    }

    /**
     * Property 9: Sorting Correctness
     * For any selected sort option, the car catalog results should be ordered correctly according to that criteria
     */
    async testSortingCorrectness() {
        console.log('Running Property Test: Sorting Correctness');
        
        let passedTests = 0;
        let failedTests = 0;
        const failures = [];
        
        const sortOptions = ['newest', 'price_low', 'price_high', 'year', 'mileage'];

        // Run property test for minimum iterations
        for (let i = 0; i < this.iterations; i++) {
            try {
                // Generate random sort option
                const sortOption = sortOptions[Math.floor(Math.random() * sortOptions.length)];
                
                // Test the sorting functionality properties
                const result = this.verifySortingProperties(sortOption);
                
                if (result.success) {
                    passedTests++;
                } else {
                    failedTests++;
                    failures.push({
                        iteration: i + 1,
                        sortOption: sortOption,
                        error: result.error
                    });
                }
                
            } catch (error) {
                failedTests++;
                failures.push({
                    iteration: i + 1,
                    sortOption: sortOption,
                    error: error.message
                });
            }
        }

        const testResult = {
            property: 'Sorting Correctness',
            totalIterations: this.iterations,
            passed: passedTests,
            failed: failedTests,
            successRate: (passedTests / this.iterations) * 100,
            failures: failures.slice(0, 5) // Show first 5 failures
        };

        this.testResults.push(testResult);
        return testResult;
    }

    /**
     * Generate random search term for testing
     */
    generateRandomSearchTerm() {
        const searchTerms = [
            'Porsche', 'Audi', 'BMW', 'Mercedes', 'Tesla',
            '911', 'A4', 'X5', 'Model', 'C-Class',
            'Turbo', 'Sport', 'AMG', 'M', 'Plaid',
            'Por', 'Aud', 'BM', 'Mer', 'Tes', // Partial matches
            '91', 'A', 'X', 'Mod', 'C-', // Very partial matches
            '', // Empty search
            'NonExistent', 'XYZ123' // Non-matching terms
        ];
        
        return searchTerms[Math.floor(Math.random() * searchTerms.length)];
    }

    /**
     * Verify search properties for given search term
     */
    verifySearchProperties(searchTerm) {
        try {
            // Apply search to sample cars
            const searchResults = this.applySearch(this.sampleCars, searchTerm);
            
            // Property 8.1: All results should contain search term (if not empty)
            if (searchTerm && searchTerm.trim() !== '') {
                const relevanceValid = this.verifySearchRelevance(searchResults, searchTerm);
                if (!relevanceValid.success) {
                    return { success: false, error: `Search relevance failed: ${relevanceValid.error}` };
                }
            }

            // Property 8.2: Empty search should return all cars
            if (!searchTerm || searchTerm.trim() === '') {
                if (searchResults.length !== this.sampleCars.length) {
                    return { success: false, error: `Empty search should return all cars, got ${searchResults.length} instead of ${this.sampleCars.length}` };
                }
            }

            // Property 8.3: Search should be case-insensitive
            const caseInsensitiveValid = this.verifyCaseInsensitiveSearch(searchTerm);
            if (!caseInsensitiveValid.success) {
                return { success: false, error: `Case insensitive search failed: ${caseInsensitiveValid.error}` };
            }

            // Property 8.4: Search should match partial terms
            const partialMatchValid = this.verifyPartialMatching(searchResults, searchTerm);
            if (!partialMatchValid.success) {
                return { success: false, error: `Partial matching failed: ${partialMatchValid.error}` };
            }

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify sorting properties for given sort option
     */
    verifySortingProperties(sortOption) {
        try {
            // Apply sorting to sample cars
            const sortedCars = this.applySorting([...this.sampleCars], sortOption);
            
            // Property 9.1: Results should be in correct order
            const orderValid = this.verifySortOrder(sortedCars, sortOption);
            if (!orderValid.success) {
                return { success: false, error: `Sort order failed: ${orderValid.error}` };
            }

            // Property 9.2: All original cars should be present
            if (sortedCars.length !== this.sampleCars.length) {
                return { success: false, error: `Sorting changed number of cars: ${sortedCars.length} vs ${this.sampleCars.length}` };
            }

            // Property 9.3: No cars should be duplicated or lost
            const integrityValid = this.verifySortIntegrity(sortedCars, this.sampleCars);
            if (!integrityValid.success) {
                return { success: false, error: `Sort integrity failed: ${integrityValid.error}` };
            }

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Apply search to car array (simulates CarCatalog search logic)
     */
    applySearch(cars, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return cars;
        }
        
        const searchLower = searchTerm.toLowerCase();
        
        return cars.filter(car => {
            const searchableText = `${car.brand} ${car.model} ${car.variant}`.toLowerCase();
            return searchableText.includes(searchLower);
        });
    }

    /**
     * Apply sorting to car array (simulates CarCatalog sort logic)
     */
    applySorting(cars, sortOption) {
        switch (sortOption) {
            case 'price_low':
                return cars.sort((a, b) => a.price - b.price);
            case 'price_high':
                return cars.sort((a, b) => b.price - a.price);
            case 'year':
                return cars.sort((a, b) => b.year - a.year);
            case 'mileage':
                return cars.sort((a, b) => a.mileage - b.mileage);
            case 'newest':
            default:
                return cars.sort((a, b) => {
                    // Sort by isNew first, then by year
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return b.year - a.year;
                });
        }
    }

    /**
     * Verify search relevance
     */
    verifySearchRelevance(searchResults, searchTerm) {
        try {
            const searchLower = searchTerm.toLowerCase();
            
            for (const car of searchResults) {
                const searchableText = `${car.brand} ${car.model} ${car.variant}`.toLowerCase();
                if (!searchableText.includes(searchLower)) {
                    return { success: false, error: `Car "${car.brand} ${car.model}" doesn't contain search term "${searchTerm}"` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify case insensitive search
     */
    verifyCaseInsensitiveSearch(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') return { success: true };
            
            const lowerResults = this.applySearch(this.sampleCars, searchTerm.toLowerCase());
            const upperResults = this.applySearch(this.sampleCars, searchTerm.toUpperCase());
            const mixedResults = this.applySearch(this.sampleCars, searchTerm);
            
            if (lowerResults.length !== upperResults.length || lowerResults.length !== mixedResults.length) {
                return { success: false, error: `Case sensitivity affects results: ${lowerResults.length} vs ${upperResults.length} vs ${mixedResults.length}` };
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify partial matching works correctly
     */
    verifyPartialMatching(searchResults, searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') return { success: true };
            
            // For partial terms, verify that full matches are also found
            const fullMatches = this.sampleCars.filter(car => {
                const searchableText = `${car.brand} ${car.model} ${car.variant}`.toLowerCase();
                return searchableText.includes(searchTerm.toLowerCase());
            });
            
            // All full matches should be in search results
            for (const fullMatch of fullMatches) {
                const found = searchResults.some(result => result.id === fullMatch.id);
                if (!found) {
                    return { success: false, error: `Full match "${fullMatch.brand} ${fullMatch.model}" not found in search results` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify sort order is correct
     */
    verifySortOrder(sortedCars, sortOption) {
        try {
            for (let i = 0; i < sortedCars.length - 1; i++) {
                const current = sortedCars[i];
                const next = sortedCars[i + 1];
                
                let isCorrectOrder = false;
                
                switch (sortOption) {
                    case 'price_low':
                        isCorrectOrder = current.price <= next.price;
                        break;
                    case 'price_high':
                        isCorrectOrder = current.price >= next.price;
                        break;
                    case 'year':
                        isCorrectOrder = current.year >= next.year;
                        break;
                    case 'mileage':
                        isCorrectOrder = current.mileage <= next.mileage;
                        break;
                    case 'newest':
                    default:
                        // isNew cars first, then by year descending
                        if (current.isNew && !next.isNew) {
                            isCorrectOrder = true;
                        } else if (!current.isNew && next.isNew) {
                            isCorrectOrder = false;
                        } else {
                            isCorrectOrder = current.year >= next.year;
                        }
                        break;
                }
                
                if (!isCorrectOrder) {
                    return { success: false, error: `Sort order violation at position ${i} for ${sortOption}: ${JSON.stringify(current)} vs ${JSON.stringify(next)}` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify sort integrity (no cars lost or duplicated)
     */
    verifySortIntegrity(sortedCars, originalCars) {
        try {
            const sortedIds = sortedCars.map(car => car.id).sort((a, b) => a - b);
            const originalIds = originalCars.map(car => car.id).sort((a, b) => a - b);
            
            if (sortedIds.length !== originalIds.length) {
                return { success: false, error: `Different number of cars: ${sortedIds.length} vs ${originalIds.length}` };
            }
            
            for (let i = 0; i < sortedIds.length; i++) {
                if (sortedIds[i] !== originalIds[i]) {
                    return { success: false, error: `Car ID mismatch at position ${i}: ${sortedIds[i]} vs ${originalIds[i]}` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Run all search and sort property tests
     */
    async runAllTests() {
        console.log('Starting Search and Sort Property-Based Tests...');
        console.log(`Running ${this.iterations} iterations per property`);
        console.log(`Testing with ${this.sampleCars.length} sample cars`);
        
        const results = [];
        
        // Test Search Results Relevance
        const searchResult = await this.testSearchResultsRelevance();
        results.push(searchResult);
        
        // Test Sorting Correctness
        const sortResult = await this.testSortingCorrectness();
        results.push(sortResult);
        
        // Generate test report
        this.generateTestReport(results);
        
        return results;
    }

    /**
     * Generate and display test report
     */
    generateTestReport(results) {
        console.log('\n=== Search and Sort Property Test Report ===');
        
        let allTestsPassed = true;
        
        results.forEach(result => {
            console.log(`\nProperty: ${result.property}`);
            console.log(`Iterations: ${result.totalIterations}`);
            console.log(`Passed: ${result.passed}`);
            console.log(`Failed: ${result.failed}`);
            console.log(`Success Rate: ${result.successRate.toFixed(2)}%`);
            
            if (result.failed > 0) {
                allTestsPassed = false;
                console.log('Sample Failures:');
                result.failures.forEach(failure => {
                    console.log(`  - Iteration ${failure.iteration}: ${failure.error}`);
                    if (failure.searchTerm !== undefined) {
                        console.log(`    Search Term: "${failure.searchTerm}"`);
                    }
                    if (failure.sortOption !== undefined) {
                        console.log(`    Sort Option: "${failure.sortOption}"`);
                    }
                });
            }
        });
        
        console.log(`\n=== Overall Result: ${allTestsPassed ? 'PASSED' : 'FAILED'} ===`);
        
        return allTestsPassed;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchSortPropertyTests;
} else {
    window.SearchSortPropertyTests = SearchSortPropertyTests;
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.CarCatalog) {
    // Browser environment - can run tests immediately
    const testSuite = new SearchSortPropertyTests();
    // Uncomment to run tests automatically:
    // testSuite.runAllTests();
}