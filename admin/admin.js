let verkaeufer = [];

async function ladeVerkaeufer() {

    try {

        const response = await fetch(DATA_URL);
        verkaeufer = await response.json();

       zeigeVerkaeufer(verkaeufer);

document.getElementById("search").addEventListener("input", sucheVerkaeufer);

    } catch(err) {

        console.error(err);

    }

}

function zeigeVerkaeufer(liste){

    const container = document.getElementById("sellerList");

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

}
function zeigeDetails(person, element){

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

ladeVerkaeufer();