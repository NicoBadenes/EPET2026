<?php
require 'funciones.php';

// Precios
$servicios = [
    "consulta"     => 3500,
    "vacuna"       => 5000,
    "cirugia"      => 25000,
    "internacion"  => 8000,
    "peluqueria"   => 4000,
];

// Verificar POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    header("Location: turno.html");
    exit();
}

$nombre_m = htmlspecialchars(trim($_POST['nombre_mascota']));
$especie  = $_POST['especie'];
$edad     = (int)$_POST['edad'];
$peso     = (float)$_POST['peso'];
$duenio   = htmlspecialchars(trim($_POST['duenio']));
$email    = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$servicio_e = $_POST['servicio'];

// Validaciones
$errores = [];

if (empty($nombre_m) || empty($duenio)) {
    $errores[] = "Todos los campos con nombre son obligatorios.";
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El email ingresado no es válido.";
}
if ($edad < 0 || $edad > 30) {
    $errores[] = "La edad debe estar entre 0 y 30 años.";
}
if ($peso <= 0) {
    $errores[] = "El peso debe ser mayor a 0.";
}

// Mostrar Resultado
if (count($errores) > 0) {
    echo "<h3 style='color:red;'>Errores en el formulario:</h3><ul>";
    foreach ($errores as $error) {
        echo "<li>$error</li>";
    }
    echo "</ul><a href='turno.html'>Volver a intentar</a>";
} else {
    $precio_base = $servicios[$servicio_e];
    $precio_final = calcularPrecio($precio_base, $especie, $edad);
    $precio_f = number_format($precio_final, 2, ',', '.');

    echo "<h2>=== TURNO CONFIRMADO ===</h2>";
    echo "Mascota: $nombre_m ($especie, $edad años, $peso kg)<br>";
    echo "Dueño: $duenio — $email<br>";
    echo "Servicio: $servicio_e<br>";
    echo "<strong>Precio estimado: $$precio_f</strong><br>";
    echo "Nos contactaremos para confirmar el horario.";
}
?>