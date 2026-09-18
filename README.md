EstateCRM
Real Estate Property & Customer Relationship Management System
EstateCRM is a full-stack web application designed for real-estate dealers and agencies to manage their property inventory, property owners, customers, leads, follow-ups, and customer interaction history from one centralized platform.
The system combines a public-facing real-estate website with a protected internal CRM.
The core objective is to make the complete real-estate sales workflow easier to manage:
```text
Property Owner
      ↓
Property Added
      ↓
Property Published
      ↓
Customer Views Property
      ↓
Customer Enquiry
      ↓
Customer + Lead Created
      ↓
Contact / Property Shared
      ↓
Site Visit
      ↓
Follow-up
      ↓
Negotiation
      ↓
Booking / Deal
      ↓
Sold
      ↓
Property Hidden From Public Website
```
---
Table of Contents
Project Overview
Problem Statement
Project Objectives
Key Features
Public Website
Admin CRM
Property Management
Owner Management
Customer Management
Customer 360°
Lead Management
Follow-up Management
Activity Timeline
Website Enquiry Workflow
Authentication
Dashboard
Database Architecture
Entity Relationships
Project Architecture
Technology Stack
Project Structure
API Architecture
Environment Variables
Installation
Running the Project
Admin Login
Current Implementation Status
Business Workflow
Important Business Rules
Security
Future Roadmap
Production Deployment
Development Notes
Conclusion
---
Project Overview
EstateCRM is built for real-estate dealers who manage multiple properties and customers simultaneously.
A conventional property website mainly displays listings. EstateCRM goes further by connecting the public property website with an internal CRM.
The application currently consists of two major parts:
1. Public Website
Used by potential customers to:
Browse properties
Search/filter properties
View property details
View property images
View property location information
Submit property enquiries
2. Admin CRM
Used internally by the dealer/admin to:
Manage properties
Manage property owners
Manage customers
Manage leads
Manage follow-ups
Track customer interactions
View Customer 360°
Track the complete customer journey
Manage property visibility
---
Problem Statement
Real-estate dealers commonly manage information across multiple places such as:
Phone contacts
WhatsApp
Notes
Spreadsheets
Paper records
Separate property listings
Personal memory
When the number of customers and properties increases, it becomes difficult to remember the complete context of every customer.
For example, after several days a dealer may need to remember:
What property did this customer enquire about?
What is the customer's budget?
Which locations are preferred?
How many bedrooms are required?
Which properties were already shared?
Did the customer visit a property?
What was the customer's feedback?
When should the customer be contacted again?
What happened during the previous call?
Is the lead still active?
Is the customer negotiating or ready to book?
EstateCRM centralizes this information.
---
Project Objectives
The main objectives are:
Centralize property information.
Maintain property owner records.
Maintain customer records.
Connect customers with properties through leads.
Track lead progress.
Track scheduled follow-ups.
Maintain a customer interaction history.
Automatically capture website enquiries.
Provide a complete Customer 360° view.
Keep sold properties hidden from the public website while preserving their historical records.
Create a foundation for future buyer-property matching.
Provide a scalable architecture for future CRM features.
---
Key Features
Public Features
Modern real-estate homepage
Property listing page
Property details page
Property search/filter foundation
Property images
Property pricing
Property location
Google Maps URL support
Property enquiry form
Responsive UI
Smooth scrolling
Animations
Admin Features
Admin login
Protected admin routes
Dashboard
Property management
Owner management
Customer management
Customer 360°
Lead management
Follow-up management
Activity Timeline
Property publishing
Property status management
Owner assignment
Customer requirement management
---
Public Website
The public website is the customer-facing portion of EstateCRM.
The public user does not need access to the CRM.
Public Pages
Home
Provides the main introduction to the real-estate business and directs users toward available properties and enquiry/contact actions.
Properties
Displays available/public property listings.
Property information can include:
Title
Property type
Transaction type
Price
Area
Bedrooms
Bathrooms
Location
Images
Property Details
Provides detailed information about an individual property.
The page can contain:
Property title
Description
Price
Property type
Transaction type
Area
Bedrooms
Bathrooms
Amenities
Location
Map link
Images
Enquiry/contact functionality
Enquiry
A customer can submit an enquiry for a property.
The enquiry is processed by the backend and connected to the CRM.
---
Admin CRM
The admin CRM is the internal business-management portion of the application.
Admin access is protected using authentication.
The current admin modules are:
```text
Admin Dashboard
│
├── Properties
├── Owners
├── Customers
├── Leads
├── Follow-ups
└── Customer 360°
    └── Activity Timeline
```
---
Property Management
Property management is one of the core modules.
An admin can create, edit, search and manage property listings.
Property Fields
A property can contain:
Title
Description
Property Type
Transaction Type
Price
Area
Bedrooms
Bathrooms
Parking
Furnishing
Facing
Amenities
Address
Locality
City
State
Pincode
Latitude
Longitude
Google Maps URL
Images
Status
Public visibility
Property Owner
Supported Property Types
```text
APARTMENT
VILLA
HOUSE
PLOT
COMMERCIAL
OFFICE
SHOP
OTHER
```
Transaction Types
```text
SALE
RENT
LEASE
```
Property Status
```text
AVAILABLE
UNDER_DISCUSSION
BOOKED
SOLD
RENTED
ARCHIVED
```
Property Visibility
A property can be marked as public.
Public properties can appear on the public website.
Internal properties can remain available only inside the admin CRM.
---
Owner Management
Property owners are maintained as separate CRM records.
This allows multiple properties to be associated with the same owner without duplicating owner information.
Owner Information
The system currently stores:
Name
Phone
Email
Address
Notes
Created by
Updated by
Created/updated timestamps
Owner Operations
Admin can:
Create an owner
Edit an owner
Search owners
Select an owner while creating a property
Assign an owner to a property
Owner + Property Relationship
The relationship is:
```text
Owner
  │
  ├── Property A
  ├── Property B
  └── Property C
```
The owner is not stored as a public-facing customer record.
Owner information is intended for internal CRM use.
---
Customer Management
Customers represent people who are interested in buying, renting or leasing properties.
Customer Information
A customer can contain:
Name
Phone
Email
Purpose
Property type requirements
Preferred locations
Minimum budget
Maximum budget
Bedrooms
Minimum area
Required amenities
Notes
Customer status
Assigned agent
Created by
Updated by
Customer Purpose
```text
BUY
RENT
LEASE
```
Customer Status
```text
ACTIVE
CONVERTED
INACTIVE
```
Customer records are intended to remain available for historical reference instead of being permanently deleted when a requirement is completed.
---
Customer 360°
Customer 360° is one of the important CRM features.
Instead of checking several modules separately, the admin can open a customer and see the customer's complete CRM context.
Customer 360° Includes
Customer Information
Name
Phone
Email
Requirement
Purpose
Property types
Preferred locations
Budget
Bedrooms
Area
Amenities
Notes
Leads
The customer can have one or more property-related leads.
Follow-ups
Follow-ups associated with the customer can be viewed.
Activities
The customer interaction timeline can be viewed chronologically.
Lead Controls
The admin can update:
Lead status
Lead priority
This provides a single place for understanding the customer's current situation.
---
Lead Management
A lead connects a customer to a property.
Example:
```text
Customer:
Rahul

Property:
3BHK Apartment

Lead:
Rahul → 3BHK Apartment
```
Lead Sources
The system supports:
```text
WEBSITE
WHATSAPP
PHONE
INSTAGRAM
FACEBOOK
REFERRAL
WALK_IN
OTHER
```
Lead Status
```text
NEW
CONTACTED
PROPERTY_SHARED
SITE_VISIT
INTERESTED
NEGOTIATION
BOOKED
WON
LOST
```
Lead Priority
```text
LOW
MEDIUM
HIGH
```
Lead Information
A lead can contain:
Customer
Property
Source
Status
Priority
Assigned agent
Next follow-up
Notes
Created by
Updated by
Timestamps
---
Follow-up Management
Real-estate sales often require repeated follow-ups.
The Follow-up module allows the dealer to record and track these activities.
Follow-up Information
Customer
Lead
Assigned user
Date
Purpose
Notes
Status
Completion time
Follow-up Status
```text
PENDING
COMPLETED
MISSED
CANCELLED
```
Example:
```text
Customer: Rahul
Purpose: Follow-up regarding 3BHK apartment
Date: 20 September
Status: PENDING
```
---
Activity Timeline
The Activity Timeline provides a chronological record of customer interactions.
This is designed to solve the problem of forgetting previous conversations.
Supported Activity Types
```text
CALL
WHATSAPP
SITE_VISIT
PROPERTY_SHARED
MEETING
NOTE
NEGOTIATION
```
Each activity can contain:
Customer
Lead
Property
Activity type
Title
Description
Created by
Date/time
Example Timeline
```text
15 Sept
CALL
Discussed customer budget.

16 Sept
PROPERTY_SHARED
Shared three suitable properties.

18 Sept
SITE_VISIT
Customer visited apartment.

19 Sept
CALL
Customer showed interest.

20 Sept
NEGOTIATION
Price discussion started.
```
This gives the dealer a historical view of the customer journey.
---
Website Enquiry Workflow
The public enquiry workflow connects the website with the internal CRM.
Process
```text
Customer
   ↓
Opens Property
   ↓
Submits Enquiry
   ↓
Backend validates Property
   ↓
Check Customer by Phone
   ↓
Create Customer if Required
   ↓
Create / Reuse Active Lead
   ↓
Lead Source = WEBSITE
   ↓
Admin Sees Lead
```
Important Logic
The public enquiry endpoint accepts information such as:
Property ID
Customer name
Phone
Email
Message
The backend verifies that the property is:
```text
isPublic = true
AND
status = AVAILABLE
```
This prevents enquiries from being created against properties that should no longer be publicly available.
---
Authentication
The admin system uses authentication to protect internal CRM functionality.
Current Authentication Architecture
JWT
HTTP-only cookie
Login endpoint
Logout endpoint
Session checking
Protected React routes
Protected backend APIs
Admin Route Protection
If a user is not authenticated, protected routes redirect to:
```text
/admin/login
```
The frontend uses a protected-route component to check authentication state before rendering admin pages.
---
Admin Dashboard
The dashboard provides a centralized overview of the CRM.
Current Dashboard Statistics
Total properties
Total customers
Total leads
Total follow-ups
Quick Actions
The dashboard provides navigation to:
Manage Properties
Customers
Leads
Follow-ups
Owners
CRM Workflow Display
The dashboard communicates the intended workflow:
```text
Enquiry
   ↓
Contact
   ↓
Property Shared
   ↓
Site Visit
   ↓
Deal
```
---
Database Architecture
The backend uses MongoDB Atlas with Mongoose.
The major collections/models are:
```text
User
Owner
Property
Customer
Lead
FollowUp
Activity
```
---
Entity Relationships
User
Used for:
Authentication
Admin/staff identity
Ownership of created/updated records
Future agent assignment
Owner
Connected to properties.
```text
Owner 1 ──────── * Property
```
Customer
Connected to leads, follow-ups and activities.
```text
Customer 1 ──────── * Lead
Customer 1 ──────── * FollowUp
Customer 1 ──────── * Activity
```
Property
Connected to owners, leads and activities.
```text
Property * ──────── 1 Owner
Property 1 ──────── * Lead
Property 1 ──────── * Activity
```
Lead
Connects a customer and a property.
```text
Customer
    │
    │
   Lead
    │
    │
Property
```
Follow-up
Can be associated with a customer and optionally a lead.
Activity
Can be associated with:
Customer
Lead
Property
---
Project Architecture
The project uses a separate frontend/backend architecture.
```text
                    ESTATECRM
                       │
          ┌────────────┴────────────┐
          │                         │
     PUBLIC WEBSITE              ADMIN CRM
          │                         │
       React                     React
          │                         │
          └────────────┬────────────┘
                       │
                    Axios
                       │
                REST API Layer
                       │
                Node + Express
                       │
                   Mongoose
                       │
                 MongoDB Atlas
```
---
Technology Stack
Frontend
React
Used for building the user interface.
Vite
Used as the frontend development/build tool.
React Router
Used for navigation between public and admin pages.
Axios
Used for communication between React and the backend API.
Tailwind CSS
Used for responsive styling and UI development.
GSAP
Used for interface animations.
Lenis
Used for smooth scrolling.
---
Backend
Node.js
Runtime environment for the backend.
Express.js
Used for:
REST APIs
Routing
Middleware
Request/response handling
Mongoose
Used for:
MongoDB models
Schema definitions
Validation
Database operations
Relationships through ObjectId references
---
Database
MongoDB Atlas
Cloud-hosted MongoDB database.
Current database:
```text
estatecrm
```
---
Authentication
JWT
Used for authentication/session authorization.
HTTP-only Cookies
Used to store the authentication token securely from normal client-side JavaScript access.
---
Project Structure
Current high-level structure:
```text
estate-crm/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── Counter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── lib/
│   │   │   └── lenis.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetails.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Login.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageProperties.jsx
│   │   │       ├── Owners.jsx
│   │   │       ├── Customers.jsx
│   │   │       ├── CustomerDetails.jsx
│   │   │       ├── Leads.jsx
│   │   │       └── FollowUps.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── propertyService.js
│   │   │   ├── enquiryService.js
│   │   │   └── leadService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── controllers/
│   │   ├── customerController.js
│   │   ├── ownerController.js
│   │   ├── activityController.js
│   │   └── publicEnquiryController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Owner.js
│   │   ├── Property.js
│   │   ├── Customer.js
│   │   ├── Lead.js
│   │   ├── FollowUp.js
│   │   └── Activity.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── followUpRoutes.js
│   │   ├── ownerRoutes.js
│   │   ├── activityRoutes.js
│   │   └── publicRoutes.js
│   │
│   ├── createAdmin.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```
---
API Architecture
The backend follows REST-style API organization.
Authentication
```text
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```
Properties
```text
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
```
Customers
```text
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
PUT    /api/customers/:id
```
Leads
```text
GET    /api/leads
GET    /api/leads/:id
POST   /api/leads
PUT    /api/leads/:id
```
Follow-ups
```text
GET    /api/followups
GET    /api/followups/:id
POST   /api/followups
PUT    /api/followups/:id
```
Owners
```text
GET    /api/owners
GET    /api/owners/:id
POST   /api/owners
PUT    /api/owners/:id
```
Activities
```text
POST   /api/activities
GET    /api/activities/customer/:customerId
GET    /api/activities/:id
PUT    /api/activities/:id
DELETE /api/activities/:id
```
Public Enquiries
```text
POST /api/public/enquiries
```
The exact response structure may vary by controller implementation.
---
Environment Variables
The backend requires environment variables.
Create:
```text
server/.env
```
Example:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Do not commit the actual `.env` file to GitHub.
The repository should use `.gitignore` to protect environment secrets.
---
Installation
Prerequisites
Install:
Node.js
npm
MongoDB Atlas account
Git
VS Code or another code editor
---
Clone Repository
```bash
git clone https://github.com/Vinayak-Agasimani/estate-crm.git
```
Enter the project:
```bash
cd estate-crm
```
---
Frontend Installation
Move into the client:
```bash
cd client
```
Install dependencies:
```bash
npm install
```
---
Backend Installation
Open another terminal.
Move into server:
```bash
cd server
```
Install dependencies:
```bash
npm install
```
---
Environment Setup
Inside:
```text
server/
```
create:
```text
.env
```
Add:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```
Replace the placeholder values with the actual local/development configuration.
---
Running the Project
Two terminals are recommended.
Terminal 1 – Backend
```bash
cd server
npm run dev
```
The backend should run on:
```text
http://localhost:5000
```
The root endpoint is:
```text
http://localhost:5000/
```
Expected response:
```json
{
  "success": true,
  "message": "EstateCRM API is running"
}
```
---
Terminal 2 – Frontend
```bash
cd client
npm run dev
```
The frontend should run on:
```text
http://localhost:5173
```
---
Admin Login
Development admin credentials currently used for testing:
```text
Email:
admin@estatecrm.com

Password:
Admin@12345
```
These credentials are for the current development environment and should be replaced/secured appropriately before production.
---
Current Implementation Status
Completed
Foundation
[x] Project setup
[x] React + Vite
[x] Node.js + Express
[x] MongoDB Atlas
[x] Mongoose models
[x] REST API foundation
Authentication
[x] Admin login
[x] JWT authentication
[x] HTTP-only cookie
[x] Authentication check
[x] Logout
[x] Protected admin routes
Property Management
[x] Property model
[x] Property API
[x] Create property
[x] Edit property
[x] Property search
[x] Property status
[x] Public visibility
[x] Owner assignment
[x] Image URL support
[x] Location information
[x] Google Maps URL support
[x] Sold property hiding logic
Owner Management
[x] Owner model
[x] Owner API
[x] Owner management page
[x] Add owner
[x] Edit owner
[x] Search owner
[x] Assign owner to property
[x] Owner navigation from dashboard
Customer Management
[x] Customer model
[x] Customer API
[x] Add customer
[x] Edit customer
[x] Customer search
[x] Customer requirements
[x] Customer status
[x] Customer 360° page
Lead Management
[x] Lead model
[x] Lead API
[x] Lead listing
[x] Lead status updates
[x] Lead priority
[x] Lead source
[x] Customer/property relationship
Follow-ups
[x] Follow-up model
[x] Follow-up API
[x] Create follow-up
[x] Update follow-up status
[x] Follow-up filtering
Activity Timeline
[x] Activity model
[x] Activity API
[x] Customer activity history
[x] Activity creation
[x] Activity editing
[x] Activity deletion
[x] Customer 360° timeline
[x] Related lead/property support
Public Enquiry
[x] Public enquiry API
[x] Customer creation/reuse
[x] Lead creation/reuse
[x] Website lead source
[x] Public property validation
---
Current Development Priority
The next major feature planned is:
Buyer ↔ Property Matching
The CRM will use customer requirements to identify suitable properties.
Example:
```text
Customer Requirement

Purpose:
BUY

Property Type:
APARTMENT

Budget:
₹40,00,000 – ₹60,00,000

Bedrooms:
2–3

Location:
Belagavi

Minimum Area:
1200 sq.ft.
```
The system will compare this requirement against available properties.
Potential matching criteria:
Purpose
Property type
Location
Budget
Bedrooms
Area
Amenities
Availability
The result will allow the dealer to quickly identify suitable properties for a customer.
---
Future Roadmap
Phase 1 – Core CRM
Completed:
Property management
Owner management
Customer management
Leads
Follow-ups
Activity Timeline
Customer 360°
Public enquiry system
---
Phase 2 – Intelligent CRM Workflow
Planned:
Buyer-property matching
Find buyers for a property
Reverse matching
Similar property suggestions
Property sharing history
Site visit management
Customer feedback
Deal management
Booking workflow
Negotiation tracking
---
Phase 3 – Communication
Planned:
WhatsApp integration
SMS integration
Email notifications
Follow-up reminders
Automated communication templates
Communication history
---
Phase 4 – Advanced CRM
Planned:
Multiple agents
Agent assignment
Role-based permissions
Agent dashboards
Team management
Activity audit logs
Advanced customer search
Advanced lead filtering
---
Phase 5 – Analytics
Planned:
Lead conversion analytics
Property performance
Sales reports
Customer source analytics
Follow-up analytics
Agent performance
Monthly/weekly reports
Dashboard charts
Exportable reports
---
Phase 6 – Media Management
Current implementation uses image URLs.
Future production implementation can support:
Direct image uploads
Multiple image uploads
Property videos
Cloud storage
Image optimization
Thumbnails
Secure media URLs
---
Phase 7 – Public Website Enhancement
Planned:
Advanced property filters
Location-based search
Price range
Property type
Bedrooms
Featured properties
Similar properties
Property videos
Improved gallery
WhatsApp contact
Call buttons
Social sharing
SEO optimization
Performance optimization
---
Important Business Rules
1. Sold Properties
When a property is sold:
```text
status = SOLD
isPublic = false
```
The property should not appear on the public website.
However, it should remain in the database.
This preserves:
Historical leads
Customer relationships
Activities
Previous property information
Business records
The property should therefore be hidden rather than permanently deleted.
---
2. Customer History
Customer records should be retained even after a requirement is completed.
Customer status can be changed to:
```text
CONVERTED
```
or:
```text
INACTIVE
```
This allows the dealer to maintain historical customer information.
---
3. Owner Privacy
Owner information is internal CRM data.
The public website should not expose private owner details such as:
Phone
Email
Internal notes
Negotiation details
Commission information
---
4. Public Property Data
The public website should only expose information appropriate for customers.
Private internal CRM information should not be returned through public APIs.
Before production, public API responses should use explicit field selection/projection or DTOs to prevent accidental exposure of internal fields.
---
Security
Security is an important part of the production roadmap.
Current security foundations include:
JWT authentication
HTTP-only cookies
Protected admin routes
Password hashing
Environment variables
Authentication middleware
Credential separation from source code
Additional production hardening should include:
HTTPS
Secure cookie configuration
Production CORS configuration
API rate limiting
Strong input validation
File type validation
Upload size restrictions
Authorization checks
Role-based access control
Audit logging
Database backups
Error logging
Security headers
Public/private API separation
---
Production Deployment
The intended production architecture is:
```text
                    USERS
                      │
          ┌───────────┴───────────┐
          │                       │
     Public Website            Admin CRM
          │                       │
          └───────────┬───────────┘
                      │
                 Frontend Host
                      │
                 REST API
                      │
              Backend Host
                      │
                MongoDB Atlas
                      │
                Cloud Storage
```
Potential production components include:
Frontend hosting
Backend hosting
MongoDB Atlas
Cloud image/video storage
Custom domain
HTTPS/SSL
The exact hosting provider can be selected during deployment.
---
Development Notes
Local URLs
Frontend:
```text
http://localhost:5173
```
Backend:
```text
http://localhost:5000
```
API Base URL
The frontend currently uses:
```text
http://localhost:5000/api
```
with credentials enabled for authentication cookies.
For production this should be replaced with the deployed backend URL.
---
Git Workflow
The project is maintained using Git.
Typical workflow:
```bash
git status
git add .
git commit -m "Describe changes"
git push origin main
```
Repository:
```text
https://github.com/Vinayak-Agasimani/estate-crm
```
Never commit:
```text
.env
node_modules/
credentials
API secrets
database passwords
private keys
```
---
Testing Strategy
Each major module should be tested at multiple levels.
Backend Testing
Test:
Authentication
Property APIs
Owner APIs
Customer APIs
Lead APIs
Follow-up APIs
Activity APIs
Public enquiry API
Tools such as Thunder Client/Postman can be used during development.
Frontend Testing
Test:
Navigation
Login
Protected routes
Property creation
Property editing
Owner creation
Owner assignment
Customer creation
Customer 360°
Lead updates
Follow-ups
Activity creation
Public enquiries
Integration Testing
Important end-to-end workflow:
```text
Create Owner
      ↓
Create Property
      ↓
Assign Owner
      ↓
Publish Property
      ↓
Open Public Website
      ↓
Submit Enquiry
      ↓
Customer Created
      ↓
Lead Created
      ↓
Admin Opens Lead
      ↓
Customer 360°
      ↓
Add Activity
      ↓
Create Follow-up
```
---
Complete Business Workflow
The intended complete workflow is:
Step 1 – Owner
Dealer receives property information from an owner.
Step 2 – Owner Registration
Dealer creates the owner in EstateCRM.
Step 3 – Property Registration
Dealer creates the property and assigns the owner.
Step 4 – Property Information
Dealer enters:
Price
Location
Images
Description
Property type
Amenities
Other details
Step 5 – Publish
Dealer publishes the property.
Step 6 – Customer Discovery
Customer visits the public website.
Step 7 – Enquiry
Customer submits an enquiry.
Step 8 – Customer Creation
EstateCRM creates or updates the customer.
Step 9 – Lead Creation
EstateCRM creates or reuses the corresponding property lead.
Step 10 – Contact
Dealer contacts the customer.
Step 11 – Property Sharing
Dealer shares suitable properties.
Step 12 – Site Visit
Customer visits the property.
Step 13 – Activity Recording
Dealer records the interaction.
Step 14 – Follow-up
Dealer schedules the next follow-up.
Step 15 – Negotiation
Customer and owner move into negotiation.
Step 16 – Booking
The property is booked.
Step 17 – Deal
Lead becomes won/converted according to the final workflow.
Step 18 – Sold
Property is marked as sold.
Step 19 – Public Visibility
The property is hidden from the public website.
Step 20 – Historical Record
All related records remain stored for future reference.
---
Long-Term Vision
EstateCRM is intended to evolve from a basic property website into a complete real-estate business management platform.
The long-term system can answer questions such as:
```text
Who are my active customers?

What does each customer want?

Which properties match a customer?

Which customers are interested in a property?

Which leads need attention?

Who needs a follow-up today?

What happened during the previous customer interaction?

Which properties are available?

Which properties are under discussion?

Which properties are booked?

Which properties are sold?

How many leads came from the website?

How many leads converted?

Which properties receive the most enquiries?

Which customers have not been contacted recently?
```
The central concept is:
```text
PROPERTY
    ↕
OWNER

CUSTOMER
    ↕
LEAD
    ↕
PROPERTY

CUSTOMER
    ↕
FOLLOW-UP

CUSTOMER
    ↕
ACTIVITY TIMELINE
```
All important business information is connected.
---
Current Project Status
```text
Core Project Setup              COMPLETED
MongoDB Integration             COMPLETED
Database Models                 COMPLETED
Authentication                 COMPLETED
Protected Routes                COMPLETED
Property Management             COMPLETED
Owner Management                COMPLETED
Customer Management             COMPLETED
Customer 360°                   COMPLETED
Lead Management                COMPLETED
Follow-up Management            COMPLETED
Activity Timeline               COMPLETED
Public Website Foundation      COMPLETED
Public Enquiry Workflow        COMPLETED
Admin Dashboard                COMPLETED
Owner Navigation               COMPLETED

Buyer ↔ Property Matching       NEXT
Advanced Deal Workflow          PLANNED
Communication Integration       PLANNED
Analytics                       PLANNED
Media Uploads                   PLANNED
Production Security Hardening   PLANNED
Production Deployment           PLANNED
```
---
Conclusion
EstateCRM provides a centralized foundation for managing the real-estate sales process.
It combines:
```text
PROPERTY MANAGEMENT
        +
OWNER MANAGEMENT
        +
CUSTOMER CRM
        +
LEAD MANAGEMENT
        +
FOLLOW-UP MANAGEMENT
        +
ACTIVITY HISTORY
        +
PUBLIC PROPERTY WEBSITE
        +
ENQUIRY MANAGEMENT
```
The most important concept is that the system does not treat these as separate modules.
They are connected.
A property can belong to an owner.
A customer can enquire about a property.
That enquiry becomes a lead.
The dealer can contact the customer.
The dealer can record the interaction.
The dealer can schedule a follow-up.
The customer can visit the property.
The dealer can continue the negotiation.
The property can eventually be booked or sold.
The complete history remains available inside the CRM.
This creates a foundation for building a scalable real-estate CRM rather than only a property listing website.
---
Project Repository
GitHub:
https://github.com/Vinayak-Agasimani/estate-crm
License
This project is currently intended as a private/client project.
License and redistribution terms should be defined before public/open-source distribution.