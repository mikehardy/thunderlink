#!/bin/bash
# instructions:
#   https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Setting_up_extension_development_environment
#   https://developer.mozilla.org/en-US/docs/Mozilla/Thunderbird/Thunderbird_extensions/Building_a_Thunderbird_extension_7:_Installation

echo "$PWD" > thunderlink@mozilla.org
cp thunderlink@mozilla.org /Users/mario/Library/Thunderbird/Profiles/bl174l7i.dev/extensions

#/Applications/Thunderbird.app/Contents/MacOS/thunderbird --jsdebugger --devtools -no-remote -P bl174l7i.dev
/Applications/Thunderbird.app/Contents/MacOS/thunderbird --devtools -no-remote -P bl174l7i.dev