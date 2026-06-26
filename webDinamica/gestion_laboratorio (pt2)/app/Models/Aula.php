<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Aula extends Model
{
    protected $fillable = ['nombre_sala'];
    public function equipos() 
    {
        return $this->hasMany(Equipo::class);
    }
}