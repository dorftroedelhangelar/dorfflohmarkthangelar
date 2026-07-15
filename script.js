const map = L.map('map').setView([50.7729, 7.1855], 15);

let markerListe = [];

async function ladeEinstellungen() {

    const response = await fetch(
        DATA_URL.replace("format=json", "format=settings")
    );

    const settings = await response.json();

    document.getElementById("veranstaltung").textContent =
        "🏡 " + settings.Veranstaltung;

    document.getElementById("datum").textContent =
        "📅 " + settings.Datum;

    document.getElementById("uhrzeit").textContent =
        "🕙 " + settings.Uhrzeit;

}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
}).addTo(map);

async function ladeStaende() {

    markerListe.forEach(marker => map.removeLayer(marker));
    markerListe = [];

    const tbody = document.querySelector("#standTable tbody");
    tbody.innerHTML = "";

    const response = await fetch(DATA_URL);
    const daten = await response.json();

    document.getElementById("anzahlStaende").textContent =
        `📍 ${daten.length} Stand${daten.length === 1 ? "" : "e"} ${daten.length === 1 ? "nimmt" : "nehmen"} teil`;

    daten.forEach(stand => {

        if (!stand.breitengrad || !stand.laengengrad) return;

        const icon = L.divIcon({
            className: "stand-marker",
            html: `<div>${stand.standnummer}</div>`,
            iconSize: [36,36],
            iconAnchor: [18,18]
        });

        const marker = L.marker(
            [
                parseFloat(stand.breitengrad),
                parseFloat(stand.laengengrad)
            ],
            {
                icon: icon
            }
        ).addTo(map);

        marker.bindPopup(`
<div style="min-width:230px">

<h3 style="margin:0;color:#2e7d32;">
🏡 Stand ${stand.standnummer}
</h3>

<p>
<b>📍 ${stand.strasse} ${stand.hausnummer}</b><br>
${stand.plz} ${stand.ort}
</p>

<p>
<b>🛍 Warengruppe</b><br>
${stand.warengruppe || "-"}
</p>

${stand.beschreibung ? `
<p>
<b>📝 Beschreibung</b><br>
${stand.beschreibung}
</p>
` : ""}

<a
href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
`${stand.strasse} ${stand.hausnummer}, ${stand.plz} ${stand.ort}`
)}"
target="_blank"
style="
display:block;
padding:10px;
background:#2e7d32;
color:white;
text-align:center;
text-decoration:none;
border-radius:6px;
font-weight:bold;
">
🧭 Route starten
</a>

</div>
`);

        marker.stand = stand;
        markerListe.push(marker);

        const zeile = document.createElement("tr");
        zeile.dataset.warengruppe = (stand.warengruppe || "").toLowerCase();

        zeile.innerHTML = `
            <td>${stand.standnummer}</td>
            <td>${stand.strasse} ${stand.hausnummer}</td>
            <td>${stand.warengruppe || ""}</td>
            <td>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stand.strasse} ${stand.hausnummer}, ${stand.plz} ${stand.ort}`)}"
                   target="_blank">🧭</a>
            </td>
        `;

        zeile.addEventListener("click", () => {

            document
                .querySelectorAll("#standTable tbody tr")
                .forEach(z => z.classList.remove("aktiv"));

            zeile.classList.add("aktiv");

            map.setView(marker.getLatLng(), 18);

            marker.openPopup();

        });

        tbody.appendChild(zeile);

    });

}


document.getElementById("search").addEventListener("input", function () {

    const text = this.value.toLowerCase().trim();

    if (text === "") {

        document
            .querySelectorAll("#standTable tbody tr")
            .forEach(z => z.classList.remove("aktiv"));

        return;

    }

    const marker = markerListe.find(m => {

        const s = m.stand;

        return (
            String(s.standnummer).includes(text) ||
            (s.strasse || "").toLowerCase().includes(text) ||
            (s.warengruppe || "").toLowerCase().includes(text) ||
            (s.beschreibung || "").toLowerCase().includes(text)
        );

    });

    if (!marker) return;

    map.setView(marker.getLatLng(), 18);

    marker.openPopup();

    document
        .querySelectorAll("#standTable tbody tr")
        .forEach(z => z.classList.remove("aktiv"));

    document
        .querySelectorAll("#standTable tbody tr")
        .forEach(z => {

            if (z.cells[0].textContent == marker.stand.standnummer) {

                z.classList.add("aktiv");

                z.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        });

});

function filterWarengruppe(gruppe){

    gruppe = gruppe.toLowerCase();

    const zeilen = document.querySelectorAll("#standTable tbody tr");

    markerListe.forEach((marker,index)=>{

        const warengruppe =
            (marker.stand.warengruppe || "").toLowerCase();

        const sichtbar =
            gruppe==="alle" ||
            warengruppe.includes(gruppe);

        if(sichtbar){

            if(!map.hasLayer(marker)){
                marker.addTo(map);
            }

            zeilen[index].style.display="";

        }else{

            if(map.hasLayer(marker)){
                map.removeLayer(marker);
            }

            zeilen[index].style.display="none";

        }

    });

}

document.getElementById("btnRoute").addEventListener("click", async () => {

    const btn = document.getElementById("btnRoute");

    btn.disabled = true;
    btn.textContent = "⏳ Aktualisiere...";

    await ladeStaende();

    btn.textContent = "🔄 Karte aktualisieren";
    btn.disabled = false;

});

ladeEinstellungen();
ladeStaende();
document.getElementById("btnListe").addEventListener("click", () => {

    document.querySelector(".standliste").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});