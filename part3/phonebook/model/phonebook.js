const mongoose=require('mongoose')
const url=process.env.MONGO_URI
console.log('conecting to ..', url)
mongoose.connect(url).then(()=>{console.log('connection succesful')}).catch((err)=>{console.log('error connecting',err.message)})
const nameValide=(name)=>{
  return name.length>=3
}
const phoneValidate=(number)=>{
  if (number.length >= 8 && !/[a-z]/gi.test(number)) {
    if (number.length === 8) {
      return number.includes('-')?false:true
       
      
    }
    else if(number.length>8&&!number.includes('-')){
      return true
    }
    else {
      let a = number.slice(0, number.indexOf('-'))
      let b = number.slice(number.indexOf('-') + 1)

      return a.length === 2 && !a.includes('-') && !b.includes('-')
        ? true
        : a.length === 3 && !a.includes('-') && !b.includes('-')
          ? true
          : false
    }
  }

  return false
}
const phoneSchema=new mongoose.Schema({
  name: {type:String,required:true,validate:[nameValide,'Name must be minimum 3 characters']},
  number: {type:String,required:true,validate:[phoneValidate,'Invalid phone number format']},
})
phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports=mongoose.model('PhoneBook',phoneSchema)