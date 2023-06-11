module.exports = {
    attributes: {
        PAN: {
            type: "string",
            required: true
        },
        form16File: {
            type: "string"
        },
        itrReturnedFile: {
            type: "string",
            defaultsTo: ""
        },
        status: {
            type: "string"
        },
        year: {
            type: "string"
        },
        versionForm16: {
            type: "string"
        },
        versionReturnedFile: {
            type: "string",
            defaultsTo: ""
        }
    }
}