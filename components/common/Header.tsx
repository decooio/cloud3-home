import styled from "styled-components";
import React from "react";
import styles from "@styles/cloud.module.scss";

const HeaderWrapper = styled.header`
    .inner{
      
    }
`
function Header_(){
    return(
        <HeaderWrapper>
            <div className="inner">
                <h1 className="title">IPFS Cloud3</h1>
                <span className={styles.documentLink}>Documentations</span>
            </div>
        </HeaderWrapper>
    )
}
export const Header = React.memo(Header_)