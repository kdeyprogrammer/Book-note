
import express from 'express'

import bodyParser from 'body-parser'
import { getAllBooks , addNewBook,showAddBook, 
   showEditBook,UpdateBook, deleteBook} from './Controller/bookControler.js'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(
  "/bootstrap",
  express.static("node_modules/bootstrap/dist")
);

app.get('/home',getAllBooks)

app.get('/add',showAddBook)

// app.get('/note/:book_id',note)
app.get("/sort",getAllBooks)

app.post("/book/new",addNewBook)

app.get("/edit/:id",showEditBook)

app.post("/edit/:id",UpdateBook)


app.post("/delete/:id",deleteBook)

app.listen(port , ()=> console.log(`server running on ${port}`))