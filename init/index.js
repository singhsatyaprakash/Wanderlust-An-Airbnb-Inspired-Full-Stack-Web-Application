
const mongoose=require("mongoose");
const initData=require("../init/data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

//connecting database...
main()
.then(()=>{
    console.log("Connected to Database Wanderlust.");
})
.catch((err)=>{
    console.log(err);

});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'67a9bce568a015d5a3455005'}));
    await Listing.insertMany(initData.data);
    console.log("Data was intitalized.");
}
initDB();