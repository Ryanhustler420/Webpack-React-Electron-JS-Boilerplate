// This class help us to split elements into chunks of array

class ObjectGrouper {

    constructor() {
        this.rawArray = [];
        this.groupedArrayList = [];
    }

    takeObjects(els = []) {
        this.rawArray.push(...els);
        return this;
    }

    groupedInto(chunkSize = 20) {
        if (chunkSize == 0) return this;
        if (chunkSize < this.rawArray?.length) {
            let temp = [];
            for (let index = 0; index < this.rawArray?.length; index++) {
                const element = this.rawArray[index];
                temp.push(element);
                if (index == (this.rawArray?.length - 1) || (index + 1) % chunkSize == 0) {
                    this.groupedArrayList.push(temp);
                    temp = [];
                }
            }
        } else this.groupedArrayList.push(this.rawArray);
        return this;
    }

    getGroupedArrayList() {
        return this.groupedArrayList;
    }

}

export default ObjectGrouper;