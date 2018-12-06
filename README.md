<b>ThunderLink - clickable links to specific messages</b>
=========

ThunderLinks are customizable hyperlinks to specific email messages.

Create a thunderlink for any message, using a default format or a format you specify.

Click on a thunderlink later to open that specific message in Thunderbird.

With thunderlink you can quickly file important emails away while still preserving immediate access to the message in external knowledge systems - for example in a task tracking application, a wiki, or documents so that you or others can immediately pull up a specific email related to the task.

You may completely customize ThunderLinks to fit your application's needs. And you can tag the emails you created a link to for advanced workflows and more productivity!

ThunderLinks are based on the unique message ID generated when an email is sent. This enables the Thunderbird email client to quickly and reliably find and select any email in your Thunderbird mail store.

<b>Installation</b>
========
<ol>
<li>install ThunderLink in Thunderbird</li>
<li>register the 'thunderlink' protocol in your OS following the instructions below:</li>
</ol>
 </b>

   <b>Windows:</b>
   ------------------------------------------------------------------------------------------------
   You need to download the "raw" version of the file that matches your version of Windows and Thunderbird, then double-click + confirm the registry script to merge it in to your registry and enable the thunderlink protocol:
   - [Windows 7 and XP 32bit with Thunderbird 32bit](ThunderLink_WINXP_WIN7_32bit_Thunderbird_32bit.reg)
   - [Windows 7 64bit with Thunderbird 32bit](ThunderLink_WIN7_64bit_Thunderbird_32bit.reg)
   - [Windows 10 64bit with Thunderbird 32bit](ThunderLink_WIN10_64bit_Thunderbird_32bit.reg)
   
   These .reg files were generously provided by @mobileartur - please feel free to provide others or open pull requests to help other windows users

   <b>Linux (Tested on Ubuntu 18.04LTS):</b>
   --------------------------
   <ol>
   <li>Connect the "thunderlink" URL type to a launcher file 
   <ol>
   <li>find and open either ~/.local/share/applications/mimeapps.list or /usr/share/applications/defaults.list for edit</li>
   <li>find the [Added Associations] section</li>
   <li>add the line x-scheme-handler/thunderlink=thunderbird-tl.desktop;</li>
   </ol>
   <li>Create a thunderlink launcher</li>
   <ol>
   <li>Find and copy the current thunderbird launcher (should be /usr/share/applications/thunderbird.desktop) to ~/.local/share/applications/thunderbird-tl.desktop </li>
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
   </ol>

   <b>Mac:</b>
   ------------------------------------------------------------------------------------------------
   macOS has evolved recently and made it quite difficult to register new protocol handlers. If anyone discovers how to register thunderlinks in macOS, please explain how in a Github issue or pull request (thanks!). It is however possible to configure thunderlink to create links compatible with Mail.app, and if you register those links correctly in other environments you may still use Thunderbird to create links that work everywhere, while on the Mac they will still pull up specific messages in Mail.app so information retrieval works.
   
   <b>Usage</b>
   ---------------------------
   
   Right-click on an email and select 'Copy ThunderLink to clipboard'. You now have the ThunderLink to your email in your clipboard. You can paste it into your personal wiki, or your project teams wiki, for instance.

   If you would like a clickable link to the email's subject, use a pattern like this: `<A HREF="<thunderlink>"><subject></a>` - this may be pasted into other systems that render HTML.

   If you registered the thunderbird protocol correctly, a click on the ThunderLink will take you to Thunderbird and select your email immediately. If Thunderbird wasn't running yet, the email will show in a stand-alone window.

   
   <b>Notes:</b>
   =====
   <ul>
   <li>Some task managers (for example, MyLifeOrganized (MLO)) require you to prefix the ThunderLink with `file:` to be treated like a link</li>
   <li>You can configure very complicated thunderlinks if you like. For example:
   ```
   Email: <subject>   -s Tomorrow -*   @ Work;Email; 
   file:<thunderlink>
   ```
   </li>
   </ul>


   <b>Having trouble?</b>
   
   ===========
   
   In the unlikely event of a bug, please open an issue on the provided github link, taking care to include all the requested information.

   Care to contribute? https://github.com/mikehardy/thunderlink

   For devs cloning the repo:
   
   - use make 'makeXpi.sh <release-number>' to create distributables for Thunderbird
