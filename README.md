# Open Smart Environment DVB package

This package contains the general definition of DVB-related logic.
Currently it contains only the channel [entry kind](http://opensmartenvironment.github.io/doc/classes/ose.lib.kind.html) and registers
DVB as a source to the [OSE Media player](http://opensmartenvironment.github.io/doc/modules/media.html).

DVB channels are configured in .js files.

Example:

TODO

## Status
- Pre-alpha stage (insecure and buggy)
- Unstable API
- Gaps in the documentation
- No test suite

This is not yet a piece of download-and-use software. Its important
to understand the basic principles covered by this documentation.

Use of this software is currently recommended only for users that
wish participate in the development process, see
[Contributions](#contributions).

## Getting started
To get started with OSE, refer to the [ose-bundle](http://opensmartenvironment.github.io/doc/modules/bundle.html) package and
[Media player example application](http://opensmartenvironment.github.io/doc/modules/bundle.media.html). You can read the entire OSE
documentation [here]( http://opensmartenvironment.github.io/doc).

## Modules
Open Smart Environment DVB package consists of the following modules:
- DVB channel kind
- OSE DVB core
- OSE DVB content

### DVB channel kind
[Entry kind](http://opensmartenvironment.github.io/doc/classes/ose.lib.kind.html) describing DVB channels.

Module [DVB channel kind](http://opensmartenvironment.github.io/doc/classes/dvb.lib.channel.html) reference ... 

### OSE DVB core
Core singleton of ose-dvb npm package. Registers [entry kinds](http://opensmartenvironment.github.io/doc/classes/ose.lib.kind.html)
defined by this package to the `"media"` [scope](http://opensmartenvironment.github.io/doc/classes/ose.lib.scope.html).

Module [OSE DVB core](http://opensmartenvironment.github.io/doc/classes/dvb.lib.html) reference ... 

### OSE DVB content
Provides files of OSE DVB package to the browser.

Module [OSE DVB content](http://opensmartenvironment.github.io/doc/classes/dvb.content.html) reference ... 

## <a name="contributions"></a>Contributions
To get started contributing or coding, it is good to read about the
two main npm packages [ose](http://opensmartenvironment.github.io/doc/modules/ose.html) and [ose-bb](http://opensmartenvironment.github.io/doc/modules/bb.html).

This software is in the pre-alpha stage. At the moment, it is
premature to file bugs. Input is, however, much welcome in the form
of ideas, comments and general suggestions.  Feel free to contact
us via
[github.com/opensmartenvironment](https://github.com/opensmartenvironment).

## Licence
This software is released under the terms of the [GNU General
Public License v3.0](http://www.gnu.org/copyleft/gpl.html) or
later.
