var methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();

/*
    Database schema
    Title
    Image
    Body
    Date Created
*/

// App config
mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

//mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    img: String,
    body: String,
    created: {
        type: Date, 
        default: Date.now
    }
});
var Blog = mongoose.model("Blog", blogSchema);

// Restful Routes
app.get("/", (req, res)=>{
    res.redirect("/blogs");
});


app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

app.post("/blogs", (req, res)=>{
    // create
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show", {foundBlog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {foundBlog: foundBlog});
        }
    });
});

app.put("/blogs/:id", (req, res)=>{
    req.body.foundBlog.body = req.sanitize(req.body.foundBlog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.foundBlog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect(`/blogs/${req.params.id}`);
        }
    });
});

app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, ()=>{
    console.log("Server has started");
});


