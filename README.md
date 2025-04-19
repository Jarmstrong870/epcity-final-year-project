# CSC3032-2425-TEAM4 Project

**EPCity** is a full-stack web application designed to help renters and landlords make informed rental decisions based on transparent, up-to-date **Energy Performance Certificate (EPC)** data.  

Unlike traditional property platforms, EPCity focuses on financial impact, sustainability, and education by translating raw energy data into easy-to-understand insights.  


## Features

- **Property Search & Filtering** (by EPC rating, location, type, bedrooms)  
- **Property Comparison** (up to 4 at a time, with visual breakdowns)  
- **Real-Time Group Chats** (for collaborative property decisions)  
- **Multi-Language Support** (English, French, Spanish, Polish, Mandarin)  
- **Glossary & Tutorials** (explain EPC ratings and rental tips)  
- **Favourites** (save and track properties of interest)  
- **Landlord Recommendations** (with cost estimates for EPC improvements)  
- **Secure Login** (OTP emails, hashed passwords, recovery)  


## Tech Stack

**Frontend**
- React.js  
- Javascript  
- CSS  

**Backend**
- Python  
- Flask  
- AWS RDS (PostgreSQL)  


## Setup & Installation

**Clone the Repository**  
bash  
git clone https://gitlab-se.eeecs.qub.ac.uk/CSC3032-2425/CSC3032-2425-TEAM4.git    
cd CSC3032-2425-TEAM4  

**Frontend**  
cd epc-dashboard  
npm install  
npm run start  

**Backend**  
cd backend  
pip install -r requirements.txt  
python main.py  


## Environment Variables

Create a .env file within the epc-dashboard and backend folders with the following key names.  
Refer to the project's Gitlab CI/CD variables for the keys.  

**Frontend**  
REACT_APP_GOOGLE_MAPS_API_KEY  
REACT_APP_MAPBOX_API_KEY  

**Backend**  
EPC_API_KEY  
SUPABASE_URL  
SUPABASE_KEY  
DATABASE_HOST  
DATABASE_NAME  
DATABASE_USER  
DATABASE_PORT  
DATABASE_PASSWORD  


## Database Overview

**PostgreSQL used via AWS RDS**
**Managed with pgAdmin**

Key Tables:  
users, properties, user_properties, inflation  
groups, group_messages, users  
Custom SQL functions for favouriting  


## Testing & CI/CD
**pytest for backend unit testing**  
Navigate to the Controller/Service/Repository test folder within the terminal  
pytest command: python -m pytest test_file  

**Cypress for frontend E2E testing**  
Navigate to epc-dashboard in the terminal  
cypress command: npx cypress open  
Select E2E Testing  
Choose a browser  
Click on desired test  

**Peer code reviews were carried out using Gitlab Merge Requests**


## Contributors
This application was developed as part of a university dissertation project by:  
Jack Armstrong  
Erin Harvey  
Carl Kennedy  
John McAtamney  
Matthew Moore  