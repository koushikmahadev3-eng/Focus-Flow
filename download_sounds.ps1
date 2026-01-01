$sounds = @{
    "rain.ogg" = "https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg";
    "forest.ogg" = "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg";
    "cafe.ogg" = "https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg";
    "fire.ogg" = "https://actions.google.com/sounds/v1/ambiences/fire.ogg";
    "space.ogg" = "https://actions.google.com/sounds/v1/science_fiction/space_ambience.ogg";
    "ocean.ogg" = "https://actions.google.com/sounds/v1/nature/ocean_waves_large_sweep_1.ogg";
    "train.ogg" = "https://actions.google.com/sounds/v1/transportation/train_pass_by_close.ogg";
    "night.ogg" = "https://actions.google.com/sounds/v1/nature/crickets_ambience.ogg";
    "keyboard.ogg" = "https://actions.google.com/sounds/v1/office/typing_on_computer_keyboard_continuous.ogg";
    "wind.ogg" = "https://actions.google.com/sounds/v1/weather/wind_medium_continuous.ogg"
}

$dest = "public\sounds"
if (!(Test-Path -Path $dest)) {
    New-Item -ItemType Directory -Path $dest | Out-Null
}

foreach ($name in $sounds.Keys) {
    echo "Downloading $name..."
    $url = $sounds[$name]
    $out = Join-Path $dest $name
    try {
        Invoke-WebRequest -Uri $url -OutFile $out
        echo "Saved: $name"
    } catch {
        echo "Failed to download $name from $url"
    }
}
