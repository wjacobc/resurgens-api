const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const util = require("./util");
const express = require("express")();

const PORT = 3979;
const STATUS_OK = 200;
const NOT_FOUND = 404;

process.title = "resurgens";

routesFile = fs.readFileSync("./data/routes.txt", "utf8");
routesData = parse(routesFile, {columns: true});
console.log("Loaded routes data.");

stopsFile = fs.readFileSync("./data/stops.txt", "utf8");
stopsData = parse(stopsFile, {columns: true});
console.log("Loaded stops data.");

tripsFile = fs.readFileSync("./data/trips.txt", "utf8");
tripsData = parse(tripsFile, {columns: true});
console.log("Loaded trips data.");

arrivalsFile = fs.readFileSync("./data/stop_times.txt");
arrivalsData = parse(arrivalsFile, {columns: true});
console.log("Loaded stop times data.");

const lastUpdated = util.getLastUpdated();

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

function getDestination(tripId) {
    let tripArrivals = arrivalsData.filter(arrival =>
        arrival.trip_id == tripId);

    let startStopId = tripArrivals[0].stop_id;
    let endStopId = tripArrivals[tripArrivals.length - 1].stop_id;
    let startStop = stopsData.find(stop => stop.stop_id == startStopId).stop_name;
    let endStop = stopsData.find(stop => stop.stop_id == endStopId).stop_name;

    const trip = tripsData.find(trip => trip.trip_id == tripId);

    if (trip.direction_id == 1) {
        return util.toTitleCase(endStop);
    } else {
        return util.toTitleCase(startStop);
    }
}

function getDescription(tripId) {
    const trip = tripsData.find(trip => trip.trip_id == tripId);
    if (trip.trip_headsign != "") {
        let headsign_split = trip.trip_headsign.split(" ");
        if (headsign_split.includes("Route")) {
            return util.trimHeadsign(headsign_split);
        } else {
            return trip.trip_headsign;
        }
    } else {
        const route = routesData.find(route => trip.route_id == route.route_id);
        return route.route_long_name;
    }
}

const arrivals = getArrivalsByStop();

function getUpcomingArrivals(stopId, numToGet = 3) {
    arrivalsThisStop = arrivals[stopId];
    upcomingArrivals = arrivalsThisStop.filter(arrival =>
        util.timeIsFuture(arrival.arrival_time) && util.arrivalDayMatches(arrival));
    sortedArrivals = upcomingArrivals.sort((a, b) =>
        (a.arrival_time > b.arrival_time) ? 1 : -1);

    return sortedArrivals.slice(0, numToGet);
}

function getArrivalsInFormat(stopId) {
    const upcomingArrivals = getUpcomingArrivals(stopId);
    const formattedArrivals = [];

    upcomingArrivals.forEach(arrival => {
        formatted = {};
        formatted["timeToArrival"] = util.getTimeToArrival(arrival.arrival_time);
        formatted["route"] = arrival.route_num;
        formatted["description"] = getDescription(arrival.trip_id);
        formattedArrivals.push(formatted);
    });

    return formattedArrivals;
}

express.listen(PORT, () => console.log("Accepting connections on port " + PORT));

express.get("/getArrivalsByStopId/:stopId", (req, res) => {
    const { stopId } = req.params;
    try {
        const upcomingArrivals = getArrivalsInFormat(stopId);
        res.status(STATUS_OK).send(upcomingArrivals);
    } catch (TypeError) {
        res.status(NOT_FOUND).send("That stop does not exist, please try again.");
    }
});

express.get("/getArrivalsMultipleStops/:stops", (req, res) => {
    const { stops } = req.params;
    const stopArray = stops.split(",");
    const arrivals = {};

        stopArray.forEach(stop => {
            arrivals[stop] = getArrivalsInFormat(stop);
        });
        res.status(STATUS_OK).send(arrivals);

});

express.get("/getStopInformation", (req, res) => {
    stopsData.forEach(stop => stop.stop_name = util.toTitleCase(stop.stop_name));
    res.status(STATUS_OK).send(stopsData);
});

express.get("/getLastUpdated", (req, res) => {
    res.status(STATUS_OK).send(lastUpdated);
});

