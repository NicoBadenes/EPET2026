<?php
$nombre = "Aucan";
$especie = "perro";
$edad = 18;

// Array de servicios
$servicios = [
    "consulta"     => 3500,
    "vacuna"       => 5000,
    "cirugia"      => 25000,
    "internacion"  => 8000,
    "peluqueria"   => 4000,
];

// Recargo x especie
$factor_especie = match($especie) {
    'perro'           => 1.0,
    'gato'            => 1.1,
    'conejo', 'hamster' => 1.2,
    'reptil', 'ave'   => 1.35,
    default           => 1.15,
};

// Desceunto x edad
if ($edad < 1) {
    $descuento = 0.15;
} elseif ($edad >= 1 && $edad <= 8) {
    $descuento = 0.0;
} else {
    $descuento = 0.10;
}

echo "=== TABLA DE PRECIOS PARA $nombre ===<br>";


foreach ($servicios as $nombre_servicio => $precio_base) {
    $precio_final = $precio_base * $factor_especie * (1 - $descuento);
    
    $precio_formateado = number_format($precio_final, 2, ',', '.');
    
    echo "$nombre_servicio: $$precio_formateado";
    if ($nombre_servicio == "internacion") echo " (por día)";
    echo "<br>";
}

echo "Factor especie: x$factor_especie | Descuento por edad: " . ($descuento * 100) . "%";
?>
