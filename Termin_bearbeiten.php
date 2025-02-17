<?php
// Connect to the database
$pdo = new PDO("mysql:host=localhost;dbname=kalender_datenbank", "root", "");

// Step 2: Fetch the data from the 'Termin' table if 'TitelID' is provided
if (isset($_GET['TitelID'])) {
    $terminId = $_GET['TitelID'];

    // Fetch the current data for the selected term (using the term ID)
    $stmt = $pdo->prepare("SELECT * FROM Termin WHERE TitelID = :TitelID");
    $stmt->execute(['TitelID' => $terminId]);
    $termin = $stmt->fetch(PDO::FETCH_ASSOC);
} else {
    $termin = null; // If no termin_id, set termin to null
}

// Step 3: Handle form submission to update Termin data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $newTitle = $_POST['titel'];
    $newDate = $_POST['datum'];
    $newTime = $_POST['uhrzeit'];
    $newDescription = $_POST['beschreibung'];

    // Update the term data in the database
    if ($termin) {
        $updateStmt = $pdo->prepare("UPDATE Termin SET Titel = :Titel, Datum = :Datum, Uhrzeit = :Uhrzeit, Beschreibung = :Beschreibung WHERE TitelID = :TitelID");
        $updateStmt->execute([
            'Titel' => $newTitle,
            'Datum' => $newDate,
            'Uhrzeit' => $newTime,
            'Beschreibung' => $newDescription,
            'TitelID' => $terminId
        ]);
        echo '<div class="success-message" style="position:absolute;"><b>Termin wurde erfolgreich hinzugefügt!</b></div>';
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/termin_bearbeitenStyle.css">
    <title>Termin Bearbeiten</title>
</head>
<header>
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
            <a href="Erinnerung_bearbeiten.html" class="right-icons">
                <img src="pictures/bell.webp" alt="Erinnerungen" class="icon"></a>
        </div>
    </div>

    <div>
        <h1>&nbsp;</h1>
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
                window.location.href = "Termin_loeschen.html";
            } else if (selection === "erstellen") {
                window.location.href = "Termin_erstellen.html";
            }
        }

        function redirectToBearbeiten() {
            let selection = document.getElementById("terminDropdown").value;
            if (selection) {
                // If a term is selected, redirect to the bearbeiten page
                window.location.href = "Termin_bearbeiten.php?TitelID=" + selection;
            } else {
                alert("Bitte einen Termin auswählen!");
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
                    const datumText = `${tag}. ${monat} ${jahr}`;
                    
                    // Anzeige von Uhrzeit und Datum
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
                <option value="" disabled selected>Bitte eine Aktion wählen</option> <!-- Placeholder Option -->
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
                    // Fetch and display the available terms in the dropdown list
                    $stmt = $pdo->query("SELECT TitelID, Titel FROM Termin"); 
                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        echo "<option value='" . $row['TitelID'] . "'>" . htmlspecialchars($row['Titel']) . "</option>";
                    }
                    ?>
                </select>
                <br><br>
                <button type="button" onclick="redirectToBearbeiten()" style="width: 40%; height: 54px; font-family: Arial, sans-serif; font-size: 17px; border-color: white; border-radius: 80px 80px 80px 80px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.341);">Bearbeiten</button>
            </form>
            <article style="float: right; margin-top: -21.5%;margin-right: 20%;width: 30%;height: 380px; background-color: grey;">
            <?php if ($termin): ?>
                
                <h2 style="color:white">Termin Bearbeiten</h2>
                <form method="POST">
                    <label for="title">Titel:</label><br>
                    <input type="text" id="titel" name="titel" value="<?php echo htmlspecialchars($termin['Titel']); ?>" required style="width: 400px;height:15px"><br><br>

                    <label for="date">Datum:</label><br>
                    <input type="date" id="datum" name="datum" value="<?php echo htmlspecialchars($termin['Datum']); ?>" required><br><br>

                    <label for="time">Uhrzeit:</label><br>
                    <input type="time" id="uhrzeit" name="uhrzeit" value="<?php echo htmlspecialchars($termin['Uhrzeit']); ?>" required><br><br>

                    <label for="description">Beschreibung:</label><br>
                    <textarea id="beschreibung" name="beschreibung" required style="width: 400px; height: 90px"><?php echo htmlspecialchars($termin['Beschreibung']); ?></textarea><br>
                    <br>
                    <button type="submit" style="width: 40%; height: 32px;font-family: Arial, sans-serif; font-size: 17px; margin-top: -2.2%; border-color: white; border-radius: 80px 80px 80px 80px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.341);">Termin Bearbeiten</button>
                </form>
            <?php endif; ?>
            </article>
        </div>
    </article>
</body>
</html>