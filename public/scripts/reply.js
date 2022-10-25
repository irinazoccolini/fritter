function replyToReply(fields){
    fetch(`/api/replies/${fields.id}/replies`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
  
function viewRepliesToReply(fields){
    fetch(`/api/replies/${fields.id}/replies`)
    .then(showResponse)
    .catch(showResponse);
}

function editReply(fields){
  fetch(`/api/replies/${fields.id}`, {method: "PATCH", body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function deleteReply(fields){
  fetch(`/api/replies/${fields.id}`, {method: "PATCH", body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function addReplyLike(fields){
  fetch(`/api/replies/${fields.id}/likes`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function removeReplyLike(fields){
  fetch(`/api/replies/${fields.id}/likes`, {method: 'DELETE'})
  .then(showResponse)
  .catch(showResponse);
}

function viewLikeCountByReply(fields){
  fetch(`/api/replies/${fields.id}/likes`)
  .then(showResponse)
  .catch(showResponse);
}

function reportReply(fields){
  fetch(`/api/replies/${fields.id}/reports`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function viewReportCountByReply(fields){
  fetch(`/api/replies/${fields.id}/reports`)
  .then(showResponse)
  .catch(showResponse);
}