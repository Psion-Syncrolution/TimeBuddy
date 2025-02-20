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
                <a href="Monthly-View.php"><button class="nav-button "
                        onclick="setActive(this)">Monatsansicht</button></a>
                <a href="WeeklyView.php"><button class="nav-button active"
                        onclick="setActive(this)">Wochenansicht</button></a>
                <a href="Daily-View.php"><button class="nav-button"
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
        <article style="margin-top: -1.45%;">
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
                        document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 38px; font-weight: bold;">${uhrzeitText}</span><br>
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
                    // Erster Tag des Jahres
                    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
                    // Tag der Woche des 1. Januar (0 = Sonntag, 1 = Montag, ..., 6 = Samstag)
                    const firstDayOfWeek = firstDayOfYear.getUTCDay() || 7; // Sonntag wird zu 7
            
                    // Startdatum der ersten Kalenderwoche
                    let startDate;
                    if (firstDayOfWeek <= 4) {
                        // Wenn der 1. Januar ein Montag bis Donnerstag ist, beginnt die erste KW am 1. Januar
                        startDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7 - (firstDayOfWeek - 1)));
                    } else {
                        // Wenn der 1. Januar ein Freitag, Samstag oder Sonntag ist, beginnt die erste KW am nächsten Montag
                        startDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7 + (8 - firstDayOfWeek)));
                    }
            
                    // Tage der Woche berechnen
                    const weekDates = [];
                    for (let i = 0; i < 7; i++) {
                        const currentDate = new Date(startDate);
                        currentDate.setUTCDate(startDate.getUTCDate() + i);
                        weekDates.push(currentDate);
                    }
            
                    return weekDates;
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
                        cell.textContent = date.getUTCDate(); // Das Datum des Tages anzeigen
            
                        // Samstags- und Sonntags-Zellen hervorheben (Wochenende)
                        if (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
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
                    // Kopie des Datums erstellen, um das Original nicht zu verändern
                    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                    // Den Donnerstag dieser Woche setzen
                    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
                    // Das Jahr des Donnerstags ermitteln
                    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
                    // Die Kalenderwoche berechnen
                    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
                    return weekNumber;
                }
            </script>
</article>
<!-------------------------------------------------------Article Box Schließen-------------------------------------------------------------------->
<!------------------------------------------------------------------------------------------------------------------------------------------------>
<!------------------------------------------------Termine aus der Datenbank anzeigen  -------------------------------------------------------------------->
<article style="margin-top: 20px;float:left;margin-left:20px;width:50%">
            <?php
            // Database connection
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "kalender_datenbank";

            // Create connection
            $conn = new mysqli($servername, $username, $password, $dbname);

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            // SQL query to fetch data from the Termin table
            $sql = "SELECT Titel, DATE_FORMAT(Datum, '%d.%m.%Y') AS Datum, DATE_FORMAT(Uhrzeit, '%H:%i') AS Uhrzeit, Beschreibung FROM Termin";

            $result = $conn->query($sql);
            ?>
                    <div class="Termin">
                        <table class="bottom-table">
                            <tr>
                                <!-- Table headers -->
                                <th>Terminliste</th>
                                <th>Datum</th>
                                <th>Uhrzeit</th>
                                <th>Beschreibung</th>
                            </tr>
                            <?php
                    // Check if there are rows in the result set
                    if ($result->num_rows > 0) {
                        // Output data for each row
                        while($row = $result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td>" . htmlspecialchars($row["Titel"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Datum"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Uhrzeit"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Beschreibung"]) . "</td>";
                            echo "</tr>";
                        }
                    } else {
                        // If no records are found, show a message
                        echo "<tr><td colspan='4'>Keine Termine gefunden</td></tr>";
                    }
                    ?>
                        </table>
                    </div>
                </article>
                <!-------------------------------------------------------------Termin anzeige Ende------------------------------------------------------------------------>
                <!-------------------------------------------------------------------------------------------------------------------------------------------------------->
                <article style="margin-top: 20px;float:right; margin-right:20px; width:39%">
                    <?php
            // Database connection
            $servername = "localhost";
            $username = "root";
            $password = "";
            $dbname = "kalender_datenbank";

            // Create connection
            $conn = new mysqli($servername, $username, $password, $dbname);

            // Check connection
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }

            // SQL query to fetch data from the Termin table
            $sql = "SELECT Erinnerung, Datum, Uhrzeit, Beschreibung FROM Erinnerung";
            $result = $conn->query($sql);
            ?>
                    <div class="Termin">
                        <table class="bottom-table">
                            <tr>
                                <!-- Table headers -->
                                <th>Erinnerungsliste</th>
                                <th>Datum</th>
                                <th>Uhrzeit</th>
                                <th>Beschreibung</th>
                            </tr>
                            <?php
                    // Check if there are rows in the result set
                    if ($result->num_rows > 0) {
                        // Output data for each row
                        while($row = $result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td>" . htmlspecialchars($row["Erinnerung"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Datum"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Uhrzeit"]) . "</td>";
                            echo "<td>" . htmlspecialchars($row["Beschreibung"]) . "</td>";
                            echo "</tr>";
                        }
                    } else {
                        // If no records are found, show a message
                        echo "<tr><td colspan='4'>Keine Termine gefunden</td></tr>";
                    }
                    ?>
                        </table>
                    </div>
                </article>
                <?php
        // Close the database connection
        $conn->close();
        ?>
        </div>
    </article>
<!-------------------------------------------------------Article Box Schließen-------------------------------------------------------------------->
</body>
<!--------------------------------------------------------Body Schließen --------------------------------------------------------------------------->
</html>
            