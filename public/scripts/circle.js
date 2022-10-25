
function createCircle(fields){
    fetch(`/api/circles`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
};

function deleteCircle(fields){
    fetch(`/api/circles/${fields.id}`, {method: "DELETE"})
    .then(showResponse)
    .catch(showResponse);
};

function viewFreetsByCircle(fields){
    fetch(`/api/circles/${fields.id}/freets`)
    .then(showResponse)
    .catch(showResponse)
};

function viewUserCircles(fields){
    fetch(`/api/circles`)
    .then(showResponse)
    .catch(showResponse);
};

function modifyCircle(fields){
    fetch(`/api/circles/${fields.id}`, {method: "PATCH", body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
};