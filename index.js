const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
		const reviewCollection = client.db('nikahPhotography').collection('reviews');

		// creating services to database
		app.post('/services', async (req, res) => {
			const service = req.body;
			// console.log(service);
			const result = await serviceCollection.insertOne(service);
			res.send(result);
		});

		// reading only 3 services from database
		app.get('/limited-services', async (req, res) => {
			const query = {};
			const cursor = serviceCollection.find(query).sort({ _id: -1 });
			const services = await cursor.limit(3).toArray();
			res.send(services);
		});

		// reading only 3 services from database
		app.get('/services', async (req, res) => {
			const query = {};
			const cursor = serviceCollection.find(query).sort({ _id: -1 });
			const services = await cursor.toArray();
			res.send(services);
		});

		// reading only single service from database
		app.get('/services/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const service = await serviceCollection.findOne(query);
			res.send(service);
		});

		// creating reviews

		app.post('/reviews', async (req, res) => {
			const review = req.body;
			console.log([{ review, time: new Date() }]);
			const result = await reviewCollection.insertMany([{ review: review, time: new Date() }]);
			res.send(result);
		});

		// getting reviews
		app.get('/reviews', async (req, res) => {
			let query = {};
			if (req.query.service) {
				query = { 'review.serviceId': req.query.service };
			}
			const cursor = reviewCollection.find(query).sort({ time: -1 });
			const reviews = await cursor.toArray();
			res.send(reviews);
		});

		// getting users review

		app.get('/my-reviews', async (req, res) => {
			let query = {};
			if (req.query.email) {
				query = { 'review.email': req.query.email };
			}
			const cursor = reviewCollection.find(query);
			const reviews = await cursor.toArray();
			res.send(reviews);
		});

		app.get('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const review = await reviewCollection.findOne(query);
			res.send(review);
		});

		// updating existing reviews

		app.patch('/reviews/:id', async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const review = req.body;

			const updatedReview = {
				$set: {
					review: review,
				},
			};

			const result = await reviewCollection.updateOne(query, updatedReview);
			res.send(result);
		});
	} finally {
	}
}

run().catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.send('Assignment 11 server running');
});

app.listen(port, () => {
	console.log(`Running server on ${port}`);
});
