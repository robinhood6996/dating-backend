const express = require('express')
const app = express()
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.route');
app.get('/', function (req, res) {
  res.send('Hello World')
});

mongoose.connect('mongodb+srv://datingadmin:NpLYVfeoUw591sFF@cluster0.oulrk.mongodb.net/dating?retryWrites=true&w=majority').then(() => console.log('Connected')).catch(() => {
    console.log('Error establishing db connection')
})
app.listen(3000);

app.use('/api/auth', authRoutes);



// mongodb+srv://<username>:<password>@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority