const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

// database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yiwjyul.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	try {
		const serviceCollection = client.db('nikahPhotography').collection('services');

        // creating services to database
		app.post('/services', async (req, res) => {
			const service = req.body;
			// console.log(service);
			const result = await serviceCollection.insertOne(service);
			res.send(result);
        });
        
        // reading services from database

	} finally {
	}
}

run().catch((err) => console.log(err));

console.log(uri);

app.get('/', (req, res) => {
	res.send('Assignment 11 server running');
});

app.listen(port, () => {
	console.log(`Running server on ${port}`);
});
