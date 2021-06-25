import moment from "moment";

export const formatTimestamp = (timestamp) =>
    moment(parseInt(timestamp, 10)).fromNow();