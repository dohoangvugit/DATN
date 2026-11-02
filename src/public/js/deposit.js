document.addEventListener('DOMContentLoaded', function () {
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        depositForm.addEventListener('submit', function (event) {
            const txHashInput = document.getElementById('txHashInput');
            if (txHashInput) {
                txHashInput.value = txHashInput.value.trim();
                if (!txHashInput.value) {
                    event.preventDefault();
                    txHashInput.focus();
                }
            }
        });
    }
});