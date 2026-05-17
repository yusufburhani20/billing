<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$m = new App\Services\MikrotikService();
$r = App\Models\Router::first();

// Use Reflection
$reflection = new ReflectionClass($m);
$m->connect($r);
$property = $reflection->getProperty('client');
$property->setAccessible(true);
$client = $property->getValue($m);

$request = (new RouterOS\Query('/ppp/secret/add'))
    ->equal('name', 'test_tinker3')
    ->equal('password', '123')
    ->equal('service', 'pppoe')
    ->equal('profile', 'default');
    
$res = $client->query($request)->read();
var_dump($res);
