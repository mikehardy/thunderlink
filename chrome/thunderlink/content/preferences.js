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

    CreateCustomStringTabs: function() {
        
        function createCstrTabPanel(cstrnum) {
            const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
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
            tagCheckbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-checkbox");
            tagCheckbox.setAttribute("checked", "false");
            tagCheckbox.setAttribute("label", "Tag email upon copying the ThunderLink:");
            vbox.appendChild(tagCheckbox);
            
            var tagLabel = window.document.createElementNS(XUL_NS, "label"); 
            tagLabel.setAttribute("control", "prefCustomTlString" + cstrnum + "-tag");
            tagLabel.setAttribute("value", "using tag:");
            vbox.appendChild(tagLabel);
            
            var tagTextbox = window.document.createElementNS(XUL_NS, "textbox"); 
            tagTextbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-tag");
            tagTextbox.setAttribute("preference", "prefs_CustomTlString" + cstrnum + "tag");
            vbox.appendChild(tagTextbox);
           
            return tabpanel;
        }
        
        this.LOG("create custom tabs called")
        
        var prefWindow = window.document.getElementById("thunderlink-custom-strings-tabs");
        if (prefWindow.hasChildNodes()){
            while (prefWindow.firstChild) {
                prefWindow.removeChild(prefWindow.firstChild);
            }
        }
        for (let i = 1; i < 4; i++){
            prefWindow.appendChild(createCstrTabPanel(i));
        }
        
    },

    LOG: function(msg) {
          var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                           .getService(Components.interfaces.nsIConsoleService);
          consoleService.logStringMessage(msg);
    }

}
