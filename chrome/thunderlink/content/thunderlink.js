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

var ThunderLinkChromeNS = {

	CopyStringToClpBrd: function(string)
	{
	 try {
	 //   dump("CopyMessageUrlToClp mailboxMsgUrl: " + mailboxMsgUrl + "\n");
	    var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
	                              .getService(Components.interfaces.nsIClipboardHelper);
	    clipboard.copyString(string);
	  }
	  catch (ex) {
	    dump("ex="+ex+"\n");
	  }
	},

	CopyMessageUrlToClp: function()
	{
		ThunderLinkChromeNS.CopyStringToClpBrd(ThunderLinkChromeNS.GetThunderlink());
	},

	CopyMessageUrlToClpWithExe: function()
	{
	  var appDir;
	  try {
		appDir = Components.classes["@mozilla.org/file/directory_service;1"]
		                     .getService(Components.interfaces.nsIProperties)
		                     .get("CurProcD", Components.interfaces.nsILocalFile);

	  }
	  catch (ex) {
	    dump("ex="+ex+"\n");
	  }
		// gives an [xpconnect wrapped nsILocalFile]
		appDir.append("thunderbird\" -thunderlink ");
		dump("CopyMessageUrlToClpWithExe appDir: " + appDir.path + "\n");
	    
	    var pathToExePlusTL = "\"" + appDir.path + ThunderLinkChromeNS.GetThunderlink();
	 //   dump("CopyMessageUrlToClp pathToExePlusTL: " + pathToExePlusTL + "\n");
	    ThunderLinkChromeNS.CopyStringToClpBrd(pathToExePlusTL);

	},

	GetThunderlink: function()
	{
	   var hdr = gDBView.hdrForFirstSelectedMessage;
		return "thunderlink://" + "messageid=" + hdr.messageId;
	}

}
