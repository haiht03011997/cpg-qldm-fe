import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PortfolioByAccountListByComponent from './portfolio/byAccount/byAccountList';
import PortfolioByCompanyListComponent from './portfolio/byCompany/byCompanyList';
import PortfolioListComponent from './portfolio/byStock/byStockList';
import TransactionDetailFormComponent from './transaction/form/transactionDetailForm';
import TransactionFormComponent from './transaction/form/transactionForm';
import TransactionListComponent from './transaction/list/transactionList';
import DebtListComponent from './debt/list/debtList';
import DebtDetailFormComponent from './debt/form/debtDetailForm';
import DebtFormComponent from './debt/form/debtForm';
import AccountBalanceDetailFormComponent from './accountBalance/form/accountBalanceDetailForm';
import AccountBalanceFormComponent from './accountBalance/form/accountBalanceForm';
import AccountBalanceListComponent from './accountBalance/list/accountBalanceList';
import CollateralListComponent from './collateral/list/collateralList';
import CollateralFormComponent from './collateral/form/collateralForm';
import AccountBalanceDebtListComponent from './accountBalance/debt/list/accountBalanceDebtList';
import RepresentativeListComponent from './representative/list/representativeList';
import RepresentativeFormComponent from './representative/form/representativeForm';
import RepresentativeFormDetailComponent from './representative/form/representativeFormDetail';
import UnInvestFormComponent from './representative/form/capital/form/unInvestForm';
import CollateralFormDetailComponent from './collateral/form/collateralFormDetail';
import StockAccountListComponent from './stockAccount/list/stockAccountList';
import StockAccountFormComponent from './stockAccount/form/stockAccountForm';
import AccountOwnerListComponent from './accountOwner/list/accountOwnerList';
import AccountOwnerFormComponent from './accountOwner/form/accountOwnerForm';
import CompanyListComponent from './company/list/companyList';
import CompanyFormComponent from './company/form/companyForm';
import DecentralizeListComponent from './decentralize/list/decentralizeList';
import DecentralizeFormComponent from './decentralize/form/decentralizeForm';

/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route path="portfolio/by-stock" element={<PortfolioListComponent />} />
        <Route path="portfolio/by-company" element={<PortfolioByCompanyListComponent />} />
        <Route path="portfolio/by-account" element={<PortfolioByAccountListByComponent />} />
        <Route path="transaction" element={<TransactionListComponent />} />
        <Route path="transaction/:id" element={<TransactionDetailFormComponent />} />
        <Route path="transaction/create" element={<TransactionDetailFormComponent />} />
        {/* <Route path="transaction/create" element={<TransactionFormComponent />} /> */}
        <Route path="debt" element={<DebtListComponent />} />
        <Route path="debt/:id" element={<DebtDetailFormComponent />} />
        <Route path="debt/create" element={<DebtDetailFormComponent />} />
        {/* <Route path="debt/create" element={<DebtFormComponent />} /> */}

        <Route path="account-balance" element={<AccountBalanceListComponent />} />
        <Route path="account-balance/:id" element={<AccountBalanceDetailFormComponent />} />
        <Route path="account-balance/create" element={<AccountBalanceDetailFormComponent />} />
        {/* <Route path="account-balance/create" element={<AccountBalanceFormComponent />} /> */}
        {/* <Route path="account-balance/debt" element={<AccountBalanceDebtListComponent />} /> */}

        <Route path="collateral" element={<CollateralListComponent />} />
        <Route path="collateral/:id" element={<CollateralFormDetailComponent />} />
        <Route path="collateral/:id/edit" element={<CollateralFormComponent />} />
        <Route path="collateral/create" element={<CollateralFormComponent />} />

        <Route path="representative" element={<RepresentativeListComponent />} />
        <Route path="representative/:id" element={<RepresentativeFormDetailComponent />} />
        <Route path="representative/:id/edit" element={<RepresentativeFormComponent />} />
        <Route path="representative/create" element={<RepresentativeFormComponent />} />

        <Route path="stock-account" element={<StockAccountListComponent />} />
        <Route path="stock-account/:id" element={<StockAccountFormComponent />} />
        <Route path="stock-account/create" element={<StockAccountFormComponent />} />

        <Route path="account-owner" element={<AccountOwnerListComponent />} />
        <Route path="account-owner/:id" element={<AccountOwnerFormComponent />} />
        <Route path="account-owner/create" element={<AccountOwnerFormComponent />} />

        <Route path="company" element={<CompanyListComponent />} />
        <Route path="company/:id" element={<CompanyFormComponent />} />
        <Route path="company/create" element={<CompanyFormComponent />} />

        <Route path="decentralize" element={<DecentralizeListComponent />} />
        <Route path="decentralize/:id" element={<DecentralizeFormComponent />} />
        {/* prettier-ignore */}
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
