<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unsubscribed - {{ config('app.name') }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        .title {
            color: #1a202c;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .message {
            color: #4a5568;
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .home-link {
            display: inline-block;
            background-color: #4299e1;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        .home-link:hover {
            background-color: #3182ce;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✅</div>
        <h1 class="title">Successfully Unsubscribed</h1>
        <p class="message">
            The email address <strong>{{ $email }}</strong> has been removed from our newsletter list.
            <br><br>
            You will no longer receive newsletter emails from us. If you change your mind, you can always subscribe again from our website.
        </p>
        <a href="{{ url('/') }}" class="home-link">Return to Homepage</a>
    </div>
</body>
</html>