<?php

namespace App\Http\Controllers;

use App\Models\Pages;

class PageContentController extends Controller
{
      public function getContent(string $slug)
    {
        $page = Pages::where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$page) {
            return response()->json([
                'error' => 'Page not found'
            ], 404);
        }

        return response()->json([
            'content' => $page->content,
            'schema' => $page->template_schema,
            'name' => $page->name,
            'slug' => $page->slug
        ]);
    }
}
