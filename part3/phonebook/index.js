const express = require('express')
const morgan = require('morgan')
require('dotenv').config()
const PhoneBook = require('./model/phonebook')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(':method :url :status :res[content-length] :response-time ms  :body')
)

app.get('/', (req, res) => {
  res.send(
    `<h3>This phonebook has info for ${
      persons.length
    } people </h3><br>${new Date().toUTCString()}`
  )
})
app.get('/api/persons', (req, res) => {
  PhoneBook.find({}).then((person) => {
    res.json(person)
  })
})
app.get('/api/persons/:id', (req, res, next) => {
  PhoneBook.findById(req.params.id)
    .then((p) => {
      if (p) {
        res.json(p)
      } else {
        res.status(400).end()
      }
    })
    .catch((error) => next(error))
})
app.delete('/api/persons/:id', (req, res, next) => {
  PhoneBook.findByIdAndRemove(req.params.id)
    .then((p) => {
      res.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})
app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) {
    return res.status(400).json({ error:'name must enterd'})
  } else if (!body.number) {
    return res.status(400).json({ error:'enter phone number'})
  }
  PhoneBook.findOne({name:req.body.name,number:req.body.number},{runValidators:true,context:'query'}).then((p)=>{
    if(p){
      return res.status(400).json({ error:'Name and phone number exits'})
    }else{
      const NewPerson = new PhoneBook({
        name: body.name,
        number: body.number,
      })
      NewPerson.save()
        .then((savedPerson) => {
          res.json(savedPerson)
        })
      
        .catch((error) => next(error))
    }
  }).catch((error)=>{
    next(error)
  })

})
app.put('/api/persons', (req, res, next) => {
  PhoneBook.findOneAndUpdate(
    { name: req.body.name },
    { number: req.body.number },
    {runValidators:true,context:'query'}
  )
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => {
      next(error)
    })
})
const errorHandel = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({error:'id not found' })
  }
  if(error.name==='ValidationError'){
    console.log(error.message.split(':')[2])
    return  res.status(400).json({error:error.message.split(':')[2]})
  //res.status(400).send(error.message.split(':')[2])
  }
  next(error)
}
app.use(errorHandel)
const PORT = process.env.PORT
app.listen(PORT)

console.log(`server running on port ${process.env.PORT}`)
