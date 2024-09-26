// Funkció az adatok lekérésére és megjelenítésére
async function fetchAndDisplayData() {
    try {
        // Lekérjük az adatokat az API-ról
        const response = await fetch('http://localhost/Vili_Massage_WEB/Backend/php/timeWrite.php');
        
        // Ellenőrizzük, hogy a lekérdezés sikeres volt-e
        if (!response.ok) {
            throw new Error('Hálózati hiba: ' + response.statusText);
        }
        
        // JSON formátumban olvassuk be az adatokat
        const data = await response.json();

        // Az adatok megjelenítése a div-ben
        const container = document.getElementById('idopontokosszes');
        
        // Ellenőrizzük, hogy a div létezik-e
        if (!container) {
            console.error('Az idopontokosszes div nem található.');
            return;
        }

        // Töröljük a div tartalmát az új adatok megjelenítése előtt
        container.innerHTML = '';

        // Készítünk egy row div-et a col-4 elemek számára
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';

        // Végigmegyünk az adatokat tartalmazó tömbön
        data.forEach(item => {
            // Ha a lefoglalt érték 1, akkor nem jelenítjük meg
            if (item.lefoglalt === '1') {
                displayText = ``;
            } else {
                // Készítünk egy új col-12 div elemet
                const colDiv = document.createElement('div');
                colDiv.className = 'col-12 col-md-6 mb-3 d-flex justify-content-between align-items-center';
                colDiv.setAttribute('data-idopont', item.idopont);  // Azonosítjuk az elemet az időponttal

                // Készítünk egy szöveges elemet a dátum és az állapot számára
                const textDiv = document.createElement('div');
                textDiv.className = 'd-flex align-items-center';
                textDiv.innerHTML = `${item.idopont} - Szabad`;

                // Készítünk egy gombot az áthelyezéshez
                const button = document.createElement('button');
                button.className = 'btn btn-primary btn-sm'; // Kis méretű gomb (reszponzív osztály)
                button.textContent = 'Lefoglalás';
                button.onclick = () => handleReservation(item, colDiv);  // Átadjuk az item-et és a colDiv-et

                // Hozzáadjuk a szöveget és a gombot a colDiv-hez
                colDiv.appendChild(textDiv);
                colDiv.appendChild(button);

                // Hozzáadjuk a col-12 div-et a row div-hez
                rowDiv.appendChild(colDiv);
            }
        });

        // Hozzáadjuk a row div-et a konténerhez
        container.appendChild(rowDiv);

    } catch (error) {
        console.error('Hiba történt az adatok lekérése közben:', error);
    }
}

// Funkció az időpont lefoglalására, elem eltávolítására, és mentésére a localStorage-ba
function handleReservation(item, colDiv) {
    const lefoglalando = document.getElementById('lefoglalando');

    if (!lefoglalando) {
        console.error('A lefoglalando div nem található.');
        return;
    }

    // Készítünk egy új div elemet a lefoglalandó időpont számára
    const reservationDiv = document.createElement('div');
    reservationDiv.className = 'idopont col-12 mb-3 text-warning d-flex justify-content-between align-items-center';
    reservationDiv.textContent = `${item.idopont}`;

    // Készítünk egy "Vissza" gombot
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-secondary btn-sm';  // Kis méretű és reszponzív gomb
    backButton.textContent = 'Vissza';
    backButton.onclick = () => {
        reservationDiv.remove(); // Töröljük a lefoglalandó időpontot
        // Helyezzük vissza az időpontot az idopontokosszes div-be
        document.getElementById('idopontokosszes').appendChild(colDiv);

        // Töröljük az időpontot a localStorage-ból
        removeFromLocalStorage(item.idopont);
    };

    // Hozzáadjuk a "Vissza" gombot a lefoglalandó div-hez
    reservationDiv.appendChild(backButton);

    // Hozzáadjuk a lefoglalandó div-hez
    lefoglalando.appendChild(reservationDiv);

    // Töröljük az adott elemet az idopontokosszes div-ből
    if (colDiv.parentNode) {
        colDiv.parentNode.removeChild(colDiv);  // Eltávolítja a colDiv-et a DOM-ból
    }

    // Mentjük az időpontot a localStorage-ba
    saveToLocalStorage(item.idopont);
}

// Funkció az időpont hozzáadására a localStorage-ban lévő "idopontok" tömbhöz
function saveToLocalStorage(idopont) {
    // Lekérjük a már létező időpontokat a localStorage-ból, ha léteznek
    let idopontok = JSON.parse(localStorage.getItem('idopontok')) || [];

    // Hozzáadjuk az új időpontot a tömbhöz
    idopontok.push(idopont);

    // Visszamentjük a frissített tömböt a localStorage-ba
    localStorage.setItem('idopontok', JSON.stringify(idopontok));
}

// Funkció az időpont eltávolítására a localStorage-ból
function removeFromLocalStorage(idopont) {
    // Lekérjük a már létező időpontokat a localStorage-ból
    let idopontok = JSON.parse(localStorage.getItem('idopontok')) || [];

    // Eltávolítjuk az időpontot a tömbből
    idopontok = idopontok.filter(i => i !== idopont);

    // Visszamentjük a frissített tömböt a localStorage-ba
    localStorage.setItem('idopontok', JSON.stringify(idopontok));
}

// Meghívjuk a funkciót, amikor a DOM teljesen betöltődött
document.addEventListener('DOMContentLoaded', fetchAndDisplayData);
