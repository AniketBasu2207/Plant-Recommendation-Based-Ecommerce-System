import toast from "react-hot-toast";
const Success_Alert = (message, err = false, sound = false) => {
  if (err) {
    toast.error(`${message}`, {
      style: {
        borderRadius: "10px",
        color: "black",
        width: "500px",
        fontSize: "20px",
        padding: "15px",
      },
    });
  } else {
    toast.success(`${message}`, {
      style: {
        borderRadius: "10px",
        color: "black",
        width: "500px",
        fontSize: "20px",
        padding: "15px",
      },
    });
  }

  if (sound) {
    const audio = new Audio("../successed.mp3"); // Adjust path as needed
    audio.play();
  }
};

export default Success_Alert;
