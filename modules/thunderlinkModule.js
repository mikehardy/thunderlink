var EXPORTED_SYMBOLS = ["openThunderlink"];

const MESSAGE_ID_PARAM = "messageid=";

ChromeUtils.import("resource:///modules/MailUtils.js");
ChromeUtils.import("resource:///modules/iteratorUtils.jsm");

function openThunderlink(mailURL) {
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
              let foldersArray = fixIterator(folders.enumerate(), Ci.nsIMsgFolder)
              console.log("foldersArray: ", foldersArray);
              for (let msgFolder of foldersArray) {
                if(msgHdr !== null) {
                  break;
                }
                try {
                  msgHdr = msgFolder.msgDatabase.getMsgHdrForMessageID(messageID);
                } catch(e) {
                  Components.utils.reportError("caught exception while accessing folder " + msgFolder.folderURL + ":\n"+e);
                }
              };
            }           
          }
        }
        
        if (msgHdr) {
            let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
                getService(Ci.nsIWindowMediator);
            let win = wm.getMostRecentWindow("mail:3pane");
            let openTl = getPref("open-tl-behaviour")
            if('openInNewWindow' == openTl){
                MailUtils.openMessagesInNewWindows([msgHdr]);
            } else if ('openInNewTab' == openTl) {
                MailUtils.displayMessage(msgHdr);	
            } else {//select in 3pane window
                if (win) {
                var tabmail = win.document.getElementById("tabmail");
                tabmail.switchToTab(0)//will always be the mail tab
                win.focus();
                win.gFolderTreeView.selectFolder(msgHdr.folder);
                win.gFolderDisplay.selectMessage(msgHdr);
                //console.log("thunderlinkCommandLineHandler_handle: selecting " + msgHdr + "\n");
                } else {
                MailUtils.displayMessage(msgHdr);
                }
            }
        } else {
          //console.log("Unrecognized ThunderLink URL: " + mailURL + "\n");
          var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService);
          promptService.alert(null, "Message not found", "Couldn't find an email message for ThunderLink\n\n" + mailURL);
          //Components.utils.reportError("Couldn't find an email message for ThunderLink\n\n" + mailURL);
        }
    }
}
  
function getPref(prefName) {
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
        .getService(Components.interfaces.nsIPrefService)
        .getBranch("extensions.thunderlink.");
    
    return prefService.getCharPref(prefName);		
}  
