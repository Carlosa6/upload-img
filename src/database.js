const mongoose = require('mongoose');

const MONGODB_URI = `mongodb://localhost/imgupload`;

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
})
.then(db => console.log('Database is connected'))
.catch(err => console.log(err));