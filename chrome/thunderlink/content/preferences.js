/*
   ThunderLink.
   Link from your browser to your email messages!  

   Copyright (C) 2011 Christoph Zwirello

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>
   */



var ThunderLinkPrefNS = {


    CreateCustomStringTabbox: function() {

        Components.utils.import("resource:///modules/mailServices.js");
        var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        function createCstrTabPanel(cstrnum) {
            var tabpanel = window.document.createElementNS(XUL_NS, "tabpanel"); 
            var vbox = window.document.createElementNS(XUL_NS, "vbox"); 
            vbox.setAttribute("align", "left");
            tabpanel.appendChild(vbox);

            var tTextbox = window.document.createElementNS(XUL_NS, "textbox"); 
            tTextbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-title");
            tTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "title");
            var tLabel = window.document.createElementNS(XUL_NS, "label"); 
            tLabel.setAttribute("label", "Custom String title:");
            tLabel.setAttribute("control", tTextbox.id);
            vbox.appendChild(tLabel);
            vbox.appendChild(tTextbox);

            var csTextbox = window.document.createElementNS(XUL_NS, "textbox"); 
            csTextbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-textbox");
            csTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum);
            csTextbox.setAttribute("multiline", "true");
            csTextbox.setAttribute("cols", "50");
            csTextbox.setAttribute("rows", "5");
            var csLabel = window.document.createElementNS(XUL_NS, "label"); 
            csLabel.setAttribute("label", "Custom String:");
            csLabel.setAttribute("control", csTextbox.id);
            vbox.appendChild(csLabel);
            vbox.appendChild(csTextbox);

            var tagCheckbox = window.document.createElementNS(XUL_NS, "checkbox"); 
            tagCheckbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-tagcheckbox");
            tagCheckbox.setAttribute("checked", "false");
            tagCheckbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "tagcheckbox");
            tagCheckbox.setAttribute("label", "Tag email upon copying the ThunderLink:");
            tagCheckbox.setAttribute("oncommand", "ThunderLinkPrefNS.ToggleTlTagField("+cstrnum+");");
            vbox.appendChild(tagCheckbox);

            var tagLabel = window.document.createElementNS(XUL_NS, "label"); 
            tagLabel.setAttribute("control", "prefCustomTlString" + cstrnum + "-tag");
            tagLabel.setAttribute("value", "using tag:");

            function appendMenuItems(menuPopup){

                let tagArray = MailServices.tags.getAllTags({}); 
                for (var j = 0; j < tagArray.length; ++j)
                {
                    var menuItem = window.document.createElementNS(XUL_NS, "menuitem");

                    menuItem.setAttribute("label", tagArray[j].tag);
                    menuItem.setAttribute("value", j+1);
                    menuPopup.appendChild(menuItem);
                }
            }
            var menuList = window.document.createElementNS(XUL_NS, "menulist"); 
            menuList.setAttribute("id", "prefCustomTlString" + cstrnum + "-tag");
            var menuPopup = window.document.createElementNS(XUL_NS, "menupopup"); 
            menuList.setAttribute("preference", "prefs_customTlString" + cstrnum + "tag");
            //menuList.setAttribute("disabled", ThunderLinkPrefNS.GetPreferenceValue("extensions.thunderlink.custom-tl-string-"+cstrnum+"-tagcheckbox", "bool"));
            appendMenuItems(menuPopup);
            menuList.appendChild(menuPopup);
            
            var labelbox = window.document.createElementNS(XUL_NS, "hbox"); 
            labelbox.appendChild(tagLabel);
            labelbox.appendChild(menuList);
            vbox.appendChild(labelbox);

            var keyLabel = window.document.createElementNS(XUL_NS, "label"); 
            keyLabel.setAttribute("value", "Shortcut: CTRL + ALT + " + cstrnum);
            vbox.appendChild(keyLabel);

            return tabpanel;
        }


        function createCstrTab(cstrnum) {
            var tab = window.document.createElementNS(XUL_NS, "tab");
            tab.setAttribute("label", "Custom String " + cstrnum);
            return tab;
        }


        var tabbox = window.document.getElementById("thunderlink-custom-strings-tabbox");
        if (tabbox.hasChildNodes()){
            while (tabbox.firstChild) {
                tabbox.removeChild(tabbox.firstChild);
            }
        }

        var tabs = window.document.createElementNS(XUL_NS, "tabs"); 
        var tabpanels = window.document.createElementNS(XUL_NS, "tabpanels"); 

        for (let i = 1; i < 5; i++){
            tabs.appendChild(createCstrTab(i));
            tabpanels.appendChild(createCstrTabPanel(i));
        }
        tabbox.appendChild(tabs);
        tabbox.appendChild(tabpanels);
    },

    ToggleTlTagField: function(cstrnum) {
        function $(aID) { return document.getElementById(aID); }
        tlTagCheckbox = $("prefCustomTlString" + cstrnum + "-tagcheckbox")
        tlTagField = $("prefCustomTlString" + cstrnum + "-tag")
        if (tlTagCheckbox.checked) {
            tlTagField.disabled = false;
        }
        else {
            tlTagField.disabled = true;
        }
    },

    GetPreferenceValue: function(prefname, type){
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("extensions.thunderlink.");
        prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);

        //TODO
        result = prefService.getBoolPref(prefname);
        return result;
    },

    LOG: function(msg) {
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage(msg);
    },


}
