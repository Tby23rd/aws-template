"use client";
import {useState,useEffect} from "react";
import {generateClient} from "aws-amplify/data";
import type {Schema} from "@/amplify/data/resource";
import "./../app/app.css";
import {Amplify} from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import {Authenticator} from "@aws-amplify/ui-react";

Amplify.configure(outputs);

const client=generateClient<Schema>();

export default function App() {
  const [todos,setTodos]=useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id});
  }

  useEffect(() => {
    listTodos();
  },[]);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <Authenticator>
      {({signOut, user}) => (
        <main>
          <button onClick={signOut}>Sign out</button>
        <h1>My todos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className="p-6 space-x-6 flex flex-col">
              <span className="text-lg font-bold py-8" key={todo.id} onClick={() => deleteTodo(todo.id)}>
                x
              </span>
              <span className="text-blue-900 font-bold py-8" key={todo.id}>{todo.content}</span>

            </li>
          ))}
        </ul>

      </main>
      )
      
      }

    </Authenticator>

  );
}
