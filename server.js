// Import the app module
const app = require('./app2');
require('dotenv').config()


// Define the port the server will run on
//console.log(process.env.PORT)
const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
