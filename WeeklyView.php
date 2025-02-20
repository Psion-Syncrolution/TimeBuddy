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

        // Fetch counts of Termin for each date
        $sql = "SELECT Datum, COUNT(*) AS count FROM Termin GROUP BY Datum";
        $result = $conn->query($sql);

        $terminCounts = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $terminCounts[$row['Datum']] = $row['count'];
            }
        }

        // Encode the data to JSON for use in JavaScript
        echo "<script>const terminCounts = " . json_encode($terminCounts) . ";</script>";

        // Close the connection
        $conn->close();
        ?>
        
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
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite">
            <span class="tooltiptext">Zurück zur Startseite</span><!--tooltip anzeigen -->
        </a>
        <!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
        <div class="nav-buttons">
            <a href="Monthly-View.php"><button class="nav-button"
                    onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.php"><button class="nav-button active" onclick="setActive(this)">Wochenansicht</button></a>
            <a href="Daily-View.php"><button class="nav-button" onclick="setActive(this)">Tagesansicht</button></a>
        </div>
        <!---------------------------------------Navbar Icons für Termin und Erinnerung-------------------------------------------------------------->
        <div class="right-icons">
            <a href="Termin_erstellen.html" class="icon-link">
                <img src="pictures/appo.png" alt="Termine" class="icon">
                <span class="tooltiptext">Termine bearbeiten</span>
        </a>
            <a href="Erinnerung_erstellen.php" class="icon-link">
                <img src="pictures/bell.webp" alt="Erinnerungen" class="icon">
                <span class="tooltiptext">Erinnerungen bearbeiten</span>
        </a>
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
<!---------------------------------------------------------Uhrzeit + Datum--------------------------------------------------------------------->
<div id="uhrzeit-legende-container" style="display: flex; align-items: center; gap: 20px;">
            <div id="uhrzeit">
                <!--2. Live-Uhrzeit oben (11:00:04)-->
                <h1 id="uhrzeit"></h1>
            </div>

            <!--------------------------------------- Legende innerhalb von Uhrezit und Datum --------------------------------------------------------------------------------->
            <div id="legende" style="display: flex; gap: 10px; align-items: center;  position: absolute; left: 40% ">
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 20px; height: 20px; background-color: rgba(142, 209, 102, 0.678); border: 1px solid #ccc;"></div>
                    <span style="font-size: 14px; color: gray;">1-4 Termine</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 20px; height: 20px; background-color: rgba(250, 225, 1, 0.68); border: 1px solid #ccc;"></div>
                    <span style="font-size: 14px; color: gray;">5-8 Termine</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <div style="width: 20px; height: 20px; background-color: rgba(255, 72, 0, 0.68); border: 1px solid #ccc;"></div>
                    <span style="font-size: 14px; color: gray;">9+ Termine</span>
                </div>
            </div>
            </div>
<!-------------------------------------------Legende Ende, weiter mit Uhrzeit Script---------------------------------------------------------------------------------->
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
        // Function to calculate dates for a specific calendar week
        function getWeekDates(year, week) {
            const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
            const firstDayOfWeek = firstDayOfYear.getUTCDay() || 7;

            let startDate;
            if (firstDayOfWeek <= 4) {
                startDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7 - (firstDayOfWeek - 1)));
            } else {
                startDate = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7 + (8 - firstDayOfWeek)));
            }

            const weekDates = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setUTCDate(startDate.getUTCDate() + i);
                weekDates.push(currentDate);
            }

            return weekDates;
        }

        // Function to generate the week view in the HTML table
        function generateWeekView(year, week) {
            const table = document.getElementById('calendarTable');

            // Clear all existing rows except the header
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            // Calculate week dates
            const weekDates = getWeekDates(year, week);
            const row = table.insertRow();
            const weekNumberCell = row.insertCell();
            weekNumberCell.textContent = week;
            weekNumberCell.style.backgroundColor = '#cccccc5f';

            // Iterate through the week dates and add cells
            weekDates.forEach(date => {
                const cell = row.insertCell();
                const dateKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}`;

                cell.textContent = date.getUTCDate();

                if (terminCounts[dateKey]) {
                    const count = terminCounts[dateKey];
                    if (count > 8) {
                        cell.style.backgroundColor = "rgba(255, 72, 0, 0.68)";
                    } else if (count > 4) {
                        cell.style.backgroundColor = "rgba(250, 225, 1, 0.68)";
                    } else {
                        cell.style.backgroundColor = "rgba(142, 209, 102, 0.678)";
                    }
                } else {
                    cell.style.backgroundColor = ""; // Default color
                }

                // Highlight weekends
                if (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
                    cell.style.backgroundColor = cell.style.backgroundColor || '#cccccc5f';
                }
            });
        }

        // Populate the week select dropdown
        function populateWeekSelect() {
            const weekSelect = document.getElementById('weekSelect');
            for (let i = 1; i <= 52; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `KW ${i}`;
                weekSelect.appendChild(option);
            }
        }

        // Event listeners for week and year changes
        document.getElementById('weekSelect').addEventListener('change', function () {
            const week = parseInt(this.value);
            const year = parseInt(document.getElementById('yearInput').value);
            generateWeekView(year, week);
        });

        document.getElementById('yearInput').addEventListener('change', function () {
            const week = parseInt(document.getElementById('weekSelect').value);
            const year = parseInt(this.value);
            generateWeekView(year, week);
        });

        // Initialize the dropdown and display the current week
        populateWeekSelect();
        const currentDate = new Date();
        const currentWeek = getWeekNumber(currentDate);
        document.getElementById('weekSelect').value = currentWeek;
        document.getElementById('yearInput').value = currentDate.getFullYear();
        generateWeekView(currentDate.getFullYear(), currentWeek);

        // Calculate the calendar week for a date
        function getWeekNumber(date) {
            const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
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
<!--------------------------------------------------------Body Schließen --------------------------------------------------------------------------->
</html>
            