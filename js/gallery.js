$(document).ready(function() {
    // AJAX kérés az adatok lekérésére
    $.getJSON('http://localhost/Vili_Massage_WEB/Backend/php/imageWrite.php', function(data) {
        var gallery = $('#galleryAll');

        // Adatok feldolgozása
        data.forEach(function(item) {
            var galleryItem = `
                <div class="col-md-3 mb-4 gallery-item">
                    <a href="../Backend/${item.image_path}" data-lightbox="gallery" data-title="${item.title}">
                        <img src="../Backend/${item.image_path}" alt="${item.title}" class="img-fluid">
                    </a>
                </div>
            `;
            gallery.append(galleryItem);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Hiba történt az adatok lekérésekor:', textStatus, errorThrown);
    });
});