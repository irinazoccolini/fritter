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
  fetch(`/api/freets/${fields.id}`, {method: 'PATCH', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  fetch(`/api/freets/${fields.id}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function replyToFreet(fields){
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

function reportFreet(fields){
  fetch(`/api/freets/${fields.id}/reports`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function viewReportCountByFreet(fields){
  fetch(`/api/freets/${fields.id}/reports`)
  .then(showResponse)
  .catch(showResponse);
}

function viewFreetById(fields){
  fetch(`/api/freets/${fields.id}`)
  .then(showResponse)
  .catch(showResponse)
}

function viewFollowingFeed(fields){
  fetch('/api/freets/followingFeed')
  .then(showResponse)
  .catch(showResponse)
}