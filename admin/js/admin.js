let verkaeufer = [];

async function ladeVerkaeufer() {

    try {

        const response = await fetch(DATA_URL);
        verkaeufer = await response.json();
      verkaeufer.sort((a, b) =>
    a.nachname.localeCompare(b.nachname, "de")
);

       zeigeVerkaeufer(verkaeufer);

document.getElementById("search").addEventListener("input", sucheVerkaeufer);

    } catch(err) {

        console.error(err);

    }

}

function zeigeVerkaeufer(liste){

    const container = document.getElementById("sellerList");

document.getElementById("anzahlVerkaeufer").textContent =
    `${liste.length} Verkäufer gefunden`;

container.innerHTML = "";

    liste.forEach((person,index) => {

        const div = document.createElement("div");

        div.className = "seller-item";

        div.innerHTML = `
            <strong>${person.nachname}</strong>
            ${person.strasse} ${person.hausnummer}
        `;

        div.onclick = () => zeigeDetails(person, div);

        container.appendChild(div);

    });
    
aktualisiereStatistik(liste);

}
function zeigeDetails(person, element = null){

    document.querySelectorAll(".seller-item")
        .forEach(e => e.classList.remove("active"));

    element.classList.add("active");

    document.querySelector(".seller-details").innerHTML = `

        <h2>${person.nachname}</h2>

        <table>

            <tr>
                <td>Straße</td>
                <td>${person.strasse} ${person.hausnummer}</td>
            </tr>

            <tr>
                <td>PLZ / Ort</td>
                <td>${person.plz} ${person.ort}</td>
            </tr>

<tr>
    <td>E-Mail</td>
    <td>${person.email || "-"}</td>
</tr>

<tr>
    <td>Anmeldeweg</td>
    <td>${person.anmeldeweg || "Formular"}</td>
</tr>


            <tr>
                <td>Warengruppe</td>
                <td>${person.warengruppe}</td>
            </tr>

            <tr>
                <td>Beschreibung</td>
                <td>${person.beschreibung || "-"}</td>
            </tr>

            <tr>
                <td>Stand</td>
                <td>${person.standnummer}</td>
            </tr>


        </table>
        <br>
       <a
    href="https://www.google.com/maps?q=${person.breitengrad},${person.laengengrad}"
    target="_blank"
    class="maps-link">
    🗺️ In Google Maps öffnen
</a>

<br><br>


<button id="btnBearbeiten" class="edit-btn">
    ✏️ Verkäufer bearbeiten
</button> 

    `;

}
function sucheVerkaeufer() {

    const suchtext = document
        .getElementById("search")
        .value
        .toLowerCase()
        .trim();

    const treffer = verkaeufer.filter(person => {

        return (
            person.nachname.toLowerCase().includes(suchtext) ||
            person.strasse.toLowerCase().includes(suchtext) ||
            (person.beschreibung || "").toLowerCase().includes(suchtext) ||
            person.warengruppe.toLowerCase().includes(suchtext)
        );

    });

    zeigeVerkaeufer(treffer);

}
function aktualisiereStatistik(liste){

    const statistik = {};

    liste.forEach(person => {

        const gruppe = person.warengruppe || "Sonstige";

        statistik[gruppe] = (statistik[gruppe] || 0) + 1;

    });

    let html = "";

    Object.keys(statistik)
        .sort()
        .forEach(gruppe => {

            html += `
                <div>
                    ${gruppe}: <strong>${statistik[gruppe]}</strong>
                </div>
            `;

        });

    document.getElementById("statistik").innerHTML = html;
    }

window.addEventListener("DOMContentLoaded", () => {

    ladeVerkaeufer();

    document.querySelectorAll(".menu").forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            switch (page) {

                case "dashboard":
                    window.location.href = "index.html";
                    break;

                case "verkaeufer":
                    window.location.href = "verkaeufer.html";
                    break;

                case "mail":
                    window.location.href = "rundmails.html";
                    break;

                case "abstimmung":
                    window.location.href = "abstimmungen.html";
                    break;

                case "einstellungen":
                    window.location.href = "einstellungen.html";
                    break;
            }

              });

    });

});