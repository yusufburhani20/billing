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

$data = [
    'username' => $c->pppoe_username,
    'password' => $c->pppoe_password,
    'profile' => $c->package->speed_profile_name ?? 'default',
    'full_name' => $c->user->name
];

$query = (new RouterOS\Query('/ppp/secret/print'))->where('name', $data['username']);
$existing = $client->query($query)->read();
var_dump("Existing:", $existing);

$request = (new RouterOS\Query('/ppp/secret/add'))
    ->equal('name', $data['username'])
    ->equal('password', $data['password'])
    ->equal('service', 'pppoe')
    ->equal('profile', $data['profile'])
    ->equal('comment', 'IDRISIYYAH-NET: ' . $data['full_name']);
    
var_dump("Request:", $request);
$response = $client->query($request)->read();
var_dump("Response:", $response);
