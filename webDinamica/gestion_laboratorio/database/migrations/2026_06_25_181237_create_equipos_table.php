<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('equipos', function (Blueprint $table) {
            $table->id(); // Identificador único
            $table->string('nombre', 80); // Tipo de componente
            $table->string('numero_serie')->unique(); // Patrimonio escolar
            $table->text('descripcion')->nullable(); // Observaciones que admiten nulos
            $table->string('imagen_ruta')->nullable(); // columna para la foto
            
            // clave foranea
            $table->foreignId('aula_id')->constrained('aulas')->onDelete('cascade');
            
            $table->timestamps(); // Marcas de auditoria
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipos');
    }
};