document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Funkció az űrlap gomb állapotának frissítésére
    function updateSubmitButtonState() {
        if (nameInput.value.trim() === '') {
            submitButton.disabled = true;
        } else {
            submitButton.disabled = false;
        }
    }

    // Ellenőrizzük az input értékét és frissítjük a gomb állapotát
    nameInput.addEventListener('input', updateSubmitButtonState);
    
    // Űrlap elküldésének kezelése
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Megakadályozzuk az alapértelmezett form elküldést
        
        const name = nameInput.value.trim();
        // Lekérjük az időpontokat a localStorage-ból
        const reservations = JSON.parse(localStorage.getItem('idopontok')) || [];

        if (name === '' || reservations.length === 0) {
            alert('Kérlek, töltsd ki a nevet és válassz időpontot.');
            return;
        }

        try {
            // POST kérés a PHP fájlhoz
            const response = await fetch('http://localhost/Vili_Massage_WEB/Backend/php/makereservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    reservations: reservations
                }),
            });

            if (!response.ok) {
                throw new Error('Hálózati hiba: ' + response.statusText);
            }

            // Sikeres elküldés után alert üzenet
            alert(`Sikeres Foglalás!`);

            // Töröljük a form tartalmát, ha szükséges
            nameInput.value = '';
            localStorage.removeItem('idopontok'); // Töröljük az időpontokat a localStorage-ból
            updateSubmitButtonState();
        } catch (error) {
            console.error('Hiba történt az adatküldés közben:', error);
            alert('Hiba történt az időpontok lefoglalása közben.');
        }
    });

    // Inicializáljuk a gomb állapotát
    updateSubmitButtonState();
});
