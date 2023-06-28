module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testEnvironmentOptions: {
        url: 'http://localhost:3000'
    }

};
