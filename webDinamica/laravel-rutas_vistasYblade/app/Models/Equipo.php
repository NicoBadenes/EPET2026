<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'numero_serie', 'descripcion', 'imagen_ruta', 'aula_id'];

    public function aula()
    {
        return $this->belongsTo(Aula::class); 
    }
}