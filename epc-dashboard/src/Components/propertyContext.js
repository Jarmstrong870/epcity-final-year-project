import React, {createContext, useState } from 'react' ;

export const PropertyContext = createContext();

export function PropertyProvider({ children }) {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [topRatedProperties, setTopRatedProperties] = useState([]);
    const [error, setError] = useState(null);

    
    const fetchProperties = async ( query = '', propertyTypes = [], epcRatings = []) => {
        setLoading(true);
        try {
            // Build the property search URL
            let url = query || propertyTypes.length || epcRatings.length 
              ? `http://127.0.0.1:5000/api/property/alter?`
              : `http://127.0.0.1:5000/api/property/loadCSV`;
            
            if (query) url += `search=${query}&`;
            if (propertyTypes.length > 0) url += `pt=${propertyTypes.join(',')}&`;
            if (epcRatings.length > 0) url += `epc=${epcRatings.join(',')}&`;
  
            // Fetch property search results
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch property data');
            const data = await response.json();
            setProperties(data);
            }catch (error) {
                console.error('There was an error fetching the property data!', error);
            } finally {
                setLoading(false);
            }
    };

    const changePage = async (pageNumber) => {

        try {
            const pageUrl = `http://127.0.0.1:5000/api/property/paginate?pageNumber=${pageNumber}`;
            const pageResponse = await fetch(pageUrl);
            if (!pageResponse.ok) throw new Error('Failed to fetch pagination data');
            const pageData = await pageResponse.json();
            setProperties(pageData);
        }catch (error) {
            console.error('There was an error fetching the property data!', error);
        }
    };

    const sortProperties = async (sortValue) => {
        try {
            const sortUrl = `http://127.0.0.1:5000/api/property/sort?attribute=${sortValue}`;
            const sortResponse = await fetch(sortUrl);
            if (!sortResponse.ok) throw new Error('Failed to fetch sort data');
            const sortData = await sortResponse.json();
            setProperties(sortData);
        }catch (error) {
            console.error('There was an error fetching the property data!', error);
        }
    };

    const fetchTopRatedProperties = async () => {
        try{
            const response = 'http://127.0.0.1:5000/api/property/loadTopRated';
            const data = await fetch(response);
            if (!data.ok) throw new Error('Failed to fetch property data');
            const topRatedData = await data.json();
            setTopRatedProperties(topRatedData.slice(0, 3)); 
        } catch (error) {
            console.error('Failed to fetch properties:', error);
        }
    };
    
    return (
        <PropertyContext.Provider
        value = {{
            properties,   
            loading,
            topRatedProperties,
            error,
            fetchProperties,
            sortProperties,
            fetchTopRatedProperties,
            changePage
        }}
        >
            {children}
        </PropertyContext.Provider>
    )
  
}