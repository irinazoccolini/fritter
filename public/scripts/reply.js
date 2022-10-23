function replyToReply(fields){
    if (fields.anonymous == "false"){
      fields.anonymous = false;
    } else if (fields.anonymous == "true"){
      fields.anonymous = true;
    }
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
  fetch(`/api/replies/${fields.id}`, {method: "PUT", body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  .then(showResponse)
  .catch(showResponse);
}

function deleteReply(fields){
  fetch(`/api/replies/${fields.id}`, {method: "DELETE"})
  .then(showResponse)
  .catch(showResponse);
}
