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
*   **Service:** `shop_service` (triggered by application logic), then `settings_service` (to update status).
*   **Triggering Shop Sync (Conceptual - actual endpoint depends on `shop_service` design):**
    *   Application logic (e.g., frontend or an orchestrator) would typically initiate this after `hasConfiguredBolApi` is true. This might involve calling one or more `shop_service` endpoints. Examples of conceptual `shop_service` calls that would run using the now-configured Bol API keys:
        *   `POST YOUR_API_GATEWAY_URL/api/shop/sync-all` (hypothetical endpoint)
        *   Or specific syncs:
            *   `POST YOUR_API_GATEWAY_URL/api/shop/sync-orders`
            *   `POST YOUR_API_GATEWAY_URL/api/shop/sync-offers-from-bol` (e.g., using the export offers CSV mechanism)
            *   `POST YOUR_API_GATEWAY_URL/api/shop/sync-products-from-bol`
    *   **Headers for `shop_service` calls:**
        *   `X-User-ID: <user_id>` (This is crucial so `shop_service` can retrieve the correct Bol.com API keys from `settings_service`).
*   **Marking Shop Sync as Complete:**
    *   Once the application determines that the relevant initial synchronization tasks are complete:
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
