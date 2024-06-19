const sheetId = '11LxnU4bloGgINAh90D7k8VfHTPnU5PEGowvmb9ugp28';
const apiKey = 'AIzaSyA8lRYrx0bCNMWI71JmErIIQ3qwP6XCy-Q';
const apiKeyy = 'ya29.a0AXooCgut5JKEcYCtJb_5mgXJgKShHdz1IBtGdjkE5ldwYj9k15GgIWluDMZc5RNqkeAXn-PimfseuxWyGWhYCNoF-rVP45mib99nTj0GBDyRTLrxo9naPpZPHT8i3gWSSeVGQN8A8uM1SjdT5UUlVV2mRFLXRi4-o5p6aCgYKAZwSARMSFQHGX2Mie7TySXWGzWLSpEnAIiyDGA0171';

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
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED&key=${apiKey}`;

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

        const userTasks = values.filter(row => row[0] === loggedInUser || row[1] === loggedInUser);

        const tasksDiv = document.getElementById('tasks');
        tasksDiv.innerHTML = '';

        if (userTasks.length === 0) {
            tasksDiv.innerHTML = '<p>No Current Tasks</p>';
        } else {
            userTasks.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.className = 'task';
                taskDiv.innerHTML = `
                    <strong>Task:</strong> ${task[2]}<br>
                    <strong>Points:</strong> ${task[3]}<br>
                    <strong>Assigned By:</strong> ${task[0]}<br>
                    <strong>Assigned To:</strong> ${task[1]}<br>
                    <button onclick="completeTask('${task[0]}', '${task[1]}', '${task[2]}', '${task[3]}')">Complete Task</button>
                `;
                tasksDiv.appendChild(taskDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching data from Google Sheets:', error);
    });
}

function completeTask(assignedBy, assignTo, assignTask, assignPoints) {
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
        
        const actualIndex = values.findIndex(row => {
            return (row[0] === assignedBy || row[1] === assignTo) && row[2] === assignTask && row[3] === assignPoints;
        });

        if (actualIndex === -1) {
            alert('Task not found or you do not have permission to complete this task.');
            return;
        }

        // Update points for the user completing the task
        points[loggedInUser] = (points[loggedInUser] || 0) + parseFloat(assignPoints);

        // Remove the task from Google Sheets
        values.splice(actualIndex, 1);

        // Construct the URL to update data in Google Sheets
        const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:D1:clear?key=${apiKey}`;

        fetch(updateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKeyy}` // Include if using OAuth token
            },
            body: JSON.stringify({
                range: 'Sheet1!A1:D1',
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
            console.log('Task completed successfully', data);
            updateTasks(); // Update the tasks list after completing task
            updateLeaderboard(); // Update the leaderboard after completing task
        })
        .catch(error => {
            console.error('Error completing task:', error);
        });
    })
    .catch(error => {
        console.error('Error fetching data from Google Sheets:', error);
    });
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
        window.location.href = 'login.html';
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