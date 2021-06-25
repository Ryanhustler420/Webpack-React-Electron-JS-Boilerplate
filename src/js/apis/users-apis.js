// Populate these api with your logic

export const getCurrentUser = () => {
    return new Promise.resolve({ uid: 213, username: 'test-user', age: 21 });
}

export const getUserWithId = uid => {
    return new Promise.resolve({ uid: 11, username: 'test-user', age: 21 });
}