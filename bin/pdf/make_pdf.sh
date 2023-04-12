#!/bin/bash

# Attempt to make a PDF of the whole text, using pandoc.
#
# All being well, the generated PDF will appear as src/book.pdf

if [ $# -eq 0 ]; then
    echo "Usage: $0 filename.md"
    exit 1
fi

name=$(basename $1 .md)
outdir=$(pwd)
srcdir=$(cd -- $(dirname "$1") && pwd)
path=$(cd -- $(dirname "$0") && pwd)

echo "Converting $srcdir/$name.md to ./$name.pdf"

# For finding the logging script
export LUA_PATH="$path/filters/?.lua;;"

cd $srcdir

pandoc \
    $name.md \
    --output $outdir/$name.pdf \
    --from markdown \
    --metadata title-meta:'Upgrading Ethereum - Bellatrix Edition' \
    --metadata author-meta:'Ben Edgington' \
    --metadata lang:en-GB \
    --lua-filter $path/filters/pagebreaks.lua \
    --lua-filter $path/filters/links.lua \
    --lua-filter $path/filters/figures.lua \
    --lua-filter $path/filters/summaries.lua \
    --lua-filter $path/filters/codeblocks.lua \
    --variable documentclass:book \
    --variable classoption:oneside \
    --variable linkcolor:violet \
    --variable geometry:a4paper \
    --variable geometry:margin=2.54cm \
    --variable block-headings \
    --include-before-body $path/inc/title-page.tex \
    --include-in-header $path/inc/blockquote.tex \
    --include-in-header $path/inc/summaries.tex \
    --include-in-header $path/inc/underscore.tex \
    --include-in-header $path/inc/notightlist.tex \
    --toc \
    --toc-depth=3 \
    --pdf-engine=xelatex
