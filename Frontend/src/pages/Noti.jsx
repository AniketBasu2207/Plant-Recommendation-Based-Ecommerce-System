import { Store } from "react-notifications-component";
import React from "react";
import Notification from "../components/Notification";
import Success_Alert from "./Success_Alert";
import { differenceInHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const Noti = () => {
  const notification = (title, description, type) => {
    Store.addNotification({
      title: "Wonderful!",
      message: "This is a notification message",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
      },
    });
  };
  const is24HoursPassed = (isoString) => {
    const indianTime = toZonedTime(isoString, "Asia/Kolkata");
    const hoursDifference = differenceInHours(new Date(), indianTime);
    console.log(hoursDifference);

    return hoursDifference >= 24;
  };
  const message = "Florus";
  return (
    <div>
      <button onClick={notification}>Click me for notification</button>
      <button onClick={() => Notification("abc", "desc", "danger")}>
        Click me for notification
      </button>
      <button onClick={() => Success_Alert("congrats", true)}>
        Click me for notification
      </button>
      <button onClick={() => Success_Alert(message, false, true)}>
        Click me for notification
      </button>
      {/* {formatDistanceToNow(toZonedTime('2025-05-04T19:30:00.000Z', 'Asia/Kolkata'), { addSuffix: true })} */}
      {is24HoursPassed("2025-05-05T17:14:40.646Z").toString()}
    </div>
  );
};

export default Noti;
