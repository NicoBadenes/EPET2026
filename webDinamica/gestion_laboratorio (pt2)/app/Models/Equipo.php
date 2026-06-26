<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipo extends Model
{
    public function aula() 
    {
        return $this->belongsTo(Aula::class);
    }
}