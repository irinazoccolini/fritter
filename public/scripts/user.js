/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createUser(fields) {
  fetch('/api/users', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function changeUsername(fields) {
  fetch('/api/users', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function changePassword(fields) {
  fetch('/api/users', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteUser(fields) {
  fetch('/api/users', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function signIn(fields) {
  fetch('/api/users/session', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function signOut() {
  fetch('/api/users/session', {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function followUser(fields){
  console.log("in this function")
  fetch(`/api/users/${fields.username}/followers`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse)
}

function unfollowUser(fields){
  fetch(`/api/users/${fields.username}/followers`, {method: 'DELETE'})
  .then(showResponse)
  .catch(showResponse)
}

function getUserFollowers(fields){
  fetch(`/api/users/${fields.username}/followers`)
  .then(showResponse)
  .catch(showResponse)
}

function getUserFollowing(fields){
  fetch(`/api/users/${fields.username}/following`)
  .then(showResponse)
  .catch(showResponse)
}


