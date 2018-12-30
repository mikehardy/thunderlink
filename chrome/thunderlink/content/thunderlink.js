/*
   ThunderLink.
   Link from your browser to your email messages!

   Copyright (C) 2011 Christoph Zwirello
   Copyright (C) 2018 Mike Hardy <mike@mikehardy.net>

   This Source Code Form is subject to the terms of the Mozilla Public
   License, v. 2.0. If a copy of the MPL was not distributed with this
   file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

var ThunderLinkChromeNS = {

  CopyStringToClpBrd: function CopyStringToClpBrd(string) {
    try {
      console.log("CopyMessageUrlToClp mailboxMsgUrl: " + string + "\n");
      var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
        .getService(Components.interfaces.nsIClipboardHelper);
      clipboard.copyString(ThunderLinkChromeNS.ConvertToUnicode(string));
    } catch (ex) {
      console.error(ex);
    }
  },

  CopyMessageUrlToClp: function CopyMessageUrlToClp() {
    ThunderLinkChromeNS.CopyStringToClpBrd(ThunderLinkChromeNS.GetThunderlink());
  },

  GetPathToExe: function GetPathToExe() {
    var appDir;
    try {
      appDir = Components.classes["@mozilla.org/file/directory_service;1"]
        .getService(Components.interfaces.nsIProperties)
        .get("CurProcD", Components.interfaces.nsIFile);
    } catch (ex) {
      console.error(ex);
    }
    // gives an [xpconnect wrapped nsILocalFile]
    appDir.append("thunderbird"); // exe filename
    return appDir.path;
  },

  CopyCustomTlStringToClp: function CopyCustomTlStringToClp(cstrnum) {
    console.log("CopyCustomTlStringToClp: cstrnum: " + cstrnum + "\n");
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");

    var customTlStr = prefService.getCharPref("custom-tl-string-" + cstrnum);
    console.log("CopyCustomTlStringToClp: customTlStr: " + customTlStr + "\n");
    var tagActive = prefService.getBoolPref("custom-tl-string-" + cstrnum + "-tagcheckbox");
    console.log("CopyCustomTlStringToClp: tagActive: " + tagActive + "\n");
    var procCustomTlStr = ThunderLinkChromeNS.ResolvePlaceholders(customTlStr);
    console.log("CopyCustomTlStringToClp: procCustomTlStr resolved: " + procCustomTlStr + "\n");
    procCustomTlStr = ThunderLinkChromeNS.FixNewlines(procCustomTlStr);
    console.log("CopyCustomTlStringToClp: procCustomTlStr newlines fixed: " + procCustomTlStr + "\n");
    if (tagActive) this.TagEmail(prefService.getIntPref("custom-tl-string-" + cstrnum + "-tag"));
    ThunderLinkChromeNS.CopyStringToClpBrd(procCustomTlStr);
  },

  TagEmail: function TagEmail(keywordIx) {
    console.log("TagEmail: keywordIx: " + keywordIx);
    var hdr = gDBView.hdrForFirstSelectedMessage;
    console.log("TagEmail: hdr: " + hdr + "\n");
    var keywords = "" + hdr.getStringProperty("keywords");
    console.log("TagEmail: current keywords: " + keywords);

    function addKeywordToList(addKeywords, addKeywordIx) {
      var keyword = "$label" + addKeywordIx;
      if (addKeywords.includes(keyword)) return addKeywords;
      // eslint-disable-next-line no-param-reassign
      addKeywords += " " + keyword;
      console.log("TagEmail: keywords after processing: " + addKeywords);
      return addKeywords;
    }
    var msg = Components.classes["@mozilla.org/array;1"]
      .createInstance(Components.interfaces.nsIMutableArray);
    msg.clear();
    msg.appendElement(hdr, false);

    hdr.folder.addKeywordsToMessages(msg, addKeywordToList(keywords, keywordIx));
    hdr.folder.msgDatabase.Close(true);
    hdr.folder.msgDatabase = null;
  },

  FixNewlines: function FixNewlines(tlstring) {
    var osString = Components.classes["@mozilla.org/xre/app-info;1"]
      .getService(Components.interfaces.nsIXULRuntime).OS;

    var result = tlstring;
    if (osString === 'WINNT') result = tlstring.replace(/[\r]?\n/g, "\r\n");
    return result;
  },

  ResolvePlaceholders: function ResolvePlaceholders(tlstring) {
    Components.utils.import("resource:///modules/gloda/utils.js");

    var subject = GlodaUtils.deMime(gDBView.hdrForFirstSelectedMessage.subject);

    // replace a few characters that frequently cause trouble
    // with a focus on org-mode, provided as filteredSubject
    var protectedSubject = subject.split("[").join("(");
    protectedSubject = protectedSubject.split("]").join(")");
    protectedSubject = protectedSubject.replace(/[<>'"`´]/g, "");

    var result = tlstring.replace(/<thunderlink>/ig, ThunderLinkChromeNS.GetThunderlink());
    result = result.replace(/<messageid>/ig, gDBView.hdrForFirstSelectedMessage.messageId);
    result = result.replace(/<subject>/ig, subject);
    result = result.replace(/<filteredSubject>/ig, protectedSubject);
    result = result.replace(/<sender>/ig, gDBView.hdrForFirstSelectedMessage.author);
    result = result.replace(/<tbexe>/ig, "\"" + ThunderLinkChromeNS.GetPathToExe() + "\" -thunderlink ");

    date = new Date(gDBView.hdrForFirstSelectedMessage.date/1000);
    dateString = date.toLocaleDateString() + " - " + date.toLocaleTimeString();   
    result = result.replace(/<time>/ig, dateString);            
                                       
    return result;
  },

  GetCustomTlStringTitle: function GetCustomTlStringTitle(cstrnum) {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");

    return prefService.getCharPref("custom-tl-string-" + cstrnum + "-title");
  },

  GetThunderlink: function GetThunderlink() {
    var hdr = gDBView.hdrForFirstSelectedMessage;
    return "thunderlink://messageid=" + hdr.messageId;
  },

  OnTlMenuLoad: function OnTlMenuLoad() {
    function createCstrMenuItem(cstrnum) {
      var label = ThunderLinkChromeNS.GetCustomTlStringTitle(cstrnum);
      // Skip when title is not configured or temporary unused
      if (!label.length || label.match(/^\./)) return null;

      const XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
      var item = window.document.createElementNS(XUL_NS, "menuitem");
      item.setAttribute("label", ThunderLinkChromeNS.ConvertToUnicode(label));
      item.addEventListener("command", () => { ThunderLinkChromeNS.CopyCustomTlStringToClp(cstrnum); }, false);
      return item;
    }
    var popup = window.document.getElementById("thunderlink-custom-strings");

    if (popup.hasChildNodes()) {
      while (popup.firstChild) {
        popup.removeChild(popup.firstChild);
      }
    }

    // Add only valid menuitems
    for (var i = 1; i <= 8; i++) {
      var menuitem = createCstrMenuItem(i);
      if (menuitem) popup.appendChild(menuitem);
    }
  },

  ConvertToUnicode: function ConvertToUnicode(string) {
    var converter = Components
      .classes["@mozilla.org/intl/scriptableunicodeconverter"]
      .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    converter.charset = "UTF-8";
    // FIXME This can throw exceptions? NS_ERROR_ILLEGAL_INPUT if there are Spanish accents etc
    return converter.ConvertToUnicode(string);
  },

  OpenThunderlinkFromClipboard: function OpenThunderlinkFromClipboard() {
    var trans = Cc["@mozilla.org/widget/transferable;1"].createInstance(Ci.nsITransferable);
    trans.init(null); trans.addDataFlavor("text/unicode");
    Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard)
    var str = {};
    var strLength = {};
    trans.getTransferData("text/unicode", str, strLength);
    var pastetext = str.value.QueryInterface(Ci.nsISupportsString).data;
    this.OpenMessage(pastetext);
  },

  OpenMessage: function OpenMessage(mailURL) {
    Components.utils.import("resource://thunderlinkModules/thunderlinkModule.js");
    openThunderlink(mailURL);
  }
};
