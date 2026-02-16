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
git clone https://github.com/Jarmstrong870/epcity-final-year-project.git  
cd epcity-final-year-project  

**Frontend**  
cd epc-dashboard  
npm install  
npm run start  

**Backend**  
cd backend  
pip install -r requirements.txt  
python main.py  


## Environment Variables
Create a .env file in both the epc-dashboard and backend folders using the variable names below.
Security note: real credentials are not included in this repository. To run the project locally, you will need to create your own API keys / services.

**What you need to create**

**Google Maps API key (Frontend)**
Create a Google Cloud project, enable the required Google Maps APIs (e.g., Maps JavaScript / Places / Directions depending on your usage), and generate an API key.
Used for: map display, geocoding/address search, route planning.
Mapbox API key (Frontend)
Create a Mapbox account and generate an access token.
Used as a fallback mapping provider.

**EPC API key (Backend)**
Register for an API key for the UK EPC / Open Data Communities EPC data source used by this project.
Used for: retrieving EPC certificate data.

**Supabase project (Backend)**
Create a Supabase project and obtain the project URL and API key (anon/service role depending on implementation).
Used for: storage (e.g., images) and any Supabase-backed functionality used by the backend.

**PostgreSQL database credentials (Backend)**
Create a PostgreSQL database (AWS RDS recommended to match the original setup, but local PostgreSQL can also be used).
Used for: application data storage (users, properties, favourites, groups, etc.).

**MailerSend API key (Backend)**
Create a MailerSend account and generate an API key.
Used for: OTP / account emails.

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
MAILERSEND_API_KEY

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
E H  
C K 
J McA 
M M 