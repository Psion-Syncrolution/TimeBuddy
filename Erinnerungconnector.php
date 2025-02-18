<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Erinnerung Speichern</title>
    <style>
        .success-message {
            color: green;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-top: 10%;
        }
        .error-message {
            color: red;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>

<?php
// MySQLi-Verbindung herstellen
$conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

// Verbindung prüfen
if (!$conn) {
    die('<div class="error-message">Verbindung fehlgeschlagen: ' . mysqli_connect_error() . '</div>');
}

// Formulardaten prüfen und abrufen
if (isset($_POST['TitelID'], $_POST['Datum'], $_POST['Uhrzeit'], $_POST['Beschreibung'])) {
    $TitelID = $_POST['TitelID'];
    $Datum = $_POST['Datum'];
    $Uhrzeit = $_POST['Uhrzeit'];
    $Beschreibung = $_POST['Beschreibung'];
    
    // Beispiel: Standardtext für die Erinnerung (kann angepasst werden)
    $ErinnerungText = "Erinnerung für Termin: " . $TitelID;  

    // Prüfen, ob der Termin existiert
    $checkTermin = $conn->prepare("SELECT TitelID FROM Termin WHERE TitelID = ?");
    $checkTermin->bind_param("i", $TitelID);
    $checkTermin->execute();
    $result = $checkTermin->get_result();

    if ($result->num_rows > 0) {
        // Erinnerung speichern
        $stmt = $conn->prepare("INSERT INTO Erinnerung (TitelID, Erinnerung, Datum, Uhrzeit, Beschreibung) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $TitelID, $ErinnerungText, $Datum, $Uhrzeit, $Beschreibung);

        if ($stmt->execute()) {
            echo '<div class="success-message">Erinnerung wurde erfolgreich gespeichert!</div>';
            header("Refresh: 3; url=Monthly-View.html");
            exit();
        } else {
            echo '<div class="error-message">Fehler beim Speichern der Erinnerung: ' . $stmt->error . '</div>';
        }
        $stmt->close();
    } else {
        echo '<div class="error-message">Fehler: Der Termin existiert nicht!</div>';
    }

    $checkTermin->close();
} else {
    echo '<div class="error-message">Fehlende Formulardaten!</div>';
}

// Verbindung schließen
$conn->close();
?>

</body>
</html>
