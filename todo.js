let todoFactory;
let localStorageManager;

function Data(id, text) {
    this.id = id;
    this.text = text;
    this.date = Date();
}

function ToDoFactory() {
    this.arrData = [];
}

ToDoFactory.prototype.createData = function () {
    const text = getInputValue();
    const nextId = this.arrData.length ? this.arrData[this.arrData.length - 1].id + 1 : 1;
    const dataObj = new Data(nextId, text);
    this.arrData.push(dataObj);
    localStorageManager.setDataLs(this.arrData);
    this.drawTodo(dataObj);
}

ToDoFactory.prototype.drawTodo = function (todo) {
    const el = this.createElement(todo);
    this.appendToHtml(el);
    this.attachEventListeners(todo);
}

function LocalStorageManager() { }

LocalStorageManager.prototype.setDataLs = function (arrData) {
    localStorage.setItem('todos', JSON.stringify(arrData))
}


LocalStorageManager.prototype.getDataLS = function () {
    const arrayData = JSON.parse(localStorage.getItem('todos'));
    return arrayData;
}

ToDoFactory.prototype.appendToHtml = function (el) {
    const container = document.getElementById('cards-wrapper');
    container.appendChild(el);
}

ToDoFactory.prototype.remove = function (id) {
    const container = document.getElementById('cards-wrapper');
    const divToRemove = document.getElementById(`card${id}`);
    container.removeChild(divToRemove);
    const thisTodo = this.arrData.findIndex((todo) => todo.id === id);
    this.arrData.splice(thisTodo, 1);
    localStorageManager.setDataLs(this.arrData);
}

ToDoFactory.prototype.createElement = function (obj) {
    const el = document.createElement('div');
    el.classList.add('card');
    el.classList.add('custom-card');
    el.id = `card${obj.id}`;
    el.innerHTML = `
        ${obj.id}
        <div class="card-body">
        <div class="input-class">
            <input class="input-text" id="inputText${obj.id}" type="text" value="${obj.text}">
            <button id="doneButton${obj.id}" class="done-button">
                <i class="bi bi-check-lg"></i>
            </button>
        </div>
            <p id="xosqiP${obj.id}" class="card-text">${obj.date}</p>
        </div>
        <button id="removeButton${obj.id}" class="btn btn-primary" >
        <i class="bi bi-basket-fill"></i>
        </button>
    </div>
    `;
    return el;
}

ToDoFactory.prototype.attachEventListeners = function (obj) {
    document.getElementById('removeButton' + obj.id).addEventListener("click", () => {
        this.remove(obj.id);
    });
    document.getElementById(`inputText${obj.id}`).addEventListener("click", () => {
        document.getElementById(`doneButton${obj.id}`).style.display = "block";
    });
    document.getElementById(`doneButton${obj.id}`).addEventListener("click", () => {
        this.handleDoneClick(obj.id);
    });
}

ToDoFactory.prototype.handleDoneClick = function (id) {
    const value = document.getElementById(`inputText${id}`).value;
    const thisTodo = this.arrData.find((todo) => todo.id === id);
    thisTodo.date = Date();
    thisTodo.text = value;
    LocalStorageManager.prototype.setDataLs(this.arrData);
    document.getElementById(`doneButton${id}`).style.display = "none";
    document.getElementById(`xosqiP${id}`).innerHTML = `
    ${Date()}
    `
}

ToDoFactory.prototype.initializeFromLocalStorage = function (arrData) {
    arrData.forEach((todo) => {
        this.drawTodo(todo);
    })
}

window.addEventListener('load', () => {
    toDoFactory = new ToDoFactory();
    localStorageManager = new LocalStorageManager();
    const arrData = localStorageManager.getDataLS();
    if (arrData) {
        toDoFactory.initializeFromLocalStorage(arrData);
        toDoFactory.arrData = arrData;
    }
    document.getElementById("myButton").disabled = true;
    document.getElementById("myButton")
        .addEventListener("click", toDoFactory.createData.bind(toDoFactory));

    document.getElementById("myInput").addEventListener("keyup", (event) => {
        if (document.getElementById("myInput").value === '') {
            document.getElementById("myButton").disabled = true;
        } else {
            document.getElementById("myButton").disabled = false;
        }
        if (event.keyCode == 13 || event.which == 13) {
            toDoFactory.createData.bind(toDoFactory)();
        }
    });
});


function getInputValue() {
    const inputValue = document.getElementById("myInput").value;
    if (!inputValue) {
        throw ("You must write something!");
    }
    return inputValue;
}