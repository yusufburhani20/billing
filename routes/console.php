<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('billing:generate')->dailyAt('00:01');
Schedule::command('billing:isolate')->dailyAt('00:05');
