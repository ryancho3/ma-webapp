
module.exports = function(req, res, next) {

    var requestProtocol = req.protocol;
    var headerProtocol = req.headers['X-Forwarded-Proto']; // 'http' | 'https' as populated by AWS Elastic Load Balancer

    // Redirect https => http
    if (requestProtocol === 'https' || headerProtocol === 'https') {

        var httpsUrl = 'https://' + request.headers.host;
        return res.redirect(301, httpsUrl);
    }

    return next();
}
