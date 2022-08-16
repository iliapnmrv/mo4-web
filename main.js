import 'dotenv/config'
import express from 'express';
import expressNtlm from 'express-ntlm';
import jwt from 'jsonwebtoken'

var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(expressNtlm({
    debug: function() {
        var args = Array.prototype.slice.apply(arguments);
        console.log.apply(null, args);
    },
    // domain: process.env.domain,
    // domain: process.env.domaincontroller,
    domain: undefined,
    domaincontroller: undefined,

    // use different port (default: 389)
    // domaincontroller: 'ldap://myad.example:3899',
}));

// function parseCookies(request) {
//     var list = {},
//         rc = request.headers.cookie;

//     rc && rc.split(';').forEach(function(cookie) {
//         var parts = cookie.split('=');
//         list[parts.shift().trim()] = decodeURI(parts.join('='));
//     });

//     return list;
// }

app.all('*', function(request, response) {


    const { ntlm } = request;

    if (ntlm == null) {
        console.log("null");
    }

    const accessToken = jwt.sign({ username: ntlm.UserName, workstation: ntlm.Workstation }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '7d' })
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    console.log(accessToken, refreshToken);

    // response.cookie('user', asd.UserName);

    // var cookies = parseCookies(request);
    // console.log(cookies);
    //response.redirect('http://localhost:8082/');
    // response.end(JSON.stringify(request.ntlm)); 
    // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
    // response.sendFile(`${__dirname}/public/index.html`);
    response.render('index', { title: 'Портал МО-4', message: 'Добро пожаловать ' + ntlm.UserName }).json({ accessToken, refreshToken });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.header['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(process.env.PORT, () => console.log(`runnin on port, ${process.env.PORT}`));