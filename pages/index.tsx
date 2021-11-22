import React from 'react';
import type { NextPage } from 'next'

import WalletDetails from '../components/Wallet';
import Converter from '../components/Converter';

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  const [show, setWalletModalShow] = React.useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          NEPTUNE MUTUAL
        </h1>
      </header>
      <Converter setShow={setWalletModalShow} />
      <WalletDetails show={show} onClose={() => setWalletModalShow(false)} />
    </div>
  );
}

export default Home
