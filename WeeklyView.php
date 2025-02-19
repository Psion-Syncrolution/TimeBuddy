<!DOCTYPE html>
<html>

    <head>
        <meta charset="UTF-8" />
        <title>Wochenansicht</title>
        <link rel="stylesheet" href="css/navbarStyle.css">
        <link rel="stylesheet" href="css/weeklyViewStyle.css">
</head>
<header>
        <!----------------------------------------------------Navbar--------------------------------------------------------------------------------->
        <div class="navbar"> <!-- Navbar erzeugen-->
            <a href="StartPage.html" class="left-icon"> <!-- Startpage verknüpfen über ein Icon -->
                <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite"></a>
            <!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
            <div class="nav-buttons">
                <a href="Monthly-View.html"><button class="nav-button "
                        onclick="setActive(this)">Monatsansicht</button></a>
                <a href="WeeklyView.html"><button class="nav-button active"
                        onclick="setActive(this)">Wochenansicht</button></a>
                <a href="Daily-View.html"><button class="nav-button"
                        onclick="setActive(this)">Tagesansicht</button></a>
            </div>
            <!---------------------------------------Navbar Icons für Termin und Erinnerung-------------------------------------------------------------->
            <div class="right-icons">
                <a href="Termin_erstellen.html" class="right-icons">
                    <img src="pictures/appo.png" alt="Termine" class="icon" title="Termine bearbeiten"></a>
                <a href="Erinnerung_erstellen.php" class="right-icons">
                    <img src="pictures/bell.webp" alt="Erinnerungen" class="icon" title="Erinnerungen bearbeiten"></a>
            </div>
        </div>
        <!-------------------------------------------------Navbar Ende------------------------------------------------------------------------------->
        <!------------------------------------------------------------------------------------------------------------------------------------------->
        <div>
            <h1>&nbsp;</h1> <!-- no Backspace als Abstand-->
        </div>
        <!------------------------------------------------------------------------------------------------------------------------------------------->
        <!------------------------------------------------------------------------------------------------------------------------------------------->
        <!-------------------------------------------------Aktiv Anzeige der Button------------------------------------------------------------------>
        <script>
            function setActive(button) {
                document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        </script>
        <!-------------------------------------------------Aktiv Anzeige der Button ENDE-------------------------------------------------------------->
        <!-------------------------------------------------------------------------------------------------------------------------------------------->
</header> <!-- Header Ende -->
<!-------------------------------------------------------------------------------------------------------------------------------------------------->
<!--------------------------------------------------------Body Schließen --------------------------------------------------------------------------->
    <body>
        <br><br>
<!------------------------------------------------------Article Box öffnen-------------------------------------------------------------------------->
        <article style="margin-top: -1.3%;">
<!---------------------------------------------------------Uhrzeit + Datum-------------------------------------------------------------------------->
            <div id="uhrzeit">
                <!--2.Live-Uhrezit oben (11:00:04)-->
                <h1 id="uhrzeit"></h1>
                <script>
                    let globalDatumText = "";
                    function updateUhrzeit() {
                        const jetzt = new Date();

                        // Uhrzeit
                        const stunden = jetzt.getHours().toString().padStart(2, '0');
                        const minuten = jetzt.getMinutes().toString().padStart(2, '0');
                        const sekunden = jetzt.getSeconds().toString().padStart(2, '0');
                        const uhrzeitText = `${stunden}:${minuten}:${sekunden}`;

                        // Monat als Text
                        const monate = [
                            "Januar", "Februar", "März", "April", "Mai", "Juni",
                            "Juli", "August", "September", "Oktober", "November", "Dezember"
                        ];
                        const tag = jetzt.getDate().toString().padStart(2, '0');
                        const monat = monate[jetzt.getMonth()];  // Monat in Textform
                        const jahr = jetzt.getFullYear();
                        globalDatumText = `${tag}. ${monat} ${jahr}`;

                        // Anzeige von Uhrzeit und Datum
                        document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 39px; font-weight: bold;">${uhrzeitText}</span><br>
                            <span style="font-size: 20px; color: grey;">${globalDatumText}</span>`;
                    }

                    setInterval(updateUhrzeit, 1000);

                    updateUhrzeit();
                </script>
<!---------------------------------------------------------Uhrzeit + Datum--------------------------------------------------------------------->
<!-------------------------------------------------------------Ende---------------------------------------------------------------------------->
            </div>
            <div>
                <!-- Dropdown Menü für die Auswahl der Kalenderwoche -->
                <table>
                    <tr>
                        <th style="text-align: left;">
                            Kalenderwoche
                            <!-- Dropdown-Selektor für Kalenderwochen -->
                            <select id="weekSelect">
                                <!-- Optionen für Kalenderwochen werden dynamisch generiert -->
                            </select>
                        </th>
                        <th style="width: 50px; font-size: medium;">
                            <!-- Eingabefeld für das Jahr, der Standardwert ist 2025 -->
                            <input type="number" id="yearInput" value="2025" style="width: 60px;">
                        </th>
                    </tr>
                </table>
            </div>

            <!-- Tabelle für die Wochenansicht -->
            <table id="calendarTable" class="kalender">
                <tr>
                    <!-- Kopfzeilen der Tabelle für die Wochenansicht -->
                    <th>KW</th>
                    <th>Mo</th>
                    <th>Di</th>
                    <th>Mi</th>
                    <th>Do</th>
                    <th>Fr</th>
                    <th>Sa</th>
                    <th>So</th>
                </tr>
            </table>

            <script>
                // Funktion zur Berechnung der Datumsangaben einer bestimmten Kalenderwoche
                function getWeekDates(year, week) {
                    // Berechnung des ersten Tages des Jahres
                    const firstDayOfYear = new Date(year, 0, 1);

                    // Berechnung der Tage, die zum ersten Montag im Jahr fehlen
                    const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7;
                    const firstMonday = new Date(year, 0, 1 + daysToFirstMonday);

                    // Bestimmen des Startdatums für die angegebene Woche
                    const startDate = new Date(firstMonday.setDate(firstMonday.getDate() + (week - 1) * 7));
                    const weekDates = [];

                    // Iteration durch die 7 Tage der Woche
                    for (let i = 0; i < 7; i++) {
                        const currentDate = new Date(startDate);
                        currentDate.setDate(startDate.getDate() + i); // Datum für jeden Tag der Woche anpassen
                        weekDates.push(currentDate); // Tag der Woche zur Liste hinzufügen
                    }

                    return weekDates; // Rückgabe der Liste der Datumswerte
                }

                // Funktion zur Generierung der Wochenansicht in der HTML-Tabelle
                function generateWeekView(year, week) {
                    const table = document.getElementById('calendarTable');

                    // Löschen aller bestehenden Zeilen außer der Kopfzeile
                    while (table.rows.length > 1) {
                        table.deleteRow(1);
                    }

                    // Berechnung der Wochen-Daten basierend auf Jahr und Woche
                    const weekDates = getWeekDates(year, week);
                    const row = table.insertRow(); // Neue Zeile für die Woche hinzufügen
                    const weekNumberCell = row.insertCell(); // Zelle für die Kalenderwoche hinzufügen
                    weekNumberCell.textContent = week; // Kalenderwoche anzeigen
                    weekNumberCell.style.backgroundColor = '#cccccc5f'; // Hintergrundfarbe für Kalenderwoche

                    // Iteration durch die Wochentage und Hinzufügen der Daten zur Zeile
                    weekDates.forEach(date => {
                        const cell = row.insertCell(); // Neue Zelle für jeden Wochentag hinzufügen
                        cell.textContent = date.getDate(); // Das Datum des Tages anzeigen

                        // Samstags- und Sonntags-Zellen hervorheben (Wochenende)
                        if (date.getDay() === 0 || date.getDay() === 6) {
                            cell.style.backgroundColor = '#cccccc5f'; // Hintergrundfarbe für Wochenende
                        }
                    });
                }

                // Funktion zum Befüllen des Dropdown-Menüs mit Kalenderwochen (KW 1 bis KW 52)
                function populateWeekSelect() {
                    const weekSelect = document.getElementById('weekSelect');

                    // Schleife zum Erstellen der Optionen für jedes Jahr
                    for (let i = 1; i <= 52; i++) {
                        const option = document.createElement('option');
                        option.value = i; // Setzen der KW als Wert
                        option.textContent = `KW ${i}`; // Anzeigen der KW im Dropdown-Menü
                        weekSelect.appendChild(option); // Option dem Dropdown-Menü hinzufügen
                    }
                }

                // Eventlistener für die Änderung der Auswahl der Kalenderwoche
                document.getElementById('weekSelect').addEventListener('change', function () {
                    const week = parseInt(this.value); // Ausgewählte Kalenderwoche
                    const year = parseInt(document.getElementById('yearInput').value); // Ausgewähltes Jahr
                    generateWeekView(year, week); // Aktualisieren der Wochenansicht
                });

                // Eventlistener für die Änderung des Jahres
                document.getElementById('yearInput').addEventListener('change', function () {
                    const week = parseInt(document.getElementById('weekSelect').value); // Ausgewählte Kalenderwoche
                    const year = parseInt(this.value); // Ausgewähltes Jahr
                    generateWeekView(year, week); // Aktualisieren der Wochenansicht
                });

                // Initialisierung des Dropdown-Menüs mit Kalenderwochen
                populateWeekSelect();

                // Ermitteln der aktuellen Kalenderwoche und des aktuellen Jahres
                const currentDate = new Date();
                const currentWeek = getWeekNumber(currentDate); // Berechnung der aktuellen Kalenderwoche
                document.getElementById('weekSelect').value = currentWeek; // Setzen der aktuellen Kalenderwoche im Dropdown
                document.getElementById('yearInput').value = currentDate.getFullYear(); // Setzen des aktuellen Jahres im Eingabefeld
                generateWeekView(currentDate.getFullYear(), currentWeek); // Anzeige der aktuellen Woche

                // Funktion zur Berechnung der Kalenderwoche eines Datums
                function getWeekNumber(date) {
                    const firstDayOfYear = new Date(date.getFullYear(), 0, 1); // Erster Tag des Jahres
                    const pastDaysOfYear = (date - firstDayOfYear) / 86400000; // Anzahl der Tage seit Jahresbeginn
                    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7); // Berechnung der Kalenderwoche
                }
            </script>

            <!-- Termin-Tabelle (Beispieltermine) -->
        <article>
            <div class="Termin">
                <table class="bottom-table">
                    <tr>
                        <!-- Kopfzeilen für die Termin-Tabelle -->
                        <th>Termin</th>
                        <th>Datum</th>
                        <th>Uhrzeit</th>
                        <th>Beschreibung</th>
                        <th style="width: 1%; background-color: gray "></th>
                        <th>Erinnerung</th>
                        <th>Datum</th>
                        <th>Uhrzeit</th>
                        <th>Beschreibung</th>
                    </tr>
                    <!-- Beispiel für Termin-Daten -->
                    <tr>
                        <td>Termintitel</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Termintitel</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Termintitel</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Termintitel</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </article>
<!-------------------------------------------------------Article Box Schließen-------------------------------------------------------------------->
<!------------------------------------------------------------------------------------------------------------------------------------------------>
    </body>
<!--------------------------------------------------------Body Schließen --------------------------------------------------------------------------->
</html>
            