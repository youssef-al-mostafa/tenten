<?php

use App\Http\Controllers\PageContentController;
use Illuminate\Support\Facades\Route;

Route::get('api/pages/{slug}/content', [PageContentController::class, 'getContent']);
