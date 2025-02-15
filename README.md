# Pet Adoption Site - FWASK

## Overview
This is a **full-stack web application** for a pet adoption agency where employees can post pets for adoption or fostering, and users can apply to adopt or foster pets. 

### Key Features:
- Employees can post pets for adoption and fostering.
- Users can browse adoptable pets (even without an account).
- Users can apply to **adopt** or **foster** pets.
- **Role-based views:** Employees have dashboards, while foster parents have special access.
- **Live chat** powered by WebSockets.
- Employees receive notifications when a foster timeline is ending.
- Users receive an **adoption invoice** upon approval and can submit payment.

## Getting Started

### **1. Clone the Repository**
```sh
git clone <repository-url>
cd pet-adoption-site
```

### **2. Setup the Backend**
```sh
cd back
npm install
npm run setup  # Initializes database
npm run start    # Starts the backend
```
The backend will run at `http://localhost:3000/`.

### **3. Setup the Frontend**
```sh
cd ../front
npm install
npm run dev
```
The frontend will run at `http://localhost:5173/`.

---
