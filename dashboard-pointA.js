// --- Live Clock ---
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const clock = document.getElementById('liveClock');
    if (clock) clock.textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- Dropdown Population ---
function populateJackpotMonths() {
    const jackpots = JSON.parse(localStorage.getItem('jackpots_A')) || [];
    const months = Array.from(new Set(jackpots.map(j => j.date ? j.date.slice(0, 7) : null).filter(Boolean)));
    months.sort((a, b) => b.localeCompare(a));
    const select = document.getElementById('jackpotMonth');
    if (select) {
        select.innerHTML = months.length ? months.map(m => `<option value="${m}">${m}</option>`).join('') : `<option value="${new Date().toISOString().slice(0,7)}">${new Date().toISOString().slice(0,7)}</option>`;
        const todayMonth = new Date().toISOString().slice(0,7);
        select.value = months.includes(todayMonth) ? todayMonth : (months[0] || todayMonth);
    }
}
function populateWinLossMonths() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const months = Array.from(new Set(winLosses.map(j => j.date ? j.date.slice(0, 7) : null).filter(Boolean)));
    months.sort((a, b) => b.localeCompare(a));
    const select = document.getElementById('winlossMonth');
    if (select) {
        select.innerHTML = months.length ? months.map(m => `<option value="${m}">${m}</option>`).join('') : `<option value="${new Date().toISOString().slice(0,7)}">${new Date().toISOString().slice(0,7)}</option>`;
        const todayMonth = new Date().toISOString().slice(0,7);
        select.value = months.includes(todayMonth) ? todayMonth : (months[0] || todayMonth);
    }
}

// --- Widget Update Functions ---
function showJackpot(view) {
    updateJackpot();
    updateJackpotDayInput();
}
function showWinLoss(view) {
    updateWinLoss();
    updateWinLossDayInput();
}
function updateJackpot() {
    const jackpots = JSON.parse(localStorage.getItem('jackpots_A')) || [];
    const selectedMonth = document.getElementById('jackpotMonth').value;
    const view = document.getElementById('jackpotView').value;
    const selectedDay = document.getElementById('jackpotDay').value;
    let total = 0;
    if (view === 'daily' && selectedDay) {
        jackpots.forEach(j => {
            if (j.date === selectedDay) total += Number(j.amount);
        });
    } else if (view === 'monthly') {
        jackpots.forEach(j => {
            if (j.date && j.date.startsWith(selectedMonth)) total += Number(j.amount);
        });
    } else if (view === 'yearly') {
        const year = selectedMonth.slice(0, 4);
        jackpots.forEach(j => {
            if (j.date && j.date.startsWith(year)) total += Number(j.amount);
        });
    }
    document.getElementById('jackpotCount').textContent = total.toLocaleString();
}
function updateWinLoss() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const selectedMonth = document.getElementById('winlossMonth').value;
    const view = document.getElementById('winlossView').value;
    const selectedDay = document.getElementById('winlossDay').value;
    let total = 0;
    if (view === 'daily' && selectedDay) {
        winLosses.forEach(wl => {
            if (wl.date === selectedDay) total += Number(wl.amount);
        });
    } else if (view === 'monthly') {
        winLosses.forEach(wl => {
            if (wl.date && wl.date.startsWith(selectedMonth)) total += Number(wl.amount);
        });
    } else if (view === 'yearly') {
        const year = selectedMonth.slice(0, 4);
        winLosses.forEach(wl => {
            if (wl.date && wl.date.startsWith(year)) total += Number(wl.amount);
        });
    }
    document.getElementById('winLossValue').textContent = "₱" + total.toLocaleString();
    updateLastWinLoss();
    renderWinLossChart();
}
function updateLastWinLoss() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const lastDiv = document.getElementById('lastWinLoss');
    if (!lastDiv) return;
    if (winLosses.length === 0) {
        lastDiv.textContent = "No Win/Loss entry yet.";
    } else {
        const last = winLosses[winLosses.length - 1];
        lastDiv.textContent = `Last: ₱${Number(last.amount).toLocaleString()} (${last.date})`;
    }
}

// --- Date Input Visibility ---
function updateJackpotDayInput() {
    const view = document.getElementById('jackpotView').value;
    document.getElementById('jackpotDay').parentElement.style.display = (view === 'daily') ? '' : 'none';
}
function updateWinLossDayInput() {
    const view = document.getElementById('winlossView').value;
    document.getElementById('winlossDay').parentElement.style.display = (view === 'daily') ? '' : 'none';
}

// --- On Load Setup ---
function setTodayDropdowns() {
    populateJackpotMonths();
    populateWinLossMonths();
    const today = new Date().toISOString().slice(0,10);
    document.getElementById('jackpotDay').value = today;
    document.getElementById('winlossDay').value = today;
    updateJackpotDayInput();
    updateWinLossDayInput();
}

// --- Technician On Duty Display ---
function displayOnDutyTechs() {
    const data = JSON.parse(localStorage.getItem('onDutyTechnician_A'));
    const el = document.getElementById('onDutyTechs');
    if (!el) return;
    if (!data) {
        el.innerHTML = "<span style='color:#888;'>No data set.</span>";
        return;
    }
    let html = "";
    if (data.shiftDate)
        html += `<div class="duty-row"><span class="duty-label">Date:</span><span class="duty-value">${data.shiftDate}</span></div>`;
    if (data.shiftTime)
        html += `<div class="duty-row"><span class="duty-label">Shift:</span><span class="duty-value">${data.shiftTime}</span></div>`;
    if (data.supervisor)
        html += `<div class="duty-row"><span class="duty-label">Supervisor:</span><span class="duty-value">${data.supervisor}</span></div>`;
    if (data.osmEng)
        html += `<div class="duty-row"><span class="duty-label">OSM Eng.:</span><span class="duty-value">${data.osmEng}</span></div>`;
    if (Array.isArray(data.teamLeaders) && data.teamLeaders.length)
        html += `<div class="duty-row"><span class="duty-label">Team Leader(s):</span><span class="duty-value">${data.teamLeaders.join(", ")}</span></div>`;
    if (Array.isArray(data.technicians) && data.technicians.length)
        html += `<div class="duty-row"><span class="duty-label">Technician(s):</span><span class="duty-value">${data.technicians.join(", ")}</span></div>`;
    el.innerHTML = html || "<span style='color:#888;'>No data set.</span>";
}

// --- Reset Functions ---
function resetOperational() {
    if (confirm("Reset operational machine count?")) {
        localStorage.removeItem('machinesOperationalCount');
        document.getElementById('machinesOperationalCount').textContent = 0;
    }
}
function resetNonOperational() {
    if (confirm("Reset non-operational machine count?")) {
        localStorage.removeItem('machinesNonOperationalCount');
        document.getElementById('machinesNonOperationalCount').textContent = 0;
    }
}
function resetOnDuty() {
    if (confirm("Are you sure you want to reset technicians on duty?")) {
        localStorage.removeItem('onDutyTechnician_A');
        displayOnDutyTechs();
    }
}

// --- Chart Rendering ---
function renderWinLossChart() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const selectedMonth = document.getElementById('winlossMonth').value;
    const daily = {};
    winLosses.forEach(wl => {
        if (wl.date && wl.date.startsWith(selectedMonth)) {
            daily[wl.date] = (daily[wl.date] || 0) + Number(wl.amount);
        }
    });
    const labels = Object.keys(daily).sort();
    const data = labels.map(day => daily[day]);
    const ctx = document.getElementById('winLossChart').getContext('2d');
    if (window.winLossChartInstance) window.winLossChartInstance.destroy();
    window.winLossChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Win/Loss',
                data,
                fill: true,
                borderColor: '#16a085',
                backgroundColor: 'rgba(26,188,156,0.12)',
                pointBackgroundColor: '#1abc9c',
                pointBorderColor: '#fff',
                pointRadius: 6,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#16a085',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#1abc9c',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#16a085', font: { weight: 'bold' } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#e0f7fa' },
                    ticks: { color: '#16a085', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// --- Modal Helpers ---
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
    if(id === 'addJackpotModal') document.getElementById('addJackpotMsg').innerHTML = '';
    if(id === 'addWinLossModal') document.getElementById('addWinLossMsg').innerHTML = '';
    if(id === 'addOnDutyModal') document.getElementById('addOnDutyMsg').innerHTML = '';
    if(id === 'addOperationalModal') document.getElementById('addOperationalMsg').innerHTML = '';
    if(id === 'addNonOperationalModal') document.getElementById('addNonOperationalMsg').innerHTML = '';
}

// --- Add Jackpot ---
document.getElementById('addJackpotForm').onsubmit = function(e) {
    e.preventDefault();
    const amount = document.getElementById('jackpotAmount').value.trim();
    const selectedMonth = document.getElementById('jackpotMonth').value;
    const today = new Date().toISOString().slice(0,10);
    const date = today.startsWith(selectedMonth) ? today : (selectedMonth + '-01');
    if (!amount || !date) {
        document.getElementById('addJackpotMsg').innerHTML = '<div class="error-msg">Please enter jackpot amount and select date.</div>';
        return;
    }
    let jackpots = JSON.parse(localStorage.getItem('jackpots_A')) || [];
    jackpots.push({ amount: Number(amount), date });
    localStorage.setItem('jackpots_A', JSON.stringify(jackpots));
    document.getElementById('addJackpotMsg').innerHTML = '<div class="success-msg">Jackpot added!</div>';
    this.reset();
    setTodayDropdowns();
    updateJackpot();
    setTimeout(() => { closeModal('addJackpotModal'); }, 600);
};

// --- Add Win/Loss ---
document.getElementById('addWinLossForm').onsubmit = function(e) {
    e.preventDefault();
    const date = document.getElementById('winLossDateInput').value;
    const amount = document.getElementById('winLossAmount').value.trim();
    if (!date || !amount) {
        document.getElementById('addWinLossMsg').innerHTML = '<div class="error-msg">Please fill in all fields.</div>';
        return;
    }
    let winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    winLosses.push({ date, amount: Number(amount) });
    localStorage.setItem('winLosses_A', JSON.stringify(winLosses));
    document.getElementById('addWinLossMsg').innerHTML = '<div class="success-msg">Win/Loss entry added!</div>';
    this.reset();
    setTodayDropdowns();
    updateWinLoss();
    setTimeout(() => { closeModal('addWinLossModal'); }, 600);
};

// --- Add Technician On Duty ---
document.getElementById('addOnDutyForm').onsubmit = function(e) {
    e.preventDefault();
    const shiftDate = document.getElementById('onDutyDate').value;
    const shiftTime = document.getElementById('onDutyShift').value;
    const supervisor = document.getElementById('onDutySupervisor').value;
    const osmEng = document.getElementById('onDutyOsmEng').value;
    const teamLeaders = document.getElementById('onDutyTeamLeaders').value.split(',').map(s => s.trim()).filter(Boolean);
    const technicians = document.getElementById('onDutyTechnicians').value.split(',').map(s => s.trim()).filter(Boolean);

    if (!shiftDate || !shiftTime || !supervisor || !osmEng) {
        document.getElementById('addOnDutyMsg').innerHTML = '<div class="error-msg">Please fill in all required fields.</div>';
        return;
    }

    const data = { shiftDate, shiftTime, supervisor, osmEng, teamLeaders, technicians };
    localStorage.setItem('onDutyTechnician_A', JSON.stringify(data));
    document.getElementById('addOnDutyMsg').innerHTML = '<div class="success-msg">On Duty updated!</div>';
    this.reset();
    displayOnDutyTechs();
    setTimeout(() => { closeModal('addOnDutyModal'); }, 600);
};

// --- Operational/Non-Operational ---
document.getElementById('addOperationalForm').onsubmit = function(e) {
    e.preventDefault();
    const val = document.getElementById('operationalInput').value;
    localStorage.setItem('machinesOperationalCount', val);
    document.getElementById('addOperationalMsg').innerHTML = '<div class="success-msg">Saved!</div>';
    document.getElementById('machinesOperationalCount').textContent = val;
    setTimeout(() => { closeModal('addOperationalModal'); }, 600);
};
document.getElementById('addNonOperationalForm').onsubmit = function(e) {
    e.preventDefault();
    const val = document.getElementById('nonOperationalInput').value;
    localStorage.setItem('machinesNonOperationalCount', val);
    document.getElementById('addNonOperationalMsg').innerHTML = '<div class="success-msg">Saved!</div>';
    document.getElementById('machinesNonOperationalCount').textContent = val;
    setTimeout(() => { closeModal('addNonOperationalModal'); }, 600);
};

// --- On load ---
document.getElementById('machinesOperationalCount').textContent = localStorage.getItem('machinesOperationalCount') || 0;
document.getElementById('machinesNonOperationalCount').textContent = localStorage.getItem('machinesNonOperationalCount') || 0;
updateLastWinLoss();

// --- JACKPOT TABLE MODAL LOGIC ---
document.getElementById('jackpotWidget').addEventListener('click', function(e) {
    if (e.target.closest('button')) return;
    openJackpotTableModal();
});
function openJackpotTableModal() {
    const jackpots = JSON.parse(localStorage.getItem('jackpots_A')) || [];
    const selectedMonth = document.getElementById('jackpotMonth').value;
    const view = document.getElementById('jackpotView').value;
    const selectedDay = document.getElementById('jackpotDay').value;
    let filtered = [];
    if (view === 'daily' && selectedDay) {
        filtered = jackpots.filter(j => j.date === selectedDay);
    } else if (view === 'monthly') {
        filtered = jackpots.filter(j => j.date && j.date.startsWith(selectedMonth));
    } else if (view === 'yearly') {
        const year = selectedMonth.slice(0, 4);
        filtered = jackpots.filter(j => j.date && j.date.startsWith(year));
    }
    let html = '';
    if (filtered.length === 0) {
        html = "<div style='color:#888'>No jackpot data for this period.</div>";
    } else {
        html = `<table class="jackpot-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Jackpot Amount</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(j => `
                    <tr>
                        <td>${j.date}</td>
                        <td>₱${Number(j.amount).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    }
    document.getElementById('jackpotTableContainer').innerHTML = html;
    openModal('jackpotTableModal');
}

// --- WIN/LOSS TABLE MODAL LOGIC ---
document.getElementById('winLossWidget').addEventListener('click', function(e) {
    if (e.target.closest('button')) return;
    openWinLossTableModal();
});
function openWinLossTableModal() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const selectedMonth = document.getElementById('winlossMonth').value;
    const view = document.getElementById('winlossView').value;
    const selectedDay = document.getElementById('winlossDay').value;
    let filtered = [];
    if (view === 'daily' && selectedDay) {
        filtered = winLosses.filter(wl => wl.date === selectedDay);
    } else if (view === 'monthly') {
        filtered = winLosses.filter(wl => wl.date && wl.date.startsWith(selectedMonth));
    } else if (view === 'yearly') {
        const year = selectedMonth.slice(0, 4);
        filtered = winLosses.filter(wl => wl.date && wl.date.startsWith(year));
    }
    let html = '';
    if (filtered.length === 0) {
        html = "<div style='color:#888'>No Win/Loss data for this period.</div>";
    } else {
        html = `<table class="jackpot-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Win/Loss Amount</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.map(wl => `
                    <tr>
                        <td>${wl.date}</td>
                        <td>₱${Number(wl.amount).toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>`;
    }
    document.getElementById('winLossTableContainer').innerHTML = html;
    openModal('winLossTableModal');
}
function exportWinLossToExcel() {
    const winLosses = JSON.parse(localStorage.getItem('winLosses_A')) || [];
    const selectedMonth = document.getElementById('winlossMonth').value;
    const view = document.getElementById('winlossView').value;
    const selectedDay = document.getElementById('winlossDay').value;
    let filtered = [];
    let filename = '';
    if (view === 'daily' && selectedDay) {
        filtered = winLosses.filter(wl => wl.date === selectedDay);
        filename = `winloss-data-${selectedDay}.csv`;
    } else if (view === 'monthly') {
        filtered = winLosses.filter(wl => wl.date && wl.date.startsWith(selectedMonth));
        filename = `winloss-data-${selectedMonth}.csv`;
    } else if (view === 'yearly') {
        const year = selectedMonth.slice(0, 4);
        filtered = winLosses.filter(wl => wl.date && wl.date.startsWith(year));
        filename = `winloss-data-${year}.csv`;
    }
    if (filtered.length === 0) {
        alert("No Win/Loss data to export for this period.");
        return;
    }
    let csv = "Date,Win/Loss Amount\n";
    filtered.forEach(wl => {
        csv += `"${wl.date}","${wl.amount}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// --- Event Listeners for Date/Dropdown Changes ---
document.getElementById('jackpotMonth').addEventListener('change', updateJackpot);
document.getElementById('jackpotView').addEventListener('change', function() {
    showJackpot(this.value);
});
document.getElementById('jackpotDay').addEventListener('change', updateJackpot);

document.getElementById('winlossMonth').addEventListener('change', updateWinLoss);
document.getElementById('winlossView').addEventListener('change', function() {
    showWinLoss(this.value);
});
document.getElementById('winlossDay').addEventListener('change', updateWinLoss);

// --- Keyboard Accessibility ---
document.getElementById('winLossWidget').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') openWinLossTableModal();
});
document.getElementById('jackpotWidget').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') openJackpotTableModal();
});

// --- Initial Setup ---
setTodayDropdowns();
updateJackpot();
updateWinLoss();
displayOnDutyTechs();