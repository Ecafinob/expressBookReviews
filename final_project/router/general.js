const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
   // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book){
    return res.status(404).json({
      message:"Livre non trouvé"
    });
  }
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
  if(booksByAuthor.length === 0){
    return res.status(404).json({
      message:"Livre non trouvé"
    });
  }
  return res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle =Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
  if(booksByTitle.length === 0){
    return res.status(404).json({
      message:"Livre non trouvé"
    });
  }
  return res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(!book){
    return res.status(404).json({
      message:"Livre non trouvé"
    });
  }
  return res.status(200).json(book.reviews);
});

//Routes avec axios

//Tâche 10 liste des livres
// public_users.get("/", async(req,res) =>{
//   try{
//     const response = await axios.get("http://localhost:5000/");
//     res.status(200).json(response.data);
//   }catch(error){
//     res.status(500).json({
//       message:"Erreur lors de la récupération des livres"
//     });
//   }
// });

//Tâche 11 obtenir un livre par son ISBN
// public_users.get("/isbn/:isbn", async (req,res) =>{
//   try{
//     const isbn = req.params.isbn;
//     const reqponse = await axios.get(`http://localhost:5000/isbn/${isbn}`);
//     res.status(200).json(response.data);
//   }catch(error){
//     res.status.apply(404).json({
//       message:"Livre non trouvé"
//     });
//   }
// });

//Tâche 12 : obtenir les livres par auteur
// public_users.get("/author/:author", async (req,res) =>{
//   try{
//     const author = req.params.author;
//     const response = await axios.get(`http://localhost:5000/author/${author}`);
//   res.status(200).json(response.data);
//   }catch(error){
//     res.status(404).json({
//       message: "Livre non trouvé"
//     });
//   }
// });

//Tâche 13: obtenir les livres par titre
// public_users.get("/title/:title", async (req, res) =>{
//   try{
//     const title = req.params.title;
//     const response = await axios.get(`http://localhost:5000/title/${title}`);
//     res.status(200).json(response.data);
//   }catch(error){
//     res.status(404).json({
//       message: "Livre non trouvé"
//     });
//   }
// });

module.exports.general = public_users;
