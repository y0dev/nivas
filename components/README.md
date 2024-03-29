## :open_file_folder: Files

- `index.js` handles for all the routes

## :open_file_folder: Folder structure

- `auth` Component that handles authentication
- `coupon` Component that handles coupon generation and validation (Admin Only)
- `email` Component that handles email
- `mls` Component that handles Multiple Listing Service (Zillow)
- `payment` Component that handles Payment Service (Stripe)
- `repo` Component that handles mongodb wrappers
- `user` Component that handles user controller, schema, and repository
- `view` Component that handles view routes and controller

## :art: Component Design

- `controller` handles incoming requests and sends the response data back to the client. It uses the repository class to interact with the database.
- `model` represents the database model for its component.
- `repository` a wrapper for the database. Here we read and write data to the database.
- `routes` define the API endpoints for the corresponding component and assign the controller methods to them.t
- `schema` mongodb database schema
- `test` file for testing the component and its endpoints.
