import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import administration from 'app/modules/administration/administration.reducer';
import userManagement from 'app/modules/administration/user-management/user-management.reducer';
import applicationProfile from './application-profile';
import authentication from './authentication';
import portfolioByStock from './portfolio/byStock/portfolioByStock.reducer';
import portfolioByCompany from './portfolio/byCompany/portfolioByCompany.reducer';
import portfolioByAccount from './portfolio/byAccount/portfolioByAccount.reducer';
import portfolio from './portfolio/portfolio.reducer';
import transactionView from './transaction/view/transaction.reduces';
import transactionForm from './transaction/form/transaction.reduces';
import transactionType from './transaction/type/transactionType.reducer';
import account from './account/account.reducer';
import memberCompany from './company/member/company.member.reducer';
import stock from './stock/stock.reducer';
import user from './user/user.reducer';
import company from './company/company.reducer';
import debtView from './debt/view/debt.reduces';
import debtForm from './debt/form/debt.reducers';
import accountBalanceView from './accountBalance/view/accountBalance.reduces';
import accountBalanceForm from './accountBalance/form/accountBalance.reduces';
import accountBalanceType from './accountBalance/type/accountBalanceType.reduces';
import collateralView from './collateral/view/collateral.reduces';
import collateralForm from './collateral/form/collateral.reducers';
import contractAddendumCollateralView from './collateral/form/contractAddendum/view/contractAddendum.reduces';
import contractAddendumCollateralForm from './collateral/form/contractAddendum/form/contractAddendum.reducers';
import accountBalanceDebt from './accountBalance/debt/view.reducer';
import config from './config/config.reducer';
import representativeForm from './representative/form/representative.reducers';
import representativeView from './representative/view/representative.reduces';
import capitalRepresentativeForm from './representative/form/capitalRepresentative/form/capitalRepresentative.reducers';
import capitalRepresentativeView from './representative/form/capitalRepresentative/view/capitalRepresentative.reduces';
import capitalRepresentativeReplaceView from './representative/form/capitalRepresentative/view/replace/capitalRepresentativeReplace.reduces';
import stockAccountView from './stockAccount/view/stockAccount.reduces';
import stockAccountForm from './stockAccount/form/stockAccount.reduces';
import accountOwnerView from './accountOwner/view/accountOwner.reduces';
import accountOwnerForm from './accountOwner/form/accountOwner.reduces';
import companyView from './company/view/company.reduces';
import companyForm from './company/form/company.reduces';
import decentralizeForm from './decentralize/form/decentralize.reduces';
import buildTreeSecurityCompany from './company/tree/securities.reducer';
import buildTreeMemberCompany from './company/tree/members.reducer';

/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  applicationProfile,
  administration,
  userManagement,
  loadingBar,
  portfolio,
  portfolioByStock,
  portfolioByCompany,
  portfolioByAccount,
  transactionView,
  transactionType,
  account,
  memberCompany,
  stock,
  user,
  company,
  transactionForm,
  debtView,
  debtForm,
  accountBalanceView,
  accountBalanceForm,
  accountBalanceType,
  collateralView,
  collateralForm,
  contractAddendumCollateralView,
  contractAddendumCollateralForm,
  accountBalanceDebt,
  config,
  representativeForm,
  representativeView,
  capitalRepresentativeForm,
  capitalRepresentativeView,
  capitalRepresentativeReplaceView,
  stockAccountView,
  stockAccountForm,
  accountOwnerView,
  accountOwnerForm,
  companyView,
  companyForm,
  decentralizeForm,
  buildTreeSecurityCompany,
  buildTreeMemberCompany,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default rootReducer;
