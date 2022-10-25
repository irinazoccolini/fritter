// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'reply-to-freet': replyToFreet,
  'view-replies-to-freet': viewRepliesToFreet,
  'reply-to-reply': replyToReply,
  'view-replies-to-reply': viewRepliesToReply,
  'edit-reply': editReply,
  'delete-reply': deleteReply,
  'add-freet-like': addFreetLike,
  'remove-freet-like': removeFreetLike,
  'view-like-count-by-freet': viewLikeCountByFreet,
  'add-reply-like': addReplyLike,
  'remove-reply-like': removeReplyLike,
  'view-like-count-by-reply': viewLikeCountByReply,
  'view-report-count-by-freet': viewReportCountByFreet,
  'report-freet': reportFreet,
  'view-report-count-by-reply': viewReportCountByReply,
  'report-reply': reportReply,
  'create-circle': createCircle,
  'delete-circle': deleteCircle,
  'view-freets-by-circle': viewFreetsByCircle,
  'view-user-circles': viewUserCircles,
  'modify-circle-name': modifyCircle,
  'modify-circle-members': modifyCircle,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'view-user-followers': getUserFollowers,
  'view-user-following': getUserFollowing,
  'view-freet-by-id': viewFreetById,
  'view-reply-by-id': viewReplyById
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
