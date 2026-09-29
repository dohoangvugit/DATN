document.getElementById('logout-btn').addEventListener('click', function(e) {
    e.preventDefault()
    
    fetch(this.getAttribute('href'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url; 
        } else {
            window.location.reload();
        }
    }).catch(err => console.error('Lỗi đăng xuất:', err))
})