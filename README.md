<b>ThunderLink</b>
=========

ThunderLink lets you link to email messages in Thunderbird.

You can place ThunderLinks on the Desktop (in batch scripts), in OpenOffice/LibreOffice documents or in a personal wiki (such as <a href="http://www.tiddlywiki.com"> "TiddlyWiki"</a>).

Or maybe you have a Wiki running at your company and you want to link to emails sent to a mailing list so that your colleagues can quickly access them without having to search their inboxes first?

Use a ThunderLink!

With version 1.0.0, It's now also easy to integrate ThunderLink with todo lists and task managers such as RememberTheMilk, MyLifeOrganized, Evernote, OneNote, Nirvana, Taskwarrior, etc. 
You can completely customize ThunderLinks to fit your application's needs. And you can tag the emails you created a link to for advanced workflows and more productivity!

ThunderLinks are based on the unique message ID generated when an email is sent. This enables the Thunderbird email client to quickly and reliably find and select an email - as long as you actually received it.

With the companion extension ThunderLinkSpotter for the Firefox webbrowser you can make Firefox "ThunderLink-aware", so that it will automatically turn ThunderLinks into hyperlinks. One click and you can read the email you were looking for.

ThunderLinks are also recognized and turned into hyperlinks by Thunderbird itself, so you can use them in emails, too.


<b>Installation</b>
========
<ol>
<li>install ThunderLink in Thunderbird
   (use "all versions" link below for Thunderbird versions older than 5.0)</li>
   <li>install ThunderLinkSpotter in Firefox</li>
   <li>register the 'thunderlink' protocol in your OS following the instructions below:</li>
   </ol>
   </b>

   <b>on Linux (ubuntu):</b>
   --------------------------
   <b>pre-Natty:</b>
   follow these instructions: http://kb.mozillazine.org/Register_protocol
   Make sure you use the <b>-thunderlink</b> command line option when invoking Thunderbird, e.g. for Linux: 
   <code>/gconftool-2 -s /desktop/gnome/url-handlers/thunderlink/command '/usr/bin/thunderbird -thunderlink %s' --type String </code>

   <b>Natty and newer:</b>
   <ol>
   <li>You'll need to update your ~/.local/share/applications/mimeapps.list:
   under [Added Associations], add the line
   x-scheme-handler/thunderlink=thunderbird-tl.desktop;</li>

   <li>then, make a copy of your ~/.local/share/applications/thunderbird.desktop and name it thunderbird-tl.desktop </li>

   <li>Change the line that starts with
   Exec=thunderbird %u...
   to
   Exec=thunderbird -thunderlink '%u'...</li>
   <li>and the line that starts with
   MimeType=...
   to
   MimeType=x-scheme-handler/thunderlink;
   this entry for Thunderbird will thus serve only for handling ThunderLinks.</li>
   <li>in Thunderbird, you might have to explicitly select the new handler: Go to edit->preferences->attachments. In the "incoming" tab, you will have to select as the action for thunderlink whatever name you chose for the handler in the thunderbird-tl.desktop file</li>
   </ol>

   <b>Oneiric and newer:</b>

   Like Natty but you might have to 
   <ol>
   <li>in 1), edit 
   /usr/share/applications/defaults.list instead of ~/.local/share/applications/mimeapps.list
   </li>
   <li>in 2), the thunderbird.desktop file has to be copied from /usr/share/applications/ to your ~/.local/share/applications
   </li>
   </ol>
   Otherwise, the instructions are the same.

   <b>on Windows 7 (32 bit) and XP:</b>
   ------------------------------------------------------------------------------------------------
   there is a .reg script for registering the thunderlink protocol:


   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   <code>
   
   REGEDIT4

   [HKEY_CLASSES_ROOT\thunderlink]
   
   @="URL:thunderlink Protocol"
   
   "URL Protocol"=""

   [HKEY_CLASSES_ROOT\thunderlink\shell]

   [HKEY_CLASSES_ROOT\thunderlink\shell\open]

   [HKEY_CLASSES_ROOT\thunderlink\shell\open\command]
   
   @="\"C:\\\\Program Files\\\\Mozilla Thunderbird\\\\thunderbird.exe\" -thunderlink \"%1\""
   
   </code>
   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

   <b>on Windows 7 64 bit:</b>

   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
   <code>
   
   REGEDIT4

   [HKEY_CLASSES_ROOT\thunderlink]
   
   @="URL:thunderlink Protocol"
   
   "URL Protocol"=""

   [HKEY_CLASSES_ROOT\thunderlink\shell]

   [HKEY_CLASSES_ROOT\thunderlink\shell\open]

   [HKEY_CLASSES_ROOT\thunderlink\shell\open\command]
   
   @="\"C:\\\\Program Files (x86)\\\\Mozilla Thunderbird\\\\thunderbird.exe\" -thunderlink \"%1\""
   
   </code>
   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

   Create a file with .reg extension, copy the stuff between the dashes into it, changing the path to the thunderbird.exe if necessary, double-click on the file, confirm execution, done.

   ------------------------------------------------------------------------------------------------
   
   <b>on Windows 8</b>
   
   Haven't tried it myself, but this guide should help:
   http://msdn.microsoft.com/en-us/library/aa767914%28v=VS.85%29.aspx

   ------------------------------------------------------------------------------------------------

   The easiest way to find out the install location is to right-click on the shortcut to Thunderbird in your Start menu and select Properties, and then check the "Target" or "Start in" fields for the path data. (thx Sean!)

   ... and that's it, you're good to go!



   <b>Usage</b>
   
   =====
   
   Right-click on an email and select 'Copy ThunderLink to clipboard'. You now have the ThunderLink to your email in your clipboard. You can paste it into your personal wiki, or your project teams wiki, for instance.

   Use ThunderLinkSpotter to turn that link into a hyperlink, making it "clickable". If you registered the thunderbird protocol correctly, a click on the ThunderLink will take you to Thunderbird and select your email immediately. If Thunderbird wasn't running yet, the email will show in a stand-alone window.


   <b>Usage with <a href="http://mylifeorganized.net/">MyLifeOrganized</a> (MLO)</b>
   
   =====
   
   MyLifeOrganized (MLO) is a popular task manager, organizer, project management tool, etc. Once you have ThunderLink setup such that your OS recognizes and correctly executes ThunderLinks, there is one additional detail for getting MLO to recognize ThunderLinks (within a MLO Task Note filed): You must prefix the ThunderLink with `file:`. This will indicate to the MLO software that the ThunderLink should be treated like a link. Note that `file:` works with other things as well (e.g., Evernote local links -> `file:evernote:///...`).
   
   If you like to use the MLO Rapid Task Entry box, you could configure your ThunderLinks like the following example:
   ```
   Email: <subject>   -s Tomorrow -*   @ Work;Email; 
   file:<thunderlink>
   ```
   Note that the TL is on the second line. Also, I having extra spaces between some of the items can make it easier for you if you need to tweak something (eg, change the Start Date, or add a MLO Context).
   
   In MLO Rapid Task Entry, if you uncheck "Multiple Task Entry (1 task per line...)" then pasting the above TL result into the Rapid Task Entry box will produce the following MLO Task:
   ```
   Task Subject = "Email: EMAIL_SUBJECT" 
   Start: Tomorrow 
   Star 
   Contexts: Work; Email; 
   Task Note: A clickable ThunderLink, beginning with "file:"
   ```
   <a href="https://github.com/poohsen/thunderlink/issues/20#issuecomment-54720844">Reference for Above.</a>
   

   <b>Having trouble?</b>
   
   ===========
   
   <b>Please note that protocol registration changed in Ubuntu Natty! </b>
   If you had to use the "natty and newer" installation instructions, you might have to tell thunderbird to use the new handler (see instructions above)


   I tested this extension with several TB installations and two other beta testers, under Linux and Windows (7 and XP). However..... in the unlikely event of a bug, please don't leave a question or "doesn't work" type message as a comment.
   I'm keen on constructive feedback, so just describe your setup and the issue you're having and send it to: "firstname underscore lastname, provider is gmx dot de" and I'll try my best to sort you out. You can still flame me afterwards should I fail ;)

   Care to contribute? https://github.com/poohsen/thunderlink

   For devs cloning the repo:
   
   - use make 'makeXpi.sh <release-number>' to create distributables for Thunderbird
