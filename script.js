const users = JSON.parse(localStorage.getItem('users')) || {};
const levels = {
    'Shaurya': 3,
    'Nikita': 2.2,
    'Sid': 2.1,
    'Aditya': 1.1,
    'Angad': 1.3,
    'Arnav': 1.2,
    'Dhir': 1,
    'Giuliano': 1.4,
    'Neel': 1,
    'Anton': 1
};

const points = JSON.parse(localStorage.getItem('points')) || {};
const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function register() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    if (username && password) {
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! You can now log in.');
        showLoginForm();
    } else {
        alert('Please enter both username and password.');
    }
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username] === password) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'points-logger.html';
    } else {
        alert('Invalid username or password.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

function logPoints() {
    const person = document.getElementById('person').value;
    const task = document.getElementById('task').value;
    const pointsEarned = parseFloat(document.getElementById('points').value);

    const loggedInUser = localStorage.getItem('loggedInUser');
    const userLevel = levels[loggedInUser];

    if (person && task && !isNaN(pointsEarned) && pointsEarned > 0) {
        if (userLevel === 1 && person !== loggedInUser) {
            alert('You can only log points for yourself.');
            return;
        }

        if (!points[person]) {
            points[person] = 0;
        }
        points[person] += pointsEarned;
        localStorage.setItem('points', JSON.stringify(points));
        updateLeaderboard();
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('task').value = '';
    document.getElementById('points').value = '';
}

function assignTask() {
    const assignTo = document.getElementById('assignTo').value;
    const assignTask = document.getElementById('assignTask').value;
    const assignPoints = parseFloat(document.getElementById('assignPoints').value);

    const loggedInUser = localStorage.getItem('loggedInUser');
    const userLevel = levels[loggedInUser];

    if (assignTo && assignTask && !isNaN(assignPoints) && assignPoints > 0) {
        if ((userLevel === 2.2 && levels[assignTo] !== 1.2) || 
            (userLevel === 2.1 && levels[assignTo] !== 1.1)) {
            return;
        }

        tasks.push({
            assignedBy: loggedInUser,
            assignedTo: assignTo,
            task: assignTask,
            points: assignPoints
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        updateTasks();
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('assignTask').value = '';
    document.getElementById('assignPoints').value = '';
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    const loggedInUser = localStorage.getItem('loggedInUser');
    const userLevel = levels[loggedInUser];

    const sortedUsers = Object.keys(points).sort((a, b) => points[b] - points[a]);

    sortedUsers.forEach(user => {
        if (userLevel === 3 || 
            (userLevel === 2.2 && levels[user] === 1.2) ||
            (userLevel === 2.1 && levels[user] === 1.1) ||
            (userLevel === 1.2 && levels[user] === 2.2) ||
            (userLevel === 1.1 && levels[user] === 2.1)) {
            const userDiv = document.createElement('div');
            userDiv.className = 'leaderboard-entry';
            userDiv.textContent = `${user}: ${points[user]} points`;
            leaderboard.appendChild(userDiv);
        }
    });
}

function updateTasks() {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';

    const loggedInUser = localStorage.getItem('loggedInUser');
    
    const userTasks = tasks.filter(task => task.assignedBy === loggedInUser || task.assignedTo === loggedInUser);

    if (userTasks.length === 0) {
        tasksDiv.innerHTML = '<p>No Current Tasks</p>';
    } else {
        userTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';
            taskDiv.innerHTML = `
                <strong>Task:</strong> ${task.task}<br>
                <strong>Points:</strong> ${task.points}<br>
                <strong>Assigned By:</strong> ${task.assignedBy}<br>
                <strong>Assigned To:</strong> ${task.assignedTo}<br>
                <button onclick="completeTask(${index})">Complete Task</button>
            `;
            tasksDiv.appendChild(taskDiv);
        });
    }
}

function completeTask(index) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    const actualIndex = tasks.findIndex((task, idx) => {
        const taskMatch = task.assignedBy === loggedInUser || task.assignedTo === loggedInUser;
        return taskMatch && idx === index;
    });

    if (actualIndex === -1) {
        alert('Task not found or you do not have permission to complete this task.');
        return;
    }

    const task = tasks[actualIndex];

    if (task.assignedTo !== loggedInUser) {
        alert('You can only complete tasks assigned to you.');
        return;
    }

    if (!points[loggedInUser]) {
        points[loggedInUser] = 0;
    }
    points[loggedInUser] += task.points;

    tasks.splice(actualIndex, 1); // Remove the task from the original array
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('points', JSON.stringify(points));

    updateTasks();
    updateLeaderboard();
}

function updateAssignToOptions() {
    const assignToSelect = document.getElementById('assignTo');
    assignToSelect.innerHTML = '<option value=""></option>';  // Reset options
    const loggedInUser = localStorage.getItem('loggedInUser');
    const userLevel = levels[loggedInUser];

    Object.keys(levels).forEach(user => {
        if (user !== loggedInUser && (
            (userLevel === 3) ||
            (userLevel === 2.2 && levels[user] === 1.2) ||
            (userLevel === 2.1 && levels[user] === 1.1)
        )) {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            assignToSelect.appendChild(option);
        }
    });
}

window.onload = function() {
    updateLeaderboard();
    updateTasks();
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('person').value = loggedInUser;
        if (levels[loggedInUser] >= 2) {
            document.getElementById('assignTaskForm').style.display = 'block';
            updateAssignToOptions();
        }
    } else {
        window.location.href = 'index.html';
    }
}