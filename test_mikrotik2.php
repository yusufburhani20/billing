<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$m = new App\Services\MikrotikService();
$r = App\Models\Router::first();
$m->connect($r);

// I will use Reflection to bypass protected property
$reflection = new ReflectionClass($m);
$property = $reflection->getProperty('client');
$property->setAccessible(true);
$client = $property->getValue($m);

$response = $client->query(new RouterOS\Query('/ppp/secret/print'))->read();
var_dump($response);
