angular.module('allControllers')
    .service('UploadService',['Upload', function (Upload) {
        return {
            upload: function (files) {
                Upload.upload({
                    url: '/upload',
                    file: files
                }).progress(function(e) {

                }).success(function(data, status, headers, config) {
                    // file is uploaded successfully
                    console.log(data);

                });
            },
            rename: function (file,name) {
                Upload.rename(file,name);
            }

        }
    }]);