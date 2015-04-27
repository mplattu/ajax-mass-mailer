ajax-mass-mailer
================

mass mailer using jQuery.ajax

Original version https://github.com/kapitanluffy/ajax-mass-mailer

Changes:
* UTF-8 charset
* Message body is text/plain instead of text/html
* Some changes to background
* Log to local file

To enable logging to local file add `settings.php` with following content to
same directory with `mailer.php` with following content:

``<?php

$LOGFILE = '/path/to/your/logfile.txt';

?>``

Don't forget to make your logfile writeable for your web server.

