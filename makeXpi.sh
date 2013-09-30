if [ -n "$1" ]; then
    perl -p -i -e "s/version>.+</version>$1</" install.rdf
    zip -r thunderlink-$1-tb.xpi . -x *.swo *.swp *.xpi *.sh *.git* .gitignore
else
    echo "Please give me a version!"
fi
