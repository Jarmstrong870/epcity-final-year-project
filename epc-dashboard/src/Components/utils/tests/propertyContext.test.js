import { render, act } from '@testing-library/react';
import { PropertyContext, PropertyProvider } from '../propertyContext';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';

describe('PropertyContext', () => {
    let contextValues;
    
    const TestComponent = () => {
        contextValues = useContext(PropertyContext);
        return null;
    };

    beforeEach(() => {
        global.fetch = jest.fn();
    });

    test('should initialize with default values', () => {
        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        expect(contextValues.properties).toEqual([]);
        expect(contextValues.loading).toBe(false);
        expect(contextValues.topRatedProperties).toEqual([]);
        expect(contextValues.error).toBeNull();
        expect(contextValues.page).toBe(1);
        expect(contextValues.city).toBeNull();
    });

    test('should fetch properties successfully', async () => {
        const mockProperties = [
            { uprn: '1', address: 'Test Address 1' },
            { uprn: '2', address: 'Test Address 2' }
        ];

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockProperties)
            })
        );

        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        await act(async () => {
            await contextValues.fetchProperties();
        });

        expect(contextValues.properties).toEqual(mockProperties);
        expect(contextValues.loading).toBe(false);
    });

    test('should handle fetch errors', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Failed to fetch'))
        );

        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        await act(async () => {
            await contextValues.fetchProperties();
        });

        expect(contextValues.properties).toEqual([]);
        expect(contextValues.loading).toBe(false);
    });

    test('should sort properties correctly', async () => {
        const mockSortedProperties = [
            { uprn: '2', price: 200 },
            { uprn: '1', price: 100 }
        ];

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockSortedProperties)
            })
        );

        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        await act(async () => {
            await contextValues.sortProperties('price', 'desc');
        });

        expect(contextValues.properties).toEqual(mockSortedProperties);
    });

    test('should fetch top rated properties', async () => {
        const mockTopRated = [
            { uprn: '1', rating: 'A' },
            { uprn: '2', rating: 'B' }
        ];

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockTopRated)
            })
        );

        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        await act(async () => {
            await contextValues.fetchTopRatedProperties();
        });

        expect(contextValues.topRatedProperties).toEqual(mockTopRated);
    });

    test('should handle pagination', async () => {
        const mockPageProperties = [
            { uprn: '3', address: 'Test Address 3' },
            { uprn: '4', address: 'Test Address 4' }
        ];

        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockPageProperties)
            })
        );

        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        await act(async () => {
            await contextValues.getNewPage(2);
        });

        expect(contextValues.properties).toEqual(mockPageProperties);
        expect(contextValues.page).toBe(2);
    });

    test('should update city filter', () => {
        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );

        act(() => {
            contextValues.setCity('Liverpool');
        });

        expect(contextValues.city).toBe('Liverpool');
    });
    test('should maintain filters when changing pages', async () => {
        // Mock initial filtered properties
        const mockFilteredProperties = [
            { uprn: '1', property_type: 'HOUSE', current_energy_rating: 'A' },
            { uprn: '2', property_type: 'HOUSE', current_energy_rating: 'B' }
        ];
    
        // Mock next page properties
        const mockNextPageProperties = [
            { uprn: '3', property_type: 'HOUSE', current_energy_rating: 'A' },
            { uprn: '4', property_type: 'HOUSE', current_energy_rating: 'B' }
        ];
    
        // Setup mock fetch responses
        global.fetch
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFilteredProperties)
            }))
            .mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockNextPageProperties)
            }));
    
        render(
            <PropertyProvider>
                <TestComponent />
            </PropertyProvider>
        );
    
        // Apply filters first
        await act(async () => {
            await contextValues.fetchProperties(
                null,
                ['HOUSE'],
                ['A', 'B'],
                [1, 10],
                'Liverpool'
            );
        });
    
        // Verify initial filtered results
        expect(contextValues.properties.every(p => p.property_type === 'HOUSE')).toBe(true);
        expect(contextValues.properties.every(p => ['A', 'B'].includes(p.current_energy_rating))).toBe(true);
    
        // Change page
        await act(async () => {
            await contextValues.getNewPage(2);
        });
    
        // This assertion would fail because getNewPage doesn't maintain filters
        expect(contextValues.properties.every(p => p.property_type === 'HOUSE')).toBe(true);
        expect(contextValues.properties.every(p => ['A', 'B'].includes(p.current_energy_rating))).toBe(true);
    });
    
    test('should maintain ALL filters after navigation', async () => {
        const history = createMemoryHistory();
        const mockFilteredProperties = [
            { uprn: '1', property_type: 'HOUSE', current_energy_rating: 'A', postcode: 'L1' },
            { uprn: '2', property_type: 'HOUSE', current_energy_rating: 'B', postcode: 'L2' }
        ];
    
        render(
            <BrowserRouter history={history}>
                <PropertyProvider>
                    <TestComponent />
                </PropertyProvider>
            </BrowserRouter>
        );
    
        // Set both city and other filters
        await act(async () => {
            contextValues.setCity('Liverpool');
            await contextValues.fetchProperties(
                null,
                ['HOUSE'],
                ['A', 'B'],
                [1, 10],
                'Liverpool'
            );
        });
    
        // Store initial states
        const initialCity = contextValues.city;
        const initialFilters = {
            propertyTypes: ['HOUSE'],
            epcRatings: ['A', 'B']
        };
    
        // Navigate to property and back
        await act(async () => {
            history.push(`/property/${mockFilteredProperties[0].uprn}`);
            history.back();
        });
    
        // All filters should persist (this will fail)
        expect(contextValues.city).toBe(initialCity);
        expect(contextValues.propertyTypes).toEqual(initialFilters.propertyTypes);
        expect(contextValues.epcRatings).toEqual(initialFilters.epcRatings);
    });
});
