const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.API_KEY}`);

const handleApiCall = () => (req, res) => {
  stub.PostModelOutputs(
    {
      model_id: "a403429f2ddf4b49b307e318f00e528b",
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log("Error: " + err);
        return;
      }
      if (response.status.code !== 10000) {
        console.log(
          "Received failed status: " +
            response.status.description +
            "\n" +
            response.status.details
        );
        return;
      }

      for (const c of response.outputs[0].data.concepts) {
        console.log(c.name + ": " + c.value);
      }
      return res.status(200).json(response);
    }
  );
};

module.exports = { handleApiCall };
