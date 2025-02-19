<?php
// Datenbankverbindung herstellen
$pdo = new PDO("mysql:host=localhost;dbname=kalender_datenbank", "root", "");

// Falls das Formular gesendet wurde
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["TitelID"])) {
    $titelID = $_POST["TitelID"];

    // Termin sicher löschen
    $stmt = $pdo->prepare("DELETE FROM Termin WHERE TitelID = :TitelID");
    $stmt->execute(["TitelID" => $titelID]);

    // Erfolgsnachricht
    echo "<script>alert('Termin erfolgreich gelöscht!'); window.location.href='Termin_loeschen.php';</script>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/termin_bearbeitenStyle.css">
    <title>Termin Löschen</title>
</head>
<header style="margin-bottom: 1%;">
<!----------------------------------------------------Navbar--------------------------------------------------------------------------------->
        <div class="navbar"> <!-- Navbar erzeugen-->
            <a href="StartPage.html" class="left-icon"> <!-- Startpage verknüpfen über ein Icon -->
                <img src="pictures/clock.png" alt="clock-icon" class="left-icon" title="Rückkehr zu Startseite"></a>
<!------------------------------------------------Navbar Buttons----------------------------------------------------------------------------->
            <div class="nav-buttons">
                <a href="Monthly-View.php"><button class="nav-button " onclick="setActive(this)">Monatsansicht</button></a>
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
        <script>
            function setActive(button) {
                document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }

            function handleSelection() {
                let selection = document.getElementById("dropdown").value;

                if (selection === "bearbeiten") {
                    window.location.href = "Termin_bearbeiten.php"; // Redirect to edit page
                } else if (selection === "loeschen") {
                    window.location.href = "Termin_loeschen.php"; // Redirect to delete page
                } else if (selection === "erstellen") {
                    window.location.href = "Termin_erstellen.html"; // Redirect to create page
                }
            }
        </script>
</header>
<!---------------------------------------------------------Body öffnen------------------------------------------------------------------------>
<body>
    <br><br> <!-- Abstand zwischen den Elementen -->
<!---------------------------------------------------------Article öffnen------------------------------------------------------------------------>
    <article style="margin-top: 0.45%;"> <!-- Artikel-Bereich für den Inhalt -->
        <div>
            <!-- Anzeige der aktuellen Uhrzeit und des Datums -->
            <h1 id="uhrzeit"></h1>
            <script>
                // Funktion zum Aktualisieren von Uhrzeit und Datum
                function updateUhrzeit() {
                    const jetzt = new Date(); // Holt das aktuelle Datum und die Uhrzeit

                    // Formatieren der Uhrzeit (Stunden, Minuten und Sekunden)
                    const stunden = jetzt.getHours().toString().padStart(2, '0'); // Stunden
                    const minuten = jetzt.getMinutes().toString().padStart(2, '0'); // Minuten
                    const sekunden = jetzt.getSeconds().toString().padStart(2, '0'); // Sekunden
                    const uhrzeitText = `${stunden}:${minuten}:${sekunden}`; // Uhrzeit als Text

                    // Monat als Text definieren
                    const monate = [
                        "Januar", "Februar", "März", "April", "Mai", "Juni",
                        "Juli", "August", "September", "Oktober", "November", "Dezember"
                    ];
                    const tag = jetzt.getDate().toString().padStart(2, '0'); // Tag im Format 01, 02, etc.
                    const monat = monate[jetzt.getMonth()];  // Monat als Text (z.B. Januar, Februar)
                    const jahr = jetzt.getFullYear(); // Jahr
                    const datumText = `${tag}. ${monat} ${jahr}`; // Datum als Text

                    // Anzeige der Uhrzeit und des Datums auf der Webseite
                    document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 38px;">${uhrzeitText}</span><br>
                    <span style="font-size: 20px; color: grey;">${datumText}</span>`;
                }

                // Diese Funktion wird jede Sekunde aufgerufen, um die Uhrzeit und das Datum zu aktualisieren
                setInterval(updateUhrzeit, 1000);

                // Initiales Update der Uhrzeit und des Datums beim Laden der Seite
                updateUhrzeit();
            </script>
        </div>

        <div>
            <br>
            <!-- Dropdown-Menü für die Auswahl einer Aktion: Erstellen, Bearbeiten oder Löschen -->
            <select name="dropdown" id="dropdown" onchange="handleSelection()">
                <option value="" disabled selected>Bitte eine Aktion wählen</option> <!-- Platzhalter für die Dropdown-Auswahl -->
                <option value="erstellen">Erstellen</option>
                <option value="bearbeiten">Bearbeiten</option>
                <option value="loeschen">Löschen</option>
            </select>

            <h2>Wähle einen Termin zum Löschen</h2> <!-- Überschrift für die Auswahl eines Termins zum Löschen -->
            
            <!-- Formular für das Löschen eines Termins -->
            <form id="terminForm" method="POST">
                <!-- Label und Dropdown-Menü für die Auswahl des zu löschenden Termins -->
                <label for="terminDropdown">Termin auswählen:</label>
                <select name="TitelID" id="terminDropdown" required>
                    <option value="" disabled selected>Bitte einen Termin wählen</option> <!-- Platzhalter für die Dropdown-Auswahl -->
                    <?php 
                    // PHP-Code zur Verbindung mit der MySQL-Datenbank
                    // Verbindung zur Datenbank (hier lokal, mit Benutzername "root" und leerem Passwort)
                    $pdo = new PDO("mysql:host=localhost;dbname=kalender_datenbank", "root", "");
                    
                    // Abfrage der Termine aus der Tabelle "Termin"
                    $stmt = $pdo->query("SELECT TitelID, Titel FROM Termin"); 

                    // Durchlaufe alle abgerufenen Termine und fülle das Dropdown-Menü
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        // Erstelle eine Option für jeden Termin, wobei der Titel als sichtbarer Text und die TitelID als Wert dient
                        echo "<option value='" . htmlspecialchars($row['TitelID']) . "'>" . htmlspecialchars($row['Titel']) . "</option>";
                    }
                    ?>
                </select>
                <br><br> <!-- Abstand -->

                <!-- Button zum Löschen eines Termins -->
                <button type="submit" onclick="return confirm('Möchten Sie diesen Termin wirklich löschen?')" style="width: 40%; height: 54px; font-family: Arial, sans-serif; font-size: 17px; border-color: white; border-radius: 80px 80px 80px 80px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.341);">
                    Termin Löschen
                </button>
            </form>
        </div>
    </article>
<!---------------------------------------------------------Article Schließen------------------------------------------------------------------------>
</body>
<!---------------------------------------------------------Body Schließen------------------------------------------------------------------------>
</html>