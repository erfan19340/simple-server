"use strict";

const fs = require('fs');
const path = require('path');

module.exports = class AttachmentController {
    upload(data) {
        console.log(request().method)
        if (request().method == 'GET') {
            return 'attachment/upload_form.html';
        }
        if (data.files.file) {
            let tmpPath = data.files.file.path;
            let destinationPath = path.join(configs().uploadDir, data.files.file.name);
            // fs.rename(tmpPath, destinationPath, function (err) {
            //     console.error(err);
            // });
            if (!fs.existsSync(configs().uploadDir)) {
                fs.mkdirSync(configs().uploadDir);
            }
            var readStream = fs.createReadStream(tmpPath);
            var writeStream = fs.createWriteStream(destinationPath);
            readStream.pipe(writeStream);
            readStream.on('end', function () {
                fs.unlinkSync(tmpPath);
            });

            return 'attachment/success_upload.html'
        }
    }
}
