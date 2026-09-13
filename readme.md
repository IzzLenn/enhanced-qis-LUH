# Enhanced QIS for Leibniz Universität Hannover
Enhanced QIS verbessert das QIS-System (Credits: github.com/Oshimani)

# Download
Download form Mozilla Addon Store
___Wird noch erstellt___
# Features
## Notenübersicht
Die Notenübersicht wird aufpoliert und erweitert.

## Neuerung in Version 1.1

In der Notenübersicht wird jetzt zusätzlich die Summe der Leistungspunkte aller bestandenen Module im Kopf der Spalte **Leistungspunkte** angezeigt.

Beispiel:

`Leistungspunkte (90)`

Für die Summe werden nur Zeilen mit dem Status **bestanden** und gültigen Leistungspunkten berücksichtigt. Wenn QIS Modulzeilen über eine leere Spalte **Prf.Art** kennzeichnet, werden gezielt diese Modulzeilen verwendet, damit untergeordnete Teilleistungen nicht doppelt gezählt werden. Falls diese Kennzeichnung auf einer QIS-Variante fehlt, wird auf alle bestandenen Zeilen mit Leistungspunkten zurückgefallen.

Aus dem ursprünglichen Design:
![see docs/images/GradeOverview_before.png](docs/images/GradeOverview_before.png)

Wird die verbesserte Übersicht:
![see docs/images/GradeOverview_after_annotated.png](docs/images/GradeOverview_after_annotated.png)
- Es werden die alten farblichen Markierungen für bestandene, angemeldete, und nicht bestandene Prüfungsleistungen wieder eingeführt
- Es werden unnötige Informationen aus der Notenübersicht entfernt
    - Prüfungsrücktritte
    - Modulgruppierungen
- Es wird ein Notenschnitt ermittelt (wird in der Tabellenüberschrift "Note" angezeigt)
    - Berechnung: ![see docs/images/AVGGrade.png](docs/images/AVGGrade.png)
