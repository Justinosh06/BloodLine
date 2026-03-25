<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApiController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page - Only for guests
Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    });
});

// Protected Routes
Route::middleware('auth')->group(function () {
    
    // API Routes
    Route::prefix('api')->group(function () {
        Route::get('/available-requests', [ApiController::class, 'getAvailableRequests']);
        Route::get('/hospital-inventory', [ApiController::class, 'getHospitalInventory']);
        Route::get('/donor-stats', [ApiController::class, 'getDonorStats']);
        Route::get('/hospital-stats', [ApiController::class, 'getHospitalStats']);
        Route::post('/donations', [ApiController::class, 'createDonation']);
        Route::put('/requests/{bloodRequest}/status', [ApiController::class, 'updateRequestStatus']);
        Route::get('/system-stats', [ApiController::class, 'getSystemStats']);
        Route::get('/search-donors', [ApiController::class, 'searchDonors']);
    });
    
    // Client/Donor Area
    Route::get('/dashboard', [ClientController::class, 'index'])->name('dashboard');
    Route::get('/requests', [ClientController::class, 'availableRequests'])->name('requests.index');
    Route::get('/requests/create', [ClientController::class, 'createRequest'])->name('requests.create');
    Route::post('/requests', [ClientController::class, 'storeRequest'])->name('requests.store');
    Route::get('/requests/available', [ClientController::class, 'availableRequests'])->name('requests.available');
    Route::get('/inventory', [ClientController::class, 'inventory'])->name('inventory');
    Route::get('/calendar', [ClientController::class, 'calendar'])->name('calendar');
    Route::post('/donations', [ClientController::class, 'storeDonation'])->name('donations.store');
    Route::post('/donations/register', [ClientController::class, 'registerDonation'])->name('donations.register');
    Route::post('/donations/accept', [ClientController::class, 'acceptRejectDonation'])->name('donations.accept');
    Route::post('/donations/update-status', [ClientController::class, 'updateDonationStatus'])->name('donations.update-status');

    // Admin/Hospital Area (Third-Party)
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])
        ->prefix('admin')
        ->group(function () {
            Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
            Route::get('/global-requests', [AdminController::class, 'globalRequests'])->name('admin.global-requests');
            Route::get('/inventory', [AdminController::class, 'inventory'])->name('admin.inventory');
        });

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';