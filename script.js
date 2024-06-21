const sheetId = '11LxnU4bloGgINAh90D7k8VfHTPnU5PEGowvmb9ugp28';
const sheetTitle = 'Sheet1';
const sheetRange = 'A9:E9';
const apiKey = 'AIzaSyA8lRYrx0bCNMWI71JmErIIQ3qwP6XCy-Q';
const apiKeyy = 'ya29.a0AXooCgut5JKEcYCtJb_5mgXJgKShHdz1IBtGdjkE5ldwYj9k15GgIWluDMZc5RNqkeAXn-PimfseuxWyGWhYCNoF-rVP45mib99nTj0GBDyRTLrxo9naPpZPHT8i3gWSSeVGQN8A8uM1SjdT5UUlVV2mRFLXRi4-o5p6aCgYKAZwSARMSFQHGX2Mie7TySXWGzWLSpEnAIiyDGA0171';
const fullUrl = ('https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange)

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

const points = {}; // Initialize points object

const tasks = []; // Initialize tasks array

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (passwords[username] && passwords[username] == password) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'points-logger.html';
    } else {
        alert('Invalid password.');
    }
}

function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
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

        // Assuming you have a function to append new points to Google Sheets
        appendPointsToSheet(person, pointsEarned);
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('task').value = '';
    document.getElementById('points').value = '';
}

function appendPointsToSheet(person, pointsEarned) {
    // Construct the URL to append data to Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:B1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

    // Data to append
    const values = [
        [person, pointsEarned.toString()]
    ];

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyy}` // Include if using OAuth token
        },
        body: JSON.stringify({
            values: values
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Points appended successfully', data);
        updateLeaderboard(); // Update the leaderboard after appending points
    })
    .catch(error => {
        console.error('Error appending points:', error);
    });
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

        // Append new task to Google Sheets
        appendTaskToSheet(loggedInUser, assignTo, assignTask, assignPoints);
    } else {
        alert('Please enter a valid task description and points.');
    }

    document.getElementById('assignTask').value = '';
    document.getElementById('assignPoints').value = '';
}

function appendTaskToSheet(assignedBy, assignTo, assignTask, assignPoints) {
    // Construct the URL to append data to Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

    // Data to append
    const values = [
        [assignedBy, assignTo, assignTask, assignPoints.toString()]
    ];

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKeyy}` // Include if using OAuth token
        },
        body: JSON.stringify({
            values: values
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Task appended successfully', data);
        updateTasks(); // Update the tasks list after appending task
    })
    .catch(error => {
        console.error('Error appending task:', error);
    });
}

function updateLeaderboard() {
    // Fetch data from Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const values = data.values || [];

        // Create an array of users with their points
        const usersWithPoints = values.map(row => ({
            name: row[0],
            points: parseInt(row[1]) || 0 // Default to 0 if points are not defined
        }));

        // Sort users based on points in descending order
        usersWithPoints.sort((a, b) => b.points - a.points);

        // Update the leaderboard HTML
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.innerHTML = '';

        usersWithPoints.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'leaderboard-entry';
            userDiv.textContent = `${user.name}: ${user.points} points`;
            leaderboard.appendChild(userDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching data from Google Sheets:', error);
    });
}

function updateTasks() {
    // Fetch data from Google Sheets
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1?key=${apiKey}`;

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const values = data.values || [];
        const loggedInUser = localStorage.getItem('loggedInUser');

        const userTasks = values.filter(row => row[1] === loggedInUser || row[2] === loggedInUser);

        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = '';

        if (userTasks.length === 0) {
            tasksDiv.innerHTML = '<p>No Current Tasks</p>';
        } else {
            userTasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task-entry';
                taskDiv.innerHTML = `<p>Assigned By: ${task[1]}</p>
                                     <p>Assigned To: ${task[2]}</p>
                                     <p>Task: ${task[3]}</p>
                                     <p>Points: ${task[4]}</p>`;
                tasksDiv.appendChild(taskDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data from Google Sheets:', error);
    });
}

function updateAssignToOptions(userLevel) {
    const assignTo = document.getElementById('assignTo');
    assignTo.innerHTML = '';

    for (let user in levels) {
        if (levels[user] === 1 && userLevel >= 2) {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            assignTo.appendChild(option);
        } else if (userLevel === 3) {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            assignTo.appendChild(option);
        }
    }
}

window.onload = function() {
    updateLeaderboard();
    updateTasks();
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('person').value = loggedInUser;
        updateAssignToOptions(levels[loggedInUser]); // Update assignTo dropdown based on logged in user's level
        if (levels[loggedInUser] >= 2) {
            document.getElementById('assignTaskForm').style.display = 'block';
        }
    } else {
        window.location.href = 'index.html';
    }
}

function updateAssignToOptions(userLevel) {
    const assignToSelect = document.getElementById('assignTo');
    assignToSelect.innerHTML = '';

    Object.entries(levels).forEach(([name, level]) => {
        if (userLevel === 3 || (userLevel === 2.2 && level === 1.2) || (userLevel === 2.1 && level === 1.1)) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            assignToSelect.appendChild(option);
        }
    });
}