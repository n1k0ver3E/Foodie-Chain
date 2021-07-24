import { ChangeEvent } from 'react'

type userType = 'regulator' | 'participant'

export interface IUserTypeProps {
  type: userType
}

export interface IProfileContract {
  profileContract: any
  accounts: string[]
}

export interface IMenuList {
  title: string
  link: string
}

export interface IAccountTypeDropdown {
  value: number
  account: string
}

export interface IRegisterAccountDetails {
  accountAddress: string
  accountName: string
  accountType: number
}

export interface IRegisterFormProps {
  showErrorNotice: boolean
  errorMessage: string
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  isAccountAddressFieldValid: boolean
  accountAddressFieldErrorMsg: string
  isAccountNameFieldValid: boolean
  isLoading: boolean
  handleRegister: (e: any) => Promise<void>
  accountType: number
}

export interface IViewAccountFormProps {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  handleViewAccount: (e: any) => Promise<void>
  checked: boolean
  setChecked: (checked: boolean) => void
  isRegisteredAddressFieldValid: boolean
  isAccountAddressFieldValid: boolean
  accountAddressFieldErrorMsg: string
  isLoading: boolean
}

export interface IParticipantDetails {
  accountAddress: string
  accountId: number
  accountName: string
  accountStatus: number
  accountType: number
}

export interface IProfileContractAPI {
  registerParticipant: (participantDetails: IParticipantDetails) => void
  registeredAccounts: IParticipantDetails[]
  registrationError: boolean
  pendingAccounts: IParticipantDetails[]
  approvedAccounts: IParticipantDetails[]
  rejectedAccounts: IParticipantDetails[]
  updateAccountStatus: (address: string, updatedAccountStatus: number) => void
  getAllParticipants: () => void
}

export interface IViewAccountDetails {
  registeredAddress: string
  accountAddress: string
}

export interface IAccountStatus {
  accountId?: number | null
  accountName: string
  accountStatus: number | null
  accountType: number | null
  updated?: boolean
}

export interface IAccountsTableProps {
  columns: any
  data: IParticipantDetails[]
}

export type IFarmerProductInitial = Pick<
  IFarmerProductDetails,
  'productName' | 'productLocation'
>

export interface IFarmerProductDetails {
  productName: string
  productLocation: string
  plantingDate: Date | string
  harvestDate: Date | string
}

export type IManufacturerProcessInitial = Pick<
  IManufacturerProcessDetails,
  'productId' | 'processingType'
>

export interface IManufacturerProcessDetails {
  productId: number | string
  processingType: string
  timeStamp: string
}

export type IRetailProcessDetails = Pick<
  IManufacturerProcessDetails,
  'productId'
>
