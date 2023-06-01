function timeWord(timeString) {
    let hourString;
    let minuteString;
    let partOfDay;

    const onesKey = {
        "0": "twelve",
        "1": "one",
        "2": "two",
        "3": "three",
        "4": "four",
        "5": "five",
        "6": "six",
        "7": "seven",
        "8": "eight",
        "9": "nine"
    };
    const tensKey = {
        "0": "oh",
        "2": "twenty",
        "3": "thirty",
        "4": "fourty",
        "5": "fifty",
    };
    const militaryTimeKey = {
        "12": "twelve",
        "13": "one",
        "14": "two",
        "15": "three",
        "16": "four",
        "17": "five",
        "18": "six",
        "19": "seven",
        "20": "eight",
        "21": "nine",
        "22": "ten",
        "23": "eleven"

    }
    const specialKey = {
        "10": "ten",
        "11": "eleven",
        "12": "twelve",
        "13": "thirteen",
        "14": "fourteen",
        "15": "fifteen",
        "16": "sixteen",
        "17": "seventeen",
        "18": "eighteen",
        "19": "nineteen"
    };


    let hourNum = Number(timeString[0] + timeString[1]);
    let minuteNum = Number(timeString[3] + timeString[4]);

    if (hourNum < 1 && minuteNum < 1) {
        return "midnight";
    }
    if (hourNum === 12 && minuteNum < 1) {
        return "noon";
    }
    if (hourNum >= 12) {
        partOfDay = "pm";
        hourString = militaryTimeKey[hourNum];
    } else {
        partOfDay = "am";
        (hourNum < 10 ? hourString = onesKey[hourNum] : hourString = specialKey[hourNum]);
    };

    if (minuteNum < 1) {
        minuteString = "o'clock";
    } else if (minuteNum > 9 && minuteNum < 20) {
        minuteString = specialKey[minuteNum];
    } else if (timeString[4] === "0") {
        minuteString = tensKey[timeString[3]];
    } else {
        minuteString = tensKey[timeString[3]] + " " + onesKey[timeString[4]];
    }

    return hourString + " " + minuteString + " " + partOfDay
};

module.exports = { timeWord };