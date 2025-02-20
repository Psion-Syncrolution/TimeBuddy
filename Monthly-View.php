<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Monatsansicht</title>

    <!-- Einbindung der CSS-Dateien für das Styling der Navigation und der Monatsansicht -->
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/monthlyViewStyle.css">
</head>

<header>
    <!----------------------------------------------------Navbar--------------------------------------------------------------------------------->
    <div class="navbar"> <!-- Navbar erzeugen-->
        <a href="StartPage.html" class="left-icon"> <!-- Startpage verknüpfen über ein Icon -->
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite"></a>
        <!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
        <div class="nav-buttons">
            <a href="Monthly-View.php"><button class="nav-button active"
                    onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.php"><button class="nav-button" onclick="setActive(this)">Wochenansicht</button></a>
            <a href="Daily-View.php"><button class="nav-button" onclick="setActive(this)">Tagesansicht</button></a>
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
<!-------------------------------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------Body öffnen------------------------------------------------------------------------>

<body>
    <br><br>
    <!------------------------------------------------------Article Box öffnen-------------------------------------------------------------------->
    <article style="margin-top: -1.42%;">
        <!---------------------------------------------------------Uhrzeit + Datum--------------------------------------------------------------------->
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

        <!-- Monat und Jahr Auswahl für den Kalender -->
        <div>
            <table>
                <tr>
                    <th style="text-align: left;">
                        Monat
                        <select id="monthSelect">
                            <option value="0">Januar</option>
                            <option value="1">Februar</option>
                            <option value="2">März</option>
                            <option value="3">April</option>
                            <option value="4">Mai</option>
                            <option value="5">Juni</option>
                            <option value="6">Juli</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">Oktober</option>
                            <option value="10">November</option>
                            <option value="11">Dezember</option>
                        </select>
                    </th>
                    <th style="width: 50px; font-size: medium;">
                        <input type="number" id="yearInput" value="2025" style="width: 60px;">
                    </th>
                </tr>
            </table>
        </div>

        <!-- Kalender-Tabelle -->
        <table id="calendarTable">
            <tr>
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
    </article>
    <!--------------------------------------------------------Kalender ----------------------------------------------------------------------------->
    <script>
        // Funktion zur Generierung des Kalenders
        function generateCalendar(month, year) {
            const table = document.getElementById('calendarTable');

            // Löscht alle Zeilen außer der Kopfzeile
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
            const totalDays = lastDay.getDate();
            const totalWeeks = Math.ceil((startDay + totalDays) /7);
            //Letzter Tag des Vormonats
            const lastPrevMonthDay = new Date(year, month, 0).getDate();

            //Startwert für den Nächsten Monat
            let nextMonthDate = 1;
            let date = 1;
            for (let i = 0; i < totalWeeks; i++) {
                const row = table.insertRow();
                const weekNumberCell = row.insertCell();
                weekNumberCell.textContent = getWeekNumber(new Date(year, month, date));

                for (let j = 0; j < 7; j++) {
                    const cell = row.insertCell();
                    if (i === 0 && j < startDay) {
                        cell.textContent = lastPrevMonthDay - (startDay - j - 1);
                        cell.style.color = "gray";
                        //Füllt die ersten leeren Zellen mit den letzten Tagen des Vormonats
                    } else if (date > totalDays) {
                        cell.textContent = nextMonthDate;
                        nextMonthDate++;
                        cell.style.color = "gray";
                        //Monate des nächsten Monats zählen von 1 hoch
                    } else {
                        cell.textContent = date;
                        date++;
                    }
                }
            }
        }

        function getWeekNumber(date) {
            const firstThursday = new Date(date.getFullYear(), 0, 4);
            const weekNumber = Math.ceil((((date - firstThursday) / 86400000) + firstThursday.getDay() + 1) / 7);
            return weekNumber;
}

        // Ereignislistener für die Auswahl des Monats und Jahres
        document.getElementById('monthSelect').addEventListener('change', function () {
            generateCalendar(parseInt(this.value), parseInt(document.getElementById('yearInput').value));
        });

        document.getElementById('yearInput').addEventListener('change', function () {
            generateCalendar(parseInt(document.getElementById('monthSelect').value), parseInt(this.value));
        });

        // Initialisierung des Kalenders mit dem aktuellen Datum
        const currentDate = new Date();
        document.getElementById('monthSelect').value = currentDate.getMonth();
        document.getElementById('yearInput').value = currentDate.getFullYear();
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    </script>
    <!--------------------------------------------------------Kalender schließen ----------------------------------------------------------------------------->
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
            $sql = "SELECT Erinnerung, DATE_FORMAT(Datum, '%d.%m.%Y') AS Datum, DATE_FORMAT(Uhrzeit, '%H:%i') AS Uhrzeit, Beschreibung FROM Erinnerung";
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
<!----------------------------------------------------------Body Schließen ------------------------------------------------------------------------------->

</html>