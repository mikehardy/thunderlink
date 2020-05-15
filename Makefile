VERSION:=$(shell cat VERSION)
XPI:=thunderlink-$(VERSION)-tb.xpi
RDF:=install.rdf
MANIFEST:=manifest.json

# Always build new XPI file if requested.
.PHONY: $(XPI)
$(XPI) : $(RDF) $(MANIFEST) ./VERSION
	zip --filesync --quiet --recurse-paths $(XPI) chrome/* $(MANIFEST) chrome.manifest components/* CREDITS defaults/* modules/* $(RDF) LICENSE README.md

$(MANIFEST) : ./VERSION
	perl -p -i -e "s/\"version\"\: \".*\"/\"version\"\: \"$(VERSION)\"/" $(MANIFEST)

$(RDF): ./VERSION
	perl -p -i -e "s/version>.+</version>$(VERSION)</" $(RDF)

.PHONY: clean
clean :
	rm -f -- $(XPI)
