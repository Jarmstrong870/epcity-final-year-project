import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Tutorials.css';
import homepage from '../assets/homepage.jpg';
import properties from '../assets/house_bkc.jpg';
import account from '../assets/account.png';

const Tutorials = () => {
    const navigate = useNavigate();
    
    const tutorialOptions = {
        'Home Page Tutorials': {
            path: 'home-page-tutorials',
            image: homepage,
        },
        'Properties Tutorials': {
            path: 'properties-tutorials',
            image: properties,
        },
        'User Account Tutorials': {
            path: 'accounts-tutorials',
            image: account,
        },
    };

    return (
        <div>
          <h2 className="stylingTitle">Step by Step Tutorials</h2>
          <p>Welcome to the Step by Step Tutorials page. Select from</p>
          <div className="tutorialGrid">
                    {Object.entries(tutorialOptions).map(([title, { path, image}]) => (
                        <div
                            key = {path}
                            className = {"tutorialCard"}
                            onClick={() => navigate(`/tutorials/${path}`)}
                            style = {{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                color: '#ffffff',
                                padding: '20px',
                                borderRadius: '10px',
                            }}
                        >
                    <h3>{title}</h3>
                    </div>
                    ))}
                </div>
            </div>
        );
    };

    export default Tutorials;
