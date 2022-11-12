import classNames from 'classnames/bind';
import React from "react";

import styles from "./InputControl.module.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const cx = classNames.bind(styles);

function InputControl(props) {
  return (
    <div className={cx('container')}>
      {props.icon && <FontAwesomeIcon icon={props.icon}/>}
      <input  {...props} />
    </div>
  );
}

export default InputControl;
