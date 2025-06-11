$(document).ready(function () {
    // create variable for base url
    const BASE_URL = "http://localhost:4000";

    // get all todo items from db
    const fetchToDos = async () => {
        // fetch data from server with fetch API
        const response = await fetch(`${BASE_URL}/todos`);

        // convert response to json
        const data = await response.json();
        // console.log({data});

        return data;
    };

    // get a single todo item from db
    const fetchToDo = async (id) => {
        // fetch data from server with fetch API
        const response = await fetch(`${BASE_URL}/todos/${id}`);

        // convert response to json
        const data = await response.json();
        // console.log({data});

        return data;
    };

    // add a new todo item to the server
    const addToDo = async (text) => {
        // fetch data from server with fetch API
        const response = await fetch(`${BASE_URL}/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({text, completed: false}),
        });

        // convert response to json
        const data = await response.json();
        // console.log({data});

        return data;
    };

    // create function to get data from the server and render it to the page
    const render = async () => {
        // fetch todo items from the server
        const todos = await fetchToDos();

        // clear the current list
        $("#todoList").empty();

        // loop through items and append each new task to the list
        todos.forEach(function (todo, index) {
            let todoItem = `<li class="list-group-item d-flex justify-content-between align-items-center">
                                  <span class="todo-text ${todo.completed ? "completed" : ""
                }">${todo.text}</span>
                                  <div>
                                      <button class="btn btn-success toggleTask" data-index="${todo.id
                }">${todo.completed ? "Undo" : '<i class="fa-solid fa-check"></i>'
                }</button>
                                      <button class="btn btn-danger deleteTask" data-index="${todo.id
                }"><i class="fa-solid fa-trash-can"></i></button>
                                  </div>
                              </li>`;
            $("#todoList").append(todoItem);
        });
    };
    render();

    // add event listener to add button
    $("#addTask").click(async (event) => {
        event.preventDefault();
        const text = $("#newTask").val();
        // console.log({text});

        // add the new task to the server
        await addToDo(text);
       
        // clear input field
        $("#newTask").val("");

        render();
    });

    // add event listener to delete button
    $(document).on("click", ".deleteTask", async function () {
        // get ID of the item to be deleted
        const id = $(this).data("index");
        console.log("Deleting", {id});

        // delete item from server
        await fetch(`${BASE_URL}/todos/${id}`, {
            method: "DELETE",
        });
        render();
    });

    // add event listener to the check button
      $(document).on("click", ".toggleTask", async function () {
        // Get the id of the todo to be completed
        const id = $(this).data("index");
        // fetch the todo from the server
        const todo = await fetchToDo(id);
            

        await fetch(`${BASE_URL}/todos/${id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
      // toggle the todo status to bo the opposite of what it currently is
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
        });

        // Re-render the todos by calling the render function
        render();
    });


});
