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

var ThunderLinkChromeNS = {

    CopyStringToClpBrd: function(string)
    {
        try {
            //   dump("CopyMessageUrlToClp mailboxMsgUrl: " + mailboxMsgUrl + "\n");
            var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
            .getService(Components.interfaces.nsIClipboardHelper);
            clipboard.copyString(string);
        }
        catch (ex) {
            dump("ex="+ex+"\n");
        }
    },

    CopyMessageUrlToClp: function()
    {
        ThunderLinkChromeNS.CopyStringToClpBrd(ThunderLinkChromeNS.GetThunderlink());
    },

    CopyMessageUrlToClpWithExe: function()
    {
        var appDir;
        try {
            appDir = Components.classes["@mozilla.org/file/directory_service;1"]
            .getService(Components.interfaces.nsIProperties)
            .get("CurProcD", Components.interfaces.nsILocalFile);

        }
        catch (ex) {
            dump("ex="+ex+"\n");
        }
        // gives an [xpconnect wrapped nsILocalFile]
        appDir.append("thunderbird\" -thunderlink ");
        dump("CopyMessageUrlToClpWithExe appDir: " + appDir.path + "\n");

        var pathToExePlusTL = "\"" + appDir.path + ThunderLinkChromeNS.GetThunderlink();
        //   dump("CopyMessageUrlToClp pathToExePlusTL: " + pathToExePlusTL + "\n");
        ThunderLinkChromeNS.CopyStringToClpBrd(pathToExePlusTL);

    },

    CopyCustomTlStringToClp: function(cstrnum)
    {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("extensions.thunderlink.");
        prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);

        var customTlStr = prefService.getCharPref("custom-tl-string-" + cstrnum);		
        var procCustomTlStr = ThunderLinkChromeNS.ResolvePlaceholders(customTlStr)
        ThunderLinkChromeNS.CopyStringToClpBrd(procCustomTlStr);
    },

    ResolvePlaceholders: function(tlstring)
    {
        var result = tlstring.replace(/<thunderlink>/ig, ThunderLinkChromeNS.GetThunderlink())
        result = result.replace(/<messageid>/ig, gDBView.hdrForFirstSelectedMessage.messageId)
        result = result.replace(/<subject>/ig, gDBView.hdrForFirstSelectedMessage.subject)
        result = result.replace(/<sender>/ig, gDBView.hdrForFirstSelectedMessage.author)
        return result
    },

    GetCustomTlStringTitle: function(cstrnum)
    {
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("extensions.thunderlink.");
        prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);

        return prefService.getCharPref("custom-tl-string-" + cstrnum + "-title");		
    },

    GetThunderlink: function()
    {
        var hdr = gDBView.hdrForFirstSelectedMessage;
        return "thunderlink://" + "messageid=" + hdr.messageId;
    },

    OnTlMenuLoad: function() 
    {
        function createCstrMenuItem(cstrnum) {
            const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
            var item = window.document.createElementNS(XUL_NS, "menuitem"); // create a new XUL menuitem
            item.setAttribute("label", ThunderLinkChromeNS.GetCustomTlStringTitle(cstrnum));
            item.setAttribute("oncommand", "ThunderLinkChromeNS.CopyCustomTlStringToClp("+cstrnum+")");
            return item;
        }
        var popup = window.document.getElementById("thunderlink-custom-strings");

        if (popup.hasChildNodes()){
            while (popup.firstChild) {
                    popup.removeChild(popup.firstChild);
                }
        }
            popup.appendChild(createCstrMenuItem(1));
            popup.appendChild(createCstrMenuItem(2));
            popup.appendChild(createCstrMenuItem(3));
            popup.appendChild(createCstrMenuItem(4));
        
    }

}
