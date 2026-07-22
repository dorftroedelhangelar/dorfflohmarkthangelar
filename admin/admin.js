document.querySelectorAll(".menu").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".menu")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const page = button.dataset.page;
        const content = document.getElementById("content");

        switch(page){

            case "dashboard":

                content.innerHTML = `
                    <h1>Dashboard</h1>
                    <p>Hier erscheint später die Übersicht.</p>
                `;
                break;

            case "verkaeufer":

                content.innerHTML = `
                    <h1>Verkäufer</h1>

                    <input
                        type="text"
                        placeholder="Verkäufer suchen..."
                        style="
                            width:100%;
                            max-width:450px;
                            padding:12px;
                            font-size:16px;
                            margin-top:15px;
                        "
                    >

                    <p style="margin-top:30px;">
                        Die Verkäuferverwaltung entsteht im nächsten Schritt.
                    </p>
                `;
                break;

            case "mail":

                content.innerHTML = `
                    <h1>Rundmails</h1>
                    <p>Modul folgt.</p>
                `;
                break;

            case "abstimmung":

                content.innerHTML = `
                    <h1>Abstimmungen</h1>
                    <p>Modul folgt.</p>
                `;
                break;

            case "einstellungen":

                content.innerHTML = `
                    <h1>Einstellungen</h1>
                    <p>Modul folgt.</p>
                `;
                break;

        }

    });

});