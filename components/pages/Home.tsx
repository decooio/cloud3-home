import type { NextPage } from "next";
import styles from '../../styles/cloud.module.scss'
import {Button} from "@components/common/Button";
import HomeMonitorSvg from '../../public/images/home_monitor.svg'

const Home: NextPage = () => {
    return(
        <div className={styles.container}>
            <main className={styles.main}>
                <div className={styles.banner}>
                    <p className={styles.text}>Store in IPFS W3Bucket,</p>
                    <p className={styles.text}>Decentralized, Guaranteed & Alive.</p>
                    <div className={styles.btnBox}>
                        <Button text="Quick Start" className={styles.startBtn} mode="orange" />
                        <Button text="Launch App" mode="black" />
                    </div>
                </div>
                <div className={styles.monitor}>
                    <img className={styles.monitorImg} src="images/home_monitor.svg"/>
                </div>
            </main>
        </div>
    )
}

export default Home;