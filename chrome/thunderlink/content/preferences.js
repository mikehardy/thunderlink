/*
   ThunderLink.
   Link from your browser to your email messages!

   Copyright (C) 2011 Christoph Zwirello

   This Source Code Form is subject to the terms of the Mozilla Public
   License, v. 2.0. If a copy of the MPL was not distributed with this
   file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var ThunderLinkPrefNS = {


  CreateCustomStringTabbox: () => {
    var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    Components.utils.import("resource:///modules/mailServices.js");
    function createCstrTabPanel(cstrnum) {
      var tabpanel = window.document.createElementNS(XUL_NS, "tabpanel");
      var vbox = window.document.createElementNS(XUL_NS, "vbox");
      vbox.setAttribute("align", "left");
      tabpanel.appendChild(vbox);

      var tTextbox = window.document.createElementNS(XUL_NS, "textbox");
      tTextbox.setAttribute("id", "prefCustomTlString" + cstrnum + "-title");
      tTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "title");
      tTextbox.setAttribute("size", 51);
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
      tagCheckbox.setAttribute("oncommand", "ThunderLinkPrefNS.ToggleTlTagField(" + cstrnum + ");");
      vbox.appendChild(tagCheckbox);

      var tagLabel = window.document.createElementNS(XUL_NS, "label");
      tagLabel.setAttribute("control", "prefCustomTlString" + cstrnum + "-tag");
      tagLabel.setAttribute("value", "using tag:");

      function appendMenuItems(menuPopup) {
        var tagArray = MailServices.tags.getAllTags({});
        for (let j = 0; j < tagArray.length; ++j) {
          var menuItem = window.document.createElementNS(XUL_NS, "menuitem");

          menuItem.setAttribute("label", tagArray[j].tag);
          menuItem.setAttribute("value", j + 1);
          menuPopup.appendChild(menuItem);
        }
      }
      var menuList = window.document.createElementNS(XUL_NS, "menulist");
      menuList.setAttribute("id", "prefCustomTlString" + cstrnum + "-tag");
      var menuPopup = window.document.createElementNS(XUL_NS, "menupopup");
      menuList.setAttribute("preference", "prefs_customTlString" + cstrnum + "tag");
      menuList.setAttribute("disabled", !ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-tagcheckbox", "bool"));
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
      tab.setAttribute("label", "String " + cstrnum);
      return tab;
    }


    var tabbox = window.document.getElementById("thunderlink-custom-strings-tabbox");
    if (tabbox.hasChildNodes()) {
      while (tabbox.firstChild) {
        tabbox.removeChild(tabbox.firstChild);
      }
    }

    var tabs = window.document.createElementNS(XUL_NS, "tabs");
    var tabpanels = window.document.createElementNS(XUL_NS, "tabpanels");

    var nrOfCStrings = 8;
    for (let i = 1; i <= nrOfCStrings; i++) {
      tabs.appendChild(createCstrTab(i));
      tabpanels.appendChild(createCstrTabPanel(i));
    }
    tabbox.appendChild(tabs);
    tabbox.appendChild(tabpanels);
  },

  ToggleTlTagField: (cstrnum) => {
    function $(aID) { return document.getElementById(aID); }
    var tlTagCheckbox = $("prefCustomTlString" + cstrnum + "-tagcheckbox");
    var tlTagField = $("prefCustomTlString" + cstrnum + "-tag");
    if (tlTagCheckbox.checked) {
      tlTagField.disabled = false;
    } else {
      tlTagField.disabled = true;
    }
  },

  GetPreferenceValue: (prefname, argIgnored) => {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");
    prefService.QueryInterface(Components.interfaces.nsIPrefBranch2);

    return prefService.getBoolPref(prefname);
  },

  LOG: (msg) => {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
      .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
  },


};
