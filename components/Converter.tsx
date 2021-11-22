import React from 'react';

import SwapIcon from '../assets/icons/swap';
import styles from '../styles/Converter.module.css';

import { CONVERSION_RATES, CoinsEnum, SWAP_COIN } from '../constants/constants';

interface IConversionField {
  name: string;
  value: string;
  title: string;
}
interface IConversionState {
  source: IConversionField;
  target: IConversionField;
};

export default function Converter({ setShow, ...props }: any) {
  const [conversion, setConversionValue] = React.useState<IConversionState>({
    source: { name: CoinsEnum.NEP, value: "1", title: CoinsEnum.NEP },
    target: { name: CoinsEnum.BUSD, value: CONVERSION_RATES['NEP'].BUSD.toString(), title: CoinsEnum.BUSD }
  });

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    const source: string = name.toUpperCase();
    const parsedValue = parseFloat(value);

    let val: string;
    let target: string = "";
  
    if (name === 'NEP') {
      target = 'BUSD';
      val = parseFloat((parsedValue * CONVERSION_RATES['NEP'].BUSD).toFixed(2)).toString();
    } else {
      target = 'NEP';
      val = parseFloat((parsedValue * CONVERSION_RATES['BUSD'].NEP).toFixed(2)).toString();
    }

    setConversionValue((prev: IConversionState): IConversionState => ({
      ...prev,
      source: {
        ...prev.source,
        name: source,
        value,
      },
      target: {
        ...prev.target,
        name: target,
        value: isNaN(parseFloat(val)) ? "" : val
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
    setShow(true);
  }

  return (
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
                  type="text"
                  name={conversion.source.name}
                  value={conversion.source.value.toString()}
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
                  type="text"
                  name={conversion.target.name}
                  value={conversion.target.value.toString()}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.link}>
              <button
                type="button"
                className="btn btn-link"
                onClick={handleCheckWalletDetails}
              >
                Check wallet details
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
