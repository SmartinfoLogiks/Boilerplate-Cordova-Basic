const express = require('express');
const app = express();
const _PORT = 7777;

app.use(express.static('www'));
//app.use(express.static('files'));
//app.use('/dist', express.static('dist'));
//app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/cordova.js', (req, res) => {
    res.send("");
});

app.listen(_PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `MAPP Demo Server Running @ http://localhost:${_PORT}/`);
    console.log('\nOpen Chrome Browser and Enable Mobile Simulation. More information can be found at https://developers.google.com/web/tools/chrome-devtools/device-mode');
    console.log('\n\nHapping Coding ...');
});