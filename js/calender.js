
document.addEventListener("DOMContentLoaded", function () {

    const saveTheDate =
        document.getElementById("saveTheDate");

    if (!saveTheDate) return;

    saveTheDate.addEventListener("click", function (event) {

        event.preventDefault();

        // ==========================================
        // DATA ACARA
        // ==========================================

        const title =
            "Wedding of Tarisya & Aziz";

        const startDate =
            "20261004T080000";

        const endDate =
            "20261004T140000";

        const location =
            "Lokasi Pernikahan Tarisya & Aziz";

        const details =
            "Save The Date - Pernikahan Tarisya & Aziz";


        // ==========================================
        // GOOGLE CALENDAR
        // ==========================================

        const calendarURL =
            "https://calendar.google.com/calendar/render" +
            "?action=TEMPLATE" +
            "&text=" +
            encodeURIComponent(title) +
            "&dates=" +
            startDate +
            "/" +
            endDate +
            "&details=" +
            encodeURIComponent(details) +
            "&location=" +
            encodeURIComponent(location);


        // Buka Google Calendar
        window.open(
            calendarURL,
            "_blank"
        );

    });

});