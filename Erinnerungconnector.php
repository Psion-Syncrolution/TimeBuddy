<!DOCTYPE html>
<html lang="de"> 
<head>
    <meta charset="utf-8">
    <title>Erinnerung Speichern</title>
    <style>
        /* CSS für die Darstellung von Erfolgsmeldung und Fehlermeldung */
        .success-message {
            color: green; /* Grün für Erfolg */
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin-top: 10%; /* Abstand nach oben */
        }
        .error-message {
            color: red; /* Rot für Fehler */
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-top: 20px; /* Abstand nach oben */
        }
    </style>
</head>
<!------------------------------------------------------------Body öffnen------------------------------------------------------------------------------------>
<body>
<!------------------------------------------------------PHP Interpreter einschalten-------------------------------------------------------------------------->
<?php
// Output-Buffering starten
ob_start(); 

// Verbindung zur MySQL-Datenbank herstellen
$conn = mysqli_connect("localhost", "root", "", "kalender_datenbank");

// Wenn die Verbindung zur Datenbank fehlschlägt, eine Fehlermeldung ausgeben
if (!$conn) {
    die('<div class="error-message">Verbindung fehlgeschlagen: ' . mysqli_connect_error() . '</div>');
}

// Überprüfen, ob die Formulardaten vorhanden sind (also ob der Benutzer das Formular abgeschickt hat)
if (isset($_POST['termin_id'], $_POST['Datum'], $_POST['Uhrzeit'], $_POST['Beschreibung'])) {
    // Die Formulardaten sicher abrufen und speichern
    $TitelID = htmlspecialchars($_POST['termin_id']);
    $Datum = htmlspecialchars($_POST['Datum']);
    $Uhrzeit = htmlspecialchars($_POST['Uhrzeit']);
    $Beschreibung = htmlspecialchars($_POST['Beschreibung']);

    // Einen Erinnerungstext erstellen, der die Termin-ID enthält
    $ErinnerungText = "Erinnerung für Termin ID: " . $TitelID;  

    // SQL-Abfrage vorbereiten, um zu überprüfen, ob der Termin mit der gegebenen TitelID existiert
    $checkTermin = $conn->prepare("SELECT TitelID FROM Termin WHERE TitelID = ?");
    // Den Parameter (TitelID) an die vorbereitete Abfrage binden
    $checkTermin->bind_param("i", $TitelID);
    // Die Abfrage ausführen
    $checkTermin->execute();
    // Das Ergebnis der Abfrage holen
    $result = $checkTermin->get_result();

    // Überprüfen, ob ein Termin mit der gegebenen TitelID existiert
    if ($result->num_rows > 0) {
        // Wenn der Termin existiert, eine SQL-Abfrage vorbereiten, um die Erinnerung zu speichern
        $stmt = $conn->prepare("INSERT INTO Erinnerung (TitelID, Erinnerung, Datum, Uhrzeit, Beschreibung) VALUES (?, ?, ?, ?, ?)");
        // Die Formulardaten (TitelID, Erinnerungstext, Datum, Uhrzeit, Beschreibung) an die vorbereitete Abfrage binden
        $stmt->bind_param("issss", $TitelID, $ErinnerungText, $Datum, $Uhrzeit, $Beschreibung);

        // Die Abfrage ausführen und überprüfen, ob sie erfolgreich war
        if ($stmt->execute()) {
            // Wenn die Erinnerung erfolgreich gespeichert wurde, eine Erfolgsmeldung anzeigen
            echo '<div class="success-message">Erinnerung wurde erfolgreich gespeichert!</div>';
            // Die Seite nach 3 Sekunden auf die Monatsansicht umleiten
            header("Refresh: 2; url=Monthly-View.html");
            exit();
        } else {
            // Wenn ein Fehler bei der Speicherung der Erinnerung auftritt, eine Fehlermeldung anzeigen
            echo '<div class="error-message">Fehler: ' . $stmt->error . '</div>';
        }
        // Die vorbereitete Abfrage schließen
        $stmt->close();
    } else {
        // Wenn der Termin nicht existiert, eine Fehlermeldung anzeigen
        echo '<div class="error-message">Fehler: Termin existiert nicht!</div>';
    }

    // Die vorbereitete Abfrage für die Terminprüfung schließen
    $checkTermin->close();
}

// Die Datenbankverbindung schließen
$conn->close();
// Output-Buffering beenden und die Ausgabe an den Browser senden
ob_end_flush(); 
?>
<!------------------------------------------------------PHP Interpreter ausschalten-------------------------------------------------------------------------->
</body>
<!------------------------------------------------------Body schließen------------------------------------------------------------------------------------>
</html>