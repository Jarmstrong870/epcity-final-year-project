import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TutorialMenu.css';
import introVideo from '../assets/intro.mp4';

const TutorialMenu = () => {
  const {tutorialCategory} = useParams();

  const checkCategory = tutorialCategory.replace(/-/g, ' ').toLowerCase();

  const tutorialOptions = {
    'home page tutorials': [
        {tutorialID: 1, title: 'EPCity Welcome Tutorial', description: 'Welcome to EPC City - the home of energy efficiency! \n \n Find a tutorial below seeing how EPCity can help you find the best information about properties in the region of Liverpool!!', link: introVideo },
        {tutorialID: 2, title: 'Custom Algorithm Survey Tutorial', description: 'Learn more about our custom algorithm', link: '/video/welcome' },
    ],

    'properties tutorials': [
        {tutorialID: 3, title: 'View All Properties', description: 'Learn more about viewing all the properties', link: '/video/welcome' },
        {tutorialID: 4, title: 'Individual Property Information', description: 'Want to learn more about a specific property, click below to see the tutorial', link: '/video/welcome' },
    ],

    'accounts tutorials': [
        {tutorialID: 5, title: 'Sign Up Tutorial', description: 'Learn how to sign up', link: '/video/welcome' },
        {tutorialID: 6, title: 'Managing Account', description: 'Learn how to manage your personal account', link: '/video/welcome' },
        {tutorialID: 7, title: 'Logging In Tutorial', description: 'Learn how to log in to see your saved properties, custom algorithm etc', link: '/video/welcome' },
        {tutorialID: 8, title: 'My Favourites Tutorial', description: 'Learn how to save properties into your favourites', link: '/video/welcome' },
    ],
};

    const availableTutorials = tutorialOptions[checkCategory] || [];
    const [selectedTutorial, setSelectedTutorial] = useState(null);

    useEffect(() => {
        if(availableTutorials.length > 0 && !selectedTutorial){
            setSelectedTutorial(availableTutorials[0]);
        }
    }, [availableTutorials, selectedTutorial]);

    return (
        <div className="tutorialMenu">
            {/*Navigation sidebar */}
            <div className="navigationSidebar">
                <h3>{tutorialCategory.replace(/-/g, ' ').toUpperCase()}</h3>
                
                {/*List all available tutorials for the category*/}
                {availableTutorials.map((availableTutorial) => (
                    <div 
                        key = {availableTutorial.tutorialID}
                        onClick = {() => setSelectedTutorial(availableTutorial)}
                        className={`navigationBarElement ${selectedTutorial?.tutorialID === availableTutorial.tutorialID ? 'selected' : ''}`} >
                            {availableTutorial.title}
                        </div>
                ))}
                {availableTutorials.length === 0 && (
                    <p className="errorMessage">No tutorials are available for this section yet</p>
                )}
            </div>
        
        {/*Main Page view */}
        <div className = "contentView">

            <div className ="titleStyle">
                <h3>{selectedTutorial?.title || "No tutorial selected"}</h3>
            </div>
            
            {/* Tutorial description */}
            <p className = "descriptionStyle">{selectedTutorial?.description || "Please choose a tutorial from the sidebar"}</p>

                {/*Video player for the selected tutorial */}
            {selectedTutorial && (
                <video src={selectedTutorial.link} controls className = "tutorialVideos" />
            )}   
        </div>
    </div>
    );
};


    export default TutorialMenu;
