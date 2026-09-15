const formMessage = document.getElementById("formMessage");
const messageContainer = document.querySelector(".card-message");


// ============================================================
// LOAD UCAPAN DARI GOOGLE APPS SCRIPT - JSONP
// ============================================================

function loadMessages() {

    return new Promise(function(resolve) {

        const callbackName =
            "messageCallback_" + Date.now();

        // ========================================================
        // CALLBACK
        // ========================================================

        window[callbackName] = function(result) {

            console.log("HASIL API UCAPAN:", result);

            const script =
                document.getElementById(callbackName);

            if (script) {
                script.remove();
            }

            delete window[callbackName];

            if (!result || result.status !== true) {

                console.error(
                    "API ucapan gagal:",
                    result?.message || "Tidak diketahui"
                );

                resolve([]);

                return;
            }

            const messages =
                result.data || [];

            // ====================================================
            // TAMPILKAN DATA
            // ====================================================

            renderMessages(messages);

            resolve(messages);
        };


        // ========================================================
        // SCRIPT JSONP
        // ========================================================

        const script =
            document.createElement("script");

        script.id =
            callbackName;

        script.src =
            API_URL +
            "?action=getMessages" +
            "&callback=" +
            encodeURIComponent(callbackName) +
            "&_=" +
            Date.now();


        // ========================================================
        // ERROR
        // ========================================================

        script.onerror = function() {

            console.error(
                "Gagal mengambil ucapan dari API"
            );

            script.remove();

            delete window[callbackName];

            resolve([]);
        };


        document.body.appendChild(script);
    });
}



// ============================================================
// TAMPILKAN SEMUA UCAPAN
// ============================================================

function renderMessages(messages) {

    if (!messageContainer) {
        return;
    }

    messageContainer.innerHTML = "";


    if (!messages || messages.length === 0) {

        messageContainer.innerHTML = `
            <div class="message-empty">
                Belum ada ucapan.
            </div>
        `;

        return;
    }


    // ========================================================
    // URUTKAN TERBARU DI ATAS
    // ========================================================

    const sortedMessages =
        [...messages].reverse();


    sortedMessages.forEach(function(message) {

        const card =
            createMessageCard(message);

        messageContainer.appendChild(card);

    });
}



// ============================================================
// MEMBUAT CARD UCAPAN
// ============================================================

function createMessageCard(message) {

    const card =
        document.createElement("div");

    card.className =
        "message-item";


    // ========================================================
    // NAMA
    // ========================================================

    const nama =
        escapeHTML(
            message.nama ||
            message.Nama ||
            message["Nama Tamu"] ||
            "-"
        );


    // ========================================================
    // HUBUNGAN
    // ========================================================

    const hubungan =
        escapeHTML(
            message.hubungan ||
            message.Hubungan ||
            "-"
        );


    // ========================================================
    // PESAN
    // ========================================================

    const pesan =
        escapeHTML(
            message.pesan ||
            message.Pesan ||
            message.ucapan ||
            message.Ucapan ||
            ""
        );


    // ========================================================
    // TANGGAL
    // ========================================================

    const timestamp =
        formatDate(
            message.timestamp ||
            message.Timestamp ||
            message.tanggal ||
            message.Tanggal
        );


    // ========================================================
    // HTML CARD
    // ========================================================

    card.innerHTML = `

        <div class="message-header">

            <div class="message-name">
                ${nama}
            </div>

            ${
                timestamp
                    ? `
                        <div class="message-date">
                            ${timestamp}
                        </div>
                    `
                    : ""
            }

        </div>

        <div class="message-relation">
            ${hubungan}
        </div>

        <div class="message-text">
            ${pesan}
        </div>

    `;


    return card;
}



// ============================================================
// SUBMIT FORM UCAPAN
// ============================================================

if (formMessage) {

    formMessage.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // ==================================================
            // AMBIL DATA FORM
            // ==================================================

            const formData =
                new FormData(formMessage);


            const nama =
                String(
                    formData.get("nama") || ""
                ).trim();


            const hubungan =
                String(
                    formData.get("hubungan") || ""
                ).trim();


            const pesan =
                String(
                    formData.get("pesan") || ""
                ).trim();


            // ==================================================
            // VALIDASI
            // ==================================================

            if (!nama) {

                alert(
                    "Silakan masukkan nama."
                );

                return;
            }


            if (!hubungan) {

                alert(
                    "Silakan masukkan hubungan."
                );

                return;
            }


            if (!pesan) {

                alert(
                    "Silakan tuliskan ucapan."
                );

                return;
            }


            // ==================================================
            // TOMBOL
            // ==================================================

            const button =
                formMessage.querySelector(
                    'button[type="submit"]'
                );


            const originalButtonHTML =
                button
                    ? button.innerHTML
                    : "Send";


            if (button) {

                button.disabled = true;

                button.innerHTML =
                    "Mengirim...";
            }


            // ==================================================
            // BUAT HIDDEN IFRAME
            // ==================================================

            const iframeName =
                "messageFrame_" + Date.now();


            const iframe =
                document.createElement("iframe");


            iframe.name =
                iframeName;


            iframe.style.display =
                "none";


            document.body.appendChild(
                iframe
            );


            // ==================================================
            // BUAT FORM POST
            // ==================================================

            const submitForm =
                document.createElement("form");


            submitForm.method =
                "POST";


            submitForm.action =
                API_URL;


            submitForm.target =
                iframeName;


            submitForm.style.display =
                "none";


            // ==================================================
            // INPUT HIDDEN
            // ==================================================

            function addHiddenInput(
                name,
                value
            ) {

                const input =
                    document.createElement("input");


                input.type =
                    "hidden";


                input.name =
                    name;


                input.value =
                    value;


                submitForm.appendChild(
                    input
                );
            }


            // ==================================================
            // DATA
            // ==================================================

            addHiddenInput(
                "action",
                "addMessage"
            );


            addHiddenInput(
                "nama",
                nama
            );


            addHiddenInput(
                "hubungan",
                hubungan
            );


            addHiddenInput(
                "pesan",
                pesan
            );


            // ==================================================
            // MASUKKAN FORM
            // ==================================================

            document.body.appendChild(
                submitForm
            );


            // ==================================================
            // KIRIM KE GOOGLE APPS SCRIPT
            // ==================================================

            console.log(
                "Mengirim ucapan:",
                {
                    nama: nama,
                    hubungan: hubungan,
                    pesan: pesan
                }
            );


            submitForm.submit();


            // ==================================================
            // TUNGGU REQUEST
            // ==================================================

            setTimeout(
                function() {

                    console.log(
                        "Request ucapan telah dikirim ke server."
                    );


                    // Bersihkan
                    submitForm.remove();

                    iframe.remove();


                    // Reset form
                    formMessage.reset();


                    // Kembalikan tombol
                    if (button) {

                        button.disabled =
                            false;

                        button.innerHTML =
                            originalButtonHTML;
                    }


                    // ==================================================
                    // CATATAN
                    // ==================================================
                    // Karena POST menggunakan hidden iframe,
                    // browser tidak memberikan response JSON
                    // kepada JavaScript.
                    //
                    // Jadi kita tidak menggunakan:
                    // response.ok
                    // response.json()
                    // response.status
                    // ==================================================


                    alert(
                        "Ucapan telah dikirim. Terima kasih ❤️"
                    );


                    // ==================================================
                    // AMBIL ULANG UCAPAN
                    // ==================================================

                    setTimeout(
                        function() {

                            loadMessages();

                        },
                        500
                    );


                },
                1500
            );

        }
    );
}



// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}



// ============================================================
// FORMAT TANGGAL
// ============================================================

function formatDate(value) {

    if (!value) {

        return "";

    }


    try {

        const date =
            new Date(value);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    } catch (error) {

        return String(value);

    }
}



// ============================================================
// LOAD SAAT WEBSITE DIBUKA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadMessages();

    }
);