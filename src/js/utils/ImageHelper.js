const getFileBlob = function (url, cb) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function () {
        cb(xhr.response);
    });
    xhr.send();
};

const blobToFile = function (blob, filePathOrUrl, name) {
    blob.lastModified = Date.now();
    blob.lastModifiedDate = new Date(blob.lastModified);
    blob.path = filePathOrUrl;
    blob.name = name;
    return blob;
};

export const getFileObject = function (filePathOrUrl, newFileName, cb) {
    getFileBlob(filePathOrUrl, function (blob) {
        cb(blobToFile(blob, filePathOrUrl, newFileName));
    });
};

export const getFileObjects = async function (filePathsOrUrls = [], newFileNames = [], cb) {
    if (filePathsOrUrls?.length !== newFileNames?.length) cb(null);
    const blobs = await new Promise(async (resolve, reject) => {
        const _blobs = [];
        for (let i = 0; i < filePathsOrUrls?.length; i++) {
            const blob = await getFileObjectPromise(filePathsOrUrls[i], newFileNames[i]);
            _blobs.push(blob);
        }
        resolve(_blobs);
    });
    cb(blobs);
};

async function getFileObjectPromise(filePathOrUrl, newFileName) {
    return new Promise((resolve, reject) => {
        getFileObject(filePathOrUrl, newFileName, resolve);
    })
}