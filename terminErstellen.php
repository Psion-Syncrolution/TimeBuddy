<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Php-Connector</title>
    <style>
        .success-message {
            color: green;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
<!-- php-Interpreter einschalten -->
<?php
// MySQLi-Verbindung herstellen
$conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

// Überprüfen, ob die Verbindung erfolgreich war
if (!$conn) {
    die("Verbindung fehlgeschlagen: " . mysqli_connect_error());
}

// Daten aus dem Formular holen (über POST)
$titel = $_POST['titel'];
$datum = $_POST['datum'];
$uhrzeit = $_POST['uhrzeit'];
$beschreibung = $_POST['beschreibung'];

// SQL-Abfrage zum Einfügen der Daten vorbereiten
$stmt = $conn->prepare("INSERT INTO Termin (Titel, Datum, Uhrzeit, Beschreibung) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $titel, $datum, $uhrzeit, $beschreibung);

// SQL-Abfrage ausführen
if ($stmt->execute()) {
    // Erfolgreich hinzugefügt, jetzt Feedback anzeigen und zur Monatsansicht weiterleiten
    echo '<div class="success-message">Termin wurde erfolgreich hinzugefügt!</div>';
    echo '<div class="success-message"> Bitte Warten - Sie werden Zurrückgeleitet</div>';
    
    // Weiterleitung nach 3 Sekunden (3000 Millisekunden)
    header("Refresh: 2; url=Monthly-View.php");
    exit(); // Beendet das Script, um die Weiterleitung nach dem Feedback auszuführen
} else {
    echo "Fehler beim Hinzufügen des Termins: " . $stmt->error;
}

// Verbindung schließen
$stmt->close();
$conn->close();
?>
<!-- php-Interpreter ausschalten -->
</body>
</html>