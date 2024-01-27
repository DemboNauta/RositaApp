<?php
    $servername = "localhost"; // Nombre del servidor
    $username = "id21825236_edgar"; // Nombre de usuario
    $password = "Edgarana1"; // Contraseña (si es necesario)
    $database = "id21825236_rositaapp"; // Nombre de la base de datos
    
    $conn = new mysqli($servername, $username, $password, $database);
    
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }
    
?>