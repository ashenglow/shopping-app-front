import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:inashenglow@gmail.com">
        <Button>Contact: inashenglow@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
