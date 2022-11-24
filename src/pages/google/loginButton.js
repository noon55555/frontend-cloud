import { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginButton = () => {
  let navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const clientId = "358572339512-goo05dk4311l7qfl9p1cell18tbsfcp5.apps.googleusercontent.com";

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
      gapi.load("client:auth2", initClient);
    };
  }, []);

  const onSuccess = async (res) => {
    console.log("success", res);
    setProfile(res.profileObj);

    const response = await axios.post("https://l27iddk9x7.execute-api.us-east-1.amazonaws.com/user/api/googleLogin", res.profileObj);
    console.log(response)
    if (response.data.founduser === 0) {
      console.log('no')
      await axios
        .post("https://l27iddk9x7.execute-api.us-east-1.amazonaws.com/user/api/googleRegister", res.profileObj)
        .then(() => navigate("/upload-img"))
        .catch(function (error) {
          console.log(error);
        });
    } else {
      navigate("/upload-img");
    }
  };

  const onFailure = (res) => {
    console.log("failed", res);
  };

  const logout = () => {
    setProfile(null);
  };

  return (
    <div>
      {profile ? (
        <GoogleLogout
          clientId={clientId}
          buttonText="Log out"
          onLogoutSuccess={logout}
        />
      ) : (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      )}
    </div>
  );
};

export default LoginButton;
