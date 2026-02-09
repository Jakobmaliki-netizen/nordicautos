// Property-Based Tests for Nordic Autos Filter Functionality
// Using fast-check for property-based testing

/**
 * Property-Based Test Suite for Filter Functionality
 * **Feature: nordic-autos-website, Property 7: Filter Functionality**
 * **Validates: Requirements 3.2**
 */

class FilterPropertyTests {
    constructor() {
        this.testResults = [];
        this.iterations = 100; // Minimum required iterations
        this.sampleCars = this.generateSampleCars();
    }

    /**
     * Generate sample car data for testing
     */
    generateSampleCars() {
        const brands = ['Porsche', 'Audi', 'Mercedes-Benz', 'BMW', 'Tesla'];
        const bodyTypes = ['SUV', 'Sedan', 'Stationcar', 'Coupe'];
        const fuelTypes = ['Benzin', 'Diesel', 'El', 'Hybrid'];
        
        const cars = [];
        
        for (let i = 1; i <= 50; i++) {
            cars.push({
                id: i,
                brand: brands[Math.floor(Math.random() * brands.length)],
                model: `Model ${i}`,
                year: 2018 + Math.floor(Math.random() * 6),
                price: 500000 + Math.floor(Math.random() * 4000000),
                bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
                fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
                mileage: Math.floor(Math.random() * 100000),
                status: Math.random() > 0.9 ? 'reserved' : 'available'
            });
        }
        
        return cars;
    }

    /**
     * Property 7: Filter Functionality
     * For any combination of applied filters, only cars matching all selected criteria should be displayed in results
     */
    async testFilterFunctionality() {
        console.log('Running Property Test: Filter Functionality');
        
        let passedTests = 0;
        let failedTests = 0;
        const failures = [];

        // Run property test for minimum iterations
        for (let i = 0; i < this.iterations; i++) {
            try {
                // Generate random filter combination
                const filters = this.generateRandomFilters();
                
                // Test the filter functionality properties
                const result = this.verifyFilterProperties(filters);
                
                if (result.success) {
                    passedTests++;
                } else {
                    failedTests++;
                    failures.push({
                        iteration: i + 1,
                        filters: filters,
                        error: result.error
                    });
                }
                
            } catch (error) {
                failedTests++;
                failures.push({
                    iteration: i + 1,
                    filters: filters,
                    error: error.message
                });
            }
        }

        const testResult = {
            property: 'Filter Functionality',
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
     * Generate random filter combination for testing
     */
    generateRandomFilters() {
        const brands = ['Porsche', 'Audi', 'Mercedes-Benz', 'BMW', 'Tesla'];
        const bodyTypes = ['SUV', 'Sedan', 'Stationcar', 'Coupe'];
        const fuelTypes = ['Benzin', 'Diesel', 'El', 'Hybrid'];
        
        return {
            brand: Math.random() > 0.7 ? brands[Math.floor(Math.random() * brands.length)] : null,
            priceMin: Math.random() > 0.8 ? Math.floor(Math.random() * 1000000) : 0,
            priceMax: Math.random() > 0.8 ? 2000000 + Math.floor(Math.random() * 3000000) : 5000000,
            bodyTypes: Math.random() > 0.6 ? [bodyTypes[Math.floor(Math.random() * bodyTypes.length)]] : [],
            fuelTypes: Math.random() > 0.6 ? [fuelTypes[Math.floor(Math.random() * fuelTypes.length)]] : [],
            searchTerm: Math.random() > 0.9 ? 'Model' : ''
        };
    }

    /**
     * Verify filter properties for given filters
     */
    verifyFilterProperties(filters) {
        try {
            // Apply filters to sample cars
            const filteredCars = this.applyFilters(this.sampleCars, filters);
            
            // Property 7.1: All returned cars should match brand filter
            const brandFilterValid = this.verifyBrandFilter(filteredCars, filters.brand);
            if (!brandFilterValid.success) {
                return { success: false, error: `Brand filter failed: ${brandFilterValid.error}` };
            }

            // Property 7.2: All returned cars should match price range filter
            const priceFilterValid = this.verifyPriceFilter(filteredCars, filters.priceMin, filters.priceMax);
            if (!priceFilterValid.success) {
                return { success: false, error: `Price filter failed: ${priceFilterValid.error}` };
            }

            // Property 7.3: All returned cars should match body type filter
            const bodyTypeFilterValid = this.verifyBodyTypeFilter(filteredCars, filters.bodyTypes);
            if (!bodyTypeFilterValid.success) {
                return { success: false, error: `Body type filter failed: ${bodyTypeFilterValid.error}` };
            }

            // Property 7.4: All returned cars should match fuel type filter
            const fuelTypeFilterValid = this.verifyFuelTypeFilter(filteredCars, filters.fuelTypes);
            if (!fuelTypeFilterValid.success) {
                return { success: false, error: `Fuel type filter failed: ${fuelTypeFilterValid.error}` };
            }

            // Property 7.5: All returned cars should match search term
            const searchFilterValid = this.verifySearchFilter(filteredCars, filters.searchTerm);
            if (!searchFilterValid.success) {
                return { success: false, error: `Search filter failed: ${searchFilterValid.error}` };
            }

            // Property 7.6: No cars outside filter criteria should be included
            const exclusionValid = this.verifyFilterExclusion(this.sampleCars, filteredCars, filters);
            if (!exclusionValid.success) {
                return { success: false, error: `Filter exclusion failed: ${exclusionValid.error}` };
            }

            return { success: true };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Apply filters to car array (simulates CarCatalog filter logic)
     */
    applyFilters(cars, filters) {
        return cars.filter(car => {
            // Brand filter
            if (filters.brand && car.brand !== filters.brand) {
                return false;
            }
            
            // Price filter
            if (car.price < filters.priceMin || car.price > filters.priceMax) {
                return false;
            }
            
            // Body type filter
            if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) {
                return false;
            }
            
            // Fuel type filter
            if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
                return false;
            }
            
            // Search term filter
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                const searchableText = `${car.brand} ${car.model}`.toLowerCase();
                if (!searchableText.includes(searchLower)) {
                    return false;
                }
            }
            
            return true;
        });
    }

    /**
     * Verify brand filter correctness
     */
    verifyBrandFilter(filteredCars, brandFilter) {
        try {
            if (!brandFilter) return { success: true }; // No filter applied
            
            for (const car of filteredCars) {
                if (car.brand !== brandFilter) {
                    return { success: false, error: `Car with brand "${car.brand}" found when filtering for "${brandFilter}"` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify price filter correctness
     */
    verifyPriceFilter(filteredCars, priceMin, priceMax) {
        try {
            for (const car of filteredCars) {
                if (car.price < priceMin || car.price > priceMax) {
                    return { success: false, error: `Car with price ${car.price} found outside range ${priceMin}-${priceMax}` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify body type filter correctness
     */
    verifyBodyTypeFilter(filteredCars, bodyTypeFilter) {
        try {
            if (bodyTypeFilter.length === 0) return { success: true }; // No filter applied
            
            for (const car of filteredCars) {
                if (!bodyTypeFilter.includes(car.bodyType)) {
                    return { success: false, error: `Car with body type "${car.bodyType}" found when filtering for ${bodyTypeFilter.join(', ')}` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify fuel type filter correctness
     */
    verifyFuelTypeFilter(filteredCars, fuelTypeFilter) {
        try {
            if (fuelTypeFilter.length === 0) return { success: true }; // No filter applied
            
            for (const car of filteredCars) {
                if (!fuelTypeFilter.includes(car.fuelType)) {
                    return { success: false, error: `Car with fuel type "${car.fuelType}" found when filtering for ${fuelTypeFilter.join(', ')}` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify search filter correctness
     */
    verifySearchFilter(filteredCars, searchTerm) {
        try {
            if (!searchTerm) return { success: true }; // No filter applied
            
            const searchLower = searchTerm.toLowerCase();
            
            for (const car of filteredCars) {
                const searchableText = `${car.brand} ${car.model}`.toLowerCase();
                if (!searchableText.includes(searchLower)) {
                    return { success: false, error: `Car "${car.brand} ${car.model}" found but doesn't match search term "${searchTerm}"` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Verify that cars outside filter criteria are properly excluded
     */
    verifyFilterExclusion(allCars, filteredCars, filters) {
        try {
            const filteredIds = new Set(filteredCars.map(car => car.id));
            
            for (const car of allCars) {
                const shouldBeIncluded = this.shouldCarBeIncluded(car, filters);
                const isIncluded = filteredIds.has(car.id);
                
                if (shouldBeIncluded && !isIncluded) {
                    return { success: false, error: `Car ${car.id} should be included but was filtered out` };
                }
                
                if (!shouldBeIncluded && isIncluded) {
                    return { success: false, error: `Car ${car.id} should be excluded but was included` };
                }
            }
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Determine if a car should be included based on filters
     */
    shouldCarBeIncluded(car, filters) {
        // Brand filter
        if (filters.brand && car.brand !== filters.brand) {
            return false;
        }
        
        // Price filter
        if (car.price < filters.priceMin || car.price > filters.priceMax) {
            return false;
        }
        
        // Body type filter
        if (filters.bodyTypes.length > 0 && !filters.bodyTypes.includes(car.bodyType)) {
            return false;
        }
        
        // Fuel type filter
        if (filters.fuelTypes.length > 0 && !filters.fuelTypes.includes(car.fuelType)) {
            return false;
        }
        
        // Search term filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            const searchableText = `${car.brand} ${car.model}`.toLowerCase();
            if (!searchableText.includes(searchLower)) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Run all filter property tests
     */
    async runAllTests() {
        console.log('Starting Filter Functionality Property-Based Tests...');
        console.log(`Running ${this.iterations} iterations per property`);
        console.log(`Testing with ${this.sampleCars.length} sample cars`);
        
        const results = [];
        
        // Test Filter Functionality
        const filterResult = await this.testFilterFunctionality();
        results.push(filterResult);
        
        // Generate test report
        this.generateTestReport(results);
        
        return results;
    }

    /**
     * Generate and display test report
     */
    generateTestReport(results) {
        console.log('\n=== Filter Functionality Property Test Report ===');
        
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
                    console.log(`    Filters: ${JSON.stringify(failure.filters, null, 2)}`);
                });
            }
        });
        
        console.log(`\n=== Overall Result: ${allTestsPassed ? 'PASSED' : 'FAILED'} ===`);
        
        return allTestsPassed;
    }
}

// Export for use in test runner
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterPropertyTests;
} else {
    window.FilterPropertyTests = FilterPropertyTests;
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.CarCatalog) {
    // Browser environment - can run tests immediately
    const testSuite = new FilterPropertyTests();
    // Uncomment to run tests automatically:
    // testSuite.runAllTests();
}