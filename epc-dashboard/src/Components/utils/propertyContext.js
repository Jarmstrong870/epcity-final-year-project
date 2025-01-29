import React, { createContext, useState } from 'react';

export const PropertyContext = createContext();

export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [topRatedProperties, setTopRatedProperties] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(null)
    const [propertyTypesList, setPropertyTypesList] = useState([])
    const [epcRatingsList, setEpcRatingsList] = useState([])
    const [sort, setSort] = useState(null)
    const [sortOrder, setSortOrder] = useState(null)

    const fetchProperties = async (query = null, propertyTypes = [], epcRatings = [], sortOption = null, order = null, pageNumber = 1) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            sortOption = sort
            order = sortOrder

            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
            if (sortOption) url += `sort_by=${sortOption}&`;
            if (order) url += `order=${order}&`;
            url += `page=${pageNumber}`;

            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
            setSearch(query);
            setPropertyTypesList(propertyTypes);
            setEpcRatingsList(epcRatings);
        } catch (error) {
            console.error('There was an error fetching the property data!', error);
        } finally {
            setLoading(false);
        }
    };

    const sortProperties = async (sortOption = null, order = null, pageNumber = 1, query = null, propertyTypes = [], epcRatings = [] ) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            query = search
            propertyTypes = propertyTypesList
            epcRatings = epcRatingsList

            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
            if (sortOption) url += `sort_by=${sortOption}&`;
            if (order) url += `order=${order}&`;
            url += `page=${pageNumber}`;

            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
            setSort(sortOption);
            setSortOrder(order);
        } catch (error) {
            console.error('There was an error fetching the property data!', error);
        } finally {
            setLoading(false);
        }
    };

    const getNewPage = async (pageNumber = 1, query = null, propertyTypes = [], epcRatings = [], sortOption = null, order = null) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            query = search
            propertyTypes = propertyTypesList
            epcRatings = epcRatingsList
            sortOption = sort
            order = sortOrder

            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
            if (sortOption) url += `sort_by=${sortOption}&`;
            if (order) url += `order=${order}&`;
            url += `page=${pageNumber}`;

            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
        } catch (error) {
            console.error('There was an error fetching the property data!', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopRatedProperties = async () => {
        try {
            const response = 'http://127.0.0.1:5000/api/property/loadTopRated';
            const data = await fetch(response);
            if (!data.ok) throw new Error('Failed to fetch property data');
            const topRatedData = await data.json();
            setTopRatedProperties(topRatedData);
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };

    return (
        <PropertyContext.Provider
            value={{
                properties,
                loading,
                topRatedProperties,
                error,
                fetchProperties,
                fetchTopRatedProperties,
                sortProperties,
                getNewPage
            }}
        >
            {children}
        </PropertyContext.Provider>
    )

}

