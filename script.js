let date = new Date();
let selectedDate = new Date();
// Yerel hafızadan etkinlikleri çek
let events = JSON.parse(localStorage.getItem('cal-events')) || {};

// Özel Günler Veritabanı
const specialDays = { 
    "1-1": "Yılbaşı", 
    "23-4": "Ulusal Egemenlik ve Çocuk Bayramı",
    "1-5": "Emek ve Dayanışma Günü",
    "19-5": "Gençlik ve Spor Bayramı",
    "15-7": "Demokrasi Günü",
    "30-8": "Zafer Bayramı",
    "29-10": "Cumhuriyet Bayramı", 
    "10-11": "Atatürk'ü Anma Günü" 
};

function renderCalendar() {
    const daysGrid = document.getElementById('days-grid');
    daysGrid.innerHTML = "";
    const viewYear = date.getFullYear();
    const viewMonth = date.getMonth();

    // Başlığı Güncelle
    document.getElementById('month-year-title').innerText = 
        new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(date);

    // Ayın ilk gününün haftanın hangi gününe geldiğini bul (Pzt=0 yapmak için)
    const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Boş kutucuklar
    for (let x = 0; x < firstDay; x++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = "day empty";
        daysGrid.appendChild(emptyDiv);
    }

    // Günleri oluştur
    for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.innerText = i;
        
        const dateKey = `${i}-${viewMonth}-${viewYear}`;
        const specialKey = `${i}-${viewMonth + 1}`;
        
        // 1. Kendi Etkinliklerin Varsa Nokta Koy ve Tooltip Ekle
        if (events[dateKey]) {
            dayDiv.classList.add('has-event');
            dayDiv.setAttribute('title', `${events[dateKey].length} Etkinlik Mevcut`);
        }

        // 2. Özel Gün Varsa Rengi Değiştir ve Tooltip Ekle
        if (specialDays[specialKey]) {
            dayDiv.classList.add('special-day');
            // Eğer hem etkinlik hem özel gün varsa ikisini de göster
            const currentTitle = dayDiv.getAttribute('title') || "";
            dayDiv.setAttribute('title', (currentTitle ? currentTitle + " & " : "") + specialDays[specialKey]);
        }
        
        // Bugün işaretlemesi
        const today = new Date();
        if (i === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
            dayDiv.classList.add('today');
        }

        // Seçili gün işaretlemesi
        if (i === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear()) {
            dayDiv.classList.add('selected');
        }

        dayDiv.onclick = () => selectDay(i, viewMonth, viewYear);
        daysGrid.appendChild(dayDiv);
    }
}

function selectDay(day, month, year) {
    selectedDate = new Date(year, month, day);
    document.getElementById('selected-day-num').innerText = day;
    document.getElementById('selected-day-name').innerText = 
        selectedDate.toLocaleDateString('tr-TR', { month: 'long', weekday: 'long' });
    
    showEvents();
    renderCalendar();
}

function showEvents() {
    const dateKey = `${selectedDate.getDate()}-${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
    const listDisplay = document.getElementById('event-list-display');
    listDisplay.innerHTML = "";

    if (events[dateKey]) {
        events[dateKey].forEach((msg, index) => {
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <span>${msg}</span>
                <button onclick="deleteEvent(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:10px; float:right;">Sil</button>
            `;
            listDisplay.appendChild(item);
        });
    } else {
        listDisplay.innerHTML = "<p style='opacity:0.3; font-size:13px;'>Henüz plan yok.</p>";
    }
}

function saveEvent() {
    const input = document.getElementById('eventInput');
    if (!input.value.trim()) return;

    const dateKey = `${selectedDate.getDate()}-${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
    if (!events[dateKey]) events[dateKey] = [];
    
    events[dateKey].push(input.value.trim());
    localStorage.setItem('cal-events', JSON.stringify(events));
    input.value = "";
    showEvents();
    renderCalendar();
}

function deleteEvent(index) {
    const dateKey = `${selectedDate.getDate()}-${selectedDate.getMonth()}-${selectedDate.getFullYear()}`;
    events[dateKey].splice(index, 1);
    if (events[dateKey].length === 0) delete events[dateKey];
    
    localStorage.setItem('cal-events', JSON.stringify(events));
    showEvents();
    renderCalendar();
}

function changeMonth(dir) {
    date.setMonth(date.getMonth() + dir);
    renderCalendar();
}

// Başlatma
selectDay(new Date().getDate(), new Date().getMonth(), new Date().getFullYear());
