<?php

namespace App\Services;

use App\Models\Router;
use RouterOS\Client;
use RouterOS\Query;
use Exception;
use Illuminate\Support\Facades\Log;

class MikrotikService
{
    protected $client;

    /**
     * Connect to a specific Mikrotik router.
     */
    public function connect(Router $router)
    {
        try {
            $isSsl = ((int) $router->api_port === 8729);
            
            $config = [
                'host' => $router->ip_address,
                'user' => $router->username,
                'pass' => $router->password ?? '',
                'port' => (int) $router->api_port,
                'timeout' => 3,
            ];

            if ($isSsl) {
                $config['ssl'] = true;
                $config['ssl_options'] = [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true,
                ];
            }

            $this->client = new Client($config);
            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Connection Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Isolate user via Address List (Redirect to Landing Page).
     */
    public function isolate(Router $router, $username)
    {
        if (!$this->connect($router)) return false;

        try {
            // Find active connection to get IP
            $query = (new Query('/ppp/active/print'))->where('name', $username);
            $active = $this->client->query($query)->read();

            if (!empty($active) && isset($active[0]['address'])) {
                $ipAddress = $active[0]['address'];
                
                $addQuery = (new Query('/ip/firewall/address-list/add'))
                    ->equal('list', 'ISOLIR')
                    ->equal('address', $ipAddress)
                    ->equal('comment', 'Isolated by Billing System: ' . $username);
                
                $this->client->query($addQuery)->read();
                return true;
            }
            return false;
        } catch (Exception $e) {
            Log::error("Mikrotik Isolation Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Reconnect/Unisolate user.
     */
    public function reconnect(Router $router, $username)
    {
        if (!$this->connect($router)) return false;

        try {
            // Remove from address list
            $query = (new Query('/ip/firewall/address-list/print'))
                ->where('comment', 'Isolated by Billing System: ' . $username);
            
            $lists = $this->client->query($query)->read();

            if (!empty($lists)) {
                foreach ($lists as $list) {
                    if (isset($list['.id'])) {
                        $removeQuery = (new Query('/ip/firewall/address-list/remove'))
                            ->equal('.id', $list['.id']);
                        $this->client->query($removeQuery)->read();
                    }
                }
            }
            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Reconnect Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add or Update a PPP Secret
     */
    public function syncSecret(Router $router, array $data)
    {
        if (!$this->connect($router)) return false;

        try {
            $query = (new Query('/ppp/secret/print'))->where('name', $data['username']);
            $existing = $this->client->query($query)->read();

            if (!empty($existing) && isset($existing[0]['.id'])) {
                // Update
                $request = (new Query('/ppp/secret/set'))
                    ->equal('.id', $existing[0]['.id']);
            } else {
                // Create
                $request = (new Query('/ppp/secret/add'))
                    ->equal('name', $data['username']);
            }

            $request->equal('password', $data['password'])
                    ->equal('service', 'pppoe')
                    ->equal('profile', $data['profile'])
                    ->equal('comment', 'IDRISIYYAH-NET: ' . $data['full_name']);
            
            $response = $this->client->query($request)->read();

            if (is_array($response)) {
                if (isset($response['!trap'])) {
                    Log::error("Mikrotik Secret Sync Failed (!trap): " . json_encode($response['!trap']));
                    return false;
                }
                if (isset($response['after']['message'])) {
                    Log::error("Mikrotik Secret Sync Failed: " . $response['after']['message']);
                    return false;
                }
            }

            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Secret Sync Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Remove a PPP Secret
     */
    public function removeSecret(Router $router, string $username)
    {
        if (!$this->connect($router)) return false;

        try {
            $query = (new Query('/ppp/secret/print'))->where('name', $username);
            $existing = $this->client->query($query)->read();

            if (!empty($existing) && isset($existing[0]['.id'])) {
                $request = (new Query('/ppp/secret/remove'))
                    ->equal('.id', $existing[0]['.id']);
                $this->client->query($request)->read();
            }
            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Secret Remove Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add or Update an IP Pool
     */
    public function syncPool(Router $router, string $poolName, string $ranges)
    {
        if (!$this->connect($router)) return false;

        try {
            $query = (new Query('/ip/pool/print'))->where('name', $poolName);
            $existing = $this->client->query($query)->read();

            if (!empty($existing) && isset($existing[0]['.id'])) {
                // Update
                $request = (new Query('/ip/pool/set'))
                    ->equal('.id', $existing[0]['.id']);
            } else {
                // Create
                $request = (new Query('/ip/pool/add'))
                    ->equal('name', $poolName);
            }

            $request->equal('ranges', $ranges);
            
            $response = $this->client->query($request)->read();

            if (is_array($response)) {
                if (isset($response['!trap'])) {
                    Log::error("Mikrotik Pool Sync Failed (!trap): " . json_encode($response['!trap']));
                    return false;
                }
                if (isset($response['after']['message'])) {
                    Log::error("Mikrotik Pool Sync Failed: " . $response['after']['message']);
                    return false;
                }
            }

            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Pool Sync Failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Add or Update a PPP Profile
     */
    public function syncProfile(Router $router, string $profileName, ?string $localAddress, ?string $poolName, ?string $rateLimit)
    {
        if (!$this->connect($router)) return false;

        try {
            $query = (new Query('/ppp/profile/print'))->where('name', $profileName);
            $existing = $this->client->query($query)->read();

            if (!empty($existing) && isset($existing[0]['.id'])) {
                // Update
                $request = (new Query('/ppp/profile/set'))
                    ->equal('.id', $existing[0]['.id']);
            } else {
                // Create
                $request = (new Query('/ppp/profile/add'))
                    ->equal('name', $profileName);
            }

            if ($localAddress) $request->equal('local-address', $localAddress);
            if ($poolName) $request->equal('remote-address', $poolName);
            if ($rateLimit) $request->equal('rate-limit', $rateLimit);
            
            $response = $this->client->query($request)->read();

            if (is_array($response)) {
                if (isset($response['!trap'])) {
                    Log::error("Mikrotik Profile Sync Failed (!trap): " . json_encode($response['!trap']));
                    return false;
                }
                if (isset($response['after']['message'])) {
                    Log::error("Mikrotik Profile Sync Failed: " . $response['after']['message']);
                    return false;
                }
            }

            return true;
        } catch (Exception $e) {
            Log::error("Mikrotik Profile Sync Failed: " . $e->getMessage());
            return false;
        }
    }
}
