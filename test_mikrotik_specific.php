<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$c = App\Models\Customer::first();
$m = new App\Services\MikrotikService();
$r = App\Models\Router::first();

// Use Reflection
$reflection = new ReflectionClass($m);
$m->connect($r);
$property = $reflection->getProperty('client');
$property->setAccessible(true);
$client = $property->getValue($m);

$query = (new RouterOS\Query('/ppp/secret/print'))->where('name', $c->pppoe_username);
var_dump($client->query($query)->read());
