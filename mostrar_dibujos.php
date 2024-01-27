<?php
include("../bd.php");

$sql = "SELECT nombre, dibujo FROM dibujos ORDER BY fecha DESC";  
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    while ($row = $result->fetch_assoc()) {
        $nombre = $row["nombre"];
        $dibujoData = $row["dibujo"];
        echo '<p>'.$nombre.'</p>';
        echo '<img src="' . $dibujoData . '" alt="Dibujo">';
    }
} else {
    echo "No hay dibujos almacenados.";
}

$conn->close();
?>
