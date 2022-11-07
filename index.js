const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('Assignment 11 server running');
});

app.listen(port, () => {
	console.log(`Running server on ${port}`);
});
