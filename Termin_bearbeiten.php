<?php
// Verbindung zur Datenbank herstellen
$pdo = new PDO("mysql:host=localhost;dbname=kalender_datenbank", "root", "");

// Schritt 2: Abrufen der Daten aus der 'Termin' Tabelle, wenn 'TitelID' übergeben wird
if (isset($_GET['TitelID'])) {
    $terminId = $_GET['TitelID'];

    // Abrufen der aktuellen Daten für den ausgewählten Termin (mit der TitelID)
    $stmt = $pdo->prepare("SELECT * FROM Termin WHERE TitelID = :TitelID");
    $stmt->execute(['TitelID' => $terminId]);
    $termin = $stmt->fetch(PDO::FETCH_ASSOC);  // Die Daten des Termins werden als assoziatives Array gespeichert
} else {
    $termin = null; // Wenn keine TitelID angegeben ist, setze termin auf null
}

// Schritt 3: Verarbeiten des Formulars zum Aktualisieren der Termindaten
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Neue Werte aus dem Formular
    $newTitle = $_POST['titel'];
    $newDate = $_POST['datum'];
    $newTime = $_POST['uhrzeit'];
    $newDescription = $_POST['beschreibung'];

    // Update der Termindaten in der Datenbank, wenn der Termin existiert
    if ($termin) {
        $updateStmt = $pdo->prepare("UPDATE Termin SET Titel = :Titel, Datum = :Datum, Uhrzeit = :Uhrzeit, Beschreibung = :Beschreibung WHERE TitelID = :TitelID");
        $updateStmt->execute([
            'Titel' => $newTitle,
            'Datum' => $newDate,
            'Uhrzeit' => $newTime,
            'Beschreibung' => $newDescription,
            'TitelID' => $terminId
        ]);
        // Erfolgsmeldung anzeigen, wenn der Termin erfolgreich aktualisiert wurde
        echo '<div class="success-message" style="width: 16.5%; height:auto; padding: 1%;position:absolute; margin-top: 19.2%;margin-left: 78%;text-align:center;font-size:20px;color: rgba(0, 0, 0, 0.70); background-color:rgba(113, 202, 92, 0.32); border: solid 2px rgba(0, 0, 0, 0.39); border-radius: 20px;"><b>Termin wurde erfolgreich <br>hinzugefügt &#9752 </b></div>';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="css/navbarStyle.css"> <!-- CSS-Datei für das Navigationsmenü -->
    <link rel="stylesheet" href="css/termin_bearbeitenStyle.css"> <!-- CSS-Datei für das Bearbeiten des Termins -->
    <title>Termin Bearbeiten</title>
</head>

<!-- Header der Seite -->
<header style="margin-bottom: 1%;">
    <div class="navbar">
        <!-- Link zum "Monatsansicht" -->
        <a href="Monthly-View.html" class="left-icon">
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon"></a>

        <div class="nav-buttons">
            <!-- Navigationsbuttons für die verschiedenen Ansichten -->
            <a href="Monthly-View.html"><button class="nav-button active" onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.html"><button class="nav-button" onclick="setActive(this)">Wochenansicht</button></a> 
            <a href="Daily-View.html"><button class="nav-button" onclick="setActive(this)">Tagesansicht</button></a>          
        </div>

        <div class="right-icons">
            <!-- Links zu Seiten für die Erstellung von Terminen und Erinnerungen -->
            <a href="Termin_erstellen.html" class="right-icons">
                <img src="pictures/appo.png" alt="Termine" class="icon"></a>
            <a href="Erinnerung_erstellen.php" class="right-icons">
                <img src="pictures/bell.webp" alt="Erinnerungen" class="icon"></a>
        </div>
    </div>

    <div>
        <h1>&nbsp;</h1>
    </div>

    <script>
        // Funktion zum Setzen des aktiven Navigationselements
        function setActive(button) {
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }

        // Funktion, die bei Auswahl einer Aktion im Dropdown-Menü ausgeführt wird
        function handleSelection() {
            let selection = document.getElementById("dropdown").value;
            
            if (selection === "bearbeiten") {
                window.location.href = "Termin_bearbeiten.php";
            } else if (selection === "loeschen") {
                window.location.href = "Termin_loeschen.php";
            } else if (selection === "erstellen") {
                window.location.href = "Termin_erstellen.html";
            }
        }

        // Funktion, die den Benutzer zur Bearbeitungsseite für den ausgewählten Termin weiterleitet
        function redirectToBearbeiten() {
            let selection = document.getElementById("terminDropdown").value;
            if (selection) {
                // Wenn ein Termin ausgewählt ist, wird zur Bearbeitungsseite weitergeleitet
                window.location.href = "Termin_bearbeiten.php?TitelID=" + selection;
            } else {
                alert("Bitte einen Termin auswählen!"); // Fehlermeldung, wenn kein Termin ausgewählt wurde
            }
        }
    </script>
</header>

<body>
    <br><br>
    <article>
        <div>
            <h1 id="uhrzeit"></h1>
            <script>
                // Funktion, die die aktuelle Uhrzeit und das Datum anzeigt
                function updateUhrzeit() {
                    const jetzt = new Date();
                    
                    // Uhrzeit im Format HH:MM:SS
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
                    const datumText = `${tag}. ${monat} ${jahr}`;
                    
                    // Anzeige der Uhrzeit und des Datums auf der Seite
                    document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 38px;">${uhrzeitText}</span><br>
                        <span style="font-size: 20px; color: grey;">${datumText}</span>`;
                }
                
                // Aktualisierung der Uhrzeit jede Sekunde
                setInterval(updateUhrzeit, 1000);
                updateUhrzeit();
            </script>
        </div>

        <div>
            <br>
            <!-- Dropdown-Menü zur Auswahl einer Aktion (Erstellen, Bearbeiten, Löschen) -->
            <select name="dropdown" id="dropdown" onchange="handleSelection()">
                <option value="" disabled selected>Bitte eine Aktion wählen</option> <!-- Platzhalter Option -->
                <option value="erstellen">Erstellen</option>
                <option value="bearbeiten">Bearbeiten</option>
                <option value="loeschen">Löschen</option>
            </select>

            <h2>Wähle einen Termin</h2>
            <form id="terminForm" action="javascript:void(0);">
                <label for="terminDropdown">Termin auswählen:</label>
                <select name="termin" id="terminDropdown" required>
                    <option value="" disabled selected>Bitte einen Termin wählen</option>
                    <?php 
                    // Abrufen und Anzeigen der verfügbaren Termine im Dropdown-Menü
                    $stmt = $pdo->query("SELECT TitelID, Titel FROM Termin"); 
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        // Jeder Termin wird als Option im Dropdown angezeigt
                        echo "<option value='" . $row['TitelID'] . "'>" . htmlspecialchars($row['Titel']) . "</option>";
                    }
                    ?>
                </select>
                <br><br>
                <!-- Button zur Weiterleitung zum Bearbeiten eines Termins -->
                <button type="button" onclick="redirectToBearbeiten()" style="width: 40%; height: 54px; font-family: Arial, sans-serif; font-size: 17px; border-color: white; border-radius: 80px 80px 80px 80px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.341);">Bearbeiten</button>
            </form>

            <article style=" position:absolute; margin-top: -20%;margin-left: 43%;width: 30%;height: 365px; background-color: rgba(128, 128, 128, 0.91)">
            <?php if ($termin): ?>
                
                <!-- Formular zur Bearbeitung eines bestehenden Termins -->
                <h2 style="color:white">Termin Bearbeiten</h2>
                <form method="POST">
                    <label for="title" style="color:rgb(255, 255, 255)">Titel:</label><br>
                    <input type="text" id="titel" name="titel" value="<?php echo htmlspecialchars($termin['Titel']); ?>" required style="width: 100%;"><br><br>

                    <label for="date" style="color:rgb(255, 255, 255)">Datum:</label><br>
                    <input type="date" id="datum" name="datum" value="<?php echo htmlspecialchars($termin['Datum']); ?>" required><br><br>

                    <label for="time" style="color:rgb(255, 255, 255)">Uhrzeit:</label><br>
                    <input type="time" id="uhrzeit" name="uhrzeit" value="<?php echo htmlspecialchars($termin['Uhrzeit']); ?>" required><br><br>

                    <label for="description" style="color:rgb(255, 255, 255)">Beschreibung:</label><br>
                    <textarea id="beschreibung" name="beschreibung" required style="width: 100%; height:50px;" ><?php echo htmlspecialchars($termin['Beschreibung']); ?></textarea><br>
                    <br>
                    <!-- Button zum Absenden des Bearbeitungsformulars -->
                    <button type="submit">Termin Bearbeiten</button>
                </form>
            <?php endif; ?>
            </article>
        </div>
    </article>
</body>
</html>