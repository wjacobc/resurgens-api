const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const util = require("./util");


routesFile = fs.readFileSync("./data/routes.txt", "utf8");
routesData = parse(routesFile, {columns: true});

stopsFile = fs.readFileSync("./data/stops.txt", "utf8");
stopsData = parse(stopsFile, {columns: true});

tripsFile = fs.readFileSync("./data/trips.txt", "utf8");
tripsData = parse(tripsFile, {columns: true});

arrivalsFile = fs.readFileSync("./data/stop_times.txt");
arrivalsData = parse(arrivalsFile, {columns: true});

function getArrivalsByStop() {
    arrivalsByStop = {}


    arrivalsData.forEach(arrival => {
        let stopId = arrival.stop_id;
        let trip = tripsData.find(trip => trip.trip_id == arrival.trip_id);
        let routeId = trip.route_id;
        let routeNum = routesData.find(route =>
            route.route_id == routeId).route_short_name;
        arrival.route_num = routeNum;
        arrival.headsign = trip.trip_headsign;

        // use serviceId to determine what day of the week this arrival
        // is for, since weekend service is different from weekday
        let serviceId = trip.service_id;
        if (serviceId == 3) {
            arrival.type = "saturday";
        } else if (serviceId == 4) {
            arrival.type = "sunday";
        } else {
            arrival.type = "weekday";
        }

        if (arrivalsByStop[stopId] == undefined) {
            arrivalsByStop[stopId] = [];
        }

        arrivalsByStop[stopId].push(arrival);
    });

    return arrivalsByStop;
}

function getStartEndStop(tripId) {
    let trip_arrivals = arrivalsData.filter(arrival =>
        arrival.trip_id == tripId);


    let startStopId = trip_arrivals[0].stop_id;
    let endStopId = trip_arrivals[trip_arrivals.length - 1].stop_id;
    let startStop = stopsData.find(stop => stop.stop_id == startStopId).stop_name;
    let endStop = stopsData.find(stop => stop.stop_id == endStopId).stop_name;

    console.log(util.toTitleCase(startStop) + " -> " + util.toTitleCase(endStop));
}

