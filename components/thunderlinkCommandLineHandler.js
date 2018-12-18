/*
   ThunderLink.
   Link from your browser to your email messages!

   Copyright (C) 2011 Christoph Zwirello
   Copyright (C) 2018 Mike Hardy <mike@mikehardy.net>

   This Source Code Form is subject to the terms of the Mozilla Public
   License, v. 2.0. If a copy of the MPL was not distributed with this
   file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const MAPI_STARTUP_ARG = "MapiStartup";
const MESSAGE_ID_PARAM = "messageid=";

var thunderlinkCommandLineHandler = {
  get _messenger() {
    delete this._messenger;
    dump("getting messenger: " + Cc["@mozilla.org/messenger;1"].createInstance(Ci.nsIMessenger) + "\n");
    this._messenger = Cc["@mozilla.org/messenger;1"].createInstance(Ci.nsIMessenger);
    return this._messenger;
  },

  /**
   * Handles the following command line arguments:
   * - -thunderlink: opens the mail folder view
   */
  handle: function thunderlinkCommandLineHandler_handle(aCommandLine) {
    // Do this here because xpcshell isn't too happy with this at startup
    Components.utils.import("resource:///modules/MailUtils.js");
    Components.utils.import("resource:///modules/iteratorUtils.jsm");
    // -thunderlink <URL>
    let mailURL = null;
    let msgHdr = null;
    let messageID = null;

    try {
      mailURL = aCommandLine.handleFlagWithParam("thunderlink", false);
      dump("thunderlink command with mailURL " + mailURL);
    } catch (e) {
      console.error(e);
    }

    if (mailURL && mailURL.length > 0) {
      if (/^thunderlink:\/\//.test(mailURL)) {
        // This might be a standard message URI, or one with a messageID parameter
        const messageIDIndex = mailURL.toLowerCase().indexOf(MESSAGE_ID_PARAM);
        if (messageIDIndex !== -1) {
          // Convert the messageID URI into a folder URI
          messageID = mailURL.slice(messageIDIndex + MESSAGE_ID_PARAM.length);
          // dump("messageID is " + messageID);

          // if on Windows, there will be an added trailing slash which we remove
          if (/\/$/.test(messageID)) messageID = messageID.slice(0, messageID.length - 1);

          // Make sure the folder tree is initialized
          MailUtils.discoverFolders();
        }
      } else if (/^\w*:/.test(mailURL)) {
        // handle pontential protocols followed by messageId such as RFC 2392 or macOS message://
        [, , messageID] = /(\w*):\/?\/?([^/]*)\/?(.*)/.exec(mailURL);

        if (/^<(.*)>$/.test(messageID)) [, messageID] = /^<(.*)>$/.exec(messageID);
        else if (/^%3[cC](.*)%3[eE]$/.test(messageID)) [, messageID] = /^%3[cC](.*)%3[eE]$/.exec(messageID);
        // maybe not correct as it should be done before separating the contentID part of RFC 2392?

        // Make sure the folder tree is initialized
        MailUtils.discoverFolders();
      }

      if (msgHdr === null && messageID) {
        const accountManager = Cc["@mozilla.org/messenger/account-manager;1"].getService(Ci.nsIMsgAccountManager);
        const folders = accountManager.allFolders;
        // eslint-disable-next-line no-restricted-syntax
        for (var msgFolder of fixIterator(folders.enumerate(), Ci.nsIMsgFolder)) {
          try {
            msgHdr = msgFolder.msgDatabase.getMsgHdrForMessageID(messageID);
            if (msgHdr !== null) {
              break;
              // Copies will be ignored for now
            }
          } catch (e) {
            Components.utils.reportError("caught exception while accessing folder " + msgFolder.folderURL + ":\n" + e);
          }
        }
      }

      if (msgHdr) {
        aCommandLine.preventDefault = true;
        const wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
        const win = wm.getMostRecentWindow("mail:3pane");
        const openTl = this.getPref("open-tl-behaviour");
        if (openTl === 'openInNewWindow') {
          MailUtils.openMessagesInNewWindows([msgHdr]);
        } else if (openTl === 'openInNewTab') {
          MailUtils.displayMessage(msgHdr);
        } else if (win) {
          // select in 3pane window
          var tabmail = win.document.getElementById("tabmail");
          tabmail.switchToTab(0); // will always be the mail tab
          win.focus();
          win.gFolderTreeView.selectFolder(msgHdr.folder);
          win.gFolderDisplay.selectMessage(msgHdr);
          dump("thunderlinkCommandLineHandler_handle: selecting " + msgHdr + " in 'tabmail'\n");
        } else {
          MailUtils.displayMessage(msgHdr);
        }
      } else {
        dump("Unrecognized ThunderLink URL: " + mailURL);
        var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
          .getService(Components.interfaces.nsIPromptService);
        promptService.alert(null, "Message not found", "Couldn't find an email message for ThunderLink\n\n" + mailURL);
      }
    }
  },

  getPref: function getPref(prefName) {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.thunderlink.");
    return prefService.getCharPref(prefName);
  },

  helpInfo: "  -thunderlink <URL>        Open/select the message specified by this URL.\n",

  /* nsIClassInfo */
  flags: Ci.nsIClassInfo.SINGLETON,
  getHelperForLanguage: function getHelperForLanguage(languageIgnored) { },
  getInterfaces: function getInterfaces(count) {
    const interfaces = [Ci.nsICommandLineHandler];
    count.value = interfaces.length;
    return interfaces;
  },

  /* nsIFactory */
  createInstance: function createInstance(outer, iid) {
    if (outer != null) throw Cr.NS_ERROR_NO_AGGREGATION;
    return this.QueryInterface(iid);
  },

  // Use ChromeUtils instead of XPCOMUtils here and line 154 for TB64+ (or earlier?)
  QueryInterface: XPCOMUtils.generateQI([Ci.nsICommandLineHandler, Ci.nsIClassInfo, Ci.nsIFactory]),
};

function thunderlinkCommandLineHandlerModule() { }
thunderlinkCommandLineHandlerModule.prototype = {
  classID: Components.ID("{547bfe26-688b-4e63-a1da-07da0e8367e1}"),
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIModule]),
  _xpcom_factory: thunderlinkCommandLineHandler,
};

var components = [thunderlinkCommandLineHandlerModule];
var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
