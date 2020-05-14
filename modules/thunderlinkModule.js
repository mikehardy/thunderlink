// eslint-disable-next-line no-unused-vars
var EXPORTED_SYMBOLS = [
  "openThunderlink",
  "replaceVariables",
  "getThunderlinkPathToExe",
  "getThunderlinkForHdr",
  "appendThunderlinkToFile",
  "convertEscapeCharacters",
];

const MESSAGE_ID_PARAM = "messageid=";

// MailUtils.js import moves to MailUtils.jsm and is deprecated past Thunderbird 60
var version;
if ("@mozilla.org/xre/app-info;1" in Components.classes) {
  version = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo).version;
} else {
  version = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getCharPref("app.version");
}
var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"].getService(Components.interfaces.nsIVersionComparator);

if (version && versionChecker && versionChecker.compare(version, "64.0") > 0) {
  Components.utils.import("resource:///modules/MailUtils.jsm");
} else {
  Components.utils.import("resource:///modules/MailUtils.js");
}
Components.utils.import("resource:///modules/iteratorUtils.jsm");

function getPref(prefName) {
  var prefService = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService)
    .getBranch("extensions.thunderlink.");

  return prefService.getCharPref(prefName);
}

function getThunderlinkForHdr(hdr) {
  return "thunderlink://" + MESSAGE_ID_PARAM + hdr.messageId;
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
    } else if (/^mid:/.test(mailURL)) {

      // strip off the "mid:" prefix.
      let messageID = mailURL.slice("mid:".length);

      // Make sure the folder tree is initialized
      MailUtils.discoverFolders();

      // Search all folders for messageID.
      var accountManager = Components.classes["@mozilla.org/messenger/account-manager;1"]
        .getService(Components.interfaces.nsIMsgAccountManager);
      var folders = accountManager.allFolders;
      var foldersArray = fixIterator(folders.enumerate(), Components.interfaces.nsIMsgFolder);
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
    } else {
      Components.utils.reportError("unrecognized URL: " + mailURL + "\n");
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

function convertEscapeCharacters(string) {
  // replacing double quotes so they are escaped for JSON.parse
  var result = string.replace(/["]/g, "\\\"");
  // convert escape characters like \t to tabs
  result = JSON.parse("\"" + result + "\"");
  return result;
}

// eslint-disable-next-line no-unused-vars
function replaceVariables(template, hdr) {
  Components.utils.import("resource:///modules/gloda/utils.js");
  const subject = GlodaUtils.deMime(hdr.subject);

  // replace a few characters that frequently cause trouble
  // with a focus on org-mode, provided as filteredSubject
  var protectedSubject = subject.split("[").join("(");
  protectedSubject = protectedSubject.split("]").join(")");
  protectedSubject = protectedSubject.replace(/[<>'"`´]/g, "");

  var convertedEscapeCharacters = convertEscapeCharacters(template);

  var result = convertedEscapeCharacters.replace(/<thunderlink>/ig, getThunderlinkForHdr(hdr));
  result = result.replace(/<messageid>/ig, hdr.messageId);
  result = result.replace(/<subject>/ig, subject);
  result = result.replace(/<filteredSubject>/ig, protectedSubject);
  result = result.replace(/<sender>/ig, GlodaUtils.deMime(hdr.author));
  result = result.replace(/<tbexe>/ig, "\"" + getThunderlinkPathToExe() + "\" -thunderlink ");

  const date = new Date(hdr.date / 1000);
  const dateString = date.toLocaleDateString() + " - " + date.toLocaleTimeString();
  result = result.replace(/<time>/ig, dateString);

  return result;
}

// eslint-disable-next-line no-unused-vars, max-len
function appendThunderlinkToFile(hdrs, messageTemplate, alertTemplate, filePath, selectionDelimiter) {
  var alertText = "";
  var messageText = "";

  // create file object
  Components.utils.import("resource://gre/modules/FileUtils.jsm");
  // eslint-disable-next-line no-undef
  var file = new FileUtils.File(filePath);

  // write to file
  // file is nsIFile, data is a string
  var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
    .createInstance(Components.interfaces.nsIFileOutputStream);

  // https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSPR/Reference/PR_Open#Parameters
  foStream.init(file,
    // eslint-disable-next-line no-bitwise
    /* PR_WRONLY 0x02 */ 0x02 | /* PR_CREATE_FILE 0x08 */ 0x08 | /* PR_APPEND */ 0x10,
    0o666, 0);

  var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"]
    .createInstance(Components.interfaces.nsIConverterOutputStream);
  converter.init(foStream, "UTF-8", 0, 0);

  // generate message text
  var i = 0;
  for (; i < hdrs.length; i++) {
    messageText += replaceVariables(messageTemplate, hdrs[i]);

    if ((i + 1) !== hdrs.length) {
      messageText += convertEscapeCharacters(selectionDelimiter);
    }
  }

  converter.writeString(messageText);
  converter.close(); // this closes foStream

  // generate alert string
  if (hdrs.length === 1) {
    alertText += "Email written to file: " + filePath + "\n\n";
    alertText += replaceVariables(alertTemplate, hdrs[0]);
  } else if (hdrs.length === 2) {
    alertText += hdrs.length;
    alertText += " emails written to file: " + filePath + "\n\n";
    alertText += replaceVariables(alertTemplate, hdrs[0]);
    alertText += replaceVariables(alertTemplate, hdrs[1]);
  } else {
    alertText += hdrs.length;
    alertText += " emails written to file: " + filePath + "\n\n";
    alertText += replaceVariables(alertTemplate, hdrs[0]);
    alertText += "...\n\n";
    alertText += replaceVariables(alertTemplate, hdrs[hdrs.length - 1]);
  }
  return alertText;
}
