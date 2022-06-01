import React from 'react'
import Bignumber from 'bignumber.js'
import {AssetLink} from '@stellar-expert/ui-framework'
import {stripTrailingZeros, formatWithPrecision} from '@stellar-expert/formatter'
import {parseAssetFromObject} from '@stellar-expert/asset-descriptor'
import './account-balances.scss'

function calculateAvailableBalance(account, balance) {
    let available = new Bignumber(balance.balance).minus(new Bignumber(balance.selling_liabilities))
    if (balance.asset_type === 'native') {
        const reserves = 2 + account.subentry_count + account.num_sponsoring - account.num_sponsored
        available = available.minus(new Bignumber(reserves).mul(new Bignumber(0.5)))
    }
    return available.toString()
}

function AccountBalanceView({account, balance}) {
    const asset = parseAssetFromObject(balance),
        isPoolShare = balance.asset_type === 'liquidity_pool_shares'
    return <div>
        <AssetLink asset={asset} className="account-balance text-center">
            <div className="condensed">
                {stripTrailingZeros(formatWithPrecision(balance.balance))}
            </div>
            <div className="text-tiny condensed">
                {isPoolShare ?
                    <>pool shares</> :
                    <>{stripTrailingZeros(formatWithPrecision(calculateAvailableBalance(account, balance)))} available</>
                }
            </div>
            <span className="text-small">
                <AssetLink asset={asset} link={false}/>
                {(balance.is_authorized === false && !isPoolShare) && <>
                    <i className="icon icon-lock"
                       title={`Trustline to ${asset.toCurrency()} is not authorized by the asset issuer`}/>
                </>}
           </span>
        </AssetLink>
    </div>
}

export default function AccountCurrentBalancesView({account}) {
    const {ledgerData, deleted} = account
    if (deleted) return <div className="dimmed">Balances unavailable</div>
    if (!ledgerData) return null
    const xlmBalance = ledgerData.balances.find(b => b.asset_type === 'native')
    return <div className="all-account-balances text-header">
        <AccountBalanceView account={ledgerData} balance={xlmBalance}/>
        {ledgerData.balances
            .filter(b => b.asset_type !== 'native')
            .map((b, i) => <AccountBalanceView key={i} account={ledgerData} balance={b}/>)}
    </div>
}