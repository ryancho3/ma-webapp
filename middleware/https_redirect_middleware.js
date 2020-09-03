
module.exports = function(req, res, next) {

    var headerProtocol = req.headers['X-Forwarded-Proto']; // 'http' | 'https' as populated by AWS Elastic Load Balancer

    // Redirect https => http
    if (headerProtocol === 'http') {

        var httpsUrl = 'https://' + request.headers.host;
        return res.redirect(301, httpsUrl);
    }

    return next();
}
