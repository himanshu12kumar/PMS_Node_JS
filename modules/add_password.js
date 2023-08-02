var mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/pms',{useNewUrlParser: true, useUnifiedTopology: true});
var conn = mongoose.Collection;
var passSchema = new mongoose.Schema({
   password_category: {
    type: String,
    required: true,
   },
    project_name: {
        type: String,
        required: true,
       },
   password_detail: {
    type: String,
    required: true,
   },
    date:{
        type: Date,
        default: Date.now
    }    


});

var passModel = mongoose.model('password_details', passSchema);

module.exports = passModel;