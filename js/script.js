
// Variables
let LIST, id, counter;

// Get data from sessionStorage
let data = sessionStorage.getItem("ToDoList");

// Classes for CSS changes
const CHECK = "checked-yes";
const UNCHECK = "checked-no";
const LINE_THROUGH = "lineThrough";

//Input[type checkbox] atributte
const SAVECHECKED = "checked";

// Selected elements by ID
const table = document.getElementById("all_notes");
const descprition = document.getElementById("description");
const deadline = document.getElementById("deadline");
const show = document.getElementById("show");


//If data exists, load LIST
if (data) {
  LIST = JSON.parse(data);
  id = LIST.length;

  loadList(LIST);

  //When data do not exists
} else {
  LIST = [];
  id = 0;
  show.style.display = "none";
}

//Load items to table
function loadList(array) {
  array.forEach(function (item) {
    add(item.descprition, item.datetime, item.id, item.done, item.remove);
  });
}


// Add item to table
function add(toDo, time, id, done, remove) {
  TimeLeft(time, id);
  if (remove) { return; }

  var DONE = UNCHECK;
  let line = "";
  let checked = "";
  if (done == true) {
    DONE = CHECK;
    line = LINE_THROUGH;
    checked = SAVECHECKED;
  }

  const text = '<tr><td class="' + line + '" id="id' + id + '">' + toDo + '</td>' +
    '<td id="time' + id + '"></td>' +
    '<td><button onclick="deleteFromList(' + id + ',this)" class="deleteBtn" type="submit">DELETE</button></td>' +
    '<td><input class="' + DONE + '" type="checkbox" id="done" value="' + id + '" ' + checked + '></td> </tr>';

  var position = "afterbegin"; // table begin

  if (time == "" || time == "-") // if time was not chosen or expired
  {
    position = "beforeend";  // table end
  }
  table.insertAdjacentHTML(position, text);

}


function buttonAdd() {
  show.style.display = "grid";
  const toDo = descprition.value; // inserted "To Do" value
  var time = deadline.value; // inserted datetime-local value

  let currentTime = new Date();
  let insertedTime = new Date(time);

  if (insertedTime < currentTime) {
    time = "-";
  }

  // if toDo field is not empty 
  if (toDo) {

    LIST.push({
      descprition: toDo,
      datetime: time,
      id: id,
      done: false,
      remove: false
    });

    add(toDo, time, id, false, false); // Add to user interface
    sessionStorage.setItem("ToDoList", JSON.stringify(LIST)); //save to SessionStorage
    id++;

  }
  else {
    alert("Please fill descripction field")
  }
  //Reset input fields values
  descprition.value = "";
  deadline.value = "";

}

//Timeleft counter
function TimeLeft(deadlinetime, i) {
  var newtime = setInterval(function () { ReturnMinutes(deadlinetime, i); }, 200);
}

function ReturnMinutes(deadlinetime, i) {
  let currentTime = new Date();
  let expireTime = new Date(deadlinetime);
  let minutes = (expireTime - currentTime);

  if (minutes > 0) {
    var days = Math.floor(minutes / (1000 * 60 * 60 * 24));
    var hours = Math.floor((minutes % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var min = Math.floor((minutes % (1000 * 60 * 60)) / (1000 * 60));
    minutes = days + " Days " + hours + " Hours " + min + " Minutes ";
  }
  else {
    minutes = "-";
  }

  var timerField = document.getElementById("time" + i);
  if (timerField != null) {
    timerField.innerHTML = minutes;

    if (LIST[i].done == true) {
      timerField.innerHTML = "-";
    }

  }

}

// Delete item from list
function deleteFromList(i, o) {
  if (confirm("Are you sure to delete '"+LIST[i].descprition+"' ?")) {
    LIST[i].remove = true;
    sessionStorage.setItem("ToDoList", JSON.stringify(LIST));
    var p = o.parentNode.parentNode;
    p.parentNode.removeChild(p);
    IfAllRemoved(LIST);
  }
}

// When checkbox is checked/unchecked change element class and toggle line-trough style
function completeItem(element) {
  element.classList.toggle(CHECK);
  element.classList.toggle(UNCHECK);
  var id = "#id" + element.attributes.value.value; //chechbox value
  document.querySelector(id).classList.toggle(LINE_THROUGH);
  LIST[element.value].done = LIST[element.value].done ? false : true;
}

//When input element in table is clicked
table.addEventListener("click", function (event) {
  const element = event.target; // return the clicked element inside table
  if (event.target instanceof HTMLInputElement) {
    const elementidName = element.attributes.id.value; //chechbox id
    if (elementidName == "done") {
      completeItem(element);
    }

    sessionStorage.setItem("ToDoList", JSON.stringify(LIST)); //add updated item to SessionStorage
  }

});


// If all items deleted, do no show table and remove date from sessionStorage
function IfAllRemoved(list) {
  let counter = 0;
  for (i = 0; i < list.length; i++) {
    if (list[i].remove == true) {
      counter++;
    }

  }
  if (counter == list.length) {
    show.style.display = "none";
    sessionStorage.removeItem("ToDoList");
  }

}

//Sort list items by date
function SortList() {
  LIST.sort(function (a, b) {
    return b.datetime.localeCompare(a.datetime);
  });

}