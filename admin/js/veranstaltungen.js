  const API =

  "https://script.google.com/macros/s/AKfycbxxCIRNnzJAvZzOnwFiLSsiyT7kCvlLkc_93P40RL7iI7b7CYZyNV_mhi7n8BF6w3la/exec";

  let veranstaltungen = [];
  let aktuelleVeranstaltung = null;
async function ladeVeranstaltungen() {

    const response = await fetch(API + "?format=veranstaltungen");

    const daten = await response.json();
  veranstaltungen = daten;
  


    const tbody = document.querySelector("#tblVeranstaltungen tbody");

    // Tabelle leeren
    tbody.innerHTML = "";

    daten.forEach(v => {

        const zeile = document.createElement("tr");

zeile.innerHTML = `
    <td>${v.id}</td>
    <td>${v.name}</td>
   <td>${formatiereDatum(v.datum)}</td>
    <td>${v.beginn}</td>
    <td>${v.ende}</td>
    <td>${v.ort}</td>
    <td>${v.status}</td>
   <td>

    <button onclick="bearbeiteVeranstaltung(${v.id})">
        ✏️
    </button>

    <button onclick="loescheVeranstaltung(${v.id})">
        🗑️
    </button>

</td>
`;

tbody.appendChild(zeile);

    });

}

  

ladeVeranstaltungen();

function sucheVeranstaltung(id) {

    return null;

}

function bearbeiteVeranstaltung(id) {

    const v = veranstaltungen.find(x => x.id == id);
aktuelleVeranstaltung = id;
    document.getElementById("txtName").value = v.name;
   const teile = v.datum.split(".");

if (teile.length === 3) {
    document.getElementById("txtDatum").value =
        teile[2] + "-" + teile[1] + "-" + teile[0];
} else {
    document.getElementById("txtDatum").value = v.datum;
}
    document.getElementById("txtOrt").value = v.ort;
    document.getElementById("txtBeginn").value = v.beginn;
    document.getElementById("txtEnde").value = v.ende;
    document.getElementById("txtStatus").value = v.status;

    document.getElementById("fensterNeueVeranstaltung").style.display = "block";
document.querySelector("#fensterNeueVeranstaltung h2").textContent =
    "Veranstaltung bearbeiten";
    const btn = document.getElementById("btnSpeichern");

btn.disabled = false;
btn.innerHTML = "💾 Änderungen speichern";
}
document.getElementById("btnNeu").addEventListener("click", neueVeranstaltung);

function neueVeranstaltung() {

   document.getElementById("fensterNeueVeranstaltung").style.display = "block";
   document.querySelector("#fensterNeueVeranstaltung h2").textContent =
    "Neue Veranstaltung";
   btn.disabled = false;
btn.innerHTML = "💾 Veranstaltung anlegen";

document.getElementById("txtName").value = "";
document.getElementById("txtDatum").value = "";
   document.getElementById("txtName").focus();



}

document.getElementById("btnAbbrechen").addEventListener("click", schliesseFenster);
document.getElementById("btnSpeichern").addEventListener("click", speichereVeranstaltung);
function schliesseFenster() {

    document.getElementById("fensterNeueVeranstaltung").style.display = "none";

}

async function loescheVeranstaltung(id) {

    const v = veranstaltungen.find(x => x.id == id);
    if (!confirm(
    'Möchten Sie die Veranstaltung "' + v.name + '" wirklich löschen?'
)) {
    return;
}
    try {

        const response = await fetch(
            API +
            "?format=loeschen" +
            "&id=" + encodeURIComponent(id)
        );

        const text = await response.text();

        if (text !== "OK") {
            throw new Error(text);
        }

        await ladeVeranstaltungen();

    } catch (err) {

        alert("Fehler beim Löschen:\n\n" + err.message);

    }

}

async function speichereVeranstaltung() {
const btn = document.getElementById("btnSpeichern");

btn.disabled = true;
btn.innerHTML = "⏳ Wird gespeichert...";
    const name = document.getElementById("txtName").value.trim();

    if (name === "") {
        alert("Bitte einen Namen eingeben.");
          btn.disabled = false;
          btn.innerHTML = "💾 Speichern";
        document.getElementById("txtName").focus();
        return;
    }

  const datum = document.getElementById("txtDatum").value;
const ort = document.getElementById("txtOrt").value;
const beginn = document.getElementById("txtBeginn").value;
const ende = document.getElementById("txtEnde").value;
const status = document.getElementById("txtStatus").value;
if (aktuelleVeranstaltung !== null) {

      
    const response = await fetch(
        API +
        "?format=update" +
        "&id=" + encodeURIComponent(aktuelleVeranstaltung) +
        "&name=" + encodeURIComponent(name) +
        "&datum=" + encodeURIComponent(datum) +
        "&beginn=" + encodeURIComponent(beginn) +
        "&ende=" + encodeURIComponent(ende) +
        "&ort=" + encodeURIComponent(ort) +
        "&status=" + encodeURIComponent(status)
    );

    const text = await response.text();


    if (text !== "OK") {
        throw new Error(text);
    }

    aktuelleVeranstaltung = null;

    await ladeVeranstaltungen();

    document.getElementById("fensterNeueVeranstaltung").style.display = "none";

    return;

}

try {

    const response = await fetch(
        API +
        "?format=speichern" +
        "&name=" + encodeURIComponent(name) +
        "&datum=" + encodeURIComponent(datum) +
        "&beginn=" + encodeURIComponent(beginn) +
        "&ende=" + encodeURIComponent(ende) +
        "&ort=" + encodeURIComponent(ort) +
        "&status=" + encodeURIComponent(status)
    );

    const text = await response.text();

    if (text !== "OK") {
        throw new Error(text);
    }

    await ladeVeranstaltungen();
    document.getElementById("fensterNeueVeranstaltung").style.display = "none";

    

} catch (err) {

     btn.disabled = false;
    btn.innerHTML = "💾 Speichern";
    alert("Fehler beim Speichern:\n\n" + err.message);
   
    

}
}
function formatiereDatum(datum) {

    if (!datum) return "";

    if (datum.includes(".")) {
        return datum;
    }

    const teile = datum.split("-");

    if (teile.length !== 3) {
        return datum;
    }

    return teile[2] + "." + teile[1] + "." + teile[0];

}
