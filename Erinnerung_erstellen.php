<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Erinnerung Erstellen</title>
    <link rel="stylesheet" href="css/navbarStyle.css">
    <link rel="stylesheet" href="css/termin_bearbeitenStyle.css">
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        .container { width: 50%; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; }
        input, select, textarea, button { margin: 10px 0; width: 100%; padding: 8px; }
        button { background-color: green; color: white; border: none; cursor: pointer; }
        button:hover { background-color: darkgreen; }
    </style>
</head>

<header>
    <div class="navbar">
        <a href="Monthly-View.html" class="left-icon">
            <img src="pictures/clock.png" alt="clock-icon" class="left-icon"></a>

        <div class="nav-buttons">
            <a href="Monthly-View.html"><button class="nav-button active">Monatsansicht</button></a>
            <a href="WeeklyView.html"><button class="nav-button">Wochenansicht</button></a>
            <a href="Daily-View.html"><button class="nav-button">Tagesansicht</button></a>
        </div>

        <div class="right-icons">
            <a href="Termin_erstellen.html"><img src="pictures/appo.png" alt="Termine" class="icon"></a>
            <a href="Erinnerung_erstellen.php"><img src="pictures/bell.webp" alt="Erinnerungen" class="icon"></a>
        </div>
    </div>
</header>

<body>
    <br><br>
    <h1 id="uhrzeit"></h1>

    <script>
        function updateUhrzeit() {
            const jetzt = new Date();
            const stunden = jetzt.getHours().toString().padStart(2, '0');
            const minuten = jetzt.getMinutes().toString().padStart(2, '0');
            const sekunden = jetzt.getSeconds().toString().padStart(2, '0');
            const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
            const tag = jetzt.getDate().toString().padStart(2, '0');
            const monat = monate[jetzt.getMonth()];
            const jahr = jetzt.getFullYear();
            
            document.getElementById('uhrzeit').innerHTML = `<span style="font-size: 38px;">${stunden}:${minuten}:${sekunden}</span><br>
                <span style="font-size: 20px; color: grey;">${tag}. ${monat} ${jahr}</span>`;
        }
        setInterval(updateUhrzeit, 1000);
        updateUhrzeit();
    </script>

    <div class="container">
        <h2>Erinnerung zu einem Termin hinzufügen</h2>
        <form action="Erinnerungconnector.php" method="POST">
    <label for="termin_id">Termin wählen:</label>
    <select name="termin_id" required>
        <option value="">Bitte Termin auswählen</option>
        <!-- Hier muss PHP die existierenden Termine als Optionen ausgeben -->
        <?php
        $conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");
        if ($conn) {
            $query = "SELECT TitelID, Titel FROM Termin";
            $result = mysqli_query($conn, $query);
            while ($row = mysqli_fetch_assoc($result)) {
                echo '<option value="'.$row['id'].'">'.$row['Titel'].'</option>';
            }
            mysqli_close($conn);
        }
        ?>
    </select>
    <input type="hidden" name="TitelID" value="1"> <!-- Replace with actual ID -->
    <label>Datum:</label>
    <input type="date" name="Datum" required><br>

    <label>Uhrzeit:</label>
    <input type="time" name="Uhrzeit" required><br>

    <label>Beschreibung:</label>
    <textarea name="Beschreibung" required></textarea><br>

    <button type="submit">Erinnerung speichern</button>
</form>
    </div>
</body>
</html>
