<!DOCTYPE html>
<html lang="de"> 
	<head>
		<meta charset ="utf-8">
		<title> Php-Connector </title>
		<style>
		
		</style>
	</head>
	<body>
	<!-- php-Interpreter einschalten -->
	<?php
// Verbindung zur SQLite-Datenbank herstellen
try {
    $pdo = new PDO('sqlite:Kalender-Datenbank.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Daten aus dem Formular holen
    $titel = $_POST['Titel'];
    $datum = $_POST['Datum'];
	$uhrzeit = $_POST['Uhrzeit'];
	$beschreibung = $_POST['Beschreibung'];
    
    // SQL-Abfrage zum Einfügen der Daten
    $stmt = $pdo->prepare("INSERT INTO Termin (Titel, Datum, Uhrzeit, Beschreibung) VALUES (:Titel, :Datum, :Uhrzeit; :Beschreibung)");
    $stmt->bindParam(':Titel', $titel);
    $stmt->bindParam(':Datum', $datum);
	$stmt->bindParam(':Uhrzeit', $time);
	$stmt->bindParam(':Beschreibung', $beschreibung);
    
    // SQL-Abfrage ausführen
    $stmt->execute();
    
    echo "Benutzer erfolgreich hinzugefügt!";
} catch (PDOException $e) {
    echo "Fehler: " . $e->getMessage();
}
?>
	<!-- php-Interpreter ausschalten -->			
	</body>
</html>