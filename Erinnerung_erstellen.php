<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <title>Erinnerung Erstellen</title>
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/termin_bearbeitenStyle.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f0f0;
        }

        article {
            width: 95.2%;
            height: 95%;
            background: white;
            padding: 20px;
            margin-top: 4%;
            margin-left: 20px;
            margin-right: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .main-container {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
        }

        #uhrzeit-box,
        .container {
            flex: 1;
            min-width: 300px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        }

        #termin-list {
            margin-top: 15px;
            max-height: 200px;
            overflow-y: auto;
            border-top: 1px solid #ccc;
            padding-top: 10px;
            text-align: left;
        }

        input,
        select,
        textarea,
        button {
            margin: 10px 0;
            width: 100%;
            padding: 8px;
        }

        button {
            background-color: green;
            color: white;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background-color: darkgreen;
        }

        @media (max-width: 800px) {
            .main-container {
                flex-direction: column;
                align-items: center;
            }
        }
    </style>
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
            <a href="Daily-View.php"><button class="nav-button " onclick="setActive(this)">Tagesansicht</button></a>
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
<!------------------------------------------------------Body öffnen--------------------------------------------------------------------------->

<body>
    <!------------------------------------------------------Article öffnen------------------------------------------------------------------------->
    <article>
        <div class="main-container"> <!---- Haupt Container öffnen---->
            <div id="uhrzeit-box"> <!----- Time Box öffnen --------->
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
                            <span style="font-size: 20px; color: grey;font-weight: 0;">${globalDatumText}</span>`;
                }

                setInterval(updateUhrzeit, 1000);

                updateUhrzeit();
            </script>
                <h3>Termine anzeigen für:</h3>
                <!-----------Formular öffnen ------------------->
                <form method="GET">
                    <!-----------Select Option Start---------------->
                    <select name="month" onchange="this.form.submit()">
                        <!-------- PHP Interpreter einschalten --------->
                        <?php
                        $months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
                        $currentMonth = isset($_GET['month']) ? $_GET['month'] : date('m');

                        foreach ($months as $index => $month) {
                            $value = str_pad($index + 1, 2, "0", STR_PAD_LEFT);
                            $selected = ($value == $currentMonth) ? "selected" : "";
                            echo "<option value='$value' $selected>$month</option>";
                        }
                        ?>
                        <!--------- PHP Interpreter ausschalten -------->
                    </select>
                    <!-----------Select Option Ende ---------------->
                </form>
                <!-----------Formular schließen ---------------->
                <!-------------------------------------------------------Container Termin Liste öffnen---------------------------------------------------------->
                <div id="termin-list">
                    <h3>Termine im gewählten Monat:</h3>
                    <!-------- PHP Interpreter einschalten --------->
                    <?php
                    $conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");
                    if ($conn) {
                        $currentYear = date('Y');
                        $query = "SELECT Datum, Uhrzeit, Titel FROM Termin WHERE MONTH(Datum) = '$currentMonth' AND YEAR(Datum) = '$currentYear' ORDER BY Datum, Uhrzeit ASC";
                        $result = mysqli_query($conn, $query);

                        if (mysqli_num_rows($result) > 0) {
                            echo "<ul>";
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo "<li><strong>" . date('d.m.Y', strtotime($row['Datum'])) . "</strong> um " . date('H:i', strtotime($row['Uhrzeit'])) . " - <strong>" . htmlspecialchars($row['Titel']) . "</strong></li>";
                            }
                            echo "</ul>";
                        } else {
                            echo "<p>Keine Termine für diesen Monat.</p>";
                        }
                        mysqli_close($conn);
                    } else {
                        echo "<p>Datenbankverbindung fehlgeschlagen.</p>";
                    }
                    ?>
                    <!--------- PHP Interpreter ausschalten -------->
                </div>
                <!-------------------------------------------------------Container Termin Liste schließen ---------------------------------------------------------->
            </div><!-------- Time Box schließen --------->

            <!-------------------------------------------------------Formular Box Erinnerung öffnen ------------------------------------------------------------>
            <div class="container">
                <h2>Erinnerung zu einem Termin hinzufügen</h2>
                <form action="Erinnerungconnector.php" method="POST">
                    <label for="termin_id">Termin wählen:</label>
                    <select name="termin_id" required>
                        <option value="">Bitte Termin auswählen</option>
                        <?php
                        $conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");
                        if ($conn) {
                            $query = "SELECT TitelID, Titel FROM Termin";
                            $result = mysqli_query($conn, $query);
                            while ($row = mysqli_fetch_assoc($result)) {
                                echo '<option value="'.$row['TitelID'].'">'.$row['Titel'].'</option>';
                            }
                            mysqli_close($conn);
                        }
                        ?>
                    </select>

                    <label>Datum:</label>
                    <input type="date" name="Datum" required><br>

                    <label>Uhrzeit:</label>
                    <input type="time" name="Uhrzeit" required><br>

                    <label>Beschreibung:</label>
                    <textarea name="Beschreibung" required></textarea><br>

                    <button type="submit">Erinnerung speichern</button>
                </form>
            </div>
            <!-------------------------------------------------------Formular Box Erinnerung schließen ------------------------------------------------------------>
        </div> <!---- Haupt Container schließen---->
    </article>
    <!------------------------------------------------------Article schließen------------------------------------------------------------------------------>
</body>
<!------------------------------------------------------Body schließen------------------------------------------------------------------------------------>

</html>