import classNames from 'classnames/bind';
import React from "react";

import styles from "./InputControl.module.sass";

// const cx = classNames.bind(styles);

function InputControl(props) {
  return (
    <div className={styles.container}>
      {props.label && <label>{props.label}</label>}
      <input type="text" {...props} />
    </div>
  );
}

export default InputControl;
