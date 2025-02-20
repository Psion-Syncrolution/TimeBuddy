<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
    <title>Tagesansicht</title>
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/dailyViewStyle.css">
</head>
<header>
    <!----------------------------------------------------Navbar--------------------------------------------------------------------------------->
    <div class="navbar"> <!-- Navbar erzeugen-->
        <a href="StartPage.html" class="left-icon"> <!-- Startpage verknüpfen über ein Icon -->
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite"></a>
        <!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
        <div class="nav-buttons">
            <a href="Monthly-View.php"><button class="nav-button " onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.php"><button class="nav-button" onclick="setActive(this)">Wochenansicht</button></a>
            <a href="Daily-View.php"><button class="nav-button active"
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
<!-------------------------------------------------------------------------------------------------------------------------------------------->
<!---------------------------------------------------------Body öffnen------------------------------------------------------------------------>

<body>
    <br><br>
    <!------------------------------------------------------Article Box öffnen-------------------------------------------------------------------->
    <article style="margin-top: -2.06%;">
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
        <div>
            <!------------------------------------Dropdown Menü Monats wechseln (Januar-Dezember, nur eins auswählbar)------------------------------------->
            <Table>
                <tr>
                    <!--4. Monatsbezeichnung mit Jahr(Februar 2025)-->
                    <th style="text-align: left;">
                        Monat
                        <select>
                            <option value="Januar">Januar</option>
                            <option value="Februar">Februar</option>
                            <option value="März">März</option>
                            <option value="April">April</option>
                            <option value="Mai">Mai</option>
                            <option value="Juni">Juni</option>
                            <option value="Juli">Juli</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="Oktober">Oktober</option>
                            <option value="November">November</option>
                            <option value="Dezember">Dezember</option>
                        </select>
                    </th>
                    <th style="width: 50px; font-size: medium;">
                        <!-- Eingabefeld für das Jahr, der Standardwert ist 2025 -->
                        <input type="number" id="yearInput" value="2025" style="width: 60px;">
                    </th>
                </tr>
            </Table>
        </div>
        <!-----------------------------------------------------------Datum Anzeige----------------------------------------------------------------------->
        <script>
            function updateDatumText() {
                document.getElementById('datumTextAnzeige').textContent = globalDatumText;
            }

            setInterval(updateDatumText, 1000);
            updateDatumText();
        </script>
        <!---------------------------------------------------------Datum Anzeige ENDE--------------------------------------------------------------------->
        <!------------------------------------------------------------------------------------------------------------------------------------------------>
        <!--------------------------------Tabelle erstellen 8 Spalten (Woche, Mo, Die, Mi, Do, Fr, Sa, So) 6 Zeilen (Woche x -y)-------------------------->
        <!------------------------------------------------------------------------------------------------------------------------------------------------>
        <!--8 Spalten nach rechts // Uhrzeit aufteilung von 06:00 bis 18:00 Uhr-->
        <table class="kalender">
            <tr>
                <th>Tag/Zeit</th>
                <th>06</th>
                <th>07</th>
                <th>08</th>
                <th>09</th>
                <th>10</th>
                <th>11</th>
                <th>12</th>
                <th>13</th>
                <th>14</th>
                <th>15</th>
                <th>16</th>
                <th>17</th>
                <th>18</th>
            </tr>

            <!--Zeile 1-->
            <tr>
                <td
                    style="font-size:20px; padding: 0%; margin: 0%; color: rgb(6, 6, 6); background-color: rgba(128, 128, 128, 0.200);">
                    Montag</td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
                <td>
                    <div class="divider"></div>
                </td>
            </tr>
        </table>
        <!--------------------------------Tabelle erstellen 8 Spalten (Woche, Mo, Die, Mi, Do, Fr, Sa, So) 6 Zeilen (Woche x -y) schließen---------------->
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
            $sql = "SELECT Titel, DATE_FORMAT(Datum, '%d.%m.%Y') AS Datum, DATE_FORMAT(Uhrzeit, '%H:%i') AS Uhrzeit, Beschreibung FROM Termin";
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