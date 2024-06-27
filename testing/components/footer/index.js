import React from "react";
import styles from "./footer.module.scss";

export default function Footer() {
  var currYear = new Date().getFullYear().toString().slice(-2)
  var yearRange = `2008-${currYear}`
  return (
    <footer className={`${styles.footer} color111 font15`}>
      <p className="m-0">
        {`Copyrights ${yearRange}. All Rights Reserved.`}
        &nbsp;
        &nbsp;
        <a role="button" aria-label="Privacy" tabIndex="0" className="color111" href="https://www.justdial.com/Privacy-Policy" target="_blank">
          Privacy
        </a>{" "}
        |{" "}
        <a role="button" aria-label="Terms" tabIndex="0" className="color111" href="https://www.justdial.com/Terms-of-Use" target="_blank">
          Terms
        </a>{" "}
        |{" "}
        <a role="button" aria-label="Infringement" tabIndex="0"
          className="color111"
          href="https://www.justdial.com/Infringement-Policy"
          target="_blank"
        >
          Infringement
        </a>
      </p>
    </footer>
  );
}
