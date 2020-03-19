<b>ThunderLink - clickable, durable links to specific messages</b>
======================================================

ThunderLinks are durable hyperlinks to specific email messages.

Make a reference to the ThunderLink anywhere you want immediate access to the original message contents in full. For example, wikis, task trackers, etc.

Click on a ThunderLink later to open that specific message in Thunderbird.

You may customize ThunderLink formats to fit your needs.

You may even configure ThunderLink to tag the email while creating the link, enabling advanced workflows and more productivity!

ThunderLinks are durable even if you file the message. They are based on the unique message ID generated when an email is sent. This enables the Thunderbird email client to quickly and reliably find and select any email that exists in your Thunderbird mail store.

<b>Installation</b>
===========
<ol>
<li>Install the ThunderLink Add-On in Thunderbird - https://addons.thunderbird.net/en-US/thunderbird/addon/thunderlink/?src=search</li>
<li>Register the 'thunderlink' protocol in your OS following the instructions below:</li>
</ol>
 </b>

   <b>Windows:</b>
   ----------------
   Download the "raw" version of the file that matches your Windows and Thunderbird versions, then double-click the file and confirm the registry script to merge it in to your registry:
   
   <ul>
   <li>https://github.com/mikehardy/thunderlink/blob/master/integration/ThunderLink_WINXP_WIN7_32bit_Thunderbird_32bit.reg
   <li>https://github.com/mikehardy/thunderlink/blob/master/integration/ThunderLink_WIN7_64bit_Thunderbird_32bit.reg
   <li>https://github.com/mikehardy/thunderlink/blob/master/integration/ThunderLink_WIN10_64bit_Thunderbird_32bit.reg
   </ul>

   These .reg files were generously provided by @mobileartur - please feel free to provide others or open pull requests to help other windows users. Note that 32bit Thunderbird is the current recommendation for Windows. For this reason we don't have registry files for 64-bit Thunderbird.

   <b>Linux (Tested on Ubuntu 18.04LTS):</b>
   ------------------------------------------
   <ol>
   <li>Install the desktop launcher that opens ThunderLinks in Thunderbird</li>
   <ol>
   <li>Download the thunderlink launcher https://github.com/mikehardy/thunderlink/blob/master/integration/thunderbird-tl.desktop</li>
   <li>Copy it to ~/.local/share/applications/thunderbird-tl.desktop</li>
   </ol>
   <li>Connect the "thunderlink" URL type to the launcher file
   <ol>
   <li>Run the command `touch ~/.local/share/applications/mimeapps.list` to make sure you have a local MIME handler registry</li>
   <li>Add the handler: `echo "x-scheme-handler/thunderlink=thunderbird-tl.desktop" >> ~/.local/share/applications/mimeapps.list`</li>
   </ol>
   </ol>
   
   `mimeapps.list` might be placed here: `~/.config/mimeapps.list`

   <b>Mac:</b>
   ----------
   You may integrate directly with thunderbird using helper scripts as described here:
   https://github.com/mikehardy/thunderlink/blob/master/integration/macosx/install.txt
   
   Separately, it is possible to interoperate with Mail.app on macOS and Thunderbird on (for example) Windows with the same links, following these instructions: https://github.com/mikehardy/thunderlink/wiki/macOS-compatibility---interoperability
   
   <b>Usage</b>
   -------------
   Use the keyboard shortcut for the ThunderLink format you want (e.g. Ctrl-Alt-6) or right-click on an email and select 'ThunderLink...' and the format you want. You now have the ThunderLink to your email in your clipboard. You can paste it into your personal wiki, or your project teams wiki, or a new task entry in your task tracker for instance.

   If you would like a clickable ThunderLink with the email's subject, use a pattern like this: `<A HREF="<thunderlink>"><subject></a>` - this may be pasted into other systems that render HTML.

   If you registered the ThunderLink protocol correctly, a click on the ThunderLink will open your email directly using the ThunderLink options you configured (open in a new tab, open in a new window, etc)

   
   <b>Notes:</b>
   =======
   <ul>
   <li>Some task managers (for example, MyLifeOrganized (MLO)) require you to prefix the ThunderLink with `file:` to be treated like a link</li>
   <li>You can configure very complicated ThunderLinks if you like. For example:
   ```
   Email: <subject>   -s Tomorrow -*   @ Work;Email; 
   file:<thunderlink>
   ```
   </li>
   </ul>

   <b>Having trouble?</b>
   ================
   In the unlikely event of a bug, please open an issue on the provided github link, taking care to include all the requested information.

   Care to contribute? https://github.com/mikehardy/thunderlink

   For devs cloning the repo use make 'makeXpi.sh <release-number>' to create distributables for Thunderbird
