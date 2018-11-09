if [ -n "$1" ]; then
    perl -p -i -e "s/version>.+</version>$1</" install.rdf
    zip -r thunderlink-$1-tb.xpi chrome/* chrome.manifest components/* CREDITS defaults/* install.rdf LICENSE README.md
else
    echo "Please give me a version!"
fi
