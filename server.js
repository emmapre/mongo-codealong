import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/books'
mongoose.connect(mongoUrl, { userNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Author = mongoose.model('Author', {
  name: String,
})


const Book = mongoose.model('Book', {
  title: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    //vilken den relaterar till
    ref: 'Author',
  }
})



if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    //annars skapas nya författare hela tiden, detta gör att det blir tomt varje gång funktionen körs och sen fylls på igen
    await Author.deleteMany()
    await Book.deleteMany()

    const tolkien = new Author({ name: 'J.R.R Tolkien' })
    await tolkien.save()

    const rowling = new Author({ name: 'JK Rowling' })
    await rowling.save()


    await new Book({
      title: 'Harry Potter 1',
      author: rowling,
    }).save()
    await new Book({ title: 'Harry Potter 2', author: rowling, }).save()
    await new Book({ title: 'Harry Potter 3', author: rowling, }).save()
    await new Book({ title: 'Harry Potter 4', author: rowling, }).save()
    await new Book({ title: 'Harry Potter 5', author: rowling, }).save()
    await new Book({ title: 'Harry Potter 6', author: rowling, }).save()
    await new Book({ title: 'Harry Potter 7', author: rowling, }).save()
    await new Book({
      title: 'The Hobbit',
      author: tolkien,
    }).save()
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('authors/:id', async (erq, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObejctId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
}
)

app.get('/books', async (req, res) => {
  const books = await Book.find().populate('author')
  res.json(books)
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
