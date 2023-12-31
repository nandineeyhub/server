const mongoose = require("mongoose")
const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto")
const userSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim: true,
        maxLength:32
    },
    lastname:{
        type:String,
        required:true,
        trim: true,
        maxLength:32
    },
    username:{
        type:String,
        required:true,
        unique:true,
        trim: true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Role' 
    },
    salt:String
},{
    timestamps:true
})

userSchema.pre('save', function (next) {
  this.salt = uuidv1()
  this.password = securePassword(this.password, this.salt)
  next()
})




const securePassword = (plainpassword, salt)=>{
  console.log(plainpassword, "value")
      if(!plainpassword){
        console.log("invalid")
        return ""
      }
      try{
        console.log("this is working")
        return crypto.createHmac("sha256", salt).update(plainpassword).digest("hex")
      } catch(error){
        console.log("catch error")
        console.log(error.message)
      }
    }

// userSchema.methods.authenticate = (plainpassword)=>{
//   console.log(plainpassword, this.encry_password)
//   console( securePassword(plainpassword) == this.encry_password)
//   return securePassword(plainpassword) == this.encry_password
// }

userSchema.statics.authenticate = (plainpassword, salt, encry_password)=>{
  //  console.log(plainpassword, encry_password)
  //  console.log(securePassword(plainpassword, salt) == encry_password)
  return securePassword(plainpassword, salt) == encry_password
}

module.exports = mongoose.model("user", userSchema)