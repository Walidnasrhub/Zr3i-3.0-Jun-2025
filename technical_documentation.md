# Crop Monitoring and Management Application: Technical Documentation

## 1. Introduction

This document provides a comprehensive technical overview of the Crop Monitoring and Management Application. It is intended for developers, system administrators, and anyone interested in understanding the architecture, technologies, and implementation details of the platform.

## 2. Architecture Overview

The application follows a microservices-oriented architecture, with a clear separation of concerns between the backend API, web frontend, and mobile frontend. This design promotes scalability, maintainability, and independent deployment of components.

### 2.1 High-Level Diagram

```mermaid
graph TD
    User[User] --> WebApp[Web Application (React)]
    User --> MobileApp[Mobile Application (React Native)]

    WebApp --> BackendAPI[Backend API (Flask)]
    MobileApp --> BackendAPI

    BackendAPI --> Database[Database (SQLite/PostgreSQL)]
    BackendAPI --> ExternalAPIs[External APIs (e.g., Copernicus, Weather)]
    BackendAPI --> DataProcessing[Data Processing & Analytics]

    DataProcessing --> SatelliteData[Sentinel-2 Satellite Data]
    DataProcessing --> RemoteSensing[Remote Sensing Algorithms]

    subgraph Cloud Infrastructure
        BackendAPI
        Database
        ExternalAPIs
        DataProcessing
        SatelliteData
        RemoteSensing
    end

    subgraph User Devices
        WebApp
        MobileApp
    end
```

### 2.2 Component Breakdown

*   **Backend API (Flask):**
    *   **Purpose:** Serves as the central hub for data management, business logic, and integration with external services.
    *   **Technologies:** Python, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, GeoPandas, Shapely, Psycopg2 (for PostgreSQL).
    *   **Key Modules:** User authentication, field management, satellite data processing, monitoring data aggregation, Farm-to-Fork traceability logic.

*   **Web Application (React):**
    *   **Purpose:** Provides a rich, interactive user interface for desktop and web-based access.
    *   **Technologies:** React, JavaScript, Axios, Leaflet, React-Leaflet, React-Hook-Form, Zod, i18next, Tailwind CSS.
    *   **Key Modules:** User dashboards, field visualization, monitoring data display, Farm-to-Fork interface, settings.

*   **Mobile Application (React Native):**
    *   **Purpose:** Offers a native-like experience for iOS and Android devices, leveraging mobile-specific features.
    *   **Technologies:** React Native, Expo, Axios, React Native Maps, React Native SVG, React Native Chart Kit, Expo Notifications, AsyncStorage, @react-native-community/netinfo, i18n-js.
    *   **Key Modules:** User authentication, field management (with drawing tools), monitoring data display, Farm-to-Fork (with camera/GPS), offline functionality, push notifications.

*   **Database:**
    *   **Purpose:** Stores all application data, including user profiles, field geometries, monitoring data, and traceability records.
    *   **Technologies:** SQLite (development/testing), PostgreSQL (recommended for production).
    *   **Schema:** (Detailed in Section 4)

*   **External APIs:**
    *   **Purpose:** Integrates with third-party services for satellite data, weather information, and other agricultural data sources.
    *   **Examples:** Copernicus Data Space Ecosystem (for Sentinel-2), Weather APIs.

*   **Data Processing & Analytics:**
    *   **Purpose:** Handles the acquisition, processing, and analysis of raw satellite and environmental data.
    *   **Technologies:** Python, eodag, Rasterio, Xarray, RiOXarray, NumPy, SciPy.
    *   **Key Functions:** Cloud masking, atmospheric correction, vegetation index calculation (NDVI, NDMI, NDWI).

## 3. API Specifications (Backend)

The backend API is built with Flask and provides RESTful endpoints for various functionalities. All endpoints are secured with JWT (JSON Web Token) authentication.

### 3.1 Authentication Endpoints

*   **`POST /api/auth/register`**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{"username": "string", "email": "string", "password": "string"}`
    *   **Response:** `{"message": "User registered successfully"}` (201 Created)

*   **`POST /api/auth/login`**
    *   **Description:** Authenticates a user and returns an access token.
    *   **Request Body:** `{"email": "string", "password": "string"}`
    *   **Response:** `{"access_token": "string"}` (200 OK)

### 3.2 Field Management Endpoints

*   **`GET /api/fields/`**
    *   **Description:** Retrieves all fields for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Response:** `[{"id": int, "name": "string", "crop_type": "string", ...}]` (200 OK)

*   **`POST /api/fields/`**
    *   **Description:** Adds a new field for the authenticated user.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{"name": "string", "description": "string", "crop_type": "string", "boundary": GeoJSON_Feature_Object}`
    *   **Response:** `{"id": int, "name": "string", ...}` (201 Created)

*   **`GET /api/fields/<int:field_id>`**
    *   **Description:** Retrieves details of a specific field.
    *   **Authentication:** Required (JWT)
    *   **Response:** `{"id": int, "name": "string", ...}` (200 OK)

*   **`PUT /api/fields/<int:field_id>`**
    *   **Description:** Updates an existing field.
    *   **Authentication:** Required (JWT)
    *   **Request Body:** `{"name": "string", "description": "string", "crop_type": "string", "boundary": GeoJSON_Feature_Object}` (partial updates allowed)
    *   **Response:** `{"id": int, "name": "string", ...}` (200 OK)

*   **`DELETE /api/fields/<int:field_id>`**
    *   **Description:** Deletes a field.
    *   **Authentication:** Required (JWT)
    *   **Response:** (204 No Content)

### 3.3 Satellite Data Endpoints

*   **`GET /api/satellite/imagery/<int:field_id>`**
    *   **Description:** Retrieves satellite imagery data for a specific field.
    *   **Authentication:** Required (JWT)
    *   **Query Parameters:** `date` (optional, YYYY-MM-DD), `index` (optional, e.g., "NDVI", "NDMI", "NDWI")
    *   **Response:** `{"image_url": "string", "data": "json_data_for_index"}` (200 OK)

### 3.4 Monitoring Data Endpoints (Conceptual)

*   **`GET /api/monitoring/weather/<int:field_id>`**
    *   **Description:** Retrieves weather data for a field.
    *   **Authentication:** Required (JWT)
    *   **Response:** `{"current": {}, "forecast": []}` (200 OK)

*   **`GET /api/monitoring/soil_water/<int:field_id>`**
    *   **Description:** Retrieves soil and water data for a field.
    *   **Authentication:** Required (JWT)
    *   **Response:** `{"soil": {}, "water": {}}` (200 OK)

*   **`GET /api/monitoring/crop_health/<int:field_id>`**
    *   **Description:** Retrieves crop health data for a field.
    *   **Authentication:** Required (JWT)
    *   **Response:** `{"health_indicators": {}, "stress_analysis": {}}` (200 OK)

*   **`GET /api/monitoring/risk_analysis/<int:field_id>`**
    *   **Description:** Retrieves risk analysis data for a field.
    *   **Authentication:** Required (JWT)
    *   **Response:** `{"risks": [], "insurance_info": {}}` (200 OK)

### 3.5 Farm-to-Fork Endpoints (Conceptual)

*   **`POST /api/traceability/upload`**
    *   **Description:** Uploads a traceability record (image, GPS, timestamp, status).
    *   **Authentication:** Required (JWT, Premium Subscription)
    *   **Request Body:** `{"field_id": int, "image": "base64_encoded_image", "latitude": float, "longitude": float, "timestamp": "datetime_string", "status": "string"}`
    *   **Response:** `{"message": "Record uploaded successfully"}` (201 Created)

*   **`GET /api/traceability/product/<int:product_id>`**
    *   **Description:** Retrieves traceability timeline for a product.
    *   **Authentication:** Required (JWT)
    *   **Response:** `[{"image_url": "string", "latitude": float, "longitude": float, "timestamp": "datetime_string", "status": "string"}]` (200 OK)

## 4. Database Schema

The application uses an SQLite database for development and testing, with PostgreSQL recommended for production. The schema is managed using Flask-SQLAlchemy.

### 4.1 `User` Table

| Column Name   | Data Type | Constraints           | Description                               |
| :------------ | :-------- | :-------------------- | :---------------------------------------- |
| `id`          | INTEGER   | PRIMARY KEY, AUTOINC  | Unique user identifier                    |
| `username`    | TEXT      | UNIQUE, NOT NULL      | User's chosen username                    |
| `email`       | TEXT      | UNIQUE, NOT NULL      | User's email address (for login)          |
| `password_hash` | TEXT      | NOT NULL              | Hashed password                           |
| `created_at`  | DATETIME  | NOT NULL, DEFAULT NOW | Timestamp of user creation                |
| `updated_at`  | DATETIME  | NOT NULL, DEFAULT NOW | Last update timestamp                     |

### 4.2 `Field` Table

| Column Name     | Data Type | Constraints           | Description                               |
| :-------------- | :-------- | :-------------------- | :---------------------------------------- |
| `id`            | INTEGER   | PRIMARY KEY, AUTOINC  | Unique field identifier                   |
| `user_id`       | INTEGER   | NOT NULL, FOREIGN KEY | ID of the user who owns the field         |
| `name`          | TEXT      | NOT NULL              | Name of the field                         |
| `description`   | TEXT      | NULLABLE              | Optional description of the field         |
| `crop_type`     | TEXT      | NULLABLE              | Type of crop grown in the field           |
| `area_hectares` | REAL      | NULLABLE              | Calculated area of the field in hectares  |
| `boundary`      | TEXT      | NOT NULL              | GeoJSON string representing field boundary|
| `center_lat`    | REAL      | NULLABLE              | Latitude of the field's centroid          |
| `center_lon`    | REAL      | NULLABLE              | Longitude of the field's centroid         |
| `created_at`    | DATETIME  | NOT NULL, DEFAULT NOW | Timestamp of field creation               |
| `updated_at`    | DATETIME  | NOT NULL, DEFAULT NOW | Last update timestamp                     |

### 4.3 `SatelliteImage` Table (Conceptual)

| Column Name   | Data Type | Constraints           | Description                               |
| :------------ | :-------- | :-------------------- | :---------------------------------------- |
| `id`          | INTEGER   | PRIMARY KEY, AUTOINC  | Unique image identifier                   |
| `field_id`    | INTEGER   | NOT NULL, FOREIGN KEY | ID of the associated field                |
| `image_url`   | TEXT      | NOT NULL              | URL or path to the satellite image        |
| `capture_date`| DATETIME  | NOT NULL              | Date when the image was captured          |
| `ndvi_data`   | TEXT      | NULLABLE              | JSON string of NDVI data for the image    |
| `ndmi_data`   | TEXT      | NULLABLE              | JSON string of NDMI data for the image    |
| `ndwi_data`   | TEXT      | NULLABLE              | JSON string of NDWI data for the image    |
| `created_at`  | DATETIME  | NOT NULL, DEFAULT NOW | Timestamp of record creation              |

### 4.4 `TraceabilityRecord` Table (Conceptual - for Premium Feature)

| Column Name   | Data Type | Constraints           | Description                               |
| :------------ | :-------- | :-------------------- | :---------------------------------------- |
| `id`          | INTEGER   | PRIMARY KEY, AUTOINC  | Unique record identifier                  |
| `field_id`    | INTEGER   | NOT NULL, FOREIGN KEY | ID of the associated field                |
| `product_id`  | INTEGER   | NULLABLE              | ID of the product/batch (if applicable)   |
| `image_url`   | TEXT      | NOT NULL              | URL or path to the uploaded image         |
| `latitude`    | REAL      | NOT NULL              | Latitude of image capture                 |
| `longitude`   | REAL      | NOT NULL              | Longitude of image capture                |
| `timestamp`   | DATETIME  | NOT NULL              | Timestamp of image capture                |
| `status`      | TEXT      | NOT NULL              | Current status of the product             |
| `notes`       | TEXT      | NULLABLE              | Additional notes for the record           |

## 5. Development Environment Setup

### 5.1 Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <backend_repo_url>
    cd crop_monitoring_api
    ```
2.  **Create a virtual environment and install dependencies:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
3.  **Database Migration (if using Flask-Migrate):**
    ```bash
    flask db init
    flask db migrate -m "Initial migration"
    flask db upgrade
    ```
4.  **Run the Flask application:**
    ```bash
    export FLASK_APP=src/main.py
    flask run
    ```

### 5.2 Web Frontend Setup

1.  **Clone the repository:**
    ```bash
    git clone <web_frontend_repo_url>
    cd crop-monitoring-web
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install
    # or npm install / yarn install
    ```
3.  **Run the development server:**
    ```bash
    pnpm dev
    # or npm start / yarn start
    ```

### 5.3 Mobile Frontend Setup

1.  **Clone the repository:**
    ```bash
    git clone <mobile_frontend_repo_url>
    cd crop-monitoring-mobile-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```
3.  **Run the Expo development server:**
    ```bash
    npx expo start
    ```
    *   Scan the QR code with your Expo Go app on your mobile device or use an emulator.

## 6. Testing

Refer to the individual test reports for detailed testing procedures and results:

*   `web_functional_test_report.md`
*   `web_ui_test_report.md`
*   `mobile_functional_test_report.md`
*   `mobile_ui_test_report.md`
*   `e2e_test_report.md`
*   `performance_test_report.md`
*   `security_test_report.md`

## 7. Deployment

Refer to the deployment scripts and notes for deployment procedures:

*   `backend_deploy.sh`
*   `web_deploy.sh`
*   `mobile_deploy_notes.md`

## 8. Future Enhancements (Conceptual)

*   **Advanced Analytics:** Integration of machine learning models for yield prediction, disease detection, and optimal irrigation scheduling.
*   **IoT Integration:** Connecting with ground-based sensors for real-time soil, water, and weather data.
*   **Drone Imagery Processing:** Incorporating drone-captured imagery for higher resolution and more frequent updates.
*   **Marketplace Integration:** Connecting farmers with buyers and suppliers for agricultural products and inputs.
*   **Customizable Dashboards:** Allowing users to personalize their dashboards with preferred metrics and visualizations.





## 1.3 System Architecture Overview

<img src="/home/ubuntu/upload/1000025677.jpg" alt="System Architecture" style="width:100%; max-width:800px; display:block; margin: 20px auto;">

*Figure 1: High-Level System Architecture*

## 2.1 Backend Architecture

<img src="/home/ubuntu/upload/1000024657.jpg" alt="Backend Components" style="width:100%; max-width:800px; display:block; margin: 20px auto;">

*Figure 2: Backend Component Diagram*

## 3.1 Frontend Architecture (Web)

<img src="/home/ubuntu/upload/1000024655.jpg" alt="Web Frontend" style="width:100%; max-width:800px; display:block; margin: 20px auto;">

*Figure 3: Web Application User Interface Example*

## 3.2 Frontend Architecture (Mobile)

<img src="/home/ubuntu/upload/1000028804.jpg" alt="Mobile Frontend" style="width:100%; max-width:800px; display:block; margin: 20px auto;">

*Figure 4: Mobile Application User Interface Example*



