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
    Components.utils.import("resource://thunderlinkModules/thunderlinkModule.js");

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

    openThunderlink(mailURL);
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
  QueryInterface:
    (XPCOMUtils.generateQI
      && XPCOMUtils.generateQI([Ci.nsICommandLineHandler, Ci.nsIClassInfo, Ci.nsIFactory]))
     || ChromeUtils.generateQI([Ci.nsICommandLineHandler, Ci.nsIClassInfo, Ci.nsIFactory]),
};

function thunderlinkCommandLineHandlerModule() { }
thunderlinkCommandLineHandlerModule.prototype = {
  classID: Components.ID("{547bfe26-688b-4e63-a1da-07da0e8367e1}"),
  QueryInterface:
    (XPCOMUtils.generateQI && XPCOMUtils.generateQI([Components.interfaces.nsIModule]))
    || ChromeUtils.generateQI([Components.interfaces.nsIModule]),
  _xpcom_factory: thunderlinkCommandLineHandler,
};

var components = [thunderlinkCommandLineHandlerModule];
var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
