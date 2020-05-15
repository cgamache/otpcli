# otpcli
Easy Google Authenticator style command line tool

## USAGE

### Set
	$ ./otpcli set [name] [key]
sets the secret in the OSX keychain

### Delete
	$ ./otpcli del [name]
deletes the secret from the OSX keychain

### Get
	$ ./otpcli get [name]
prints the OTP to stdout

## Building and Installation

	$ npm i
	$ npm run build
	$ npm run pkg
	$ sudo cp dist/otpcli /path/to/bin
