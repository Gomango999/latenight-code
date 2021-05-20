for FILE in *.md; do
    FILENAME=${FILE%.md}
    OUTFILE="out/${FILENAME}.html"
    echo $OUTFILE
    pandoc $FILE -o $OUTFILE --mathjax --from markdown --to html
done
