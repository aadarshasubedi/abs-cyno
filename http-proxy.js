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
    "/cyno/cynoweb": {//
        target: "http://192.168.70.39:8001"
        //target: "http://192.168.20.17:8080"
    }
}