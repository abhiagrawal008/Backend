const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection details
const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "cms_lab";

const client = new MongoClient(mongoURL);
let postsCollection;

async function connectDB() {
    await client.connect();

    const database = client.db(dbName);
    postsCollection = database.collection("posts");

    console.log("Connected to MongoDB");
}

app.set("view engine", "ejs");

// Parse data submitted through HTML forms
app.use(express.urlencoded({ extended: true }));

// Serve the CSS file
app.use(express.static("public"));

// Format a date like "26 September 2026"
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

// Make formatDate available in every EJS template
app.locals.formatDate = formatDate;

// Save the current path so the navbar can highlight the active link
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Home page redirects to the post list
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// Display all posts (only title, author and date - not the content)
app.get("/posts", async (req, res) => {
    const posts = await postsCollection
        .find({}, { projection: { title: 1, author: 1, createdAt: 1 } })
        .sort({ createdAt: -1 })
        .toArray();

    res.render("posts", { posts });
});

// Display the create-post form
app.get("/posts/new", (req, res) => {
    res.render("new-post", { error: null, post: {} });
});

// Create a new post
app.post("/posts", async (req, res) => {
    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    const author = (req.body.author || "").trim();

    // Validation - none of the fields can be empty
    if (!title || !content || !author) {
        return res.status(400).render("new-post", {
            error: "Title, content and author are all required.",
            post: { title, content, author }
        });
    }

    await postsCollection.insertOne({
        title: title,
        content: content,
        author: author,

        // Generate the creation time on the server
        createdAt: new Date()
    });

    res.redirect("/posts");
});

// Display one complete post using its MongoDB _id
app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;

    // Check that the id is a valid ObjectId before searching
    if (!ObjectId.isValid(id)) {
        return res.status(404).render("not-found");
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
        return res.status(404).render("not-found");
    }

    res.render("post", { post });
});

// Display the edit form with the post's current values
app.get("/posts/:id/edit", async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).render("not-found");
    }

    const post = await postsCollection.findOne({ _id: new ObjectId(id) });

    if (!post) {
        return res.status(404).render("not-found");
    }

    res.render("edit-post", { error: null, post });
});

// Save the edited post
// (HTML forms can only send GET or POST, so the update uses POST)
app.post("/posts/:id/edit", async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(404).render("not-found");
    }

    const title = (req.body.title || "").trim();
    const content = (req.body.content || "").trim();
    const author = (req.body.author || "").trim();

    // Same validation as creating a post
    if (!title || !content || !author) {
        return res.status(400).render("edit-post", {
            error: "Title, content and author are all required.",
            post: { _id: id, title, content, author }
        });
    }

    const result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                title: title,
                content: content,
                author: author,

                // createdAt stays the same, the server records when it was edited
                updatedAt: new Date()
            }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).render("not-found");
    }

    res.redirect(`/posts/${id}`);
});

// Start the server only after MongoDB is connected
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Could not connect to MongoDB:", err.message);
    });
