$baseUrl = "https://actions.google.com/sounds/v1"

# Candidate paths - attempting to find valid ones
$candidates = @{
    "forest.ogg" = @("ambiences/forest_morning.ogg", "nature/forest_wind.ogg", "ambiences/outdoor_summer_ambience.ogg");
    "ocean.ogg" = @("water/ocean_waves_large_sweep_1.ogg", "water/ocean_waves_large_sweep_2.ogg", "nature/ocean_waves.ogg");
    "wind.ogg" = @("weather/wind_medium_continuous.ogg", "weather/wind_heavy.ogg");
    "thunder.ogg" = @("weather/thunder_crack.ogg", "weather/thunderstorm.ogg");
    "night.ogg" = @("nature/crickets_ambience.ogg", "ambiences/outdoor_suburb_ambience.ogg");
    "space.ogg" = @("science_fiction/space_ambience.ogg", "science_fiction/scifi_drone.ogg");
    "keyboard.ogg" = @("office/typing_on_computer_keyboard_continuous.ogg", "office/typing.ogg");
    "train.ogg" = @("transportation/train_pass_by_close.ogg", "transportation/steam_train_whistle.ogg");
}

$dest = "public\sounds"
if (!(Test-Path -Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

foreach ($key in $candidates.Keys) {
    if (Test-Path -Path (Join-Path $dest $key)) {
        echo "Already have $key, skipping."
        continue
    }

    $success = $false
    foreach ($path in $candidates[$key]) {
        $url = "$baseUrl/$path"
        $out = Join-Path $dest $key
        try {
            Invoke-WebRequest -Uri $url -OutFile $out -UserAgent "Mozilla/5.0" -ErrorAction Stop
            echo "SUCCESS: Downloaded $key from $path"
            $success = $true
            break
        } catch {
            echo "Failed: $path"
        }
    }
    
    if (-not $success) {
        echo "COULD NOT DOWNLOAD: $key"
    }
}
