require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const facultyRoutes = require('./routes/faculty.js');
const authRoutes = require('./routes/auth.js');
const quarterRoutes = require('./routes/quarter.js');
const contactRoutes = require('./routes/contact.js');
const requestRoutes = require('./routes/request.js');
const residentRoutes = require('./routes/resident.js');

const app = express();
const port = process.env.PORT;

// CORS config
const corsOptions = {
	origin: process.env.CLIENT_URL,
	methods: ['GET', 'POST', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
};

app.use(cors(corsOptions));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'utilities', 'templates'));
app.use('/images', express.static(path.join(__dirname, 'utilities/images')));
app.use(express.json());

app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/quarter', quarterRoutes);
app.use('/contact', contactRoutes);
app.use('/request', requestRoutes);
app.use('/resident', residentRoutes);

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server running on port : ${port}`);
});
