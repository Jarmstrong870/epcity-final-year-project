import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import EPCGraph from './EPCGraph'; // Import EPCGraph component

const PropertyPageTemplate = () =>{
    const location = useLocation();
    const address = location.state ? location.state.address : '';


    return (
        <div>
            <div>
            <h1>Property Template</h1>
            <p>address</p>
            </div>
           
        </div>
    );
}
export default PropertyPageTemplate;
