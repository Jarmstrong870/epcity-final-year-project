import React, { createContext, useState } from 'react';

export const PropertyContext = createContext();

export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [topRatedProperties, setTopRatedProperties] = useState([]);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(null);
    const [propertyTypesList, setPropertyTypesList] = useState([]);
    const [epcRatingsList, setEpcRatingsList] = useState([]);
    const [sort, setSort] = useState('sort_by');
    const [sortOrder, setSortOrder] = useState('order');
    const [page, setPage] = useState(1);
    const [city, setCity] = useState(null);
    const [bedrooms, setBedrooms] = useState([1, 10]);

    const fetchProperties = async (query = null, propertyTypes = [], epcRatings = [], bedroomRange = [1,10], sortOption = 'sort_by', order = 'order', pageNumber = 1) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            sortOption = sort;
            order = sortOrder;

            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
            console.log(bedroomRange[0]);
            console.log(bedroomRange[1]);
            url += `min_bedrooms=${bedroomRange[0]}&`;
            url += `max_bedrooms=${bedroomRange[1]}&`;
            url += `page=${pageNumber}&`;
            if (sortOption !== 'sort_by' && order !== 'order') {
                url += `sort_by=${sortOption}&`;
                url += `order=${order}&`;
            }
            url += `page=${pageNumber}&`;
            url += `local_authority=${city}`;

            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
            setSearch(query);
            setPropertyTypesList(propertyTypes);
            setEpcRatingsList(epcRatings);
            setBedrooms(bedroomRange);
            setPage(pageNumber);
        } catch (error) {
            console.error('There was an error fetching the property data!', error);
        } finally {
            setLoading(false);
        }
    };

    const sortProperties = async (sortOption = 'sort_by', order = 'order', pageNumber = 1, query = null, propertyTypes = [], epcRatings = [], bedroomRange = [1,10]) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            query = search;
            propertyTypes = propertyTypesList;
            epcRatings = epcRatingsList;
            bedroomRange = bedrooms;

            if (sortOption !== "sort_by" && order !== "order") {
                if (query) url += `search=${query}&`;
                if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
                if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
                url += `min_bedrooms=${bedroomRange[0]}&`;
                url += `max_bedrooms=${bedroomRange[1]}&`;
                url += `sort_by=${sortOption}&`;
                url += `order=${order}&`;
                url += `page=${pageNumber}&`;
                url += `local_authority=${city}`;

                // Fetch property search results
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch property data');
                const data = await response.json();
                setProperties(data);
            }
            setSort(sortOption);
            setSortOrder(order);
            setPage(pageNumber);
        } catch (error) {
            console.error('There was an error fetching the property data!', error);
        } finally {
            setLoading(false);
        }
    };

    const getNewPage = async (pageNumber = 1, query = null, propertyTypes = [], epcRatings = [], bedroomRange = [1,10], sortOption = 'sort_by', order = 'order') => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = `http://127.0.0.1:5000/api/property/getPage?`;

            query = search;
            propertyTypes = propertyTypesList;
            epcRatings = epcRatingsList;
            bedroomRange = bedrooms;
            sortOption = sort;
            order = sortOrder;

            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
            url += `min_bedrooms=${bedroomRange[0]}&`;
            url += `max_bedrooms=${bedroomRange[1]}&`;
            if (sortOption !== 'sort_by' && order !== 'order') {
                url += `sort_by=${sortOption}&`;
                url += `order=${order}&`;
            }
            url += `page=${pageNumber}&`;
            url += `local_authority=${city}`;

            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
            setPage(pageNumber);
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
                page,
                setCity,
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

