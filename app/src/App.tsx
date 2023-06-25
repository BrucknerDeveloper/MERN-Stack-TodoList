import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = "http://localhost:3001"

interface Todo {
  _id: string,
  text: string,
  complete: boolean,
  timestamp: string,
  __v: number
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const[popupActive, setPopupActive] = useState<boolean>(false)
  const [newTodo, setNewTodo] = useState<string>("")

  useEffect(() => {
    GetTodos();
  }, [])

  async function GetTodos() {
    try {
      const res = await fetch(API_BASE + "/todos")
      const data = await res.json()
      setTodos(data)
    }
    catch (error) {
      console.log(error)
    }
  }

  async function completeTodo(id: string) {
    const respond = await fetch(`${API_BASE}/todo/complete/${id}`, { method: "PUT" })
    const data = await respond.json()

    setTodos(todos => todos.map(todo => {
			if (todo._id === data._id) {
				todo.complete = data.complete;
			}

			return todo;
		}));
  }

  async function deleteTodo(id: string){
    const respond = await fetch(`${API_BASE}/todo/delete/${id}`, { method: "DELETE" })
    const data = await respond.json()
    GetTodos()
  }

  async function addTodo(){
    const respond = await fetch(`${API_BASE}/todo/new`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    })
    const data = await respond.json()

    setTodos([...todos, data]);

		setPopupActive(false);
		setNewTodo("");
  }


  return (
    <>
      <h1>Welcome, Daniel</h1>
      <h4>Your Tasks</h4>

      <div className='todos'>
        {todos.map(todo => (
          <div 
            className={'todo ' + (todo.complete && "is-complete")} 
            key={todo._id}
          >
            <div className='checkbox' onClick={() => completeTodo(todo._id)}></div>
            <div className="text">{ todo.text }</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
          </div>
        ))}
      </div>
      
      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

      {popupActive ? (
        <div className='popup'>
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input 
              type='text' 
              className='add-todo-input'
              onChange={e => setNewTodo(e.target.value)} 
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>Create Task</div>
          </div>
        </div>
      ) : ''}
    </>
  );
}

export default App;
