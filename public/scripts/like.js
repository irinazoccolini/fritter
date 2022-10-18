function addLike(fields) {
    fetch(`/api/likes`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

function removeLike(fields) {
fetch(`/api/likes`, {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewLikeCountByFreet(fields) {
  fetch(`/api/likes?freetId=${fields.freetId}`)
    .then(showResponse)
    .catch(showResponse);
}