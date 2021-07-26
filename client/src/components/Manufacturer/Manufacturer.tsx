import React, { ChangeEvent, FC, useState, useContext, useEffect } from 'react'
import './manufacturer.css'
import {
  ICreateProductPayload,
  IManufacturerProcessDetails,
  ISendProductDetails,
} from '../../interfaces/contract'
import { ProductContractAPIContext } from '../../contexts/ProductContractAPI'
import { ProductCategory } from '../../enums/contract'

const initialState: IManufacturerProcessDetails = {
  productId: -1,
  processingType: '',
}

const sendProductInitialState: ISendProductDetails = {
  receiverAddress: '',
  logisticsAddress: '',
  trackNumber: '',
}

const Manufacturer: FC = () => {
  const { getFarmingAndManufacturingProducts } = useContext(
    ProductContractAPIContext
  )

  const [data, setData] = useState<IManufacturerProcessDetails>(initialState)
  const [sendProductData, setSendProductData] = useState<ISendProductDetails>(
    sendProductInitialState
  )
  const [isProcessingTypeFieldValid, setIsProcessingTypeFieldValid] =
    useState<boolean>(false)
  const [isReceiverAddressFieldValid, setIsReceiverAddressFieldValid] =
    useState<boolean>(false)
  const [isLogisticsAddressFieldValid, setIsLogisticsAddressFieldValid] =
    useState<boolean>(false)
  const [isTrackNumberFieldValid, setIsTrackNumberFieldValid] =
    useState<boolean>(false)
  const [products, setProducts] = useState<ICreateProductPayload[]>([])
  const [showTable, setShowTable] = useState<boolean>(true)

  useEffect(() => {
    const getProducts = async () => {
      const products = await getFarmingAndManufacturingProducts()

      setProducts(products)
    }

    getProducts()
  }, [])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'productId') {
      // GET THE VALUE HERE AND MAKE AN API CALL TO SHOW TABLE

      console.log('what is the value??', value)
      // SHOW PRODUCT INFO TABLE
      // MAKE AN API CALL
      // SET THE TABLE DATA
    }

    if (name === 'processingType') {
      if (value === '') {
        setIsProcessingTypeFieldValid(false)
      } else {
        setIsProcessingTypeFieldValid(true)
      }
    }

    setData({ ...data, [name]: value })
  }

  const handleChangeSendProduct = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'receiverAddress') {
      if (value === '') {
        setIsReceiverAddressFieldValid(false)
      } else {
        setIsReceiverAddressFieldValid(true)
      }
    }

    if (name === 'logisticsAddress') {
      if (value === '') {
        setIsLogisticsAddressFieldValid(false)
      } else {
        setIsLogisticsAddressFieldValid(true)
      }
    }

    if (name === 'trackNumber') {
      if (value === '') {
        setIsTrackNumberFieldValid(false)
      } else {
        setIsTrackNumberFieldValid(true)
      }
    }

    setSendProductData({ ...sendProductData, [name]: value })
  }

  const handleSubmission = (e: any) => {
    e.preventDefault()
  }

  const handleSubmissionSendProduct = (e: any) => {
    e.preventDefault()
  }

  return (
    <section className="container">
      {showTable && (
        <div className="is-success is-light mb-5">
          <div className="title is-6">
            <strong>Product Information</strong>
          </div>

          <table className="table is-striped table-style">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Farm Date</th>
                <th>Harvest Date</th>
                <th>Processing Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td>
                <td>2</td>
                <td>3</td>
                <td>4</td>
                <td>5</td>
                <td>6</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="columns">
        <div className="column is-half">
          <img
            src={
              'https://images.unsplash.com/photo-1518253042715-a2534e1b0a7b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80'
            }
            alt="farm"
            className="manufacturer-image"
          />
        </div>
        <div className="column is-half manufacturing-form has-background-white-bis">
          <>
            <div className="product-title">
              <h1 className="title is-4">Manufacturer Process</h1>
            </div>
            <form className="mt-5">
              <div className="field">
                <label className="label">Product</label>
                <div className="select is-normal is-fullwidth">
                  <select
                    defaultValue={'DEFAULT'}
                    name="productId"
                    id="productId"
                    onChange={handleChange}
                  >
                    <option value={'DEFAULT'} disabled>
                      Select Product
                    </option>
                    {products?.map((product: any, idx: number) => (
                      <option key={idx} value={product.productId}>
                        {product.productName} ({product.productLocation})
                      </option>
                    ))}

                    {!products.length && (
                      <option disabled>Product Selection Unavailable</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="label">Processing Type</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="processingType"
                    id="processingType"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                className="button is-block is-link is-fullwidth mt-3"
                disabled={!isProcessingTypeFieldValid || data.productId === -1}
                onClick={(e) => handleSubmission(e)}
              >
                Add
              </button>
              <br />
            </form>

            <div className="product-title">
              <h1 className="title is-4">Send Product</h1>
            </div>
            <form className="mt-5">
              <div className="field">
                <label className="label">Receiver (Address)</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="receiverAddress"
                    id="receiverAddress"
                    onChange={handleChangeSendProduct}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Logistics (Address)</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="logisticsAddress"
                    id="logisticsAddress"
                    onChange={handleChangeSendProduct}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Track Number</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    name="trackNumber"
                    id="trackNumber"
                    onChange={handleChangeSendProduct}
                  />
                </div>
              </div>

              <button
                className="button is-block is-link is-fullwidth mt-3"
                disabled={
                  !isReceiverAddressFieldValid ||
                  !isLogisticsAddressFieldValid ||
                  !isTrackNumberFieldValid
                }
                onClick={(e) => handleSubmissionSendProduct(e)}
              >
                Send
              </button>
              <br />
            </form>
          </>
        </div>
      </div>
    </section>
  )
}

export default Manufacturer
