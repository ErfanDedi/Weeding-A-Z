document.addEventListener("DOMContentLoaded", function () {

    const loader = document.getElementById("page-loader");

    if (!loader) {
        return;
    }


    /*
    =====================================================
    CEK SEMUA DATA / PROSES AWAL
    =====================================================
    */

    let minimumLoading = new Promise(function (resolve) {

        setTimeout(function () {

            resolve();

        }, 1000);

    });


    /*
    =====================================================
    TUNGGU SAMPAI SEMUA ASSET SELESAI
    =====================================================
    */

    let pageLoaded = new Promise(function (resolve) {

        if (document.readyState === "complete") {

            resolve();

        } else {

            window.addEventListener(
                "load",
                resolve,
                {
                    once: true
                }
            );

        }

    });


    /*
    =====================================================
    TUNGGU DATA + ASSET
    =====================================================
    */

    Promise.all([
        minimumLoading,
        pageLoaded
    ])
    .then(function () {

        selesaiLoading();

    });

});


/*
=========================================================
SELESAI LOADING
=========================================================
*/

function selesaiLoading() {

    const loader =
        document.getElementById("page-loader");


    if (!loader) {
        return;
    }


    /*
    Beri sedikit waktu agar
    nama tamu / AOS selesai render
    */

    setTimeout(function () {

        loader.classList.add("hide");


        /*
        Hapus dari DOM setelah animasi
        */

        setTimeout(function () {

            loader.remove();

        }, 900);

    }, 300);

}