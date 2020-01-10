# Instructions
This challenge is fully available online (both backend and frontend) and can be accessed using the following urls:

- Frontend App:
```bash
https://man-challenge-app.herokuapp.com/
```
- Backend API:
```bash
https://man-challenge-app.herokuapp.com/
```

The API can be used in the following way:
```bash
#Home:
https://man-challenge-app.herokuapp.com/

#Get All Vehicles:
https://man-challenge-app.herokuapp.com/vehicles/

#Get Vehicles by License:
https://man-challenge-app.herokuapp.com/vehicles/{license}
```

The Frontend App should be use to see and test the features whereas the Backend Api is used to retrieve the vehicle's locations and license information.
The database used in this project was the H2 database engine because it's an in-memory database with a really small footprint. Also it doesn't require complicated setups making the task of deploying the API a lot easier. For more information on H2: https://www.h2database.com/html/main.html

**Important:** Only 4 vehicle's licenses were added to the database: **[AA-00-AA, AA-00-BB, AA-00-CC, AA-00-DD]** (case-sensitive). But it is possible to display them all at once. 
The gps coordinates were generated using the http://map.project-osrm.org application that by setting two or more location pins on a map, generates a xml file with all the coordinates from that path. A class was created to go through that xml file and generate the database Inserts automatically (See src\main\java\com\tiagooliveira\manchallange\tools\DatabaseValuesGenerator.java).

The challenge was implemented as suggested with a couple added features that I added to create a better user experience:

- The distance from a given vehicle marker to the POI is displayed on the POI's marker's card when the latter is clicked.
- Displaying all vehicles is possible by just submitting the form with the license input field empty. It will retrieve all the vehicles in the database and display them. An animation was created to show to the user which vehicle is selected. To select a different vehicle, click on that vehicle's marker and the mark should start bouncing, this means that the vehicle is now selected and that distances will be calculated from that vehicle's current location.
- By clicking on a vehicle's marker, the license plate information is displayed on a card. This opens up the possibility of showing more information about the vehicle and its driver to the fleet manager.



## Installation

There's no need to install anything as the project is available online, however, if you want to deploy the project locally, use the following commands.

Download the project,

Git:
- Frontend App: https://github.com/tiagodoliveira/man-challenge
- Backend API: [https://github.com/tiagodoliveira/man-challenge-api](https://github.com/tiagodoliveira/man-challenge-api)

Direct Download (MEGA): 
- https://mega.nz/#F!dd9E0SwB!QWwtEWLcl6ne7wkAIkqC1Q

Run the API by loading it to an IDE and running the main class or go to the provided jar folder in your CLI:

```bash
cd target
# And then run:
java -jar gs-rest-service-cors-0.1.0.jar
```

To install the Web application, go to the frontend application folder in your CLI:

```bash
cd app\man-challenge
# And then run:
npm start
```
**Warning!**  
Change the configs.json file in app\man-challenge\src if:

```bash
#To run everything locally:
{"apiURL":"http://localhost:8080/vehicles/",
"API_KEY":"AIzaSyBob70viGuD9PCxbg5xAwqYzuGuEQZR4qo",
"proxyURL":""}

#To run just the Web application locally (and running the API deployed on the web):
{"apiURL":"https://man-challenge-backend.herokuapp.com/vehicles/",
"API_KEY":"AIzaSyBob70viGuD9PCxbg5xAwqYzuGuEQZR4qo",
"proxyURL":"https://cors-anywhere.herokuapp.com/"}
```

## Usage

Use the provided form to interact with the app as explained above.
