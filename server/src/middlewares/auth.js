const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  var authHeader = req.get("authorization");
  const retrievedToken = authHeader.split(" ")[1];

  if (!retrievedToken) {
    res.status(401).send({
      ok: false,
      message: "Invalid Token",
    });
  } else {
    jwt.verify(
      retrievedToken,
      process.env.API_KEY,
      function (err, retrievedToken) {
        if (err) {
          res.status(401).send({
            ok: false,
            message: "Invalid Token",
          });
        } else {
          next();
        }
      }
    );
  }
}

module.exports = verifyToken;
