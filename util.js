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
    }
}
