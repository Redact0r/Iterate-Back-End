# Application

Iterate - Back End

# Developer

Tyler Sharp

# Summary

Some writers need external motivation to keep themselves accountable. Enter Iterate, an early-in-development application to gamify the writing experience.
Each day you log in, you can set a goal. When you meet it, you earn a streak. If you don't write until the end of the next day, you lose your streak.

You can also, save, edit, and delete your work - manage all your chapters or articles here!

"Write" now, the streak feature is the key feature of the application.

Future features will include:

1. Set goals for each day of the week.
2. More styling options.
3. Pomodoro timer
4. Leaderboards and "multiplayer" writing competitions

# Links

You can find the live site here:
https://iterate-phi.vercel.app/

The back end can be contacted through this api:
https://arcane-savannah-42201.herokuapp.com/

# How to use the API

The api for this project lets you perform GET and POST requests to fetch from and contribute to the users, and story databases
Here are some examples of how to use the API:

(Unprotected Endpoint)GET /myworks?userid=userid
(you will not be able to see your userid without web dev tools)
Register: POST /signup - takes in user_name, password, full_name, nickname > Returns a bearer authentication token for the user
Example request body:
{
user_name: "testuser",
password: "Testpass01!",
full_name: "Test User"
nickname: "Mister Test"
}
My works: /myworks

GET requests need a userid in the query, which will return all works for that user.

POST requests must include {title, content, wordcount} and will be given a UUID.

DELETE requests must include the UUID in the param, such as "/myworks/id/:id"

PATCH requests require a PATCH to the UUID, such as "/myworks/id:id" and must include {title, content, wordcount} to be changed

Streak:

GET "/streak?userid=id" will return the current streak for the user

POST "/streak/check" requires a {userid} in the req body and adds a new streak. This also sets the last streak date for the user if none exists.

# Screen shots

<img src="./src/Assets/iteratesnapshot1.png" width="500">
<img src="./src/Assets/iteratesnapshot2.png" width="500">
<img src="./src/Assets/iteratesnapshot3.png" width="500">

# Technologies used

This project was completed with the following technologies:

1. React
2. Javascript
3. Node / Express
4. PostgreSQL
5. Mocha
6. Chai
7. Jest / Enzyme

## Development Set up

Complete the following steps to use this project:

1. Clone this repository to your local machine `git clone NEW-PROJECTS-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`

## Scripts

Start the application `npm start`
Start nodemon for the application `npm run dev`
Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
