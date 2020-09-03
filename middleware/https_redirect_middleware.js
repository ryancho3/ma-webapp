
module.exports = function(req, res, next) {

    var headerHost = extractHostFromRequest(req);
    var headerProtocol = extractProtocolFromRequest(req);

    // Redirect http => https
    if (headerHost == 'matchbook.academy' && headerProtocol == 'http') {
        return res.redirect(301, 'https://matchbook.academy');
    }

    return next();
}

// HELPERS

function extractHostFromRequest (req) {
    return req.headers.host;
}

function extractProtocolFromRequest (req) {

    // NOTE: load balancer adds http header to tell if original request was 'http' or 'https'
    // Depending on the load balancer it could be lowercased or not.

    if (req.headers['x-forwarded-proto']) {
        return req.headers['x-forwarded-proto'];
    }

    if (req.headers['X-Forwarded-Proto']) {
        return req.headers['X-Forwarded-Proto'];
    }

    return null;
}
