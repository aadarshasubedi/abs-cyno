module.exports = {
    "/proxy/test": {
        target: "http://localhost:3000/prifex"
    },
    "/basePath/proxy/test": {
        target: "http://localhost:3000/prifex",
        pathRewrite: {
            "^/basePath": ""
        }
    },
    "/cyno/cynoweb/pdcalc/initPdCalsResult.do": {
        target: "http://192.168.20.17:8080"
    }
}