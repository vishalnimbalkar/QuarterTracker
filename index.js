require('dotenv').config();
const http = require('http');
const path = require('path');
const express = require('express');
const facultyRoutes = require('./routes/faculty.js');
const authRoutes = require('./routes/auth.js');
const quarterRoutes = require('./routes/quarter.js');

const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'utilities', 'templates'));
app.use('/images', express.static(path.join(__dirname, 'utilities/images')));
app.use(express.json());

app.use('/faculty', facultyRoutes);
app.use('/auth', authRoutes);
app.use('/quarter', quarterRoutes);

const server = http.createServer(app);
server.listen(port, () => {
	console.log(`Server running on port : ${port}`);
});
