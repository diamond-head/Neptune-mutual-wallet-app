import React from 'react';
import { useWeb3React } from '@web3-react/core';

import { Injected } from './Connectors';
import Modal from './Modal';

import styles from '../styles/Home.module.css';

interface IProps {
  show: boolean;
  onClose: Function;
};

interface IWalletDetails {
  data: Array<any>;
  isWalletConnected: boolean;
  balance: string | undefined | null;
  account: string | undefined | null;
  chainId: number | undefined | null;
};

export default function Wallet({ show, onClose }: IProps) {
  const { activate, account, library, deactivate, chainId } = useWeb3React();
  const [walletDetails, setWalletDetails] = React.useState<IWalletDetails>({
    data: [],
    isWalletConnected: false,
    balance: undefined,
    account: undefined,
    chainId: undefined
  });

  React.useEffect((): any => {
    let stale = false;
    async function getBalance() {
      if (!!account && !!library && !!chainId) {

        const data = [
          { key: 'Account', value: account },
          { key: 'Chain ID', value: chainId },
        ];
        try {
          const balance = await library.eth.getBalance(account);
          if (!!balance) {
            data.push({ key: 'Balance', value: balance });
            if (!stale) setWalletDetails((prev) => ({ ...prev, balance, account, chainId, data }));
          }
        } catch (e) {
          if (!stale) setWalletDetails((prev) => ({ ...prev, balance: null, account, chainId }));
        }
      }
    }

    getBalance();

    return () => {
      stale = true;
      setWalletDetails((prev) => ({ ...prev, balance: null, account: null, chainId: null }))
    }
  }, [account, library, chainId]);

  const handleModalClose = () => {
    onClose();
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
        isWalletConnected: true,
      }));
    });
  }

  const handleDisconnectFromWallet = () => {
    disconnectToMetaMask().then(res => {
      onClose();
      setWalletDetails((prev) => ({
        ...prev,
        isWalletConnected: false,
      }));
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

  return (
    <Modal
      show={show}
      modalId="wallet-Details" 
      headerProps={{ title: 'Wallet Details', onClose: handleModalClose }}
      footerProps={{
        primary: {
          label: walletDetails.isWalletConnected ? "Disconnect" : 'Connect now', 
          callback: handlePrimaryButtonCallback, 
          classes: walletDetails.isWalletConnected ? 'btn-danger w-100' : 'btn-primary'
        },
        ...(!walletDetails.isWalletConnected && { secondary: { label: 'Cancel', callback: handleCancel} })
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
    </Modal>
  )
}
