const AWS = require('aws-sdk');
const S3 = require('aws-sdk/clients/s3');
const s3 = new S3(sails.config.S3_CONFIG);
const sqs = new AWS.SQS(sails.config.S3_CONFIG);


module.exports = {
  uploadFiles: async function (req, res) {
    let file = req.file('file');
    let uploadedBy = req.param('uploadedBy');
    let fileName = req.param("fileName");
    let year = new Date().getFullYear();
    let uploadedFor = req.param('uploadedFor');

    let params;
    console.log(req.body);
    try {
      if (uploadedBy != 'admin') {
        console.log("in if");
        params = {
          Bucket: sails.config.S3_CONFIG.bucketName,
          Key: `ITR/${uploadedFor}/${year}/itr-upload/${fileName}`,
          Body: file._files[0].stream
        }
        s3.upload(params, async (err, data) => {
          if (err) {
            console.log(err);
            return res.status(201).send({
              error: true,
              message: "Failed to upload file"
            });
          } else {
            console.log(data);
            // Send message to SQS queue
            const queueUrl = 'https://sqs.ap-south-1.amazonaws.com/781653571934/itr-file-upload.fifo'; // Replace with your SQS queue URL
            const messageParams = {
              MessageBody: JSON.stringify({
                PAN: uploadedFor,
                year: year,
                fileName: fileName,
                versionId: data.VersionId
              }),
              QueueUrl: queueUrl,
              MessageGroupId: Date.now().toString()
            };

            sqs.sendMessage(messageParams, (err, data) => {
              if (err) {
                console.log(err);
                return res.status(201).send({
                  error: true,
                  message: "Failed to upload file"
                });
              } 
            });
            sails.log.info("File uploaded successfully");
            await Files.create({
              PAN: uploadedFor,
              form16File: fileName,
              status: "New",
              year: year,
              versionForm16: data.VersionId
            });
            return res.status(200).send({
              error: false,
              message: "File uploaded successfully"
            });
          }
        });
      } else {
        params = {
          Bucket: sails.config.S3_CONFIG.bucketName,
          Key: `ITR/${uploadedFor}/${year}/itr-return-upload/${fileName}`,
          Body: file._files[0].stream
        }
        s3.upload(params, async (err, data) => {
          if (err) {
            console.log(err);
            return res.status(201).send({
              error: true,
              message: "Failed to upload file"
            });
          } else {
            console.log(data);
            const queueUrl = 'https://sqs.ap-south-1.amazonaws.com/781653571934/itr-file-upload.fifo'; // Replace with your SQS queue URL
            const messageParams = {
              MessageBody: JSON.stringify({
                PAN: uploadedFor,
                year: year,
                fileName: fileName,
                versionId: data.VersionId
              }),
              QueueUrl: queueUrl,
              MessageGroupId: Date.now().toString()
            };

            sqs.sendMessage(messageParams, (err, data) => {
              if (err) {
                console.log(err);
                return res.status(201).send({
                  error: true,
                  message: "Failed to upload file"
                });
              } 
            });
            sails.log.info("File uploaded successfully");
            await Files.update({ PAN: uploadedFor, year: year }).set({ status: "Complete", itrReturnedFile: fileName, versionReturnedFile: data.VersionId });
            return res.status(200).send({
              error: false,
              message: "File uploaded successfully"
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      sails.log.error(error);
      res.status(201).send({
        error: true,
        message: "Failed to upload file"
      });
    }
  },

  downloadFile: async function (req, res) {
    let reqBody = req.body;
    let requestedBy = reqBody.requestedBy;
    let year = reqBody.year;
    let fileName = reqBody.fileName;
    let pan = reqBody.pan;
    let params;

    console.log(reqBody);
    try {
      if (requestedBy != 'admin') {
        params = {
          Bucket: sails.config.S3_CONFIG.bucketName,
          Key: `ITR/${pan}/${year}/itr-return-upload/${fileName}`,
        }
      } else {
        params = {
          Bucket: sails.config.S3_CONFIG.bucketName,
          Key: `ITR/${pan}/${year}/itr-upload/${fileName}`,
        }
        await Files.update({ PAN: pan, year: year }).set({ status: "In Progress" });
      }
      console.log(params);
      console.log(await s3.headObject(params).promise());
      const fileStream = await s3.getObject(params).createReadStream();
      res.set('Content-Disposition', `attachment; filename="${fileName}"`);
      res.set('Access-Control-Expose-Headers', 'Content-Disposition');
      fileStream.pipe(res);
    } catch (error) {
      // console.log(error);
      await Files.update({ PAN: pan, year: year }).set({ status: "New" });
      res.status(201).send({
        error: true,
        message: "Failed to download file"
      });
    }
  }
}