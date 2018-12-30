// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = [
  "openThunderlink",
  "replaceVariables",
  "getThunderlinkPathToExe",
  "getThunderlinkForHdr",
];

var MESSAGE_ID_PARAM = "messageid=";

Components.utils.import("resource:///modules/MailUtils.js");
Components.utils.import("resource:///modules/iteratorUtils.jsm");

function getPref(prefName) {
  var prefService = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.thunderlink.");

  return prefService.getCharPref(prefName);
}

function getThunderlinkForHdr(hdr) {
  return "thunderlink://messageid=" + hdr.messageId;
}

function getThunderlinkPathToExe() {
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
}

// eslint-disable-next-line no-unused-vars
function openThunderlink(mailURL) {
  if (mailURL && mailURL.length > 0) {
    let msgHdr = null;
    if (/^thunderlink:\/\//.test(mailURL)) {
      // This might be a standard message URI, or one with a messageID
      // parameter. Handle both cases.
      var messageIDIndex = mailURL.toLowerCase().indexOf(MESSAGE_ID_PARAM);
      if (messageIDIndex !== -1) {
        // messageID parameter
        let messageID = mailURL.slice(messageIDIndex + MESSAGE_ID_PARAM.length);

        // if on Windows, there will be an added trailing slash
        // which we remove
        if (/\/$/.test(messageID)) {
          messageID = messageID.slice(0, messageID.length - 1);
        }

        // Make sure the folder tree is initialized
        MailUtils.discoverFolders();

        // No message in this folder? Search through all folders:
        if (msgHdr === null) {
          var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
            .getService(Components.interfaces.nsIMsgAccountManager);
          var folders = accountManager.allFolders;
          var foldersArray = fixIterator(folders.enumerate(), Components.interfaces.nsIMsgFolder);
          // console.log("foldersArray: ", foldersArray);
          // eslint-disable-next-line no-restricted-syntax
          for (var msgFolder of foldersArray) {
            if (msgHdr !== null) {
              break;
            }
            try {
              msgHdr = msgFolder.msgDatabase.getMsgHdrForMessageID(messageID);
            } catch (e) {
              Components.utils.reportError("caught exception while accessing folder " + msgFolder.folderURL + ":\n" + e);
            }
          }
        }
      }
    }

    if (msgHdr) {
      var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
      var win = wm.getMostRecentWindow("mail:3pane");
      var openTl = getPref("open-tl-behaviour");

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
        // console.log("thunderlinkCommandLineHandler_handle: selecting " + msgHdr + "\n");
      } else {
        MailUtils.displayMessage(msgHdr);
      }
    } else {
      // console.log("Unrecognized ThunderLink URL: " + mailURL + "\n");
      var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Components.interfaces.nsIPromptService);
      promptService.alert(null, "Message not found", "Couldn't find an email message for ThunderLink\n\n" + mailURL);
    }
  }
}

// eslint-disable-next-line no-unused-vars
function replaceVariables(template, hdr) {
  Components.utils.import("resource:///modules/gloda/utils.js");
  var subject = GlodaUtils.deMime(hdr.subject);

  // replace a few characters that frequently cause trouble
  // with a focus on org-mode, provided as filteredSubject
  var protectedSubject = subject.split("[").join("(");
  protectedSubject = protectedSubject.split("]").join(")");
  protectedSubject = protectedSubject.replace(/[<>'"`´]/g, "");

  // convert escape characters like \t to tabs
  template = JSON.parse("\"" + template + "\"");

  var result = template.replace(/<thunderlink>/ig, getThunderlinkForHdr(hdr));
  result = result.replace(/<messageid>/ig, hdr.messageId);
  result = result.replace(/<subject>/ig, subject);
  result = result.replace(/<filteredSubject>/ig, protectedSubject);
  result = result.replace(/<sender>/ig, GlodaUtils.deMime(hdr.author));
  result = result.replace(/<tbexe>/ig, "\"" + getThunderlinkPathToExe() + "\" -thunderlink ");

  var date = new Date(hdr.date / 1000);
  var dateString = date.toLocaleDateString() + " - " + date.toLocaleTimeString();
  result = result.replace(/<time>/ig, dateString);

  return result;
}
