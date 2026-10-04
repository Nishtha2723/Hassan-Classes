HASSAN SIR'S TUITIONS WEBSITE — DATABASE VERSION

WHAT WAS ADDED
---------------
1. Feedback is now saved in MongoDB instead of browser localStorage.
2. Feedback is loaded from MongoDB and displayed on feedback.html.
3. Admission enquiries are saved in MongoDB.
4. After an enquiry is saved successfully, WhatsApp opens with the enquiry details.
5. A Node.js + Express backend is included.
6. MongoDB is connected through Mongoose.

FOLDER
------
hassan_sir_classes_updated/
  index.html
  feedback.html
  achievements.html
  style.css
  script.js
  server.js
  package.json
  .env.example
  logo.jpeg
  achievements-2026.jpeg

LOCAL SETUP
-----------
1. Install Node.js.
2. Open Command Prompt/PowerShell in this folder.
3. Run:
      npm install

4. Create a file named:
      .env

5. Copy the contents of .env.example into .env and replace the MongoDB username,
   password and cluster with your MongoDB Atlas connection string.

   Example:
      MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hassan_sir_classes?retryWrites=true&w=majority

6. Start the website:
      npm start

7. Open:
      http://localhost:3000

DATABASE COLLECTIONS
--------------------
MongoDB will automatically create:
- Feedback
- Enquiry

IMPORTANT FOR DEPLOYMENT
------------------------
GitHub Pages can host the HTML/CSS/JS files, but it cannot run the Node.js backend.
Therefore, for database saving, deploy this complete Node.js project on a backend host
such as Render and use MongoDB Atlas for the database.

The easiest setup is:
MongoDB Atlas -> database
Render -> Node.js website + API

SECURITY
--------
Do NOT upload your real .env file or MongoDB password to GitHub.
Only upload .env.example.
