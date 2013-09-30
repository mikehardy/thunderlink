perl -p -i -e "s/version>.+</version>$1</" install.rdf
zip -r thunderlink-$1-tb.xpi . -x *.swo *.swp *.xpi *.sh *.git* .gitignore
