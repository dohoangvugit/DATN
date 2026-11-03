const enableAdvertiserButton = document.getElementById('enable-advertiser')
const enableAdvertiserMessage = document.getElementById('enable-advertiser-message')

enableAdvertiserButton?.addEventListener('click', async () => {
    enableAdvertiserButton.disabled = true
    enableAdvertiserMessage.textContent = ''

    try {
        const response = await fetch('/enable-advertiser', {
            method: 'POST',
            headers: { Accept: 'application/json' }
        })
        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.message || 'Không thể bật vai trò Advertiser')
        }

        window.location.assign(result.redirectUrl)
    } catch (error) {
        enableAdvertiserMessage.textContent = error.message
        enableAdvertiserButton.disabled = false
    }
})
