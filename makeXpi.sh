if [ -n "$1" ]; then
    rm thunderlink-$1-tb.xpi
    perl -p -i -e "s/version>.+</version>$1</" install.rdf
    perl -p -i -e "s/\"version\"\: \".*\"/\"version\"\: \"$1\"/" manifest.json
    zip -r thunderlink-$1-tb.xpi chrome/* manifest.json chrome.manifest components/* CREDITS defaults/* install.rdf LICENSE README.md
else
    echo "Please give me a version!"
fi
