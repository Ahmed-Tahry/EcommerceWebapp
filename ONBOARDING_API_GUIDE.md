# Full User Onboarding API Call Sequence

This guide outlines the sequence of API calls required to take a new user through the complete onboarding process. It involves interactions with both the `settings_service` and implies actions or triggers related to the `shop_service`.

**Assumptions:**
*   All API calls are made through an API Gateway (e.g., Nginx) that handles authentication and injects an `X-User-ID` header into requests to backend services.
*   The base URL for the API gateway is referred to as `YOUR_API_GATEWAY_URL`.

---

## Step 0: User Signup

*   **Action:** A new user signs up for the application.
*   **System Internal:** A unique `userId` is generated for the user.
*   **API Interaction:** This step is typically handled by a dedicated authentication/user management service and is outside the scope of this specific guide but provides the `userId` for subsequent steps.

---

## Step 1: Initial Onboarding Status Check (Optional but Recommended)

*   **Purpose:** To get the initial state of the user's onboarding progress. For a new user, all steps will be `false`.
*   **Service:** `settings_service`
*   **API Call:**
    *   **Method:** `GET`
    *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/onboarding/status`
    *   **Headers:**
        *   `X-User-ID: <user_id_of_new_user>`
*   **Expected Response (200 OK):**
    ```json
    {
      "userId": "<user_id_of_new_user>",
      "hasConfiguredBolApi": false,
      "hasCompletedShopSync": false,
      "hasCompletedVatSetup": false,
      "hasCompletedInvoiceSetup": false,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
    ```

---

## Step 2: Configure Bol.com API Credentials

*   **Purpose:** User provides their Bol.com API Client ID and Secret. This enables `shop_service` to interact with the Bol.com API on their behalf.
*   **Service:** `settings_service`
*   **Part A: Save Bol.com Credentials**
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/account`
        *   **Headers:**
            *   `X-User-ID: <user_id>`
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "bolClientId": "YOUR_BOL_CLIENT_ID",
              "bolClientSecret": "YOUR_BOL_CLIENT_SECRET"
            }
            ```
    *   **Expected Response (200 OK):** The saved account details.
*   **Part B: Mark Bol.com API Configuration as Complete**
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/onboarding/step`
        *   **Headers:**
            *   `X-User-ID: <user_id>`
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "hasConfiguredBolApi": true
            }
            ```
    *   **Expected Response (200 OK):** Updated onboarding status.

---

## Step 3: Initial Shop Synchronization with Bol.com

*   **Purpose:** `shop_service` performs the initial synchronization of products, offers, and orders from the user's Bol.com account.
*   **Service:** `shop_service` (for sync operations), then `settings_service` (to update onboarding status).
*   **Triggering Shop Sync Operations:**
    *   After `hasConfiguredBolApi` is true, the application should trigger the necessary synchronization tasks using the `shop_service` endpoints. These calls require the `X-User-ID` header.
    *   **A. Sync Orders from Bol.com:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/shop/orders/sync/bol`
        *   **Headers:** `X-User-ID: <user_id>`
        *   **Query Parameters (Optional):**
            *   `status` (string, e.g., "OPEN", "SHIPPED", defaults to "OPEN")
            *   `fulfilmentMethod` (string, e.g., "FBR", "FBB")
            *   `latestChangedDate` (string, format YYYY-MM-DD)
        *   **Purpose:** Fetches orders from Bol.com based on filters and stores/updates them locally.
    *   **B. Sync Offers from Bol.com:**
        *   **Method:** `GET`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/shop/offers/export/csv`
        *   **Headers:** `X-User-ID: <user_id>`
        *   **Purpose:** Initiates an offer export from Bol.com (as CSV), then parses and saves/updates these offers in the local database.
    *   **C. Sync Products from Bol.com (Per EAN):**
        *   The system might need to sync product details for EANs encountered in offers/orders. This is done on a per-product basis.
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/shop/products/:ean/sync-from-bol` (replace `:ean` with actual EAN)
        *   **Headers:** `X-User-ID: <user_id>`
        *   **Query Parameters (Optional):**
            *   `language` (string, e.g., "nl", defaults to "nl")
        *   **Purpose:** Fetches detailed product information for a specific EAN from Bol.com and updates the local product record.
        *   *(Note: A bulk "sync all products" endpoint is not currently available; this per-EAN sync would be used as needed, possibly iteratively).*
*   **Marking Shop Sync as Complete:**
    *   Once the application determines that the essential initial synchronization tasks (e.g., orders and offers) are complete:
    *   **Service:** `settings_service`
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/onboarding/step`
        *   **Headers:**
            *   `X-User-ID: <user_id>`
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "hasCompletedShopSync": true
            }
            ```
    *   **Expected Response (200 OK):** Updated onboarding status.

---

## Step 4: Configure Product VAT Settings

*   **Purpose:** User configures system-wide VAT rates or assigns VAT rates to their products. The onboarding step tracks if the user has completed this configuration task.
*   **Service:** `settings_service` (for managing VAT rates and tracking onboarding step). Product-specific VAT assignment might involve `shop_service`.
*   **Managing VAT Rates (System-wide, typically by an admin or as part of setup):**
    *   `POST YOUR_API_GATEWAY_URL/api/settings/vat` - Create a VAT rate.
        *   Body: `{ "name": "Standard NL VAT", "rate": 21, "isDefault": true }`
    *   `GET YOUR_API_GATEWAY_URL/api/settings/vat` - List VAT rates.
    *   `PUT YOUR_API_GATEWAY_URL/api/settings/vat/<vat_setting_id>` - Update a VAT rate.
*   **Marking VAT Setup as Complete for Onboarding:**
    *   After the user has performed the necessary actions related to VAT settings for their products or account:
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/onboarding/step`
        *   **Headers:**
            *   `X-User-ID: <user_id>`
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "hasCompletedVatSetup": true
            }
            ```
    *   **Expected Response (200 OK):** Updated onboarding status.

---

## Step 5: Configure Invoice Settings

*   **Purpose:** User provides their company information for invoicing.
*   **Service:** `settings_service`
*   **Part A: Save Invoice Settings**
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/invoice`
        *   **Headers:**
            *   `X-User-ID: <user_id>` (The invoice settings are global, but this header indicates *who* is making the change)
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "companyName": "User's Company Name",
              "companyAddress": "123 Business Rd, Suite 4B, Commerce City",
              "vatNumber": "USER_VAT_ID_12345",
              "defaultInvoiceNotes": "Thank you for your purchase!",
              "invoicePrefix": "INV-",
              "nextInvoiceNumber": 1
            }
            ```
    *   **Expected Response (200 OK):** Saved invoice settings.
*   **Part B: Mark Invoice Setup as Complete**
    *   **API Call:**
        *   **Method:** `POST`
        *   **Endpoint:** `YOUR_API_GATEWAY_URL/api/settings/onboarding/step`
        *   **Headers:**
            *   `X-User-ID: <user_id>`
            *   `Content-Type: application/json`
        *   **Request Body:**
            ```json
            {
              "hasCompletedInvoiceSetup": true
            }
            ```
    *   **Expected Response (200 OK):** Updated onboarding status.

---

## Checking Onboarding Completion

At any point, the frontend can call `GET YOUR_API_GATEWAY_URL/api/settings/onboarding/status` (with `X-User-ID`) to check the current status. Full onboarding is achieved when all relevant boolean flags are `true`.
The application can then unlock full functionality for the user.

---Tool output for `create_file_with_block`:
