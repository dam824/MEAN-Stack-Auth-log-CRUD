const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI,(err) => {
    if(!err) { console.log ('MongoDB connection succeded'); }
    else { console.log ('Error in MongoDB connection : ' + JSON.stringufy(err, undefined, 2)); }
});


require ('./user.model');