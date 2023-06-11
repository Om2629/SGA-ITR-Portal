module.exports = {

    //JWT
    jwtConfig: {
        issuser: "Itr-dev",
        validity: {
            accessToken: 60*10, //10 Min
            refreshToken: 60 * 60 * 24 //24Hrs
        }
    },

    bcryptConfig: {
        saltRounds: 12,
        systemSalt: "Itr"
    },

    permissions: {
        CREATE: "create"
    },

    S3_CONFIG: {
        accessKeyId: "AKIA3L7RO7FPLWZPOIQ4",
        secretAccessKey: "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",
        region: 'ap-south-1',
        bucketName: 'sga-itrportal-s3-bucket'
    }
}