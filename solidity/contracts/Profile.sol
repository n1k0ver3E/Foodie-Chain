// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

/** 
 * @title Profile Management
 * @dev Implements profile mMnagement. 
 * Constraints: 
 * 1. Each participant per 1 account address
 * 2. only one regulator address per 1 profile contract
 * Program flow
 * 1. create "Profile contract" by adding regulator's address in its constructor.
 * 2. The participants(1=Farmer,2=Manufacturer,3=Reatiler,4=Logistic) use the backend(off-chain) to call function registerAccount(on-chain)
 * 3. Event RegisterAccount is raised and the backend (off-chain) can get error and result from function registerAccount(on-chain). The backend can store the data in database off-chain.
 * 4. The initial of account status is  0=Pending.
 * 5. The regulator uses the off-chain app to pass the parameter of each participant account address and account status to function approveAccount(on-chain).
 * 6. To get accountInfo (struct Account), can directly call mapping accountInfoByAddress[accountAddress]
 */
contract Profile {
    
    //AccountStatus: 0=Pending, 1=Approved, 2=Rejected
    enum AccountStatus {Pending,Approved,Rejected}
    //AccountType: 0=Regulator,1=Farmer,2=Manufacturer,3=Reatiler,4=Logistic
    enum AccountType {Regulator,Farmer,Manufacturer,Reatiler,Logistic}
    
    address public regulatorAddress;
    uint256 public lastAccountId;
    
    struct Account{
        address  accountAddress;
        string accountName;
        uint256  accountId;
        AccountType accountType;
        AccountStatus  accountStatus;
        bool isValue; // To check duplicate account
    }
    
    // Get account Info. by account address.
    mapping (address => Account) public accountInfoByAddress;
    
    // @notice To create profile contract, have to specify regulator's address first.
    constructor (address _regulatorAddress, string memory _regulatorName) {
        regulatorAddress = _regulatorAddress;
        lastAccountId = 0;
        // Create regulator account. Account index 0 is regulator
        Account memory regulatorAcc = Account(_regulatorAddress,_regulatorName,lastAccountId,AccountType.Regulator,AccountStatus.Approved,true);
        
        //add regulator acc. address to mapping.
        accountInfoByAddress[_regulatorAddress] = regulatorAcc;
    }
    
    // Create events for using in JavaScript API
    // Event 1: RegisterAccount by Farmer,Manufacturer,Reatiler,Logistic
    event RegisterAccount(
        address indexed accountAddress,
        string accountName,
        uint256 indexed accountId,
        uint256 accountType,
        uint256 accountStatus
    );
    // Event 2: ApproveAccount by Regulator
    event ApproveAccount(
        address accountAddress,
        uint256 accountStatus
    );
    
   /// @notice Function 1: createProfile for Regulator,Farmer,Manufacturer,Reatiler,Logistic
   /// @param _accountAddress Each participant can have only one accountAddress for this phase.
   /// @param _accountName The account name for account address.
   /// @param _accountTypeValue Specific the interger as following  0=Regulator,1=Farmer,2=Manufacturer,3=Reatiler,4=Logistic
    function registerAccount(address _accountAddress, string memory _accountName, uint256 _accountTypeValue) public checkDuplicateAddress(_accountAddress){
        require(_accountTypeValue != 0, 'Cannot register as the regulator.');
        uint256 tmpNewId = lastAccountId+1;
        Account memory newAcc = Account(_accountAddress,_accountName,tmpNewId,AccountType(_accountTypeValue),AccountStatus.Pending,true);
        
        //add a new acc. address to mapping.
        accountInfoByAddress[_accountAddress] = newAcc;
        emit RegisterAccount(newAcc.accountAddress, newAcc.accountName, newAcc.accountId,uint256(newAcc.accountType),uint256(newAcc.accountStatus));
        lastAccountId = tmpNewId;
    }
   
   /// @notice Function 2: approveAccount. Only regulator account can use this function.
   /// @param _accountAddress Each participant can have only one accountAddress for this phase. 
   /// @param _accountStatus 0=Pending, 1=Approved, 2=Rejected
    function approveAccount(address _accountAddress,uint256 _accountStatus) public onlyRegulator {
       // Get account by accountAddress
        accountInfoByAddress[_accountAddress].accountStatus = AccountStatus(_accountStatus);
       emit ApproveAccount(accountInfoByAddress[_accountAddress].accountAddress,uint256(accountInfoByAddress[_accountAddress].accountStatus));
    }
    
    
    /// @notice Function 3: getAccountInfoByAddress.(For the frontend off-chain)
   /// @param _accountAddress Each participant can have only one accountAddress for this phase. 
    function getAccountInfoByAddress(address _accountAddress) public view returns(string memory accountName,uint256  accountId,uint256 accountTypeValue,uint256 accountStatusValue){
        Account memory acc = accountInfoByAddress[_accountAddress];
        accountName = acc.accountName;
        accountId = acc.accountId;
        accountTypeValue = uint256(acc.accountType);
        accountStatusValue =   uint256(acc.accountStatus);
    }
    
    // private functions
    // Does account address exist?
    function isExisAccount(address _accountAddress) private view returns(bool){
        if(accountInfoByAddress[_accountAddress].isValue){
            return true;
        }
        return false;
    }    

   // modifier
   modifier onlyRegulator{
       require(msg.sender == regulatorAddress, 'This function can only be executed by the regulator.');
       _;
   }
   modifier checkDuplicateAddress(address _accountAddress){
        require(isExisAccount(_accountAddress) == false,"Cannot register the duplicate account.");
        _;
    }
}