const fs = require('fs');
module.exports = {
    pathname: '/',
    method: 'GET',
    run: async (client, req, res, parsed) => {
        res.writeHead(200, {
            // 'strict-transport-security': 'max-age=86400; includeSubDomains; preload',
            'content-type': 'text/html; charset=UTF-8'
        });
        fs.readFile('./assets/html/root.html', 'utf8', (err, data) => {
            res.end(data.replace(/{redirect}/gi, process.env.REDIRECT).replace(/{client_id}/gi, client.user.id));
        });
    }
}