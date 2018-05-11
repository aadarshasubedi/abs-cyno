function proxy_cookie_path(oldCookie) {
    var oldCookieItems = oldCookie[0].split(';')
    var newCookie = '';
    for (var i = 0; i < oldCookieItems.length; ++i) {
        if (newCookie.length > 0)
            newCookie += ';'
        if (oldCookieItems[i].indexOf('Path=') >= 0)
            newCookie += 'Path=/'
        else
            newCookie += oldCookieItems[i];
    }
    return newCookie;
}

const proxyHost = 'http://192.168.20.17:8080';
//const proxyHost = 'http://192.168.70.39:8001';

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
    "/cyno/cynoweb": {
        target: proxyHost,
        "secure": false,
        onProxyRes: function (proxyRes, req, res) {
            let oldCookie = proxyRes.headers['set-cookie'];
            if (oldCookie == null || oldCookie.length == 0) {
                delete proxyRes.headers['set-cookie']
                return
            }
            proxyRes.headers['set-cookie'] = [proxy_cookie_path(oldCookie)];
        }
    },

    "/cyno/abswebapp": {
        target: proxyHost,
        "secure": false,
        onProxyRes: function (proxyRes, req, res) {
            let oldCookie = proxyRes.headers['set-cookie'];
            if (oldCookie == null || oldCookie.length == 0) {
                delete proxyRes.headers['set-cookie']
                return
            }
            proxyRes.headers['set-cookie'] = [proxy_cookie_path(oldCookie)];
        }
    },

    '/login2': {
        target: proxyHost + "/cyno/"
    },

    '/system' : {
        target: proxyHost + "/cyno/"
    },
    '/login':  {
        target: proxyHost + "/cyno/",
        "secure": false,
        onProxyRes: function (proxyRes, req, res) {
            let oldCookie = proxyRes.headers['set-cookie'];
            if (oldCookie == null || oldCookie.length == 0) {
                delete proxyRes.headers['set-cookie']
                return
            }
            proxyRes.headers['set-cookie'] = [proxy_cookie_path(oldCookie)];
        }
    },

    '/cyno/webbase': {
        target: proxyHost,
        "secure": false,
        onProxyRes: function (proxyRes, req, res) {
            let oldCookie = proxyRes.headers['set-cookie'];
            if (oldCookie == null || oldCookie.length == 0) {
                delete proxyRes.headers['set-cookie']
                return
            }
            proxyRes.headers['set-cookie'] = [proxy_cookie_path(oldCookie)];
        }
    },

    '/imag/output/': {
        target: "http://localhost:8000/"
    }
}