// variables
const nameInput = document.getElementById("username-add");
const emailInput = document.getElementById("email-add");
const addBtn = document.getElementById("add-btn");
const tableBody = document.getElementById("table-body");
const updateName = document.getElementById("username-update"); // Perubahan di sini, sesuaikan dengan id yang ada di HTML
const updateEmail = document.getElementById("email-update"); // Perubahan di sini, sesuaikan dengan id yang ada di HTML
const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUserId = null;
const validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// function
function renderTable() {
  tableBody.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const tr = document.createElement("tr");
    const idTd = document.createElement("td");
    const usernameTd = document.createElement("td");
    const emailTd = document.createElement("td");
    const actionsTd = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn"; // Perubahan di sini, nama kelas harus sesuai dengan yang ada di CSS
    idTd.innerText = user.id;
    usernameTd.innerText = user.username;
    emailTd.innerText = user.email;
    editBtn.innerText = "Edit";
    deleteBtn.innerText = "Delete";
    editBtn.addEventListener("click", () => {
      showUpdateForm(user.id);
    });
    deleteBtn.addEventListener("click", () => {
      deleteUser(user.id);
    });
    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(idTd);
    tr.appendChild(usernameTd);
    tr.appendChild(emailTd);
    tr.appendChild(actionsTd);
    tableBody.appendChild(tr);
  }
}

function addUser() {
  const username = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (email.match(validRegex)) {
    if (username !== "" && email !== "") {
      var id = 1;
      var val = users
        .map(function (x) {
          return x.id;
        })
        .indexOf(id);
      while (val !== -1) {
        id++;
        val = users
          .map(function (x) {
            return x.id;
          })
          .indexOf(id);
      }
      const user = {
        id: id,
        username: username,
        email: email,
      };
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
      nameInput.value = "";
      emailInput.value = "";
      renderTable();
    } else {
      alert("Username and email are required!");
    }
  } else {
    alert("Invalid email address!");
  }
}

function updateUser() {
  const username = updateName.value;
  const email = updateEmail.value;
  if (email.match(validRegex)) {
    const index = users.findIndex((user) => user.id === currentUserId);
    if (index !== -1) {
      users[index].username = username;
      users[index].email = email;
      localStorage.setItem("users", JSON.stringify(users));
      hideUpdateForm();
      renderTable();
    }
  } else {
    alert("Invalid email address!");
  }
}

function showUpdateForm(userId) {
  const user = users.find((user) => user.id === userId);
  if (user) {
    updateName.value = user.username;
    updateEmail.value = user.email;
    currentUserId = user.id;
    updateBtn.addEventListener("click", updateUser);
    cancelBtn.addEventListener("click", hideUpdateForm);
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    updateName.style.display = "inline-block";
    updateEmail.style.display = "inline-block";
    document.getElementById("update-container").style.display = "block";
  }
}

function hideUpdateForm() {
  updateName.value = "";
  updateEmail.value = "";
  currentUserId = null; // Perubahan di sini, ubah currentUserId menjadi null
  updateBtn.removeEventListener("click", updateUser);
  cancelBtn.removeEventListener("click", hideUpdateForm);
  updateBtn.style.display = "none";
  cancelBtn.style.display = "none";
  updateName.style.display = "none";
  updateEmail.style.display = "none";
  document.getElementById("update-container").style.display = "none";
}

function deleteUser(userId) {
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("users", JSON.stringify(users));
  if (users.length == 0) {
    hideUpdateForm();
  }
  renderTable();
}

// Event listeners
addBtn.addEventListener("click", addUser);
updateBtn.addEventListener("click", updateUser); // Tambahkan event listener untuk tombol Update di sini
cancelBtn.addEventListener("click", hideUpdateForm);

// Render table
renderTable();
