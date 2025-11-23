/**
 * Enhanced QIS
 * by Oshimani
 * edited by IzzLenn
 *
 * Version für die aktuelle Notenspiegel-Seite der LUH
 * (angepasste Spaltenindizes und Status-Texte)
 */

// consts
const URL_PARAM_KEY_STATE = "state";
const URL_PARAM_VALUE_NOTEN_UEBERSICHT = "notenspiegelStudent";
const URL_PARAM_VALUE_PRUEFUNGS_ANMELDUNG = "prfAnmStudent";

// run
const urlParams = new URLSearchParams(location.search);
const state = urlParams.get(URL_PARAM_KEY_STATE);

// check site (Prüfungsan- und abmeldung, Info über angemeldete Prüfungen, ..., Notenübersicht)
switch (state) {
    // NOTENÜBERSICHT/NOTENSPIEGEL
    case URL_PARAM_VALUE_NOTEN_UEBERSICHT:
        initNotenUebersicht();
        break;
    case URL_PARAM_VALUE_PRUEFUNGS_ANMELDUNG:
        initPruefungsAnmeldung();
        break;
    default:
        console.log("[Enhanced QIS] could not identify site. No modifications.");
}

function initNotenUebersicht() {
    // 1. Tabelle aufräumen & einfärben
    const tableRows = getTableRows();
    formatTableCells(tableRows);

    // 2. Durchschnittsnote berechnen (nach dem Aufräumen)
    const rowsForAvg = getTableRows();
    const avgGrade = calcAvgGrade(rowsForAvg);

    // 3. Durchschnitt in "Note"-Spaltenüberschrift eintragen
    let noteCell;
    document.querySelectorAll("th.tabelleheader").forEach(e => {
        if (e.innerText.trim() === "Note") {
            noteCell = e;
        }
    });

    if (noteCell && !Number.isNaN(avgGrade)) {
        noteCell.innerText += ` (${avgGrade.toFixed(2)})`;
    }
}

function getTableRows() {
    /* zweite Tabelle im Formular = Notenspiegel-Tabelle */
    return document.querySelectorAll("form table ~ table tbody tr");
}

function calcAvgGrade(tableRows) {
    let arr = [];

    tableRows.forEach(row => {
        const cells = row.children;
        // nur "normale" Prüfungszeilen mit genug Spalten
        if (cells.length < 7) return;

        // Spaltenstruktur laut HTML:
        // 0 PrfNr | 1 Bezeichnung | 2 Prf.Art | 3 Semester | 4 Note | 5 Status | 6 LP | 7 Datum | 8 Versuch | 9 Vermerk | 10 Freiversuch
        const gradeCell = cells[4];
        const ectsCell = cells[6];

        const gradeText = gradeCell.innerText.replace(",", ".").trim();
        const ectsText = ectsCell.innerText.replace(",", ".").trim();

        const gradeValue = parseFloat(gradeText);
        const ectsValue = parseFloat(ectsText || "0");

        // nur echte Noten (0 < Note < 5) und mit LP > 0 zählen
        if (
            Number.isFinite(gradeValue) &&
            Number.isFinite(ectsValue) &&
            gradeValue > 0 &&
            gradeValue < 5 &&
            ectsValue > 0
        ) {
            arr.push({
                grade: gradeValue,
                ects: ectsValue,
                weighted: gradeValue * ectsValue
            });
        }
    });

    if (arr.length === 0) {
        return NaN;
    }

    // gewichteten Durchschnitt berechnen
    const sumArr = arr.reduce((a, b) => {
        return {
            grade: a.grade + b.grade,
            ects: a.ects + b.ects,
            weighted: a.weighted + b.weighted
        };
    });

    return sumArr.weighted / sumArr.ects;
}

function formatTableCells(tableRows) {
    tableRows.forEach(row => {
        // Modul- und Bereichszeilen entfernen (die "Gruppierungen")
        if (row.classList.contains("qis_konto") || row.classList.contains("qis_kontoOnTop")) {
            row.remove();
            return;
        }

        const cells = row.children;
        if (cells.length < 7) {
            return;
        }

        const pruefungsTextCell = cells[1];
        const semesterCell = cells[3];
        const statusCell = cells[5];
        const vermerkCell = cells[9] || null;

        const statusText = statusCell.innerText.trim().toLowerCase();
        const vermerkTextRaw = vermerkCell ? vermerkCell.innerText.trim() : "";
        const vermerkText = vermerkTextRaw.toUpperCase();

        // Farblogik für Status (Texte statt Kürzel):
        // - "bestanden" => grün
        // - "nicht bestanden" => rot
        // - "angemeldet" => gelb (sofern kein AT-Vermerk)
        if (statusText === "bestanden") {
            statusCell.style.backgroundColor = "#00ef00";
        } else if (statusText === "nicht bestanden") {
            statusCell.style.backgroundColor = "#ef0000";
        } else if (statusText === "angemeldet") {
            // wie früher: AN + kein AT => gelb
            if (!/AT\b/i.test(vermerkText)) {
                statusCell.style.backgroundColor = "#ebef00";
            }
        }

        // AT-Logik wie im ursprünglichen Script:
        // aktuelle Versuche mit AT im aktuellen Jahr grün markieren,
        // alte AT-Versuche ausblenden
        if (vermerkText === "AT") {
            const currentYear = String(new Date().getFullYear()).substr(2);
            if (semesterCell.innerText.indexOf(currentYear) > 1) {
                // aktuelles Jahr => grün
                vermerkCell.style.backgroundColor = "#00ef00";
            } else {
                // ältere AT-Versuche entfernen
                row.remove();
                return;
            }
        }

        // Prüfungsrücktritte entfernen:
        // Früher: RT, hier kommen auch RTE o.ä. vor → alles was mit "RT" beginnt.
        if (vermerkText === "RT" || vermerkText.startsWith("RT")) {
            row.remove();
            return;
        }

        // Falls es in anderen QIS-Varianten Modulzeilen mit "Modul:" gibt, wie im Original:
        if (pruefungsTextCell.innerText.substr(0, 6) === "Modul:") {
            row.remove();
            return;
        }
    });
}

function initPruefungsAnmeldung() {
    setIndicatorsForCompletedCourses();
}

function setIndicatorsForCompletedCourses() {
    document
        .querySelectorAll("ul li.treelist a.Konto")
        .forEach(e => {
            if (e.innerText.includes("[Status: BE]")) {
                e.style.color = "rgb(0, 151, 0)";
                // e.innerText += " ✔️";
            }
        });
}
