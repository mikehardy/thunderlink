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
  
  /*
  	
  	Heavily based on the nsMailNewsCommandLineHandler.js from
 	the TB 3.1.9 Release
 	  	
  */

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const MAPI_STARTUP_ARG = "MapiStartup";
const MESSAGE_ID_PARAM = "messageid=";

var thunderlinkCommandLineHandler =
{
  get _messenger() {
    delete this._messenger;
    dump("getting messenger: " + Cc["@mozilla.org/messenger;1"]
                               .createInstance(Ci.nsIMessenger) +"\n");
    return this._messenger = Cc["@mozilla.org/messenger;1"]
                               .createInstance(Ci.nsIMessenger);
  },

  /* thunderlinkCommandLineHandler */

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
    try {
      mailURL = aCommandLine.handleFlagWithParam("thunderlink", false);
    }
    catch (e) {
      
    }

    if (mailURL && mailURL.length > 0) {
      let msgHdr = null;
      if (/^thunderlink:\/\//.test(mailURL)) {
        // This might be a standard message URI, or one with a messageID
        // parameter. Handle both cases.
        let messageIDIndex = mailURL.toLowerCase().indexOf(MESSAGE_ID_PARAM);
        if (messageIDIndex != -1) {
          // messageID parameter
          // Convert the message URI into a folder URI
          let folderURI = mailURL.slice(0, messageIDIndex)
                                 .replace("thunderlink", "mailbox");
          // Get the message ID
          let messageID = mailURL.slice(messageIDIndex + MESSAGE_ID_PARAM.length);
          
		  // if on Windows, there will be an added trailing slash 
		  // which we remove
		  if (/\/$/.test(messageID)) {
			messageID = messageID.slice(0,messageID.length-1);
		  }          
          
          // Make sure the folder tree is initialized
          MailUtils.discoverFolders();

          let folder = MailUtils.getFolderForURI(folderURI, true);
          // The folder might not exist, so guard against that
          //if (folder && messageID.length > 0)
          //  msgHdr = folder.msgDatabase.getMsgHdrForMessageID(messageID);

          // No message in this folder? Search through all folders:
          if (msgHdr === null){
              let accountManager = Cc["@mozilla.org/messenger/account-manager;1"]
                               .getService(Ci.nsIMsgAccountManager);
              let folders = accountManager.allFolders;
              let tmpHdr = null;
              for each (let msgFolder in fixIterator(folders.enumerate(), Ci.nsIMsgFolder)) {
            	  try{
                      msgHdr = msgFolder.msgDatabase.getMsgHdrForMessageID(messageID);
                      if(msgHdr !== null){
                        break;
                        // Copies will be ignored for now
                      }
                  }catch(e){
                	  Components.utils.reportError("caught exception while accessing folder " + msgFolder.folderURL + ":\n"+e);
                  }
              }
          }           
          
        }
      }
        
      if (msgHdr) {
        aCommandLine.preventDefault = true;
        let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
		  getService(Ci.nsIWindowMediator);
		let win = wm.getMostRecentWindow("mail:3pane");
		if (win) {
		  win.focus();
		  win.gFolderTreeView.selectFolder(msgHdr.folder);
		  win.gFolderDisplay.selectMessage(msgHdr);
		  //dump("thunderlinkCommandLineHandler_handle: selecting " + msgHdr + "\n");
		} else {
		  MailUtils.displayMessage(msgHdr);
		}
      }
      else {
        //dump("Unrecognized ThunderLink URL: " + mailURL + "\n");
		var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);
        promptService.alert(null, "Message not found", "Couldn't find an email message for ThunderLink\n\n" + mailURL);
        //Components.utils.reportError("Couldn't find an email message for ThunderLink\n\n" + mailURL);
      }
    }
  },

  helpInfo: "  -thunderlink <URL>        Open/select the message specified by this URL.\n",

  /* nsIClassInfo */
  flags: Ci.nsIClassInfo.SINGLETON,
  implementationLanguage: Ci.nsIProgrammingLanguage.JAVASCRIPT,
  getHelperForLanguage: function(language) null,
  getInterfaces: function(count) {
    let interfaces = [Ci.nsICommandLineHandler];
    count.value = interfaces.length;
    return interfaces;
  },

  /* nsIFactory */
  createInstance: function(outer, iid) {
    if (outer != null)
      throw Cr.NS_ERROR_NO_AGGREGATION;

    return this.QueryInterface(iid);
  },

  QueryInterface: XPCOMUtils.generateQI([Ci.nsICommandLineHandler,
                                         Ci.nsIClassInfo,
                                         Ci.nsIFactory])
};

function thunderlinkCommandLineHandlerModule() {}
thunderlinkCommandLineHandlerModule.prototype =
{
  // XPCOM registration now done in manifest
  //classDescription: "ThunderLink Commandline Handler",
  classID: Components.ID("{547bfe26-688b-4e63-a1da-07da0e8367e1}"),
  //contractID: "@mozilla.org/commandlinehandler/general-startup;1?type=thunderlink",

  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIModule]),
  
  //_xpcom_categories: [{
  //  category: "command-line-handler",
  //  entry: "m-thunderlink"
  //}],

  _xpcom_factory: thunderlinkCommandLineHandler
};

// NSGetModule: Return the nsIModule object.
//function NSGetModule(compMgr, fileSpec)
//{
//  return XPCOMUtils.generateModule([thunderlinkCommandLineHandlerModule]);
//}


var components = [thunderlinkCommandLineHandlerModule];
const NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
