import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'

import { ProfileContractContext } from '../../../contexts/ProfileContract'
import { ProductContractContext } from '../../../contexts/ProductContract'

import DocumentImage from '../../../assets/documents.png'
import SupplyChainOneLine from '../../../components/SupplyChainOneLine'
import getAccounts from '../../../utils/getAccounts'

import {
  ISupplyChainOneLine,
} from '../../../interfaces/contract'

const initialState: ISupplyChainOneLine = {
  manufacturerAddress: '',
  distributorAddress: '',
  retailerAddress: '',
  ConsumerAddress: '',
  statusType: 99,
}


const SupplyChain: FC = () => {

  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [supplyChainSuccess, setSupplyChainSuccess] = useState<boolean>(false)

  const [data, setData] = useState<ISupplyChainOneLine>(initialState)

  const { accounts } = useContext(ProfileContractContext)

  const { productContract } = useContext(ProductContractContext)


  const [inputProductId, setInputProductId] = useState<number>(0)

  useEffect(() => {

  }, [])


  const handleShow = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const _accounts = await getAccounts(accounts)

    try {
      const supplychainResp = await productContract?.methods.showOneLineTrack(
        inputProductId
      )
        .send({ from: _accounts[0] })

      if (supplychainResp) {

        const
          {
            manufacturerId,
            distributorId,
            retailerId,
            aConsumerId,
            statusType
          }
            = supplychainResp.events.ShowOneLineTrack.returnValues
        console.log("On-chain product status ", statusType)
        setData({

          manufacturerAddress: manufacturerId,
          distributorAddress: distributorId,
          retailerAddress: retailerId,
          ConsumerAddress: aConsumerId,
          statusType: 99,
        })


        setSupplyChainSuccess(true)
        setIsLoading(false)
        setError(false)
        setErrorMessage('');
      }
      else {
        setSupplyChainSuccess(false)
        setIsLoading(false)
        setError(true)
        setErrorMessage('An error occurred.')
      }

    } catch (error) {
      setSupplyChainSuccess(false)
      setIsLoading(false)
      setError(true)
      setErrorMessage(error.message)
    }
  }

  const backToSupplyChain = () => {
    setSupplyChainSuccess(false)
  }

  return (
    <div>
      <section className="container has-background-light">
        <div className="columns is-multiline">
          <div className="column is-10 is-offset-2">
            <div className="columns">
              <div className="column left mt-6 is-half">
                {!supplyChainSuccess ? (
                  <>
                    <h1 className="title is-4">Supply chain</h1>
                    {error && (
                      <div className="notification is-danger is-light">
                        {errorMessage}
                      </div>
                    )}

                    <form className="mt-5">
                      <div className="is-fullwidth">
                        <input
                          className="input"
                          type="number"
                          min="0"
                          onChange={(e) => {
                            setInputProductId(parseInt(e.target.value))
                          }}
                          placeholder="Product ID"
                        ></input>

                      </div>
                      <button
                        className={
                          isLoading
                            ? 'button is-block is-link is-fullwidth mt-3 is-loading'
                            : 'button is-block is-link is-fullwidth mt-3'
                        }
                        disabled={inputProductId === 0}
                        onClick={(e) => handleShow(e)}
                      >
                        Show
                      </button>
                      <br />
                    </form>
                  </>
                ) : (
                  <SupplyChainOneLine
                    manufacturerAddress={data.manufacturerAddress}
                    distributorAddress={data.distributorAddress}
                    retailerAddress={data.retailerAddress}
                    ConsumerAddress={data.ConsumerAddress}
                    statusType={data.statusType}
                  />
                )}
              </div>
              <div className="column right has-text-centered is-half">
                <img
                  src={DocumentImage}
                  alt="registration infographics"
                  className="side-image-document"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SupplyChain