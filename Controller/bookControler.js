import pg from 'pg'

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "567890",
    port: 5432

})

db.connect()
    .then(() => console.log("Connect to PostgresSQL"))
    .catch((err) => console.error("Database error", err))
export async function getAllBooks(req, res) {
    try {
        const sort = req.query.sort;
        let query;

        if (sort === "rating") {
            query = "select * from book order by rating asc"
        }
        else if (sort === "recent") {
            query = "select * from book order by read_date desc"
        }
        else {
            query = "select * from book order by  book_id asc"
        }
        const result = await db.query(query)
        res.render("index.ejs", {
            book: result.rows
        })

    } catch (err) {
        console.error(err)
        res.status(500).send("Database error")
    }

}

export function showAddBook(req, res) {
    res.render("add.ejs")

}

export async function note(req, res) {

    const bookID = req.params.book_id
    const result = await db.query("select note from book where book_id = $1", [bookID])
    const books = result.rows;

    res.render("note.ejs", {
        book: books
    })
}
// add new book

export async function addNewBook(req, res) {

    try {
        const { title, author, rating, note, isbn, read_date, description } = req.body;

        await db.query(
            `insert into book (title,author,rating,note,isbn,read_date,description) 
        values($1,$2,$3,$4,$5,$6,$7)`
            , [title, author, rating, note, isbn, read_date, description])


        res.redirect('/home')
    } catch (err) {
        console.error('Faild to add book, ', err)
        res.send('Faild to add book')
    }
}


export async function showEditBook(req, res) {
    const { id } = req.params
    const result = await db.query("select *from book where book_id = $1", [id])
    const book = result.rows[0]

    res.render("edit.ejs", { book })
}
export async function UpdateBook(req, res) {

    try {

        const { id } = req.params
        const { title, author, rating, note, isbn, read_date, description } = req.body;

        await db.query(
            `update book
            set title = $1,
                author = $2,
                rating = $3,
                note= $4,
                isbn= $5,
                read_date = $6,
                description = $7

            where book_id = $8
            `
            , [title, author, rating, note, isbn, read_date, description, id]
        )

        res.redirect("/home")
    } catch (err) {
        console.error("Failed to update book!", err)
        res.send("Faild to update book")
    }


}

export async function deleteBook(req, res) {

    try {
        const { id } = req.params

        await db.query("delete  FROM book WHERE book_id = $1", [id])

        res.redirect("/home")
    } catch (err) {
        console.error("Failed to delete", err)
        res.send("Failed to delete")
    }

}



