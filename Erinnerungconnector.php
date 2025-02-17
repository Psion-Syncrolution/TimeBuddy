<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Php-Connector</title>
    <style>
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
    echo "Termin erfolgreich hinzugefügt!";
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
