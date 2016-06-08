$(() => {
    "use strict";
    const CropModule = function (el) {

        const initialize = () => {
            $(el).on("keyup", ".crop-controls input[data-crop-url-input]", (e) => {
                this.validateImgProps(e.target.value);

            })
            .on("click", ".crop-controls button[data-crop-submit]", (e) => {
                e.stopPropagation();
                this.uploadPhoto();

            })
            .on("change", ".crop-controls input[data-crop-html-input]", (e) => {
                $(el).find(".crop-controls button[data-crop-submit]")
                    .prop("disabled", !this.validateFileProps(e.target.files[0]));

            })
            .on("click", ".crop-submit button[data-crop-submit-avatar]", () => {
                this.submitCroppedImage();

            });
        };

        const initAreaSelect = (imgContainer) => {
            $(imgContainer).imgAreaSelect({
                minWidth: 186,
                minHeight: 186,
                aspectRatio: "1:1",
                handles: true,
                x1:0,
                y1:0,
                x2:186,
                y2:186,
                onSelectChange: (img, selection) => {
                    resizeAvatarCanvas(img, selection);
                },
                onSelectEnd: (img, selection) => {
                    const parentDiv = $(el).find(".crop-submit .selected-coords");
                    $(parentDiv).find("input[name=\"x1\"]").val(selection.x1);
                    $(parentDiv).find("input[name=\"y1\"]").val(selection.y1);
                    $(parentDiv).find("input[name=\"x2\"]").val(selection.x2);
                    $(parentDiv).find("input[name=\"y2\"]").val(selection.y2);
                },
                onInit: (img, selection) => {
                    resizeAvatarCanvas(img, selection);
                }
            });
        };
        const resizeAvatarCanvas = (img, selection) => {
            const scaleX = 186 / (selection.width || 1);
            const scaleY = 186 / (selection.height || 1);

            $(el).find(".crop-canvas #img-avatar").css({
                width: Math.round(scaleX * img.width),
                height: Math.round(scaleY * img.height),
                marginLeft: -Math.round(scaleX * selection.x1),
                marginTop: -Math.round(scaleY * selection.y1)
            });
        };

        this.validateImgProps = function (link) {
            const img = new Image();

            img.onload = function () {
                let result;
                result = (img.height < 186 && img.width < 186);
                $(el).find(".crop-controls button[data-crop-submit]").prop("disabled", result);
            };
            img.src = link;
        };

        this.validateFileProps = function (file) {
            return ((file.type.match("image.*")) && (file.size < 5000000));
        };

        this.uploadPhoto = function () {
            const htmlInputValue = $(el).find(".crop-controls input[data-crop-url-input]").val(),
                fileInput = $(el).find(".crop-controls input[data-crop-html-input]");

            if (htmlInputValue) {
                this.uploadImageFromInternet(htmlInputValue);
            } else {
                this.uploadImageFromPC(fileInput);
            }
        };

        this.submitCroppedImage = function () {
            const parentDiv = $(el).find(".crop-submit .selected-coords");
            const x1 = $(parentDiv).find("input[name=\"x1\"]").val();
            const y1 = $(parentDiv).find("input[name=\"y1\"]").val();
            const x2 = $(parentDiv).find("input[name=\"x2\"]").val();
            const y2 = $(parentDiv).find("input[name=\"y2\"]").val();
            console.log($(el).find(".crop-canvas #img-fullavatar").attr("src"));
            console.log(x1, y1, x2, y2);
        };

        this.uploadImageFromInternet = function (link) {
            const fullImgContainer = $(el).find(".crop-canvas #img-fullavatar");
            const avatarImgContainer = $(el).find(".crop-canvas #img-avatar");
            $(fullImgContainer).attr("src", link);
            $(avatarImgContainer).attr("src", link);
            $(el).find(".crop-submit button[data-crop-submit-avatar]").show();
            initAreaSelect(fullImgContainer);
        };

        this.uploadImageFromPC = function (fileInput) {
            const file = fileInput[0].files[0];
            const reader = new FileReader();
            const fullImgContainer = $(el).find(".crop-canvas #img-fullavatar");
            const avatarImgContainer = $(el).find(".crop-canvas #img-avatar");
            reader.onload = (e) => {
                $(fullImgContainer).attr("src", e.target.result);
                $(avatarImgContainer).attr("src", e.target.result);
                $(el).find(".crop-submit button[data-crop-submit-avatar]").show();
                initAreaSelect(fullImgContainer);
            };
            reader.readAsDataURL(file);
        };

        initialize();
    };
    new CropModule($(".crop-container"));
});
