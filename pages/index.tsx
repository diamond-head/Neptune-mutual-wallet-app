import React from 'react';
import type { NextPage } from 'next'
import { useWeb3React } from '@web3-react/core';

import { Injected } from '../components/Connectors';
import WalletDetails from '../components/Modal';

import SwapIcon from '../assets/icons/swap';
import styles from '../styles/Home.module.css'
import { CONVERSION_RATES, CoinsEnum, SWAP_COIN } from '../constants/constants';

interface IConversionField {
  name: string;
  value: number;
  title: string;
}
interface IConversionState {
  source: IConversionField;
  target: IConversionField;
};

interface IWalletDetails {
  data: Array<{ key: string, value: string }>;
  show: boolean;
  isWalletConnected: boolean;
};

const Home: NextPage = () => {
  const { activate, account, library, connector, active, deactivate } = useWeb3React();

  const [walletDetails, setWalletDetails] = React.useState<IWalletDetails>({
    data: [],
    show: false,
    isWalletConnected: false
  });

  const [conversion, setConversionValue] = React.useState<IConversionState>({
    source: { name: CoinsEnum.NEP, value: 1, title: CoinsEnum.NEP },
    target: { name: CoinsEnum.BUSD, value: CONVERSION_RATES['NEP'].BUSD, title: CoinsEnum.BUSD }
  });

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, valueAsNumber } = event.currentTarget;
    const source: string = name;

    let val: number = 0;
    let target: string = "";
  
    if (name === 'nep') {
      target = 'busd';
      val = parseFloat((valueAsNumber * CONVERSION_RATES['NEP'].BUSD).toFixed(2));
    } else {
      target = 'nep';
      val = parseFloat((valueAsNumber * CONVERSION_RATES['BUSD'].NEP).toFixed(2));
    }

    setConversionValue((prev: IConversionState): IConversionState => ({
      ...prev,
      source: {
        ...prev.source,
        name: source.toUpperCase(),
        value: valueAsNumber,
      },
      target: {
        ...prev.target,
        name: target.toUpperCase(),
        value: val
      }
    }));
  }

  const handleSwapConversion = () => {
    setConversionValue((prev) => ({
      ...prev,
      source: {
        ...prev.source,
        title: SWAP_COIN[prev.source.name],
        name: SWAP_COIN[prev.source.name],
        value: 1
      },
      target: {
        ...prev.target,
        title: SWAP_COIN[prev.target.name],
        name: SWAP_COIN[prev.target.name],
        value: CONVERSION_RATES[prev.target.name][prev.source.name]
      }
    }))
  };
  
  const handleCheckWalletDetails = () => {
    setWalletDetails((prev) => ({
      ...prev,
      show: true
    }));
  }

  const handleModalClose = () => {
    setWalletDetails((prev) => ({
      ...prev,
      show: false
    }));
  }

  const handlePrimaryButtonCallback = () => {
    if (!walletDetails.isWalletConnected) {
      handleConnectWallet();
    } else {
      handleDisconnectFromWallet();
    }
  }

  const handleConnectWallet = () => {
    connectToMetaMask().then((res) => {
      setWalletDetails((prev) => ({
        ...prev,
        isWalletConnected: true
      }));
    });
  }

  const handleDisconnectFromWallet = () => {
    disconnectToMetaMask().then(res => {
      setWalletDetails((prev) => ({
        ...prev,
        isWalletConnected: false,
        show: false
      }))
    });
  }

  const handleCancel = () => {
    handleModalClose();
  }

  const connectToMetaMask = async () => {
    try {
      return await activate(Injected);
    } catch(e) {
      console.log(e);
    }
  }

  const disconnectToMetaMask = async () => {
    try {
      return await deactivate();
    } catch(e) {
      console.log(e);
    }
  }

  // const ModalBody = () => React.useCallback(() => {
  //   if (walletDetails.isWalletConnected) {
  //     return (
  //       <div className="text-danger">
  //         <p>Wallet not connected. Please click the ${'"Connect now"'} button below</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className={styles['details-wrapper']}>
  //       {walletDetails.data?.map((info: { key: string, value: string }, indx: number) => (
  //         <div className={styles['details-row']} key={indx}>
  //           <p>{info.key}</p>
  //           <p>{info.value}</p>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // }, [walletDetails]);

  return (
    <React.Fragment>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            NEPTUNE MUTUAL
          </h1>
        </header>
        <main className={styles.main}>
          <div className={styles['card-container']}>
            <div className={styles.grid}>
              <div className={styles.card}>
                <h2>Crypto converter</h2>
                <div className={styles['input-container']}>
                  <div className={styles['input-wrapper']}>
                    <label htmlFor="conversion-source">
                      {conversion.source.title}
                    </label>
                    <input
                      id="conversion-source"
                      className="form-control"
                      type="number"
                      name={conversion.source.name}
                      value={conversion.source.value}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles['swap-icon']} onClick={handleSwapConversion}>
                    <SwapIcon />
                  </div>
                  <div className={styles['input-wrapper']}>
                    <label htmlFor="conversion-target">
                      {conversion.target.title}
                    </label>
                    <input
                      id="conversion-target"
                      className="form-control"
                      type="number"
                      name={conversion.target.name}
                      value={conversion.target.value}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={styles.link}>
                  <button
                    type="button"
                    className="btn btn-link"
                    data-bs-toggle="modal"
                    data-bs-target="#wallet-Details"
                    onClick={handleCheckWalletDetails}
                  >
                    Check wallet details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <WalletDetails
          show={walletDetails.show}
          modalId="wallet-Details" 
          headerProps={{ title: 'Wallet Details', onClose: handleModalClose }}
          footerProps={{
            primary: {
              label: 'Connect now', 
              callback: handlePrimaryButtonCallback, 
              classes: walletDetails.isWalletConnected ? 'btn-danger' : 'btn-primary'
            },
            secondary: {
              label: 'Cancel',
              callback: handleCancel,
            }
          }}
        >
          {walletDetails.isWalletConnected && (
            <div className={styles['details-wrapper']}>
              {walletDetails.data?.map((info: { key: string, value: string }, indx: number) => (
                <div className={styles['details-row']} key={indx}>
                  <p>{info.key}</p>
                  <p>{info.value}</p>
                </div>
              ))}
            </div>
          )}
          {!walletDetails.isWalletConnected && (
            <div className="text-danger">
              <p>Wallet not connected. Please click the {'"Connect now"'} button below</p>
            </div>
          )}
        </WalletDetails>
      </div>
    </React.Fragment>
  )
}

export default Home
