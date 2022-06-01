import React, {useEffect, useState} from 'react'
import {AccountAddress, getDirectoryEntry} from '@stellar-expert/ui-framework'
import {navigation} from '@stellar-expert/navigation'
import DirectoryEntryPropsView from './directory-entry-props-view'

function EditDirectoryLayoutView({address, children}) {
    return <div className="card">
        <div className="desktop-only text-small" style={{float: 'right', paddingTop: '1em'}}>
            <a href="/directory">Back to Directory</a>
        </div>
        <h3>Directory – edit entry <AccountAddress account={address} chars={12} name={false}/></h3>
        <hr/>
        {children}
    </div>
}

export default function DirectoryEditExistingEntryView({match}) {
    const {address} = match.params
    const [directoryInfo, setDirectoryInfo] = useState(undefined)
    useEffect(() => {
        getDirectoryEntry(address, {extended: true})
            .then(di => setDirectoryInfo(di))
    }, [address])

    if (directoryInfo === undefined) return <EditDirectoryLayoutView address={address}>
        <div className="loader"/>
    </EditDirectoryLayoutView>

    if (directoryInfo === null) return <EditDirectoryLayoutView address={address}>
        <div className="error">
            <p>No directory record found for address <AccountAddress account={address} chars={12} name={false}/>.
            </p>
            <p><a href="/directory/add">Create new one?</a></p>
        </div>
    </EditDirectoryLayoutView>

    function navigateToEntryDetails() {
        navigation.navigate('/directory/' + address)
    }

    return <EditDirectoryLayoutView address={address}>
        <DirectoryEntryPropsView existingEntry={directoryInfo} onChange={navigateToEntryDetails}/>
    </EditDirectoryLayoutView>
}