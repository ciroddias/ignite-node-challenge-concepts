const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers
  
  const user = users.find(user => user.username === username)

  if (user) {
    
    next()

  } else {

    response.status(400).json({erro: "User not found"})

  }
}

app.post('/users', (request, response) => {
  
  const { name, username } = request.body

  const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }

  users.push(user)
  
  response.status(201).json(user)
  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
 
  const { username } = request.headers
  const user = users.find(user => user.username === username)

  response.status(200).json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { username } = request.headers

  const user = users.find(user => user.username === username)
  
  task = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(task)

  response.status(201).json(task)

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { username } = request.headers;
  const { title, deadline } = request.body
  const { id } = request.params
  
  const user = users.find(user => user.username === username)
  const todo = user.todos.find(todo => todo.id === id)  

  todo.title = title;
  todo.deadline = deadline;

  response.status(200).json(todo)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { username } = request.headers
  const { id } = request.params

  const user = users.find(user => user.username === username)
  const todo = user.todos.find(todo => todo.id === id) 

  todo.done = true

  response.status(200).json(todo)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
  const { username } = request.headers
  const { id } = request.params
  
  const user = users.find(user => user.username === username)
  user.todos.pop(todo => todo.id === id)

  response.status(200).json(user)

});

module.exports = app;