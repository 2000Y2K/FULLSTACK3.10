const express = require('express')
const app = express()
app.use(express.json());
app.use(express.static('build'))
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "55656666",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "66666666666",
      "id": 2
    }
  ]


app.get('/info', (req, res) => {
  const numb = persons.length
  const date = new Date()
  res.send(`Phonebook has info for ${numb} ****** \r${date}`)
})

app.get('/api/persons/', (request, response) => {
	response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const person = persons.find(person =>person.id === id)
  console.log(person)
  if (person){
  response.json(person)}
  else{
	  response.status(404).end()
  }
})


	// from the mozilla developer documents: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (max) => {
return Math.floor(Math.random() * Math.floor(max));
}

app.post('/api/persons/', (request, response) => {


	const body = request.body

	if (!body.name || !body.number) {
		return response.status(404).json({ 
		  error: 'content missing' 
		})
	  }

	if (persons.find(person=> person.name === body.name) ||persons.find(person => person.number === body.number)){
		return response.status(409).json({
			error: 'name or number already on the phonebook'
		})

	}

	const person = {
	  name: body.name,
	  number: body.number,
	  id: getRandomInt(1000),
	}

	persons = persons.concat(person)
	const answer = response.json(person)
  })


app.delete('/api/persons/:id', (request,response) =>{
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})