const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

document.addEventListener('DOMContentLoaded', () => {
    const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');

    $$('.visit-btn').forEach(btn => {
        const taskId = btn.dataset.taskId
        if (completedTasks.includes(taskId)) {
            markAsCompleted(btn)
        }
    })
})

async function startTask(taskId) {
    const res = await fetch(`/start/${taskId}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId })
    })
    return await res.json()
}

async function claimTask(taskId) {
    const res = await fetch(`/claim/${taskId}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId })
    })
    return await res.json()
}

function updateBalance(newBalance) {
    const balanceEl = document.getElementById('balance');
    if (!balanceEl || newBalance === undefined || newBalance === null || newBalance === '') return

    const balance = Number(newBalance)
    if (!Number.isFinite(balance)) return

    balanceEl.innerText = balance.toFixed(8)
}

function saveCompletedTask(taskId) {
    const completedTasks = JSON.parse(localStorage.getItem('completed_tasks') || '[]');
    if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
        localStorage.setItem('completed_tasks', JSON.stringify(completedTasks));
    }
}

function resetButton(btn, text) {
    btn.disabled = false
    btn.innerText = text
}

function markAsCompleted(btn) {
    btn.innerText = 'Completed'
    btn.classList.replace('btn-success', 'btn-secondary')
    btn.dataset.completed = 'true'
    btn.disabled = true
}

async function handleClick(event) {
    const btn = event.currentTarget
    const taskId = btn.dataset.taskId
    const linkUrl = btn.dataset.linkUrl
    const cooldown = Number(btn.dataset.cooldown) || 10

    btn.disabled = true

    // 1. QUAN TRỌNG: Mở tab mới NGAY LẬP TỨC khi click để tránh bị trình duyệt chặn Pop-up
    const newWindow = window.open(linkUrl, '_blank')
    if (!newWindow) {
        alert('Trình duyệt đã chặn mở tab mới! Vui lòng cho phép Pop-up cho trang web này.')
        resetButton(btn, 'Visit')
        return
    }

    let taskPageWasHidden = document.hidden
    let leftTaskTab = false
    const handleVisibilityChange = () => {
        if (document.hidden) {
            taskPageWasHidden = true
        } else if (taskPageWasHidden) {
            leftTaskTab = true
        }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    try {
        const start = await startTask(taskId)

        if (start.error || (start.message && start.message.includes('lỗi'))) {
            newWindow.close()
            alert(start.message || start.error)
            resetButton(btn, 'Visit')
            return
        }

        if (leftTaskTab) {
            throw new Error('Bạn đã rời khỏi trang PTC, nhiệm vụ bị hủy!')
        }

        let timeLeft = cooldown
        btn.innerText = `Còn ${timeLeft}s (Đang xem)`

        const countdownPromise = new Promise((resolve, reject) => {
            const startTime = Date.now()
            const timer = setInterval(() => {
                if (newWindow.closed || leftTaskTab) {
                    clearInterval(timer)
                    return reject(new Error(
                        newWindow.closed
                            ? 'Tab quảng cáo đã đóng, nhiệm vụ bị hủy!'
                            : 'Bạn đã quay lại trang PTC trước khi hết giờ, nhiệm vụ bị hủy!'
                    ))
                }

                timeLeft = Math.ceil((cooldown * 1000 - (Date.now() - startTime)) / 1000)
                if (timeLeft > 0) {
                    btn.innerText = `Còn ${timeLeft}s (Đang xem)`
                } else {
                    clearInterval(timer)
                    resolve()
                }
            }, 250)
        })

        await countdownPromise

        btn.innerText = 'Đang nhận...'
        const claimResult = await claimTask(taskId)

        if (claimResult.error || (claimResult.message && claimResult.message.includes('thất bại'))) {
            alert(claimResult.message || claimResult.error)
            resetButton(btn, 'Visit')
            return
        }

        updateBalance(claimResult.balance ?? claimResult.newBalance)
        markAsCompleted(btn)
        saveCompletedTask(taskId)

    } catch (err) {
        console.error(err)
        alert(err.message || 'Có lỗi xảy ra')
        resetButton(btn, 'Visit')
    } finally {
        document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
}

$$('.visit-btn').forEach(btn => {
    btn.addEventListener('click', handleClick)
})