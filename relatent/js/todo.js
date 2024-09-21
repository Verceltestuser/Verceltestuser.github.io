const toDoForm = document.getElementById("todo-form")
const toDOInput = toDoForm.querySelector("input")
const toDoList = document.getElementById("todo-list")
const date = new Date;

let TODOS = [];

const TODOS_KEY = "VE9ET1MK"

function saveToDo(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(TODOS))
}

function painTODO(TODO) {
    const todoelement = document.createElement("li")
    todoelement.id = TODO.id;
    const todoValue = document.createElement("span")
    const deleteBTN = document.createElement("button")
    deleteBTN.innerText = "❌"
    todoValue.innerText = TODO.payload
    deleteBTN.addEventListener("click", (e)=>{
        const deleteLI = e.target.parentNode
        TODOS = TODOS.filter((deletetodo)=> deletetodo.id !== parseInt(deleteLI.id))
        saveToDo();
        deleteLI.remove();
        if(toDoList.children.length === 0){
            toDoList.style.border = `none`
        }
    })
    todoelement.appendChild(todoValue)
    todoelement.appendChild(deleteBTN)
    toDoList.appendChild(todoelement);
    toDoList.style.border = `1px solid #fff`
}


toDoForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const newToDO = toDOInput.value
    toDOInput.value = "";
    const newTODOOBJ = {
        id : Date.now(),
        payload : newToDO
    }
    painTODO(newTODOOBJ);
    TODOS.push(newTODOOBJ)
    saveToDo();
})

const savedTodo = localStorage.getItem(TODOS_KEY)

if (savedTodo !== null){
    const parsedTODO = JSON.parse(savedTodo)
    parsedTODO.forEach((item)=>{
        painTODO(item)
        TODOS.push(item)
    });

}