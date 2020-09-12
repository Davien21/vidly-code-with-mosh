const express = require('express');
const app = express();

const genres = require('./routes/genres');
app.use(express.json());
app.use('/api/genres',genres); //use the genres router

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(
		`Server running at http://localhost:${port}/api/genres`
	);
})

