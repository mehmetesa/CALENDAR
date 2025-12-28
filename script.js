const daysGrid = document.getElementById('days-grid');
const monthYearText = document.getElementById('month-year');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

const clockElement = document.getElementById('clock');
const dayNumberElement = document.getElementById('day-number');
const dayNameElement = document.getElementById('day-name');

let date = new Date();

// Gerçek zamanlı saat fonksiyonu
function updateClock() {
    const now = new Date();
    clockElement.innerText = now.toLocaleTimeString('tr-TR');
    dayNumberElement.innerText = now.getDate();
    dayNameElement.innerText = now.toLocaleDateString('tr-TR', { month: 'long', weekday: 'long' });
}

function renderCalendar() {
    daysGrid.innerHTML = "";
    
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    monthYearText.innerText = `${monthNames[viewMonth]} ${viewYear}`;

    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Pazartesi'yi haftanın ilk günü yapmak için ayarlama
    let startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Boş günler (önceki aydan sarkanlar)
    for (let x = 0; x < startDay; x++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('day', 'empty');
        daysGrid.appendChild(emptyDiv);
    }

    // Ayın günleri
    for (let i = 1; i <= lastDay; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerText = i;

        // Bugün kontrolü
        const today = new Date();
        if (i === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        daysGrid.appendChild(dayDiv);
    }
}

prevBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// Başlat
setInterval(updateClock, 1000);
updateClock();
renderCalendar();
