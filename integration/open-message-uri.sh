#!/bin/bash
LINK=`echo $1 | sed -e 's/message\:\/\/\%3c/thunderlink\:\/\/messageid=/' | sed -e 's/\%3e//'`
/usr/lib/thunderbird/thunderbird -thunderlink "$LINK"
