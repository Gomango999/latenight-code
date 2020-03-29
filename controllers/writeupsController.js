const writeupFolder = "/files/writeups/"

exports.index = function (req, res) {
    /* Todo:
     *   Search through the /files/writeups folder, and find all files.
     *     Extract the title and uploadDate from the metadata.json
     *     Retrieve the filepath from the search
     *     Add onto array
     *   Pass list into res.render
     *     Write writeup_list.pug to list out all the files we found,
     *     in chronological order based on date of upload.
     */
    res.render('writeup.pug', {
        title: "J: Time Limits",
        problemFile: writeupFolder + "anzac/2020/J/problem.html",
        analysisFile: writeupFolder + "anzac/2020/J/analysis.html",
    });
    // res.render('writeup.pug', {
    //     title: "Vases",
    //     problemFile: writeupFolder + "orac/vases/problem.html",
    //     analysisFile: writeupFolder + "orac/vases/analysis.html",
    // });
}
