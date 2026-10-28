const message = document.getElementById('manager-message')

function showMessage(text, isError = false) {
    message.textContent = text
    message.classList.remove('d-none', 'alert-success', 'alert-danger')
    message.classList.add(isError ? 'alert-danger' : 'alert-success')
}

async function sendRequest(url, method, body) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (body) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || 'Yêu cầu không thành công')
    }

    return result
}

document.querySelectorAll('[data-update-role]').forEach(button => {
    button.addEventListener('click', async () => {
        const role = button.closest('.input-group').querySelector('[data-role-select]').value

        try {
            await sendRequest(`/manager/users/${button.dataset.updateRole}`, 'PUT', { role })
            window.location.reload()
        } catch (error) {
            showMessage(error.message, true)
        }
    })
})

document.querySelectorAll('[data-delete-user]').forEach(button => {
    button.addEventListener('click', async () => {
        const username = button.dataset.username

        if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${username}"?`)) {
            return
        }

        try {
            await sendRequest(`/manager/users/${button.dataset.deleteUser}`, 'DELETE')
            window.location.reload()
        } catch (error) {
            showMessage(error.message, true)
        }
    })
})
