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
    }
}
