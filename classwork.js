//Boiler plate code from Express docs on how to make a server
//npm install express --save//install the necessary package
const app = require("express")();//create a new instance of the application-must invoke the function so we can execute the methods
const port = 1337; //leet!
app.get("/", (req, res) => {//This is the method. App.method(path, handler)
  res.status(200);
  res.send("Welcome to Express.js!");
});
app.listen(port, () => console.log(`Express running on port ${port}.`));

//On line 5, this could be app.get, app.post, app.put, or any other type of request