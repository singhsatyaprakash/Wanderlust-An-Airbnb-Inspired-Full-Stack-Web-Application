const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    //automatically username and password section in defined in passport package...
    email:{
        type:String,
        require:true,
    }
});
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',userSchema); 