import classnames from "classnames";
import styled from "styled-components";
import { BaseProps } from "./type";
import React from "react";

const ButtonWrapper = styled.div`
  border: 3px solid #FF8C04;
  padding: 5px 30px;
  font-size: 24px;
  font-weight: 300;
  cursor: pointer;
  &.orange{
    border-color: #FF8C04;
    color: #FF8C04;
  }
  &.black{
    border-color: #000;
    color: #000;
  }
`

export interface IProps extends BaseProps {
    mode?: string;
    text: string
}
function Button_(props: IProps) {
    const {text,mode,className} = props
    return(
        <ButtonWrapper className={classnames(className,mode)}>
            {text}
        </ButtonWrapper>
    )
}
export const Button = React.memo(Button_)