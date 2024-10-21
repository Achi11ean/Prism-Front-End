# PRISM

## React Event Management App

## Introduction

This project is a React-based web application for managing various entities, such as artists, attendees, events, tours, and venues. It provides a seamless user experience for both signing up and managing these entities. The app is designed with a focus on simplicity and efficiency, allowing users to create, update, and view different lists with ease.

## Features

- **User Authentication:** Users can sign up and sign in based on their role (artist, attendee, event manager, etc.).
- **CRUD Operations:** Each user type can create, update, and view lists based on their assigned role.
- **Responsive Design:** The app is fully responsive, ensuring it works smoothly across all device sizes.
- **Dynamic Styling:** Uses a combination of CSS for modern styling, such as gradient backgrounds, hover effects, and rounded buttons, to enhance user interaction.
  
## Technologies Used

### Front-end
- **React**: A JavaScript library for building user interfaces.
- **React Router**: To handle dynamic routing for different pages such as home, artist list, attendee list, and more.
- **CSS3**: Custom styling for various components, including responsive design and animations.

### Third-party Libraries
- **Fetch API**: For making HTTP requests to the back-end to sign in, sign out, create, update, and fetch data.
- **useState & useEffect**: React hooks for state management and side effects.

### Other Tools
- **Git & GitHub**: Version control and project repository hosting.
- **Vite**: For bundling and running the app during development.

## Instructions to Run the Project

To get the project running locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/event-management-app.git
    ```
   
2. **Install Dependencies**:
    Navigate into the project directory and install all dependencies using npm:
    ```bash
    cd Prism-Front-End/vite-live
    npm install
    ```

3. **Start the Development Server**:
    To run the app in development mode, use:
    ```bash
    npm run dev
    ```
    This will start the Vite development server. The app will be available at [http://localhost:5173](http://localhost:5173).

4. **Build for Production**:
    To create a production build, run:
    ```bash
    npm run build
    ```

5. **Running with Backend**:
    The project requires a back-end server for user authentication and CRUD operations. Make sure the back-end server is running on `http://127.0.0.1:5001`. You can integrate the back-end by connecting API routes in the app.

## Future Updates

- **Enhanced Role-Based Permissions**: Implement finer access control for different user types.
- **Real-time Updates**: Incorporate WebSockets to provide real-time updates for events and attendees.
- **Advanced Search & Filters**: Expand the filtering functionality to allow advanced queries across lists.
- **File Uploads**: Add the ability for users to upload media (e.g., artist images, event flyers) to enhance the listings.

## Contact & Contributions

Feel free to contribute to the project by submitting pull requests or opening issues on GitHub. For further inquiries, contact the project maintainers:

Jonathen Whitford
Alfredo Pasquel




