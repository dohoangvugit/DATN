const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

let exchangeRateLoaded = false;
let exchangeRateLoading = false;
let exchangeRateInterval = null; // Biến gọi API định kỳ (20s)
let countdownInterval = null;    // Biến đếm ngược hiển thị mỗi giây (1s)
let timeLeft = 10;               // Thời gian đếm ngược (giây)

// Định dạng giá USD
function formatUsd(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price);
}

// Cập nhật hiển thị đồng hồ đếm ngược ra giao diện
function updateCountdownDisplay() {
    let countdownElem = document.getElementById('rateCountdown');
    if (!countdownElem) {
        // Nếu chưa có thẻ hiển thị, tự động chèn thêm vào cạnh mục "Cập nhật lúc"
        const updatedAtElem = document.getElementById('exchangeUpdatedAt');
        if (updatedAtElem && updatedAtElem.parentElement) {
            const row = document.createElement('div');
            row.className = 'exchange-price-row';
            row.innerHTML = `
                <span>Tự động làm mới</span>
                <strong id="rateCountdown" class="text-primary">${timeLeft}s</strong>
            `;
            // Chèn trước dòng "Cập nhật lúc" hoặc sau đó tùy ý
            updatedAtElem.parentElement.parentElement.insertBefore(row, updatedAtElem.parentElement.nextSibling);
        }
    } else {
        countdownElem.textContent = `${timeLeft}s`;
    }
}

// Bắt đầu bộ đếm ngược và gọi API tự động
function startAutoRefreshRate() {
    // Xóa các interval cũ nếu có để tránh chạy chồng chéo
    if (exchangeRateInterval) clearInterval(exchangeRateInterval);
    if (countdownInterval) clearInterval(countdownInterval);

    timeLeft = 10;
    updateCountdownDisplay();

    // Đếm ngược mỗi 1 giây
    countdownInterval = setInterval(() => {
        const currencyInput = document.getElementById('currencyInput');
        // Chỉ đếm ngược khi đang chọn ETH và bảng giá hiển thị
        if (currencyInput && currencyInput.value === 'ETH') {
            timeLeft--;
            if (timeLeft <= 0) {
                timeLeft = 10;
                loadExchangeRate(true); // Gọi làm mới ngầm dữ liệu
            }
            updateCountdownDisplay();
        }
    }, 1000);
}

// Lấy tỷ giá ETH/POL từ CoinGecko
async function loadExchangeRate(isBackgroundRefresh = false) {
    const content = document.getElementById('exchangeRateContent');
    const details = document.getElementById('exchangePriceDetails');

    if (exchangeRateLoading) {
        return;
    }

    exchangeRateLoading = true;

    if (!isBackgroundRefresh) {
        if (details) details.hidden = true;
        if (content) {
            content.innerHTML = `
                <div class="rate-placeholder">
                    <i class="bi bi-arrow-repeat spin"></i>
                    <span>Đang tải tỷ giá từ CoinGecko...</span>
                </div>
            `;
        }
    }

    try {
        const params = new URLSearchParams({
            ids: 'ethereum,polygon-ecosystem-token,matic-network',
            vs_currencies: 'usd'
        });

        const response = await fetch(
            `${COINGECKO_API}?${params.toString()}`,
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko HTTP ${response.status}`);
        }

        const data = await response.json();

        const ethUsd = data.ethereum?.usd;
        const polUsd = data['polygon-ecosystem-token']?.usd || data['matic-network']?.usd;

        if (
            typeof ethUsd !== 'number' ||
            typeof polUsd !== 'number' ||
            ethUsd <= 0 ||
            polUsd <= 0
        ) {
            throw new Error('Dữ liệu tỷ giá không hợp lệ.');
        }

        const rate = ethUsd / polUsd;

        if (content) {
            content.innerHTML = `
                <div class="exchange-rate-result">
                    <div class="exchange-rate-main">
                        <span>1 ETH tương đương</span>
                        <strong>
                            ${new Intl.NumberFormat('en-US', {
                                maximumFractionDigits: 4
                            }).format(rate)} POL
                        </strong>
                    </div>
                    <i class="bi bi-arrow-left-right"></i>
                </div>
            `;
        }

        const ethUsdElem = document.getElementById('ethUsdPrice');
        const polUsdElem = document.getElementById('polUsdPrice');
        const updatedAtElem = document.getElementById('exchangeUpdatedAt');

        if (ethUsdElem) ethUsdElem.textContent = formatUsd(ethUsd);
        if (polUsdElem) polUsdElem.textContent = formatUsd(polUsd);
        if (updatedAtElem) updatedAtElem.textContent = new Date().toLocaleString('vi-VN');

        if (details) details.hidden = false;
        exchangeRateLoaded = true;

        timeLeft = 10;
        updateCountdownDisplay();

    } catch (error) {
        console.error('Lỗi CoinGecko:', error);

        if (!isBackgroundRefresh && content) {
            content.innerHTML = `
                <div class="rate-placeholder">
                    <i class="bi bi-exclamation-triangle"></i>
                    <span>Không tải được tỷ giá. Vui lòng thử lại.</span>
                </div>
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm mt-3"
                    id="retryExchangeRate">
                    Thử lại
                </button>
            `;

            const retryBtn = document.getElementById('retryExchangeRate');
            if (retryBtn) {
                retryBtn.onclick = function () {
                    loadExchangeRate(false);
                };
            }
        }
    } finally {
        exchangeRateLoading = false;
    }
}

// Chọn đồng tiền nạp (POL hoặc ETH)
function selectCoin(currency) {
    const isETH = currency === 'ETH';

    document.querySelectorAll('.coin-card').forEach(function (card) {
        card.classList.toggle('active', card.dataset.coin === currency);
    });

    const currencyInput = document.getElementById('currencyInput');
    const depositTitle = document.getElementById('depositTitle');
    const depositDescription = document.getElementById('depositDescription');
    const networkBadge = document.getElementById('networkBadge');
    const exchangePanel = document.getElementById('exchangePanel');
    const ethConfirmNotice = document.getElementById('ethConfirmNotice');
    const txHashHelp = document.getElementById('txHashHelp');
    const txHashInput = document.getElementById('txHashInput');

    if (currencyInput) currencyInput.value = currency;
    if (depositTitle) depositTitle.textContent = isETH ? 'Nạp ETH' : 'Nạp POL';
    
    if (depositDescription) {
        depositDescription.textContent = isETH
            ? 'Chuyển ETH trên mạng Ethereum vào ví hệ thống.'
            : 'Chuyển POL trên mạng Polygon vào ví hệ thống.';
    }

    if (networkBadge) {
        networkBadge.textContent = isETH ? 'Ethereum Mainnet' : 'Polygon PoS';
    }

    if (exchangePanel) exchangePanel.hidden = !isETH;
    if (ethConfirmNotice) ethConfirmNotice.hidden = !isETH;

    if (txHashHelp) {
        txHashHelp.textContent = isETH
            ? 'Nhập mã giao dịch ETH trên mạng Ethereum.'
            : 'Nhập mã giao dịch POL trên mạng Polygon.';
    }

    if (txHashInput) {
        txHashInput.placeholder = isETH
            ? 'Nhập TxHash trên Ethereum...'
            : 'Nhập TxHash trên Polygon...';
    }

    // Khi chọn ETH: Tải dữ liệu và chạy đếm ngược tự động
    if (isETH) {
        if (!exchangeRateLoaded) {
            loadExchangeRate(false);
        }
        startAutoRefreshRate();
    } else {
        // Khi chọn POL: Dừng đếm ngược để đỡ tốn tài nguyên
        if (exchangeRateInterval) clearInterval(exchangeRateInterval);
        if (countdownInterval) clearInterval(countdownInterval);
    }
}

// Gắn sự kiện sau khi HTML đã tải xong DOM
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.coin-card').forEach(function (card) {
        card.addEventListener('click', function () {
            selectCoin(card.dataset.coin);
        });
    });

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