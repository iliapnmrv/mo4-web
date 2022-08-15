// const path = require('path');
var express = require('express'),
    ntlm = require('express-ntlm');

var app = express();

var asd;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(ntlm({
    debug: function() {
        var args = Array.prototype.slice.apply(arguments);
        console.log.apply(null, args);
    },
    domain: 'rb.local',
    domaincontroller: 'ldap://mo4-dc-01',

    // use different port (default: 389)
    // domaincontroller: 'ldap://myad.example:3899',
}));

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

app.all('*', function(request, response) {


    asd = request.ntlm;
    console.log("111");
    console.log(asd.UserName);
    console.log("222");

    console.log(asd);
    if (request.ntlm == null) 
    {
        console.log("null");
    }

    response.cookie('user', asd.UserName);
   
    var cookies = parseCookies(request);
    console.log(cookies);
    //response.redirect('http://localhost:8082/');
    // response.end(JSON.stringify(request.ntlm)); 
    // {"DomainName":"MYDOMAIN","UserName":"MYUSER","Workstation":"MYWORKSTATION"}
    // response.sendFile(`${__dirname}/public/index.html`);
    response.render('index', { title: 'Портал МО-4', message: 'Добро пожаловать ' + asd.UserName});
});

app.listen(3000);