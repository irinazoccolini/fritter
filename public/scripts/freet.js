/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFreets(fields) {
  fetch('/api/freets')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  fetch(`/api/freets?author=${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  fetch('/api/freets', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function replyToFreet(fields){
  if (fields.anonymous == "false"){
    fields.anonymous = false;
  } else if (fields.anonymous == "true"){
    fields.anonymous = true;
  }
  fetch(`/api/freets/${fields.id}/replies`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function viewRepliesToFreet(fields){
  fetch(`/api/freets/${fields.id}/replies`)
  .then(showResponse)
  .catch(showResponse);
}

function addFreetLike(fields){
  fetch(`/api/freets/${fields.id}/likes`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function removeFreetLike(fields){
  fetch(`/api/freets/${fields.id}/likes`, {method: 'DELETE'})
  .then(showResponse)
  .catch(showResponse);
}

function viewLikeCountByFreet(fields){
  fetch(`/api/freets/${fields.id}/likes`)
  .then(showResponse)
  .catch(showResponse);
}