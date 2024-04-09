document.getElementById('delete-message').addEventListener('click', function(event) {
    if (!confirm('Are you sure you want to delete this message? This action is permanent!')) {
      event.preventDefault();
    }
});