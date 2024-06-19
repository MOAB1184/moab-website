const sheetId = '11LxnU4bloGgINAh90D7k8VfHTPnU5PEGowvmb9ugp28';
const apiKey = 'AIzaSyA8lRYrx0bCNMWI71JmErIIQ3qwP6XCy-Q';

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

const passwords = {
    'Shaurya': 1094073,
    'Nikita': 3143733,
    'Sid': 5834944,
    'Aditya': 1224968,
    'Angad': 7637735,
    'Arnav': 7067523,
    'Dhir': 5376731,
    'Giuliano': 4633432,
    'Neel': 6677035,
    'Anton': 5958803
};

const points = {};
let tasks = [];
let loggedInUser = null;

async function fetchSheetData() {
    console.log('Fetching user data...');
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:D?key=${apiKey}`);
    const data = await response.json();
    console.log('Fetched user data:', data);
    processSheetData(data.values);
}

function processSheetData(data) {
    data.forEach(row => {
        const [assignedTo, assignedBy, task, point] = row;
        levels[assignedTo] = levels[assignedTo] || 1; // Default level if not defined
        passwords[assignedTo] = passwords[assignedTo] || 123456; // Default password if not defined
        points[assignedTo] = parseFloat(point) || 0;
    });
    updateLeaderboard();
    updateTasks();
}

async function fetchTasksData() {
    console.log('Fetching tasks data...');
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:D?key=${apiKey}`);
    const data = await response.json();
    console.log('Fetched tasks data:', data);
    tasks = data.values.map(row => ({
        assignedTo: row[0],
        assignedBy: row[1],
        task: row[2],
        points: parseFloat(row[3])
    }));
    updateTasks();
}

async function updateSheetData(range, values) {
    const body = {
        valueInputOption: 'RAW',
        data: [{
            range: range,
            majorDimension: 'ROWS',
            values: values
        }]
    };

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchUpdate?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const result = await response.json();
    console.log('Update response:', result);
}

async function updatePoints() {
    const pointsArray = Object.entries(points).map(([username, point]) => [username, levels[username], passwords[username], point]);
    await updateSheetData('Sheet1!D:D', pointsArray);
}

async function updateTasksSheet() {
    const tasksArray = tasks.map(task => [task.assignedTo, task.assignedBy, task.task, task.points]);
    await updateSheetData('Sheet1!D:D', tasksArray);
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (passwords[username] && passwords[username] === parseInt(password)) {
        loggedInUser = username;
        window.location.href = 'points-logger.html';
    } else {
        alert('Invalid username or password.');
    }
}

function logout() {
    loggedInUser = null;
    window.location.href = 'login.html';
}

async function logPoints() {
    const person = document.getElementById('person').value;
    const task = document.getElementById('task').value;
    const pointsEarned = parseFloat(document.getElementById('points').value);

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
        await updatePoints(); // Update Google Sheets
        updateLeaderboard();
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('task').value = '';
    document.getElementById('points').value = '';
}

async function assignTask() {
    const assignTo = document.getElementById('assignTo').value;
    const assignTask = document.getElementById('assignTask').value;
    const assignPoints = parseFloat(document.getElementById('assignPoints').value);

    const userLevel = levels[loggedInUser];

    if (assignTo && assignTask && !isNaN(assignPoints) && assignPoints > 0) {
        if (userLevel === 3 || (userLevel === 2.2 && levels[assignTo] === 1.2) || (userLevel === 2.1 && levels[assignTo] === 1.1)) {
            return;
        }

        tasks.push({
            assignedBy: loggedInUser,
            assignedTo: assignTo,
            task: assignTask,
            points: assignPoints
        });

        await updateTasksSheet(); // Update Google Sheets
        updateTasks();
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('assignTask').value = '';
    document.getElementById('assignPoints').value = '';
}

async function completeTask(index) {
    const task = tasks[index];

    if (task.assignedTo === loggedInUser) {
        if (!points[task.assignedTo]) {
            points[task.assignedTo] = 0;
        }
        points[task.assignedTo] += task.points;
        tasks.splice(index, 1);
        await updatePoints();
        await updateTasksSheet();
        updateTasks();
        updateLeaderboard();
    } else {
        alert('You can only complete tasks assigned to you.');
    }
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    leaderboard.innerHTML = '';

    const sortedUsers = Object.keys(levels).sort((a, b) => (points[b] || 0) - (points[a] || 0));

    sortedUsers.forEach(user => {
        const userPoints = points[user] || 0;
        const userDiv = document.createElement('div');
        userDiv.className = 'leaderboard-entry';
        userDiv.textContent = `${user}: ${userPoints} points`;
        leaderboard.appendChild(userDiv);
    });
}

function updateTasks() {
    const tasksDiv = document.getElementById('tasks');
    tasksDiv.innerHTML = '';

    const userTasks = tasks.filter(task => task.assignedTo === loggedInUser);

    if (userTasks.length === 0) {
        tasksDiv.innerHTML = '<p>No Current Tasks</p>';
    } else {
        userTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'task-title';
            titleDiv.textContent = `Assigned by: ${task.assignedBy}`;

            const assignedToDiv = document.createElement('div');
            assignedToDiv.className = 'task-assigned-to';
            assignedToDiv.textContent = `Assigned to: ${task.assignedTo}`;

            const descriptionDiv = document.createElement('div');
            descriptionDiv.textContent = task.task;

            const pointsDiv = document.createElement('div');
            pointsDiv.className = 'task-points';
            pointsDiv.textContent = `Points: ${task.points}`;

            const completeButton = document.createElement('button');
            completeButton.textContent = 'Complete Task';
            completeButton.onclick = () => completeTask(index);

            taskDiv.appendChild(titleDiv);
            taskDiv.appendChild(assignedToDiv);
            taskDiv.appendChild(descriptionDiv);
            taskDiv.appendChild(pointsDiv);
            taskDiv.appendChild(completeButton);

            tasksDiv.appendChild(taskDiv);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const personSelect = document.getElementById('person');
    const assignToSelect = document.getElementById('assignTo');

    Object.keys(levels).forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        personSelect.appendChild(option);
        assignToSelect.appendChild(option.cloneNode(true));
    });

    updateTasks();
    updateLeaderboard();
});

fetchSheetData();
fetchTasksData();