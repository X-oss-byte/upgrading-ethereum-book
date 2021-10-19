#!/usr/bin/gawk -f

BEGIN{
    n = 0
    file_name_format = "markdown-pages/part_%03d.md"
    filename = sprintf(file_name_format, n)
    h_part = ""
    h_chapter = ""
    h_part_no = -1 # Number parts from 0
    h_chapter_no = 0
    h_section_no = 0
}
{
    # Headings with an HTML comment at the end trigger a new page
    if ($0 ~ /(^# |^## |^### ).* <!-- .* -->$/) {

        # Start a new page
        if (n > 0) {
            close (filename)
        }
        n++
        filename = sprintf(file_name_format, n)

        # Generate header contents and output it
        name = gensub("^#+ (.*) <!-- .* -->$", "\\1", "1", $0)
        h_path = gensub("^#+ .* <!-- (.*) -->$", "\\1", "1", $0)
        heading = gensub ("^(#+ .*) <!-- .* -->$", "\\1", "1", $0)
        if ($0 ~ /^# /) {
            h_part = name
            h_chapter = ""
            h_section = ""
            h_part_no++
            h_chapter_no = 0
            idx = h_part_no
        } else if ($0 ~ /^## /) {
            h_chapter = name
            h_section = ""
            h_chapter_no++
            h_section_no = 0
            idx = h_part_no "," h_chapter_no
        } else {
            h_section = name
            h_section_no++
            idx = h_part_no "," h_chapter_no "," h_section_no
        }
        print "---" > filename
        print "path: " h_path > filename
        print "titles: [\"" h_part "\",\"" h_chapter "\",\"" h_section "\"]" > filename
        print "index: [" idx "]" > filename
        print "---" > filename
        print heading > filename
    } else {
        print > filename
    }
}
