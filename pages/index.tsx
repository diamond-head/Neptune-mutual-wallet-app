import React from 'react';
import type { NextPage } from 'next'

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

const Home: NextPage = () => {
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
  
  return (
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
                    defaultValue={conversion.source.value}
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
                    defaultValue={conversion.target.value}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className={styles.link}>
                <p>Check wallet details</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
