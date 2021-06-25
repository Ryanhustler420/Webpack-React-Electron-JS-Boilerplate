// Helps to save data to browser storage

class Storage {

    static setItem(key, value) {
        if (!value) return null;
        const sValue = JSON.stringify(value);
        localStorage.setItem(key, sValue);
        return this;
    }

    static getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : {}
    }

}

export default Storage;