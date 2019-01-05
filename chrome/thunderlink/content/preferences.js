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

      // Selection delimiter
      var selectionDelimterBox = window.document.createElementNS(XUL_NS, "hbox");

      var selectionDelimiterTextbox = window.document.createElementNS(XUL_NS, "textbox");
      selectionDelimiterTextbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-selection-delimiter");
      selectionDelimiterTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "selectiondelimiter");
      selectionDelimiterTextbox.setAttribute("size", 10);
      selectionDelimiterTextbox.setAttribute("value", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-selection-delimiter", "string"));

      var selectionDelimiterLabel = window.document.createElementNS(XUL_NS, "label");
      selectionDelimiterLabel.setAttribute("value", "Selection delimiter:");
      selectionDelimiterLabel.setAttribute("control", selectionDelimiterTextbox.id);

      selectionDelimterBox.appendChild(selectionDelimiterLabel);
      selectionDelimterBox.appendChild(selectionDelimiterTextbox);
      vbox.appendChild(selectionDelimterBox);

      // Clipboard checkbox
      var clipboardCheckbox = window.document.createElementNS(XUL_NS, "checkbox");
      clipboardCheckbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-clipboard-checkbox");
      clipboardCheckbox.setAttribute("checked", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-clipboard-checkbox", "bool"));
      clipboardCheckbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "clipboardcheckbox");
      clipboardCheckbox.setAttribute("label", "Copy ThunderLink to clipboard");
      vbox.appendChild(clipboardCheckbox);

      function addHorizontalSeparator() {
        var horizontalSeparator = window.document.createElementNS(XUL_NS, "separator");
        horizontalSeparator.setAttribute("orient", "horizontal");
        vbox.appendChild(horizontalSeparator);
      }
      addHorizontalSeparator();

      var tagCheckbox = window.document.createElementNS(XUL_NS, "checkbox");
      tagCheckbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-tagcheckbox");
      tagCheckbox.setAttribute("checked", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-tagcheckbox", "bool"));
      tagCheckbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "tagcheckbox");
      tagCheckbox.setAttribute("label", "Tag email upon copying the ThunderLink:");
      tagCheckbox.addEventListener("command", () => { ThunderLinkPrefNS.ToggleTlTagField(cstrnum); }, false);
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
          if (selectedIndex === (j + 1) && ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-tagcheckbox", "bool")) {
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

      addHorizontalSeparator();

      // Append to file checkbox
      var appendToFileCheckbox = window.document.createElementNS(XUL_NS, "checkbox");
      appendToFileCheckbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-appendtofile-checkbox");
      appendToFileCheckbox.setAttribute("checked", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-appendtofile-checkbox", "bool"));
      appendToFileCheckbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "appendtofilecheckbox");
      appendToFileCheckbox.setAttribute("label", "Append Thunderlink to file:");
      vbox.appendChild(appendToFileCheckbox);

      // Append to file label and path
      var fileLabelBox = window.document.createElementNS(XUL_NS, "hbox");

      var appendToFileTextbox = window.document.createElementNS(XUL_NS, "textbox");
      appendToFileTextbox.setAttribute("id", "thunderlink-prefCustomTlString" + cstrnum + "-appendtofile-path");
      appendToFileTextbox.setAttribute("preference", "prefs_customTlString" + cstrnum + "appendtofilepath");
      appendToFileTextbox.setAttribute("size", 51);
      appendToFileTextbox.setAttribute("value", ThunderLinkPrefNS.GetPreferenceValue("custom-tl-string-" + cstrnum + "-appendtofile-path", "string"));

      var appendToFileLabel = window.document.createElementNS(XUL_NS, "label");
      appendToFileLabel.setAttribute("value", "Path to file:");
      // appendToFileLabel.setAttribute("label", "Custom String title:");
      appendToFileLabel.setAttribute("control", appendToFileTextbox.id);

      fileLabelBox.appendChild(appendToFileLabel);
      fileLabelBox.appendChild(appendToFileTextbox);
      vbox.appendChild(fileLabelBox);

      addHorizontalSeparator();

      // shortcut
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
    var tlTagCheckbox = $("thunderlink-prefCustomTlString" + cstrnum + "-tagcheckbox");
    var tlTagField = $("thunderlink-prefCustomTlString" + cstrnum + "-tag");
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

      // Selection delimiter
      var selectionDelimiterElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-selection-delimiter");
      console.log("setting selection delimiter " + cstrnum + " to " + selectionDelimiterElement.value);
      this.prefs.setCharPref("custom-tl-string-" + cstrnum + "-selection-delimiter", selectionDelimiterElement.value);

      // Save whether we should copy thunderlink to clipboard
      var clipboardEnabledEl = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-clipboard-checkbox");
      console.log("We should copy thunderlink for " + cstrnum + "? " + clipboardEnabledEl.checked);
      this.prefs.setBoolPref("custom-tl-string-" + cstrnum + "-clipboard-checkbox", clipboardEnabledEl.checked);

      // Save whether we should tag or not
      var tagEnabledEl = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-tagcheckbox");
      console.log("We should tag email for " + cstrnum + "? " + tagEnabledEl.checked);
      this.prefs.setBoolPref("custom-tl-string-" + cstrnum + "-tagcheckbox", tagEnabledEl.checked);

      // Save the tag
      var tagElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-tag");
      console.log("We should tag " + cstrnum + " with " + tagElement.value);
      this.prefs.setIntPref("custom-tl-string-" + cstrnum + "-tag", tagElement.value);

      // Save whether we should append thunderlink to file
      var appendEnabledEl = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-appendtofile-checkbox");
      console.log("We should append thunderlink for " + cstrnum + "? " + appendEnabledEl.checked);
      this.prefs.setBoolPref("custom-tl-string-" + cstrnum + "-appendtofile-checkbox", appendEnabledEl.checked);

      // Append path
      var pathElement = prefwindow.getElementById("thunderlink-prefCustomTlString" + cstrnum + "-appendtofile-path");
      console.log("Setting append path " + cstrnum + " to " + pathElement.value);
      this.prefs.setCharPref("custom-tl-string-" + cstrnum + "-appendtofile-path", pathElement.value);

      if (appendEnabledEl.checked && pathElement.value === "") {
        var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
          .getService(Components.interfaces.nsIPromptService);
        prompts.alert(null, "Thunderlink Error", "In String " + cstrnum + " you have checked append thunderlink to file, but the path is empty.\nThunderlink will uncheck it!!!!");
        this.prefs.setBoolPref("custom-tl-string-" + cstrnum + "-appendtofile-checkbox", false);
      }
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
