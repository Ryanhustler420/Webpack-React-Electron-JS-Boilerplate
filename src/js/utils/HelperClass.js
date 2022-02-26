import * as luxon from 'luxon';
import * as pluralize from 'pluralize';

class HelperClass {

    static #TIME_UNITS = { 'year': 'year', 'years': 'years', 'quarter': 'quarter', 'quarters': 'quarters', 'month': 'month', 'months': 'months', 'week': 'week', 'weeks': 'weeks', 'day': 'day', 'days': 'days', 'hour': 'hour', 'hours': 'hours', 'minute': 'minute', 'minutes': 'minutes', 'second': 'second', 'seconds': 'seconds', 'millisecond': 'millisecond', 'milliseconds': 'milliseconds' };

    static abbreviateNumber(value) {
        var newValue = value;
        if (value >= 1000) {
            var suffixes = ["", "k", "m", "b", "t"];
            var suffixNum = Math.floor(("" + value)?.length / 3);
            var shortValue = '';
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
                if (dotLessShortValue?.length <= 2) { break; }
            }
            if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
            newValue = shortValue + suffixes[suffixNum];
        }
        return newValue;
    }

    static capitalize(str) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr?.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    static parseTimestampFromMongoId(mongoId = "60feccbb1fdfa749dc665004") {
        const timestamp = mongoId.toString().substring(0, 8);
        return new Date(parseInt(timestamp, 16) * 1000).toLocaleDateString();
    }

    static encodeUrl = (url = '') => {
        return url.replaceAll(' ', '%20');
    }

    static spoofOldCachedImage = (url) => {
        return this.encodeUrl(url) + `?${new Date().getTime()}`
    }

    // returns the difference from the data which this function receives and today,
    static getPassed(from = new Date().toISOString(), unitOfTime = this.#TIME_UNITS.days) {
        const createdAt = luxon.DateTime.fromISO(from);
        const today = luxon.DateTime.fromISO(new Date().toISOString());
        return today.diff(createdAt, unitOfTime).toObject();
    }

    static isTimePassed(from = new Date().toISOString(), unitOfTime = this.#TIME_UNITS.days, isItCoverThis = 0) {
        return this.getPassed(from, unitOfTime)[unitOfTime] >= isItCoverThis;
    }

    static getCurrenTime() {
        return new Date().toISOString();
    }

    static getTimePassed(from = new Date().toISOString()) {
        const now = luxon.DateTime.fromISO(new Date().toISOString());
        const timePassed = this.getPassed(from, this.#TIME_UNITS.days);
        return now.minus({ ...timePassed }).toRelative(); //.toRelativeCalendar();
    }

    static getDateFromCreatedAt(createdAt = new Date().toISOString()) {
        return createdAt.split("T")[0];
    }

    static urlContainsHttpKeyword(url = '') {
        return url.includes("Http://") || url.includes("Https://") || url.includes("http://") || url.includes("https://");
    }

    static decideAppropriateUrlAmong(url = '') {
        if (url == '') url = '...';
        return this.urlContainsHttpKeyword(url) ? url : '...';
    }

    static urlsContainsHttpKeyword(urls = ['']) {
        for (let c of urls)
            if (this.urlContainsHttpKeyword(c))
                return true;
        return false;
    }

    static truncateTripleDot = (string = '', afterChar = 10) => {
        return string.substring(0, afterChar) + '...';
    }

    static decideAppropriateUrlsAmong(urls = ['']) {
        return this.urlsContainsHttpKeyword(urls) ? urls : '...';
    }

    static refineDecimalAndGroup(x = '') {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    static hasOnlyNumericValue(value = '') {
        return new RegExp('^[0-9]+$').test(value);
    }

    static noun(noun, quantity = 0) {
        return pluralize(noun, quantity);
    }

    static isUserValid(user) {
        return true;
    }

}

export default HelperClass;