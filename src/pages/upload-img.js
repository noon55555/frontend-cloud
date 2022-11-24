import styles from "./global.module.css";
import { Space, Card } from "antd";

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";

const UploadImg = () => {
  const clientId =
    "358572339512-goo05dk4311l7qfl9p1cell18tbsfcp5.apps.googleusercontent.com";

  let navigate = useNavigate();
  const [img, setImg] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [isPass, setIsPass] = useState(null);

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const onSubmit = () => {
    const formdata = new FormData();
    formdata.append("image", img);

    console.log(formdata)
    axios
      .post("https://4p1e2zswzg.execute-api.us-east-1.amazonaws.com/test/api/upload", formdata)
      .then(function ({ status }) {
        if (status === 201) {
          setIsUpload(true);

          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = (e) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = (e) => {
              const height = e.target.height;
              const width = e.target.width;

              if (width > 200 || height > 200) setIsPass(false);
              else if (img.size > 51200) setIsPass(false);
              else if (img.type !== "image/jpg" && img.type !== "image/jpeg")
                setIsPass(false);
              else setIsPass(true);
            };
          };
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const logout = () => {
    navigate("/login");
  };

  return (
    <div className={styles.container} style={{ top: "20" }}>
      {isUpload ? (
        <>
          <h1 style={{ marginBottom: "30px" }}>RESULT</h1>
          <Space direction="vertical" size={40} align="center">
            {isPass ? (
              <Card
                style={{
                  borderColor: "#00FF00",
                  color: "#00FF00",
                  fontSize: "28px",
                }}
              >
                Correct
              </Card>
            ) : (
              <Card
                style={{
                  borderColor: "#FF0000",
                  color: "#FF0000",
                  fontSize: "28px",
                }}
              >
                Incorrect
              </Card>
            )}
            {/* <button
              style={{ width: "120px" }}
              onClick={() => navigate("/login")}
            >
              Log out
            </button> */}
            <GoogleLogout
              clientId={clientId}
              buttonText="Log out"
              onLogoutSuccess={logout}
            />
          </Space>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: "30px" }}>UPLOAD</h1>
          <Space direction="vertical" size={40} align="center">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <button style={{ width: "120px" }} onClick={onSubmit}>
              Submit
            </button>
            <Card style={{ textAlign: "left" }}>
              <ul style={{ margin: 0 }}>
                <li>ขนาดของ Submission file ต้องไม่เกิน 50 KBb</li>
                <li>
                  Submission file เป็นภาพ JPG ซึ่งมี dimension ไม่เกิน 200x200
                  pixel
                </li>
              </ul>
            </Card>
            <GoogleLogout
              clientId={clientId}
              buttonText="Log out"
              onLogoutSuccess={logout}
              icon={false}
            />
          </Space>
        </>
      )}
    </div>
  );
};

export default UploadImg;
