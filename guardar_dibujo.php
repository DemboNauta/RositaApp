<?php
include("../bd.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dibujo = $_POST['dibujo'];
    $nombre = $_POST['nombre'];

    // Modifica la consulta para incluir dos parámetros
    $stmt = $conn->prepare("INSERT INTO dibujos (dibujo, nombre) VALUES (?, ?)");
    
    // Cambia "s" a "ss" para indicar dos parámetros de tipo cadena
    $stmt->bind_param("ss", $dibujo, $nombre);

    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Dibujo guardado con éxito"]);
    } else {
        echo json_encode(["mensaje" => "Error al guardar el dibujo"]);
    }

    $stmt->close();
}

$conn->close();
?>

