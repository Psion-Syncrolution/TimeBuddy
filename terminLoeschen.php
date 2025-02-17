<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Php-Connector</title>
</head>
<body>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["termin"])) {
    // Datenbankverbindung herstellen
    $conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

    // Verbindung prüfen
    if (!$conn) {
        die("Verbindung fehlgeschlagen: " . mysqli_connect_error());
    }

    // Termin-ID holen und SQL Injection verhindern
    $termin_id = mysqli_real_escape_string($conn, $_POST["termin"]);

    // SQL-Befehl zum Löschen des Termins
    $sql = "DELETE FROM Termin WHERE id = '$termin_id'";

    if (mysqli_query($conn, $sql)) {
        echo "<script>
                alert('Termin erfolgreich gelöscht.');
                window.location.href = 'Termin_loeschen.html';
              </script>";
    } else {
        echo "Fehler beim Löschen: " . mysqli_error($conn);
    }

    // Verbindung schließen
    mysqli_close($conn);
} else {
    echo "Ungültige Anfrage.";
}
?>
</body>
</html>