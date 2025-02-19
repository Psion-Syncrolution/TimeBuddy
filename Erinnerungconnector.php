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
ob_start(); // Start output buffering

// Verbindung zur Datenbank
$conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

if (!$conn) {
    die('<div class="error-message">Verbindung fehlgeschlagen: ' . mysqli_connect_error() . '</div>');
}

// Formulardaten abrufen
if (isset($_POST['termin_id'], $_POST['Datum'], $_POST['Uhrzeit'], $_POST['Beschreibung'])) {
    $TitelID = htmlspecialchars($_POST['termin_id']);
    $Datum = htmlspecialchars($_POST['Datum']);
    $Uhrzeit = htmlspecialchars($_POST['Uhrzeit']);
    $Beschreibung = htmlspecialchars($_POST['Beschreibung']);

    $ErinnerungText = "Erinnerung für Termin ID: " . $TitelID;  

    $checkTermin = $conn->prepare("SELECT TitelID FROM Termin WHERE TitelID = ?");
    $checkTermin->bind_param("i", $TitelID);
    $checkTermin->execute();
    $result = $checkTermin->get_result();

    if ($result->num_rows > 0) {
        $stmt = $conn->prepare("INSERT INTO Erinnerung (TitelID, Erinnerung, Datum, Uhrzeit, Beschreibung) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $TitelID, $ErinnerungText, $Datum, $Uhrzeit, $Beschreibung);

        if ($stmt->execute()) {
            echo '<div class="success-message">Erinnerung wurde erfolgreich gespeichert!</div>';
            header("Refresh: 3; url=Monthly-View.html");
            exit();
        } else {
            echo '<div class="error-message">Fehler: ' . $stmt->error . '</div>';
        }
        $stmt->close();
    } else {
        echo '<div class="error-message">Fehler: Termin existiert nicht!</div>';
    }

    $checkTermin->close();
}

$conn->close();
ob_end_flush(); // End output buffering
?>


</body>
</html>