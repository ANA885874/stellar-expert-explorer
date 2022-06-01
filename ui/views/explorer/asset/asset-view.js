import React from 'react'
import {getDirectoryEntry} from '@stellar-expert/ui-framework'
import {useRouteMatch} from 'react-router'
import AssetDetailsView from './asset-details-view'
import {setPageMetadata} from '../../../util/meta-tags-generator'
import ErrorNotificationBlock from '../../components/error-notification-block'
import {useAssetInfo, useAssetIssuerInfo} from '../../../business-logic/api/asset-api'
import TomlInfo from '../toml/toml-info-view'
import AssetHistoryTabsView from './asset-history-tabs-view'

export default function AssetView() {
    const {params} = useRouteMatch()
    const {data: asset, loaded} = useAssetInfo(params.asset),
        issuerInfo = useAssetIssuerInfo(asset?.descriptor)
    if (!loaded) return <div className="loader"/>
    if (issuerInfo) {
        asset.issuerInfo = issuerInfo
    }

    if (asset.invalidAsset) {
        //handle meta
        return <ErrorNotificationBlock>
            The asset does not exist on the ledger.
        </ErrorNotificationBlock>
    }
    if (asset.error) {
        //handle meta
        return <ErrorNotificationBlock>
            Failed to fetch asset info.
        </ErrorNotificationBlock>
    }

    const {code, issuer} = asset.descriptor,
        title = !issuer ? 'Stellar Lumens' : `${code} by ${issuer}`
    //TODO: fetch TOML metadata instead
    setPageMetadata({
        title,
        description: `Stats, price history, and analytic reports for ${title}.`
    })

    if (issuer) {
        getDirectoryEntry(issuer)
            .then(data => {
                if (data) {
                    const title = `${code} by [${data.name}]${issuer}`
                    setPageMetadata({
                        title,
                        description: `Stats, price history, and analytic reports for ${title}.`
                    })
                }
            })
    }
    return <>
        <AssetDetailsView asset={asset}/>
        {!!issuerInfo?.home_domain &&
        <TomlInfo homeDomain={issuerInfo.home_domain} assetCode={code} account={issuer} className="card space"/>}
        <AssetHistoryTabsView asset={asset}/>
    </>
}