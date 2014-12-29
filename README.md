# Open Smart Environment - DVB
This package is a part of OSE suite.
The main advantage of OSE is the easy creation of applications
consisting of multiple instances working as a single whole. The
objective is to develop an all-encompassing personal mesh running
various devices including HTPCs, phones, tablets, workstations,
servers, Raspberry Pis, home automation gadgets, wearables, drones etc.

For more information about OSE see **the [documentation](http://opensmartenvironment.github.io/doc/)**.

## Status
- Pre-alpha stage (insecure and buggy)
- Unstable API
- Gaps in the documentation
- No test suite

This is not yet a piece of download-and-use software. Its important
to understand the basic principles covered by the
[documentation](http://opensmartenvironment.github.io/doc/).

Use of this software is currently recommended only for users that
wish participate in the development process, see
[contributions](http://opensmartenvironment.github.io/doc/#contrib).

## Platforms
OSE is developed in JavaScript on the following platforms.
- Node.js (>0.10) running on Debian Jessie and Raspbian
- recent versions of Firefox
- recent versions of Chromium/Chrome

It, however, probably also runs on other recent browsers and Linux
distributions.

## Package description
This package contains the general definition of DVB-related logic.
Currently it contains only the channel [entry kind] and registers
DVB as a source to the [Media player].

DVB channels are configured in .js files.

Example:

TODO

The documentation for "ose-dvb" package can be found **[here](http://opensmartenvironment.github.io/doc/#ose-dvb#)**.

## Licence
This software is released under the terms of the [GNU General
Public License v3.0](http://www.gnu.org/copyleft/gpl.html) or
later.
