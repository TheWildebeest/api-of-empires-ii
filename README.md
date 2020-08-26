# api-of-empires-ii
The first and simplest iteration of an API I built as the back end for my App Of Empires project.

This was built with:

* Firebase functions
* Express (Node.js 10 runtime)
* TypeScript

This is primarily for use with the front-end App Of Empires.
I wanted to keep a copy of this directory structure which
is the first version that was successfully deployed. It's
partly for future reference, and to remind myself to start
simple and scale up. Particularly as this was my first
typescript project, I was still getting used to the strict
typing, and so to break the learning curve into smaller
pieces, I kept the model, controller, router and middleware
all in one file. Now that I have this up and running, the
next step is to separate these out into different directories
which will make it easier to maintain.

I have left a dummy service account .json file in the build
directory (./functions/src/lib) as a guide to the file
structure only.

## Setting up your own API Of Empires

In your terminal:

### Clone the repo and add dependencies

```
$ git clone https://github.com/TheWildebeest/api-of-empires-ii.git
$ cd api-of-empires-ii
$ npm install
$npm run build
```

### Add firebase

If running `npm install` does not add the firebase CLI, you will need to run the following commands:

```
$ npm install --save firebase
$ firebase init
```

You only need to add Firebase Functions to the project. Once this is added, add your own Firebase Admin credentials in place of the dummy service acount `.json` file, and run `$ firebase deploy`.

**Notes**: If you're using npm 5.0+, you don't need the --save flag with npm. Also, if you want to add functionality to the app, be sure to follow the same "builder" pattern and export this as a function at the end.
