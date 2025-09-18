const Upload = require("../models/pdf")

async function fileUpload(req, res) {
    const { clouduploads, branch, semester, title, tags, description, uploaderEmail, uploaderName, subjectCode, subjectName } = req.body



    try {
        let userUpload = await Upload.create({
            clouduploads: clouduploads,
            branch: branch,
            semester: semester,
            title: title,
            description: description,
            uploaderEmail: uploaderEmail,
            uploaderName: uploaderName,
            subjectName: subjectName,
            subjectCode: subjectCode,
            tags: tags


        })
        const data = await userUpload.save()
        console.log(data)
        if (data) {
            return res.status(202).json({
                success: true,
                data: data
            })
        }
    } catch (error) {
        console.log(error)
    }

}


async function fileReturn(req, res) {
    let { branch, semester, subject } = req.query
    const filters = {};
    if (branch) filters.branch = branch;
    if (semester) filters.semester = semester;
    if (subject) filters.subject = subject;
    try {
        let responses = await Upload.find(filters)

        if (responses) {
            return res.json({
                data: responses,
                message: "Ther pdfs are successfully fetched",
                success: true
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(504).json({
            success: false,
            message: "There is internal Server Error",
            error: error.message
        })
    }
}
async function fetchSinglepdf(req, res) {
    let { id } = req.params
    try {
        let responses = await Upload.find({ _id: id })
        if (responses) {
            return res.json({
                data: responses,
                message: "Ther pdfs are successfully fetched",
                success: true
            })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(504).json({
            success: false,
            message: "There is internal Server Error",
            error: error.message
        })
    }
}


async function filterPdfs(req, res) {
    let { semester, branch, subject } = req.query

    const filter = {}
    if (semester) filter.semester = semester
    if (branch) filter.branch = branch
    if (subject) filter.subject = subject

    try {
        let data = await Upload.find(filter)
        if (data) {
            return res.status(202).json({
                data,
                success: true,
                message: "The elements are fetched based on the filter"
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "There is something wrong in this "
            })
        }
    } catch (error) {
        console.log(error.message)
    }

}

module.exports = { filterPdfs, fileUpload, fileReturn, fetchSinglepdf }