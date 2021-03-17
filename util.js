const getDayString = function() {
    const now = new Date();
    const dayOfWeek = now.getDay();

    if (dayOfWeek == 0) {
        return "sunday";
    } else if (dayOfWeek == 6) {
        return "saturday";
    } else {
        return "weekday";
    }
}

module.exports = {
    isWeekday: function() {
        const day = new Date().getDay();
        return day != 0 && day != 6;
    },

    isSaturday: function() {
        const day = new Date().getDay();
        return day == 6;
    },

    isWeekday: function() {
        const day = new Date().getDay();
        return day == 0;
    },

    toTitleCase: function(str) {
        let allowedWords = ["NW", "NE", "SW", "SE"];
        let words = str.split(" ");
        let fixedWords = []

        words.forEach(word => {
            if (allowedWords.includes(word)) {
                fixedWords.push(word);
            } else {
                let end = word.slice(1, word.length);
                let firstLetter = word.slice(0, 1);
                fixedWords.push(firstLetter + end.toLowerCase());
            }
        });

        return fixedWords.join(" ");
    },

    timeIsFuture: function(scheduledTime) {
        const now = new Date();
        const scheduledTimeSplit = scheduledTime.split(":");
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();

        const scheduledHour = parseInt(scheduledTimeSplit[0]);
        const scheduledMin = parseInt(scheduledTimeSplit[1]);

        // if the trip is early in the morning, pretend like it's impossibly
        // late at night, e.g. 2am -> 24am
        if (scheduledHour < 3) {
            scheduledHour += 24;
        }

        if (currentHour < scheduledHour) {
            return true;
        } else if (currentHour == scheduledHour) {
            return currentMin <= scheduledMin;
        } else {
            return false;
        }
    },

    arrivalDayMatches: function(arrival) {
        const day = getDayString();
        return day == arrival.type;
    },

    getTimeToArrival: function(time) {
        const now = new Date();
        const currentHour = parseInt(now.getHours());
        const currentMinutes = parseInt(now.getMinutes());

        const timeSplit = time.split(":");
        const otherHour = parseInt(timeSplit[0]);
        const otherMinutes = parseInt(timeSplit[1]);

        let hourDifference = otherHour - currentHour;
        let minuteDifference = otherMinutes - currentMinutes;

        if (minuteDifference < 0) {
            hourDifference = hourDifference - 1;
            minuteDifference = minuteDifference + 60;
        }

        if (hourDifference == 0) {
            return minuteDifference + "m";
        } else {
            return hourDifference + "h " + minuteDifference + "m";
        }
    },

    trimHeadsign: function(headsign_list) {
        let route_index = headsign_list.indexOf("Route");
        let headsign_minus_route =
            headsign_list.slice(route_index + 2, headsign_list.length);
        let headsign_fixed = headsign_minus_route.join(" ");

        headsign_fixed = headsign_fixed.replace("-", " ");
        headsign_fixed = headsign_fixed.trim();
        return headsign_fixed;
    }
}
