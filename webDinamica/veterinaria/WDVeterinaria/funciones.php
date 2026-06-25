<?php

/**
 * 1.
 * Recibe el nombre de la especie y retorna el factor de recargo.
 */
function obtenerFactorEspecie(string $especie): float {
    return match(strtolower($especie)) {
        'perro'           => 1.0,
        'gato'            => 1.1,
        'conejo', 'hamster' => 1.2,
        'reptil', 'ave'   => 1.35,
        default           => 1.15,
    };
}

/**
 * 2.
 * Recibe la edad y retorna el porcentaje de descuento (0.15, 0, o 0.10).
 */
function obtenerDescuentoEdad(int $edad): float {
    if ($edad < 1) {
        return 0.15; // Cachorros
    } elseif ($edad >= 1 && $edad <= 8) {
        return 0.0;  // Adultos
    } else {
        return 0.10; // Senior
    }
}

/**
 * 3.
 * Llama a las anteriores y retorna el precio redondeado a 2 decimales.
 */
function calcularPrecio(int $precioBase, string $especie, int $edad): float {
    $factor = obtenerFactorEspecie($especie);
    $descuento = obtenerDescuentoEdad($edad);
    
    $precioFinal = $precioBase * $factor * (1 - $descuento);
    
    return round($precioFinal, 2);
}

/**
 * 4.
 * Retorna un string con el HTML (tabla) de la mascota. No usa echo.
 */
function generarFicha(string $nombre, string $especie, int $edad, float $peso, bool $vacunado): string {
    $siNo = $vacunado ? "Sí" : "No";
    
    // Armamos el string con la estructura de tabla HTML
    $html = "<table border='1' style='border-collapse: collapse; width: 300px;'>";
    $html .= "<tr><th colspan='2'>FICHA MÉDICA</th></tr>";
    $html .= "<tr><td><strong>Nombre:</strong></td><td>$nombre</td></tr>";
    $html .= "<tr><td><strong>Especie:</strong></td><td>$especie</td></tr>";
    $html .= "<tr><td><strong>Edad:</strong></td><td>$edad años</td></tr>";
    $html .= "<tr><td><strong>Peso:</strong></td><td>$peso kg</td></tr>";
    $html .= "Logica de Vacunado: <tr><td><strong>Vacunado:</strong></td><td>$siNo</td></tr>";
    $html .= "</table><br>";
    
    return $html;
}

// Tests
echo "<h2>Pruebas de Cálculo de Precios</h2>";
echo "Precio Gato (2 años, base 3500): $" . calcularPrecio(3500, "gato", 2) . "<br>";
echo "Precio Reptil (10 años, base 3500): $" . calcularPrecio(3500, "reptil", 10) . "<br>";
echo "Precio Perro (0 años, base 5000): $" . calcularPrecio(5000, "perro", 0) . "<br><br>";

echo "<h2>Fichas de Mascotas</h2>";
echo generarFicha("gatito", "gato", 2, 4.2, true);
echo generarFicha("perrito", "perro", 9, 30.0, false);
echo generarFicha("conejito", "conejo", 0, 0.8, true);

?>