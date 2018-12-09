/*
   ThunderLink.
   Link from your browser to your email messages!

   Copyright (C) 2011 Christoph Zwirello

   This Source Code Form is subject to the terms of the Mozilla Public
   License, v. 2.0. If a copy of the MPL was not distributed with this
   file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var ThunderLinkPrefNS = {

  prefs: null,

  CreateCustomStringTabbox: function CreateCustomStringTabbox() {
    var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
    Components.utils.import("resource:///modules/mailServices.js");

    this.startup();

    function createCstrTabPanel(cstrnum) {
      var tabpanel = window.document.createElementNS(XUL_NS, "tabpanel");
      var vbox = window.document.createElementNS(XUL_NS, "vbox");
      vbox.setAttribute("align", "left");
      tabpanel.appendChild(vbox);

      var tTextbox = window.document.createElementNS(XUL_NS, "textbox");
      tTextbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-title");
      tTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "title");
      tTextbox.setAttribute("size", 51);
      tTextbox.setAttribute("value", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-title", "string"));
      var tLabel = window.document.createElementNS(XUL_NS, "label");
      tLabel.setAttribute("label", "Custom String title:");
      tLabel.setAttribute("control", tTextbox.id);
      vbox.appendChild(tLabel);
      vbox.appendChild(tTextbox);

      var csTextbox = window.document.createElementNS(XUL_NS, "textbox");
      csTextbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-textbox");
      csTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum);
      csTextbox.setAttribute("multiline", "true");
      csTextbox.setAttribute("cols", "50");
      csTextbox.setAttribute("rows", "5");
      csTextbox.setAttribute("value", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum, "string"));
      var csLabel = window.document.createElementNS(XUL_NS, "label");
      csLabel.setAttribute("label", "Custom String:");
      csLabel.setAttribute("control", csTextbox.id);
      vbox.appendChild(csLabel);
      vbox.appendChild(csTextbox);

      var tagCheckbox = window.document.createElementNS(XUL_NS, "checkbox");
      tagCheckbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-tagcheckbox");
      tagCheckbox.setAttribute("checked", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-tagcheckbox", "bool"));
      tagCheckbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "tagcheckbox");
      tagCheckbox.setAttribute("label", "Tag email upon copying the ThunderLink:");
      tagCheckbox.setAttribute("oncommand", "ThunderLinkPrefNS.ToggleTlTagField(" + cstrnum + ");");
      vbox.appendChild(tagCheckbox);

      var tagLabel = window.document.createElementNS(XUL_NS, "label");
      tagLabel.setAttribute("control", "thunderlink-prefCustomTlString" + cstrnum + "-tag");
      tagLabel.setAttribute("value", "using tag:");

      function appendMenuItems(menuPopup) {
        var tagArray = MailServices.tags.getAllTags({});
        var selectedIndex = ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-tag", "int");
        for (let j = 0; j < tagArray.length; ++j) {
          var menuItem = window.document.createElementNS(XUL_NS, "menuitem");

          menuItem.setAttribute("label", tagArray[j].tag);
          menuItem.setAttribute("value", j + 1);
          if (selectedIndex === (j + 1)) {
            menuItem.setAttribute("selected", true);
          }
          menuPopup.appendChild(menuItem);
        }
      }
      var menuList = window.document.createElementNS(XUL_NS, "menulist");
      menuList.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-tag");
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

  ToggleTlTagField: function ToggleTlTagField(cstrnum) {
    function $(aID) { return document.getElementById(aID); }
    var tlTagCheckbox = $("prefCustomTlString" + cstrnum + "-tagcheckbox");
    var tlTagField = $("prefCustomTlString" + cstrnum + "-tag");
    if (tlTagCheckbox.checked) {
      tlTagField.disabled = false;
    } else {
      tlTagField.disabled = true;
    }
    console.log("toggling tag field " + cstrnum + " to " + tlTagCheckbox.checked);
  },

  startup: function startup() {
    this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");
  },

  GetPreferenceValue: function GetPreferenceValue(prefname, type) {
    // var prefService = Components.classes["@mozilla.org/preferences-service;1"]
    //   .getService(Components.interfaces.nsIPrefService)
    //   .getBranch("extensions.thunderlink.");
    // prefService.QueryInterface(Components.interfaces.nsIPrefBranch);

    console.log("Looking for pref " + prefname + " / what type? " + type);
    var prefValue = "";
    switch (type) {
      case "bool":
        prefValue = this.prefs.getBoolPref(prefname);
        break;
      case "int":
        prefValue = this.prefs.getIntPref(prefname);
        break;
      default:
        prefValue = this.prefs.getCharPref(prefname);
        break;
    }
    console.log("pref " + prefname + " is " + prefValue);
    return prefValue;
  },

  LOG: function LOG(msg) {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
      .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage(msg);
  },

  onUnload: function onUnload(prefwindow) {
    console.log("unloading preferences window " + prefwindow + " / " + prefwindow.id);

    if (this.prefs.getPrefType('open-tl-behaviour')) {
      console.log("key exists: " + this.prefs.getCharPref('open-tl-behaviour'));
      if (this.prefs.prefHasUserValue('open-tl-behaviour')) {
        console.log("key has user-specific value");
      }

      var openTlBehaviourElement = prefwindow.getElementById("thunderlink-openTlBehaviour");
      console.log("tl behavior value is: " + openTlBehaviourElement.value);
      this.prefs.setCharPref("open-tl-behaviour", openTlBehaviourElement.value);
    }

    for (var cstrnum = 1; cstrnum <= 8; cstrnum++) {
      // Save the title
      var titleElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-title");
      console.log("setting title " + cstrnum + " to " + titleElement.value);
      this.prefs.setCharPref("custom-tl-string-" + cstrnum + "-title", titleElement.value);

      // Save the content
      var linkElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-textbox");
      console.log("setting link " + cstrnum + " to " + linkElement.value);
      this.prefs.setCharPref("custom-tl-string-" + cstrnum, linkElement.value);

      // Save whether we should tag or not
      var tagEnabledEl = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-tagcheckbox");
      console.log("We should tag email for " + cstrnum + "? " + tagEnabledEl.checked);
      this.prefs.setBoolPref("custom-tl-string-" + cstrnum + "-tagcheckbox", tagEnabledEl.checked);

      // Save the tag
      var tagElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-tag");
      console.log("We should tag " + cstrnum + " with " + tagElement.value);
      this.prefs.setIntPref("custom-tl-string-" + cstrnum + "-tag", tagElement.value);
    }

    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService);
    prefService.savePrefFile(null);
    return true;
  },

  escapeHtml: function escapeHtml(unsafe) {
    console.log(`attempting to escape ${unsafe}`);
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

};
