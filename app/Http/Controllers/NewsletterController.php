<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:newsletters,email'
        ]);

        try {
            Newsletter::create([
                'email' => $request->email,
                'status' => 'active',
                'subscribed_at' => now(),
            ]);

            return back()->with('success', [
                'message' => 'Successfully subscribed to our newsletter!',
                'time' => time()
            ]);

        } catch (\Exception $e) {
            if (str_contains($e->getMessage(), 'newsletters_email_unique')) {
                return back()->withErrors([
                    'email' => 'This email is already subscribed to our newsletter.'
                ]);
            }

            return back()->withErrors([
                'email' => 'Something went wrong. Please try again.'
            ]);
        }
    }

    public function unsubscribe($email)
    {
        $decodedEmail = base64_decode($email);
        
        $newsletter = Newsletter::where('email', $decodedEmail)->first();
        
        if ($newsletter) {
            $newsletter->update([
                'status' => 'inactive',
                'unsubscribed_at' => now(),
            ]);
        }

        return view('newsletter.unsubscribed', ['email' => $decodedEmail]);
    }
}
