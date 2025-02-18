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
<header style="margin-bottom: 3.05%;">
    <div class="navbar">
        <a href="Monthly-View.html" class="left-icon">
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon"></a>

        <div class="nav-buttons">
            <a href="Monthly-View.html"><button class="nav-button active" onclick="setActive(this)">Monatsansicht</button></a>
            <a href="WeeklyView.html"><button class="nav-button" onclick="setActive(this)">Wochenansicht</button></a> 
            <a href="Daily-View.html"><button class="nav-button" onclick="setActive(this)">Tagesansicht</button></a>          
        </div>

        <div class="right-icons">
            <a href="Termin_erstellen.html" class="right-icons">
                <img src="pictures/appo.png" alt="Termine" class="icon"></a>
            <a href="Erinnerung_erstellen.php" class="right-icons">
                <img src="pictures/bell.webp" alt="Erinnerungen" class="icon"></a>
        </div>
    </div>

    <script>
        function setActive(button) {
            document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }

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
    </script>
</header>

<body>
    <br><br>
    <article style="margin-top: 0.45%;">
        <div>
            <h1 id="uhrzeit"></h1>
            <script>
                function updateUhrzeit() {
                    const jetzt = new Date();
                    const stunden = jetzt.getHours().toString().padStart(2, '0');
                    const minuten = jetzt.getMinutes().toString().padStart(2, '0');
                    const sekunden = jetzt.getSeconds().toString().padStart(2, '0');
                    const uhrzeitText = `${stunden}:${minuten}:${sekunden}`;

                    const monate = [
                        "Januar", "Februar", "März", "April", "Mai", "Juni",
                        "Juli", "August", "September", "Oktober", "November", "Dezember"
                    ];
                    const tag = jetzt.getDate().toString().padStart(2, '0');
                    const monat = monate[jetzt.getMonth()];
                    const jahr = jetzt.getFullYear();
                    const datumText = `${tag}. ${monat} ${jahr}`;

                    document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 38px;">${uhrzeitText}</span><br>
                        <span style="font-size: 20px; color: grey;">${datumText}</span>`;
                }

                setInterval(updateUhrzeit, 1000);
                updateUhrzeit();
            </script>
        </div>

        <div>
            <br>
            <select name="dropdown" id="dropdown" onchange="handleSelection()">
                <option value="" disabled selected>Bitte eine Aktion wählen</option>
                <option value="erstellen">Erstellen</option>
                <option value="bearbeiten">Bearbeiten</option>
                <option value="loeschen">Löschen</option>
            </select>

            <h2>Wähle einen Termin zum Löschen</h2>
            <form id="terminForm" method="POST">
                <label for="terminDropdown">Termin auswählen:</label>
                <select name="TitelID" id="terminDropdown" required>
                    <option value="" disabled selected>Bitte einen Termin wählen</option>
                    <?php 
                    // Verbindung zur Datenbank
                    $pdo = new PDO("mysql:host=localhost;dbname=kalender_datenbank", "root", "");
                    $stmt = $pdo->query("SELECT TitelID, Titel FROM Termin"); 

                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        echo "<option value='" . htmlspecialchars($row['TitelID']) . "'>" . htmlspecialchars($row['Titel']) . "</option>";
                    }
                    ?>
                </select>
                <br><br>
                <button type="submit" onclick="return confirm('Möchten Sie diesen Termin wirklich löschen?')" style="width: 40%; height: 54px; font-family: Arial, sans-serif; font-size: 17px; border-color: white; border-radius: 80px 80px 80px 80px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.341);">Termin Löschen</button>
            </form>
        </div>
    </article>
</body>
</html>