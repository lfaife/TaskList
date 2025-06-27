class Task {

    // // initializes Task info. Values are usually parsed from a JSON object
    constructor(id, taskName, complete, date) { 
      this.id = id;
      this.taskName = taskName;
      this.complete = complete;
      this.date = date
    }

    // creates Task instance from JSON object using static method
    // Converts user input or data from an API into Task Object
    static fromJSON(json) { 
        return new Task(json.id, json.taskName, json.complete, json.date);
    }
  }
  
  class UI {

    constructor() {
      // places values given from JSON into classes specified
      this.form = document.getElementById('form');
      this.taskInput = document.getElementById('input-task');
      this.tableBody = document.getElementById('table-body');

      this.tasks = [];  // initializes tasks as to empty array, but will fill if tasks are in local storage
      this.loadTasksFromLocalStorage(); // loads tasks in localStorage
      this.renderTaskTable(); // renders Tasks on table
  
      // ensures when '+' is clicked, the info is submitted and displayed 
      this.form.addEventListener('submit', (e) => this.formIsClicked(e));
  
    }
  
    // function 0
    formIsClicked(e) {

      e.preventDefault();
  
      // validation check to see the input has a value
      if (this.taskInput.value == '') {
        alert('Please enter a value');
        return;
      }
  
      const id = Date.now() // creates random ID values using time in ms.
      const date = this.getCurrentDate()
      const task = new Task(id, this.taskInput.value, "Not Completed", date); // sets values for each new Task Instance
      this.tasks.push(task); // pushes new task to 'this.tasks' array 
  
      this.renderTaskTable(); // displays tasks in list format
 
      // resets form input to default
      const formReset = document.getElementById("form"); 
      formReset.reset();
  
    }
  
    // function 1
    renderTaskTable() {

      this.tableBody.innerHTML = []; // sets the element to an empty array

      for (let i = 0; i < this.tasks.length; i++) {
        
        const task = this.tasks[i];// places value at 'this.tasks' index into task
        const tr = this.createTaskTableRow(task); // display task object values into table-row
        this.tableBody.appendChild(tr); // appends table-row to table-body
      }
    }
  
    // function 2
    createTaskTableRow(task) {

      // creates instance of 'tr' for each new task
      const tr = document.createElement('tr'); 
  
      // creates instance of 'td' for each new task value
      const tdTask = document.createElement('td');
      const tdComplete = document.createElement('td');
      const tdActions = document.createElement('td');
      const tdDate = document.createElement('td')
  
      // places task object values into specified 'td' table cells
      tdTask.innerHTML = task.taskName;

      // After setting tdComplete
      const span = document.createElement('span');
      span.style.cursor = "pointer";
      span.innerText = task.complete;
      span.addEventListener("click", () => {
        this.toggleCompletionStatus(span, task.id);
      });

      tdComplete.appendChild(span);

      tdActions.innerHTML = task.id;

      tdDate.innerHTML = task.date


      // creates 'Delete' and 'Edit' actions
      const actionButtons = this.createActionButtons(task);

      // displays button on Web
      tdActions.appendChild(actionButtons[0])
      tdActions.appendChild(actionButtons[1])
  

      // display each Task Object instance values in table columns
      tr.appendChild(tdTask);
      tr.appendChild(tdComplete);
      tr.appendChild(tdActions);
      tr.appendChild(tdDate)

      return tr;
  
    }

    // function 3
    createActionButtons(task) {

        // creates mew button elemements
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');
  
        // creates Delete Button next to table Row
        deleteButton.setAttribute("class", "btn btn-danger btn-sm me-1 ms-2");
        deleteButton.innerHTML = "Delete";
        
        // deletes table row when button clicked
        deleteButton.addEventListener("click", () => {
        this.deleteTaskClicked(task); 
        })
  
        // creates Edit Button next to table Row
        editButton.setAttribute("class", "btn btn-warning btn-sm ");
        editButton.innerHTML = "Edit"

        // edits table row when button clicked
        editButton.addEventListener("click", () => {
        this.editTaskClicked(task); 
    })
  
    return [deleteButton, editButton];
  }
      
    // function 4
    deleteTaskClicked(task) {
    
    this.filterTaskArray(task); // filters out tasks
    this.saveTasksToLocalStorage(); // updates Local Storage
    this.renderTaskTable(); // Displays new data on Web
  }

    // function 5
    editTaskClicked(task) {

    // prompts user to enter new TaskName
    const newTaskName = prompt('Enter a new task name:', task.taskName);

    // 
    if (newTaskName !== null && newTaskName.trim() !== '') {

      // Find 'table-row' with matching ID
      // t is temp rep. of the tasks in array
      const taskToEdit = this.tasks.find(t => t.id === task.id);

      // Update the task
      if (taskToEdit) {
        taskToEdit.taskName = newTaskName;
        this.saveTasksToLocalStorage();
        this.renderTaskTable();
      }
  }
}

   // function 6
  filterTaskArray(task) {
    this.tasks = this.tasks.filter((x) => {
      return task.id != x.id;
    });
  }

  // function 7
  saveTasksToLocalStorage() {
    // parses this.tasks back into string
    const json = JSON.stringify(this.tasks);
  
    // saves new value in local Storage
    localStorage.setItem('tasks', json);
  }


  // function 8
  loadTasksFromLocalStorage() {
    // retrieves Task from local Storage
    const json = localStorage.getItem('tasks');

    if (json) {

      // parses JSON string into array of objects
      const taskArr = JSON.parse(json);

      // converts each JSON object into Task instance into 'this.tasks'
      this.tasks = taskArr.map((x) => Task.fromJSON(x));
      }
     
    }

// function 8
  toggleCompletionStatus(el, taskID) {
  // Toggle the visual text
  const newValue = "Completed ✅"

  if (el.innerText.trim() === "Not Completed") {
    el.innerText = newValue;
  } else 
     el.innerText = "Not Completed";

  // Update the task object
  const task = this.tasks.find(t => t.id === taskID);
  if (task) {
    task.complete = newValue;
    this.saveTasksToLocalStorage();
  }
}

  getCurrentDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
    const yyyy = today.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
  }

}
  // instance for UI class to maintain sustainability (displayed once)
  const ui = new UI();
  