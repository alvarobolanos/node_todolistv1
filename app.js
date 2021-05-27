const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

// Creating Database
mongoose.connect('mongodb://localhost:27017/todoDB', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

// Reporting on dabase connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Connected to database.");
});

// Create Schema
const itemsSchema = new mongoose.Schema({
	itemTitle: String
});

const listSchema = new mongoose.Schema({
	listTitle: String,
	items: [itemsSchema]
});

// Create Model
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

// Instantiate the app.
const app = express();

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({
	extended: true
}))

// Serve static files
app.use(express.static("public"))

// Routes
app.get("/", function (req, res) {
	List.countDocuments({}, function(err, count){
		if(!err){
			if (count === 0){
				const newList = new List({
					listTitle: "ToDo",
					items: []
				});
				newList.save();
				res.redirect("/");
			} else {
				List.findOne({listTitle: "ToDo"}, function(err, foundList) {
					if(!err){
						res.render('list', {
							listTitle: foundList.listTitle,
							items: foundList.items
						});
					} else {
						console.log(err);
					};
				});
			};
		} else {console.log(err)};
	});
});

app.post("/", function (req, res) {
	const itemInput = req.body.item;
	const listTitle = req.body.listTitle;
	
	const item = new Item({itemTitle: itemInput});
	
	List.findOne({listTitle: listTitle}, function(err, foundList){
		if(!err) {
			foundList.items.push(item)
			foundList.save();
			res.redirect("/");
		} else {
			console.log(err);
		};
	});
});


app.post("/delete", function (req, res) {
	const checkedItemId = req.body.checkbox;
	const listTitle = req.body.listName;

	List.findOneAndUpdate({listTitle:listTitle}, {$pull:{items: {_id: checkedItemId}}}, function(err, doc){
		if(err) {
			console.log(err);
		} else {
			console.log("Removed: " + doc);
			res.redirect("/");
		}
	});

})


app.listen(3000, function () {
	console.log("Server started on port 3000");
});