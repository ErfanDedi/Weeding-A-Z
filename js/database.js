
// ============================================================
// DATABASE.JS
// DATA TAMU UNDANGAN
// ============================================================

function getTamu() {
    return new Promise(function (resolve) {

        const callbackName =
            "tamuCallback_" + Date.now();

        // Fungsi callback global
        window[callbackName] = function (result) {

            console.log("HASIL API TAMU:", result);

            // Hapus script JSONP
            const script =
                document.getElementById(callbackName);

            if (script) {
                script.remove();
            }

            // Hapus callback dari window
            delete window[callbackName];

            // Validasi hasil
            if (!result || result.status !== true) {

                console.error(
                    "API tamu gagal:",
                    result?.message || "Tidak diketahui"
                );

                resolve([]);
                return;
            }

            resolve(result.data || []);
        };

        // Buat script JSONP
        const script =
            document.createElement("script");

        script.id = callbackName;

        script.src =
            API_URL +
            "?action=getTamu" +
            "&callback=" +
            callbackName +
            "&_=" +
            Date.now();

        // Jika gagal memuat API
        script.onerror = function () {

            console.error(
                "Gagal mengambil data tamu dari API"
            );

            script.remove();

            delete window[callbackName];

            resolve([]);
        };

        document.body.appendChild(script);
    });
}


// ============================================================
// TAMPILKAN NAMA TAMU
// ============================================================

async function tampilkanNamaTamu() {

    const guestElement =
        document.getElementById("guestName");

    if (!guestElement) {
        console.error(
            "Element #guestName tidak ditemukan"
        );
        return;
    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const namaURL =
        params.get("to");

    console.log(
        "Nama dari URL:",
        namaURL
    );

    if (!namaURL) {

        guestElement.textContent =
            "Tamu Undangan";

        return;
    }

    const namaTamu =
        decodeURIComponent(namaURL);

    console.log(
        "Nama setelah decode:",
        namaTamu
    );

    const dataTamu =
        await getTamu();

    console.log(
        "DATA TAMU:",
        dataTamu
    );

    const tamu =
        dataTamu.find(function (data) {

            if (!data["Nama Tamu"]) {
                return false;
            }

            return (
                String(data["Nama Tamu"])
                    .trim()
                    .toLowerCase()
                ===
                String(namaTamu)
                    .trim()
                    .toLowerCase()
            );
        });

    if (tamu) {

        console.log(
            "TAMU DITEMUKAN:",
            tamu
        );

        guestElement.textContent =
            tamu["Nama Tamu"];

    } else {

        console.warn(
            "Nama tidak ditemukan:",
            namaTamu
        );

        // Tetap tampilkan nama dari URL
        guestElement.textContent =
            namaTamu;
    }
}


// ============================================================
// JALANKAN SAAT WEBSITE DIBUKA
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        tampilkanNamaTamu();

    }
);