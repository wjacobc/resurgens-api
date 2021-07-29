# Resurgens-API
An Express/Node.js API for delivering transit schedule data, designed for use alongside [Resurgens Transit](http://github.com/wjacobc/resurgens-transit).

### API Endpoints

- `getArrivalsByStopId/[stopId]`

Returns a JSON object containing information about upcoming arrivals at that stop ID, including the route and time to arrival in human-readable format.

- `getArrivalsMultipleStops/[stops]`

Returns a JSON list of objects containing the same information as `getArrivalsByStopId`, for multiple stops at one time.

- `getStopInformation`

Returns a JSON list of all stops, including their geolocation and routes served.

- `getLastUpdated`

Returns a date and time using the JavaScript Date() object's `toDateString()` function. More information on that date format can be [found here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toDateString).

### Instructions
Requires `node` and `npm`, as well as `csv-parse` and `express` from npm. After cloning the repository, `npm install` will install the node dependencies.

Download `google_transit.zip` from [this link](https://itsmarta.com/google_transit_feed/google_transit.zip) (10MB .zip). Unzip the files, and move them all into a folder named `data`.

Launch the application using `node .`, and wait for it to load the data from the text files. This can be a lengthy process. After that, the program will serve requests on port 3979.
