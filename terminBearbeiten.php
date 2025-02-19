<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Php-Connector</title>
</head>
<body>

<?php
// MySQLi-Verbindung herstellen
$conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

// Verbindung prüfen
if (!$conn) {
    die("Verbindung fehlgeschlagen: " . mysqli_connect_error());
}

// SQL-Abfrage zum Abrufen aller Termine
$sql = "SELECT Titel FROM Termin";
$result = mysqli_query($conn, $sql);

// Überprüfen, ob es Termine gibt
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "<option value='" . htmlspecialchars($row["Titel"]) . "'>" . htmlspecialchars($row["Titel"]) . "</option>";
    }
} else {
    echo "<option value='' disabled>Keine Termine gefunden</option>";
}

// Verbindung schließen
mysqli_close($conn);
?>


</body>
</html>
