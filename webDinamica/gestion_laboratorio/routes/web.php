<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EquipoController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// METE LAS RUTAS DEL LABORATORIO CON EL PATOVICA
Route::get('/equipos', [EquipoController::class, 'index'])->middleware('auth')->name('equipos.index');
Route::post('/equipos/guardar', [EquipoController::class, 'store'])->middleware('auth')->name('equipos.store');

require __DIR__.'/auth.php';
