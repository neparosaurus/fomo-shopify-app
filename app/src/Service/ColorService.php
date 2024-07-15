<?php

namespace App\Service;

class ColorService
{
    public static function hsbToRgba($color) {
        $hue = $color["hue"] / 360;
        $saturation = $color["saturation"];
        $brightness = $color["brightness"];
        $red = $green = $blue = 0;

        if ($saturation === 0) {
            $red = $green = $blue = $brightness * 255;
        } else {
            $i = floor($hue * 6);
            $f = ($hue * 6) - $i;
            $p = $brightness * (1 - $saturation);
            $q = $brightness * (1 - ($saturation * $f));
            $t = $brightness * (1 - ($saturation * (1 - $f)));

            switch ($i % 6) {
                case 0:
                    $red = $brightness; $green = $t; $blue = $p; break;
                case 1:
                    $red = $q; $green = $brightness; $blue = $p; break;
                case 2:
                    $red = $p; $green = $brightness; $blue = $t; break;
                case 3:
                    $red = $p; $green = $q; $blue = $brightness; break;
                case 4:
                    $red = $t; $green = $p; $blue = $brightness; break;
                case 5:
                    $red = $brightness; $green = $p; $blue = $q; break;
            }

            $red = floor($red * 255);
            $green = floor($green * 255);
            $blue = floor($blue * 255);
        }

        return "rgba({$red}, {$green}, {$blue}, {$color["alpha"]})";
    }
}