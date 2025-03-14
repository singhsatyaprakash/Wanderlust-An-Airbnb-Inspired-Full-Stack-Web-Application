# Route Endpoint Documentation

This document outlines the main endpoints for the application along with sample request payloads and expected responses.

---

## Listings

### GET /listings
- **Purpose:** Display a list of all listings.
- **Request:** No body required.
- **Response:** Rendered HTML page (`listings/index.ejs`) showing all listings.

---

### GET /listings/new
- **Purpose:** Render the form for creating a new listing.
- **Request:** No body required.
- **Response:** Rendered HTML page (`listings/new.ejs`) with the listing creation form.

---

### POST /listings
- **Purpose:** Create a new listing.
- **Request:**
  - **Headers:** `Content-Type: multipart/form-data` (if uploading an image)
  - **Body:** 
    ```
    {
      "listing": {
        "title": "Sample Title",
        "description": "Description text",
        "location": "City, State",
        "country": "Country name",
        "price": 1200,
        "image": <optional file>
      }
    }
    ```
- **Response:** On success, redirects to `/listings`. Flash message “New list added successfully.”

---

### GET /listings/:id
- **Purpose:** Show details for a specific listing.
- **Request:** URL parameter `:id` (listing ID)
- **Response:** Rendered HTML page (`listings/show.ejs`) showing listing details along with reviews and an embedded map.

---

### GET /listings/:id/edit
- **Purpose:** Render form to edit an existing listing.
- **Request:** URL parameter `:id`
- **Response:** Rendered HTML page (`listings/edit.ejs`) pre-filled with the listing’s current information.

---

### PUT /listings/:id
- **Purpose:** Update an existing listing.
- **Request:**
  - **Headers:** `Content-Type: multipart/form-data` if a new image is provided.
  - **Body:** 
    ```
    {
      "listing": {
        "title": "Updated Title",
        "description": "Updated description",
        "location": "Updated location",
        "country": "Updated country",
        "price": 1300,
        "image": <optional new file>
      }
    }
    ```
- **Response:** On success, redirects to `/listings/:id` with flash message “List updated successfully.”

---

### DELETE /listings/:id
- **Purpose:** Delete a listing.
- **Request:** URL parameter `:id`
- **Response:** On success, redirects to `/listings` with flash message “List deleted successfully.”

---

## User Authentication

### GET /signup
- **Purpose:** Render sign-up form.
- **Request:** No body required.
- **Response:** Rendered HTML page (`users/signup.ejs`) for user registration.

---

### POST /signup
- **Purpose:** Register a new user.
- **Request:**
  - **Headers:** `Content-Type: application/x-www-form-urlencoded`
  - **Body:** 
    ```
    {
      "username": "sampleUser",
      "email": "user@example.com",
      "password": "securePassword"
    }
    ```
- **Response:** On success, the user is automatically logged in and redirected to `/listings` with flash message “Welcome to Wanderlust.”

---

### GET /login
- **Purpose:** Render login form.
- **Request:** No body required.
- **Response:** Rendered HTML page (`users/login.ejs`).

---

### POST /login
- **Purpose:** Authenticate an existing user.
- **Request:**
  - **Headers:** `Content-Type: application/x-www-form-urlencoded`
  - **Body:** 
    ```
    {
      "username": "sampleUser",
      "password": "securePassword"
    }
    ```
- **Response:** On success, redirects to `/listings` (or the previously saved redirect URL) with flash message “Welcome Back to WanderLust.”

---

### GET /logout
- **Purpose:** Log out the current user.
- **Request:** No body required.
- **Response:** On success, redirects to `/listings` with flash message “You are logged out.”

---

## Reviews

### POST /listings/:id/reviews
- **Purpose:** Create a new review for a listing.
- **Request:**
  - **URL Parameter:** `:id` (listing ID)
  - **Headers:** `Content-Type: application/x-www-form-urlencoded`
  - **Body:** 
    ```
    {
      "review": {
        "rating": 4,
        "comment": "Great place to stay!"
      }
    }
    ```
- **Response:** On success, redirects to `/listings/:id` with flash message “Thanks for review.”

---

### DELETE /listings/:id/reviews/:reviewId
- **Purpose:** Delete a review.
- **Request:**
  - **URL Parameters:** 
     - `:id` (listing ID)
     - `:reviewId` (review ID)
- **Response:** On success, redirects to `/listings/:id` with flash message “Review Deleted.”

---

## Error Handling

- For any unknown routes, the application renders an error page (`listings/error.ejs`) with status code 404.
- Validation errors on listings or reviews are thrown as `ExpressError` and rendered on the error page with a detailed message.

---

*Note: Responses are rendered using EJS views. Flash messages and redirects are used to provide feedback to the user.*

@king_of_midgard_