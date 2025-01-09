document.addEventListener("DOMContentLoaded", () => {
    const userList = document.getElementById("userList");
    const searchBox = document.getElementById("searchBox");
    const addUserForm = document.getElementById("addUserForm");

    let users = [];
    let currentUser = null;

    fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
            users = data;
            renderUserList(users);
        });

    function renderUserList(userArray) {
        userList.innerHTML = "";
        userArray.forEach((user) => {
            const li = document.createElement("li");
            li.className = "user-item";
            li.innerHTML = `
          <span>
            <strong>${user.name}</strong> (${user.email})
          </span>
          <div>
            <button onclick="showUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </div>
        `;
            userList.appendChild(li);
        });
    }

    searchBox.addEventListener("input", (e) => {
        const searchText = e.target.value.toLowerCase();
        const filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchText)
        );
        renderUserList(filteredUsers);
    });

    addUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        const newUser = {
            id: Date.now(),
            name,
            email,
        };

        users.push(newUser);
        renderUserList(users);
        addUserForm.reset();
    });

    window.deleteUser = function (id) {
        users = users.filter((user) => user.id !== id);
        renderUserList(users);
    };

    window.showUser = function (id) {
        const userToShow = users.find((user) => user.id === id);
        if (!userToShow) return;

        currentUser = userToShow;

        const popupOverlay = document.createElement("div");
        popupOverlay.className = "popup-overlay";

        const popupContent = document.createElement("div");
        popupContent.className = "popup-content";

        popupContent.innerHTML = `
        <h2>Edit User</h2>
        <label>
          Name:
          <input type="text" id="editName" value="${userToShow.name}" required />
        </label>
        <label>
          Email:
          <input type="text" id="editEmail" value="${userToShow.email}" required />
        </label>
        <button id="saveUserBtn">Save</button>
        <button class="close-popup">×</button>
      `;

        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        popupContent.querySelector(".close-popup").addEventListener("click", () => {
            popupOverlay.remove();
        });

        popupContent.querySelector("#saveUserBtn").addEventListener("click", (e) => {
            e.preventDefault();
            const updatedName = document.getElementById("editName").value;
            const updatedEmail = document.getElementById("editEmail").value;

            if (updatedName && updatedEmail) {
                currentUser.name = updatedName;
                currentUser.email = updatedEmail;
                renderUserList(users);
                popupOverlay.remove();
                currentUser = null;
            }
        });
    };
});