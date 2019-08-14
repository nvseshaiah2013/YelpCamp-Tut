var mongoose = require('mongoose');

var campSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        description: String,
        comments:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Comment"
            }
        ]
    });
//Creating Model for Schema
module.exports = mongoose.model("Camp", campSchema);