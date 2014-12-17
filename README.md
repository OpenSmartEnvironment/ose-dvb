# Open Smart Environment DVB package

This package contains the general definition of DVB-related logic.
Currently it contains only the channel [entry kind] and registers
DVB as a source to the [OSE Media player].

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
wish participate in the development process (see Contributions).

TODO: Make contribution a link

## Getting started
To get started with OSE, refer to the [ose-bundle] package and
[Media player example application].

## Modules
Open Smart Environment DVB package consists of the following modules:
- DVB channel kind
- OSE DVB core
- OSE DVB content

### DVB channel kind
[Entry kind] describing DVB channels.

Module [DVB channel kind] reference ... 

### OSE DVB core
Core singleton of ose-dvb npm package. Registers [entry kinds]
defined by this package to the `"media"` [scope].

Module [OSE DVB core] reference ... 

### OSE DVB content
Provides files of OSE DVB package to the browser.

Module [OSE DVB content] reference ... 

## Contributions
To get started contributing or coding, it is good to read about the
two main npm packages [ose] and [ose-bb].

This software is in the pre-alpha stage. At the moment, it is
premature to file bugs. Input is, however, much welcome in the form
of ideas, comments and general suggestions.  Feel free to contact
us via
[github.com/opensmartenvironment](https://github.com/opensmartenvironment).

## License
This software is licensed under the terms of the [GNU GPL version
3](../LICENCE) or later
