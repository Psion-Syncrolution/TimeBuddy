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
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite">
            <span class="tooltiptext">Zurück zur Startseite</span><!--tooltip anzeigen -->
        </a>
        <!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
        <div class="nav-buttons">
            <a href="Monthly-View.php"><button class="nav-button active"
                    onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.php"><button class="nav-button" onclick="setActive(this)">Wochenansicht</button></a>
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
<!-------------------------------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------Body öffnen------------------------------------------------------------------------>

<body>
    <br><br>
    <!------------------------------------------------------Article Box öffnen-------------------------------------------------------------------->
    <article style="margin-top: -1.42%;">
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
                    <span style="font-size: 20px; color: grey">${globalDatumText}</span>`;
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
                    <th style="width: 7%; font-size: medium; text-align: left;">
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
    <!----------------------------------------------------------------------------------------------------------------------------------------------------->
    <script>
        function generateCalendar(month, year) {
    const table = document.getElementById('calendarTable');

    // Clear existing rows except the header
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalDays = lastDay.getDate();
    const totalWeeks = Math.ceil((startDay + totalDays) / 7);

    // Previous month's last day
    const lastPrevMonthDay = new Date(year, month, 0).getDate();

    // Start date for the next month
    let nextMonthDate = 1;
    let date = 1;

    for (let i = 0; i < totalWeeks; i++) {
        const row = table.insertRow();
        const weekNumberCell = row.insertCell();
        weekNumberCell.textContent = getWeekNumber(new Date(year, month, date));
        weekNumberCell.style.backgroundColor = "#e3e3e3"; // KW-Spalte einfärben

        for (let j = 0; j < 7; j++) {
            const cell = row.insertCell();
            if (i === 0 && j < startDay) {
                cell.textContent = lastPrevMonthDay - (startDay - j - 1);
                cell.style.color = "gray"; // Previous month's days
                cell.style.backgroundColor = (j === 5 || j === 6) ? "#e3e3e3" : ""; // Sa & So einfärben
            } else if (date > totalDays) {
                cell.textContent = nextMonthDate;
                nextMonthDate++;
                cell.style.color = "gray"; // Next month's days
                cell.style.backgroundColor = (j === 5 || j === 6) ? "#e3e3e3" : ""; // Sa & So einfärben
            } else {
                // Current month's days
                const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
                cell.textContent = date;

                // Samstag (Spalte 5) und Sonntag (Spalte 6) einfärben
                if (j === 5 || j === 6) {
                    cell.style.backgroundColor = "#e3e3e3";
                }

                // Termin-Farben setzen
                if (terminCounts[dateKey]) {
                    const count = terminCounts[dateKey];
                    if (count > 8) {
                        cell.style.backgroundColor = "rgba(255, 72, 0, 0.68)";
                    } else if (count > 4) {
                        cell.style.backgroundColor = "rgba(250, 225, 1, 0.68)";
                    } else {
                        cell.style.backgroundColor = "rgba(142, 209, 102, 0.678)";
                    }
                }

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


        // Event listeners for month and year selection
        document.getElementById('monthSelect').addEventListener('change', function () {
            generateCalendar(parseInt(this.value), parseInt(document.getElementById('yearInput').value));
        });

        document.getElementById('yearInput').addEventListener('change', function () {
            generateCalendar(parseInt(document.getElementById('monthSelect').value), parseInt(this.value));
        });

        // Initialize calendar with current date
        const currentDate = new Date();
        document.getElementById('monthSelect').value = currentDate.getMonth();
        document.getElementById('yearInput').value = currentDate.getFullYear();
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());

    </script>
    <!--------------------------------------------------------Kalender schließen ----------------------------------------------------------------------------->
    <!-------------------------------------------------------Article Box Schließen-------------------------------------------------------------------->
    <!------------------------------------------------------------------------------------------------------------------------------------------------>
    <!------------------------------------------------Termine aus der Datenbank anzeigen  -------------------------------------------------------------------->
    <article style="margin-top: 20px;float:left;width:52%">
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
    <article style="margin-top: 20px;float:right;width:42%">
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

    <!--Navbar verschwinden lassen-->
    <script>
    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");
 
    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
       
        if (scrollTop > lastScrollTop) {
            // Wenn nach unten gescrollt wird → Navbar verstecken
            navbar.style.top = "-80px"; // Höhe der Navbar anpassen
        } else {
            // Wenn nach oben gescrollt wird → Navbar wieder anzeigen
            navbar.style.top = "0";
        }
 
        lastScrollTop = scrollTop;
    });
</script>

</body>
<!----------------------------------------------------------Body Schließen ------------------------------------------------------------------------------->

</html>