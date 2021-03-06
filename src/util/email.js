import nodemailer from "nodemailer";

export const sendVerify = (userToken, email) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL || "",
      pass: process.env.PASSWORD || ""
    }
  });

  const port = process.env.PORT || 8000;
  const domain = process.env.DOMAIN || `http://localhost:${port}`;
  var mailOptions = {
    from: process.env.EMAIL || "",
    to: email,
    subject: "Xác thực email cho tài khoản Online Academi",
    text: `Vui lòng bấm vào đường dẫn để xác thực: ${domain}/verify/${userToken}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
