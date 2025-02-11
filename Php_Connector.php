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

		$conn=mysqli_connect('localhost','root','','databasename');
		if($conn)
			{
				echo "connection succsessfull";
				db.execute(
					"""CREATE TABLE IF NOT EXISTS Termin (
						   id INTEGER
						   , $Name VARCHAR(50)
						   , $Vorname VARCHAR(10)
						   , $Uhrzeit Time
						   , $Datum Date
						   , $Beschreibung Text(200)
						   , $Ort VARCHAR(12)
						   , $Titel VARCHAR(20)
						   , PRIMARY KEY(id))"""
				)

				sqlStatement = "INSERT INTO Termin ($Name, $Vorname, $Uhrzeit, $Datum, $Beschreibung, $Ort, $Titel) VALUES (?, ?, ?, ?, ?, ?, ?)"
				db.execute(sqlStatement, ($Name, $Vorname, $Uhrzeit, $Datum, $Beschreibung, $Ort, $Titel))
				db.commit()

			}else {
				echo "Failed to connect with server"
			}

		?>
	<!-- php-Interpreter ausschalten -->			
	</body>

</html>