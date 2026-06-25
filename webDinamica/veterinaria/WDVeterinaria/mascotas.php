<?php
// 1.
$nombre = "Aucan";
$especie = "perro";
$edad = 18;
$peso = 81.6; 
$vacunado = true; 
$duenio = "Jesus Epstein";

// 2.
var_dump($nombre); echo "<br>";
var_dump($especie); echo "<br>";
var_dump($edad); echo "<br>";
var_dump($peso); echo "<br>";
var_dump($vacunado); echo "<br>";
var_dump($duenio); echo "<hr>";

// 3.
$edad_meses = $edad * 12;
$peso_gramos = $peso * 1000;
$etapa = ($edad >= 7) ? "Senior" : "Adulto joven";

// 4.
echo "=== FICHA DE MASCOTA ===<br>";
echo "Paciente: $nombre ($especie)<br>";
echo "Dueño: $duenio<br>";
echo "Edad: $edad años ($edad_meses meses) — $etapa<br>";
echo "Peso: $peso kg ($peso_gramos gramos)<br>";
$estado_vacuna = $vacunado ? "Sí" : "No";
echo "Vacunado: $estado_vacuna";
?>