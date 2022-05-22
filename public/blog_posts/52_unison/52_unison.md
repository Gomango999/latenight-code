---
title: "How To Exclude Folders When Syncing on Mac"
description: Using Unison as to sync to the cloud.
author: Kevin Zhu
public: false
uploadDate: 2022-05-21 01:00+11:00
---

### Introduction
Tools like Google Drive and Dropbox don't let you exclude specific files that you don't want to sync. For developers, this can lead to blindly backing up unwanted folders like `node_modules` and python virtual environments, leading to gigabytes of wasted space.

Luckily for us, we have [Unison](https://www.cis.upenn.edu/~bcpierce/unison/). Unison is is a two-way file synchroniser that monitors your files and automatically syncs them when changes are made. This tutorial will teach you how to set up Unison to ignore unwanted directories.

### Prerequisites
For the purposes of this tutorial, we'll be using [Google Drive](https://www.google.com/intl/en_au/drive/download/) as our cloud storage service with the directory we want to sync to as `/User/kevin/Drive/Macbook`. The directory we'll be syncing from is `/User/kevin/sharing`, though these can be replaced with whatever directory you want to sync from and to.

This tutorial was run on MacOS Monterey, Version 12.4, though it should work on almost any computer (Unison works for OSX, Unix and Windows).

### What is Unsion?
[Unison](https://www.cis.upenn.edu/~bcpierce/unison/) is a powerful two-way file synchroniser that uses delta-transfer, which means that it only uploads the differences between files leading to major speed-ups. We can configure it to watch for file changes and automatically upload/download them to your local device, and last but not least, it has support for ignoring certain file patterns.

Some common questions:

- Why not just use inbuilt features of Google Drive / Dropbox?
    - These require manual selection of folders to exclude. For general use, this is fine, but it requires you to go and update your list of folders each time you create a new coding project.
- What about rsync?
    - [Rsync](https://en.wikipedia.org/wiki/Rsync) is another synchroniser that can quickly sync files between two locations. However, rsync is only a one way sync, which means that changes on the drive will not be reflected in your local folder.

### Using Unison to Sync Files
First, run the following commands to install unison:

```term
$ brew update 
$ brew install unison
```

Then install [unison-fsmonitor](brew install autozimu/homebrew-formulas/unison-fsmonitor), which we'll use to monitor our files. Download it by running the following command:

```term
$ brew install autozimu/homebrew-formulas/unison-fsmonitor
```

Next change to your home directory and create a default profile:

```term
$ cd ~
$ mkdir .unison
$ cd .unison
$ touch default.prf
```

Open `default.prf` in your favourite text editor and paste in the following code:

```
# Roots
root = /Users/kevin/sharing
root = /Users/kevin/Drive/Macbook
```

Here, we define the two root directories we want to sync between. Here, we want to make sure that anything we put into `/Users/kevin/sharing` gets coiped into `/Users/kevin/Drive/Macbook` and vice versa. __Make sure to use expand out the full path of your home directory__. Unison does not recognise the path if you use `~`.

Below that in the same text file, add the following flags:

```
# Flags
batch = true
fat = true
confirmbigdel = false
fastcheck = true
prefer = newer
repeat = watch
```

Here's a list of what these flags mean:

- `batch`
    - Disable user input, so the script can run without requiring us interacting with it.
- `fat`
    - Use appropriate options for FAT filesystems (which Google Drive uses)
- `confirmbigdel`
    - Setting this to false means that we no longer require user input when deleting a large amount of files, which may be needed when syncing directories for the first time. Switch this back to true after setup is finished.
- `fastcheck`
    - Makes Unison compute a fingerprint for each file, which it can use later in order to quickly check if a file is unchanged. This can greatly speed up file checking.
- `prefer`
    - When there are conflicts between the two directories, prefer describes which one to use as the main one. Setting it to `newer` means we favour whichever file was changed last.
- `repeat`
    - How often we want the script to rerun in seconds. If we set it to `watch`, we instead tell Unison to constantly watch for file changes and then update when necessary.

For a full list of options, check out the Preferences Section of the [Unison User Manual](https://www.cis.upenn.edu/~bcpierce/unison/download/releases/stable/unison-manual.html#prefs)

Next, add the following lines:

```
# Paths to synchronise
path = .
follow = Path *
```

`path` tells Unison which directories within the roots you want to sync. `follow` tells Unison which symbolic links we want to follow. In this case, we only want to follow the symbolic links placed in the directory `/Users/kevin/sharing`. Unison will treat these symbolic links as if the files they link to are actually physically in the containing folder. All other symbolic links will remain unsynced.

Finally, add the paths that you want to ignore:

```
# Paths to ignore
ignore = Name .DS_Store
ignore = Name .vscode
ignore = Name .git
ignore = Name node_modules
ignore = Name __pycache__
ignore = Name *.py[cod]
ignore = Name .venv
ignore = Name venv
ignore = Name *.zip
```

Save and exit. Finally, we'll set up our sharing folder.

```term
$ mkdir ~/sharing
$ cd ~/sharing
```

Add symbolic links to any folder that you want to sync. For example:

```term
$ ln -s ~/projects projects
$ ln -s ~/coding coding
$ ln -s ~/work/assignment assignment
```

Now, when you run the following command in terminal:

```term
$ unison
```

... Unison will automatically sync any differences between the two folders. In other words, it will copy over the contents of the folders pointed to by the links in `~/sharing` to the Drive folder. After that's done, it will then remain watching for any changes in order to propagate them between folders. You can test this out by creating a new file in `~/sharing` and seeing your change automatically being reflected in `~/Drive/Macbook`.

### Conclusion
Unison is a great tool for achieving two way syncs between files. For a tutorial on how we can setup Unison to run in the background, please see the Launchd tutorial (coming soon!).