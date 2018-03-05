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
    "/basePath/proxyone/test": {
        target: "http://localhost:3000/prifex",
        pathRewrite: {
            "^/basePath/proxyone": "proxy"
        }
    }
}