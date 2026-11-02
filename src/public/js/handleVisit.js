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

async function startTask(taskId){
    const res = await fetch('/start/:taskId', {
        method: POST,
        headers: { "Content-Type": "application/x-www-form-urlencoded"},
        body: JSON.stringify({taskId})
    })

    return await res.json()
}

async function claimTask(taskId){
    const res = await fetch('/claim/:taskId',{
        method: POST,
        headers: { "Content-Type": "application/x-www-form-urlencoded"},
        body: JSON.stringify({taskId})
    })

    return await res.json()
}

function updateBalance(newBalance) {
    const balanceEl = document.getElementById('balance');
    if (balanceEl) {
        balanceEl.innerText = Number(newBalance).toFixed(8);
    }
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

async function handleClick(){
    const btn = event.currentTarget
    const taskId = btn.dataset.taskId
    const linkUrl = btn.dataset.linkUrl
    const cooldown = btn.dataset.cooldown

    btn.disabled = true
    btn.innerText = `Giữ trang mở và không chuyển trang ${cooldown}`

    try{
        const start = await startTask(taskId)

        if(start.error){
            alert('start.error')
            resetButton(btn, 'Visit')
            return
        }

        window.open(linkUrl, '_blank')

        let timeLeft = cooldown

        const timer = setInterval(()=>{
            if (timeLeft-- > 0){
                btn.innerText = `Bạn đang trong quá trình xem quảng cáo`
            }
        }, 1000)

        const claimResult = await claimTask(taskId)
        clearInterval(timer)

        if (claimResult.error) {
            alert(claimResult.error)
            resetButton(btn, 'Visit')
            return;
        }

        updateBalance(claimResult.newBalance)
        markAsCompleted(btn)

        saveCompletedTask(taskId)
    }catch(err){
        console.error(err)
        alert('Có lỗi xẩy ra')
        resetButton(btn, 'Visit')
    }

}

$('.visit-btn').forEach(btn => {
    btn.addEventListener('click', handleClick)
})