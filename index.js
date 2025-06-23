require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const { checkConnection } = require('./config/database');
const { sendCredentials } = require('./services/email');
const authRoutes = require('./routes/auth.js');

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'utilities', 'templates'));
app.use('/images', express.static(path.join(__dirname, 'utilities/images')));
app.use(express.json());

app.use('/auth', authRoutes);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
checkConnection();

// sendCredentials('rushisatpute473@gmail.com', 'rushi satpute', "rushi@123");