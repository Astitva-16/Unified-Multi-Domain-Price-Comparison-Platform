const {
  analyzeProductImage,
} = require(
  "../services/geminiVisionService"
);


const imageSearch =
  async (req, res) => {

    try {

      console.log(
        "Image search request received"
      );


      if (!req.file) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Please upload an image",

          });

      }


      console.log(
        "Image details:",
        {
          name:
            req.file.originalname,

          type:
            req.file.mimetype,

          size:
            req.file.size,
        }
      );


      const productDetails =
        await analyzeProductImage(
          req.file
        );


      console.log(
        "Product detected:",
        productDetails
      );


      return res
        .status(200)
        .json({

          success: true,

          data:
            productDetails,

        });

    } catch (error) {

      console.error(
        "Image Search Controller Error:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            error.message ||
            "Failed to analyze image",

        });

    }

  };


module.exports = {
  imageSearch,
};