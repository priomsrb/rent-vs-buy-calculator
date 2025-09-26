When adding new images use the following commands to make them smaller in size:

```
mogrify -quality 85 -format jpg _.png
mogrify -resize 512x512! _.jpg
imageoptim *.jpg
```

To install the commands on mac:

```
brew install imagemagick imageoptim-cli
```
