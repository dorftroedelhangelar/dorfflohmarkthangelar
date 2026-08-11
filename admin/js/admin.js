let verkaeufer = [];
let aktiverVerkaeufer = null;
let aktivesElement = null;

async function ladeVerkaeufer() {

    try {

        const response = await fetch(DATA_URL + "?format=json");
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
    aktiverVerkaeufer = person;
    aktivesElement = element;
    document.querySelectorAll(".seller-item")
        .forEach(e => e.classList.remove("active"));

    if (element) {
    element.classList.add("active");
}

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
    const btn = document.getElementById("btnBearbeiten");

if (btn) {
    btn.onclick = bearbeiteVerkaeufer;
}

}
async function bearbeiteVerkaeufer() {

    const neuerName = prompt(
        "Nachname bearbeiten:",
        aktiverVerkaeufer.nachname
    );

    if (neuerName === null) return;

    const neueEmail = prompt(
        "E-Mail-Adresse bearbeiten:",
        aktiverVerkaeufer.email || ""
    );

    if (neueEmail === null) return;

    const neueWarengruppe = prompt(
        "Warengruppen bearbeiten (mit Komma trennen):",
        aktiverVerkaeufer.warengruppe || ""
    );

    if (neueWarengruppe === null) return;

    const neueBeschreibung = prompt(
        "Beschreibung bearbeiten:",
        aktiverVerkaeufer.beschreibung || ""
    );

    if (neueBeschreibung === null) return;

    try {

        const url =
            DATA_URL +
            "?format=updateVerkaeufer" +
            "&id=" + encodeURIComponent(aktiverVerkaeufer.id) +
            "&nachname=" + encodeURIComponent(neuerName) +
            "&email=" + encodeURIComponent(neueEmail) +
            "&warengruppe=" + encodeURIComponent(neueWarengruppe) +
            "&beschreibung=" + encodeURIComponent(neueBeschreibung);

        const response = await fetch(url);
        const ergebnis = await response.text();

        if (ergebnis !== "OK") {
            throw new Error(ergebnis);
        }

        aktiverVerkaeufer.nachname = neuerName;
        aktiverVerkaeufer.email = neueEmail;
        aktiverVerkaeufer.warengruppe = neueWarengruppe;
        aktiverVerkaeufer.beschreibung = neueBeschreibung;

        if (aktivesElement) {
            aktivesElement.querySelector("strong").textContent = neuerName;
        }

        zeigeDetails(aktiverVerkaeufer, aktivesElement);

        alert("Änderungen wurden gespeichert.");

    } catch (err) {

        console.error(err);
        alert("Fehler: " + err.message);

    }

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

        const gruppen = (person.warengruppe || "Sonstige")
            .split(",")
            .map(g => g.trim());

        gruppen.forEach(gruppe => {

            if (!gruppe) return;

            statistik[gruppe] = (statistik[gruppe] || 0) + 1;

        });

    });

    let html = "";

    Object.keys(statistik)
        .sort()
        .forEach(gruppe => {

            html += `
                <div class="stat-card">
                    <span class="stat-name">${gruppe}</span>
                    <span class="stat-count">${statistik[gruppe]}</span>
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
